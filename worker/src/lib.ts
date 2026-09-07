/**
 * Pure logic of the contact Worker: challenge signing, submission validation, attachment checks and
 * the e-mail payload. No I/O here, so every function is unit-tested from `tests/unit/contact-worker.test.ts`
 * with Node's Web Crypto. `index.ts` owns the HTTP handling.
 */
import { leadingZeroBits, powInput, sha256 } from '../../src/lib/pow';

export const LIMITS = {
  name: 100,
  email: 254,
  subject: 150,
  message: 5000,
  files: 3,
  fileBytes: 4 * 1024 * 1024,
  totalBytes: 6 * 1024 * 1024,
  /** A human needs at least this long between opening the form and sending it. */
  minSeconds: 3,
  /** A challenge is valid this long; a form left open longer fetches a fresh one. */
  ttlSeconds: 15 * 60,
  /** Multipart overhead on top of totalBytes before the body is rejected unread. */
  bodyBytes: 6 * 1024 * 1024 + 256 * 1024,
} as const;

export const DEFAULT_BITS = 17;

/**
 * Allowlist of attachment kinds. The extension AND the first bytes must agree; a `.pdf` that does not
 * start with `%PDF` is refused. Executables, scripts, archives and legacy Office formats (macros) are
 * never accepted. DOCX is a ZIP container, hence the `PK` magic.
 */
export const ATTACHMENT_KINDS: Record<string, { magic: number[][]; text?: boolean }> = {
  pdf: { magic: [[0x25, 0x50, 0x44, 0x46]] },
  docx: { magic: [[0x50, 0x4b, 0x03, 0x04]] },
  png: { magic: [[0x89, 0x50, 0x4e, 0x47]] },
  jpg: { magic: [[0xff, 0xd8, 0xff]] },
  jpeg: { magic: [[0xff, 0xd8, 0xff]] },
  txt: { magic: [], text: true },
};

export interface Challenge {
  v: 1;
  salt: string;
  /** Issued at, epoch seconds. */
  iat: number;
  bits: number;
  sig: string;
}

export interface Solution extends Challenge {
  nonce: number;
}

export type Verdict = 'ok' | 'malformed' | 'expired' | 'too_fast' | 'bad_signature' | 'bad_nonce';

const encoder = new TextEncoder();

export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Cryptographically random hex string (`bytes` random bytes). */
export function randomHex(bytes = 16): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return toHex(buf);
}

export async function hmacHex(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return toHex(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(data))));
}

/** Constant-time string comparison (both inputs are our own hex, so length leaks nothing useful). */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function challengeData(salt: string, iat: number, bits: number, clientKey: string): string {
  return `v1|${salt}|${iat}|${bits}|${clientKey}`;
}

/**
 * A challenge is bound to the visitor (`clientKey` = their IP as seen by Cloudflare) and to a time, and
 * carries its own signature, so the Worker keeps no state between the two requests.
 */
export async function issueChallenge(
  secret: string,
  clientKey: string,
  bits: number = DEFAULT_BITS,
  nowMs: number = Date.now(),
): Promise<Challenge> {
  const salt = randomHex(16);
  const iat = Math.floor(nowMs / 1000);
  const sig = await hmacHex(secret, challengeData(salt, iat, bits, clientKey));
  return { v: 1, salt, iat, bits, sig };
}

export function parseSolution(raw: unknown): Solution | null {
  if (typeof raw !== 'string' || raw.length > 400) return null;
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!obj || typeof obj !== 'object') return null;
  const o = obj as Record<string, unknown>;
  if (o.v !== 1) return null;
  if (typeof o.salt !== 'string' || !/^[0-9a-f]{32}$/.test(o.salt)) return null;
  if (typeof o.sig !== 'string' || !/^[0-9a-f]{64}$/.test(o.sig)) return null;
  if (!Number.isInteger(o.iat) || !Number.isInteger(o.bits) || !Number.isInteger(o.nonce))
    return null;
  const { iat, bits, nonce } = o as { iat: number; bits: number; nonce: number };
  if (bits < 1 || bits > 32 || nonce < 0) return null;
  return { v: 1, salt: o.salt, iat, bits, nonce, sig: o.sig };
}

export async function verifySolution(
  secret: string,
  clientKey: string,
  minBits: number,
  sol: Solution | null,
  nowMs: number = Date.now(),
): Promise<Verdict> {
  if (!sol) return 'malformed';
  const now = Math.floor(nowMs / 1000);
  if (sol.bits < minBits) return 'bad_signature';
  const expected = await hmacHex(secret, challengeData(sol.salt, sol.iat, sol.bits, clientKey));
  if (!safeEqual(expected, sol.sig)) return 'bad_signature';
  if (now - sol.iat > LIMITS.ttlSeconds) return 'expired';
  if (now - sol.iat < LIMITS.minSeconds) return 'too_fast';
  const ok = leadingZeroBits(await sha256(powInput(sol.salt, sol.nonce))) >= sol.bits;
  return ok ? 'ok' : 'bad_nonce';
}

export interface Fields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type FieldsResult =
  { ok: true; value: Fields } | { ok: false; code: 'invalid'; fields: (keyof Fields)[] };

// Linear-time, no nested quantifiers (ReDoS-safe); the mailbox check is intentionally simple:
// a reply to a bad address just bounces in Rubo's inbox.
const EMAIL = /^[^\s@]{1,64}@[^\s@.]+(?:\.[^\s@.]+)+$/;
// Control characters except tab and newline; also the line/paragraph separators (U+2028/9) and
// the invisible bidi controls, built from char codes so the source stays free of invisible bytes.
const CONTROL = new RegExp(
  `[\\u0000-\\u0008\\u000b\\u000c\\u000e-\\u001f\\u007f${String.fromCharCode(0x2028)}${String.fromCharCode(0x2029)}\\u202a-\\u202e\\u2066-\\u2069]`,
  'g',
);

function clean(v: unknown, max: number, multiline: boolean): string | null {
  if (typeof v !== 'string') return null;
  let s = v.replace(/\r\n?/g, '\n').replace(CONTROL, '');
  if (!multiline) s = s.replace(/\n/g, ' ');
  s = s.trim();
  if (s.length === 0 || s.length > max) return null;
  return s;
}

export function validateFields(input: Record<string, unknown>): FieldsResult {
  const bad: (keyof Fields)[] = [];
  const name = clean(input.name, LIMITS.name, false);
  const email = clean(input.email, LIMITS.email, false);
  const subject = clean(input.subject, LIMITS.subject, false);
  const message = clean(input.message, LIMITS.message, true);
  if (!name) bad.push('name');
  if (!email || !EMAIL.test(email)) bad.push('email');
  if (!subject) bad.push('subject');
  if (!message) bad.push('message');
  if (bad.length) return { ok: false, code: 'invalid', fields: bad };
  return { ok: true, value: { name: name!, email: email!, subject: subject!, message: message! } };
}

/** Keeps a base name and an allowlisted extension; drops paths, control characters and odd symbols. */
export function sanitizeFilename(raw: string): string | null {
  const base = raw.split(/[\\/]/).pop() ?? '';
  const m = /^(.*)\.([A-Za-z0-9]{1,5})$/.exec(base.trim());
  if (!m) return null;
  const ext = m[2]!.toLowerCase();
  if (!(ext in ATTACHMENT_KINDS)) return null;
  const stem = m[1]!
    .replace(CONTROL, '')
    .replace(/[^\p{L}\p{N} ._()-]/gu, '_')
    .trim();
  if (!stem) return null;
  return `${stem.slice(0, 100)}.${ext}`;
}

function startsWith(bytes: Uint8Array, magic: number[]): boolean {
  if (bytes.length < magic.length) return false;
  return magic.every((b, i) => bytes[i] === b);
}

/** The extension the visitor claims must match what the bytes say. */
export function attachmentKind(filename: string, bytes: Uint8Array): string | null {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  const kind = ATTACHMENT_KINDS[ext];
  if (!kind) return null;
  if (kind.text) {
    const head = bytes.subarray(0, 4096);
    if (head.includes(0)) return null;
    try {
      new TextDecoder('utf-8', { fatal: true, ignoreBOM: false }).decode(head);
    } catch {
      return null;
    }
    return ext;
  }
  return kind.magic.some((m) => startsWith(bytes, m)) ? ext : null;
}

/** Base64 without a multi-megabyte JS loop when the runtime has the native encoder. */
export function toBase64(bytes: Uint8Array): string {
  const native = (bytes as Uint8Array & { toBase64?: () => string }).toBase64;
  if (typeof native === 'function') return native.call(bytes);
  let binary = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

export interface Attachment {
  filename: string;
  content: string;
}

export interface EmailPayload {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  text: string;
  attachments?: Attachment[];
}

export interface Meta {
  country?: string | undefined;
  locale?: string | undefined;
  userAgent?: string | undefined;
  receivedAt?: string | undefined;
}

/**
 * Plain-text e-mail (no HTML, so nothing the visitor typed can render as markup in the mail client).
 * The visitor's address goes to Reply-To so Rubo answers with one click.
 */
export function buildEmail(
  fields: Fields,
  meta: Meta,
  attachments: Attachment[],
  from: string,
  to: string,
): EmailPayload {
  const lines = [
    `From: ${fields.name} <${fields.email}>`,
    `Received: ${meta.receivedAt ?? new Date().toISOString()}`,
    meta.country ? `Country: ${meta.country}` : null,
    meta.locale ? `Site language: ${meta.locale}` : null,
    meta.userAgent ? `Browser: ${meta.userAgent.slice(0, 200)}` : null,
    attachments.length ? `Attachments: ${attachments.map((a) => a.filename).join(', ')}` : null,
    '',
    fields.message,
    '',
    '--',
    'Sent from the contact form at https://rubo6.dev. Attachments come from an unknown sender: open them as you would any attachment from a stranger.',
  ].filter((l): l is string => l !== null);
  const payload: EmailPayload = {
    from,
    to: [to],
    reply_to: fields.email,
    subject: `[rubo6.dev] ${fields.subject}`,
    text: lines.join('\n'),
  };
  if (attachments.length) payload.attachments = attachments;
  return payload;
}

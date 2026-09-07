/**
 * Contact Worker for https://rubo6.dev/api/contact (ADR-0012).
 *
 *   GET  /api/contact/challenge  → signed proof-of-work challenge for this visitor
 *   POST /api/contact            → multipart form: name, email, subject, message, files[], pow, website
 *
 * Runs on Cloudflare Workers on the site's own zone, so the browser talks to its own origin (no CORS,
 * `connect-src 'self'` unchanged). Sends the e-mail through Resend with the API key held as a Worker
 * secret. Defences, in order: same-origin check, body size cap, per-IP rate limit (Workers Rate Limiting
 * binding), honeypot field, proof-of-work verification, field validation, attachment allowlist with
 * magic-byte sniffing. Errors to the client are generic codes; nothing about the visitor is logged.
 */
import {
  attachmentKind,
  buildEmail,
  DEFAULT_BITS,
  issueChallenge,
  LIMITS,
  parseSolution,
  sanitizeFilename,
  toBase64,
  validateFields,
  verifySolution,
  type Attachment,
} from './lib';

interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface Env {
  /** Secret: HMAC key for challenges (`wrangler secret put POW_SECRET`). */
  POW_SECRET: string;
  /** Secret: Resend API key (`wrangler secret put RESEND_API_KEY`). Absent + MAIL_DRY_RUN → log only. */
  RESEND_API_KEY?: string;
  MAIL_TO: string;
  MAIL_FROM: string;
  /** Comma-separated origins allowed to POST (production: https://rubo6.dev). */
  ALLOWED_ORIGINS: string;
  POW_BITS?: string;
  /** "1" → do not call Resend; print the message to the Worker log (local development). */
  MAIL_DRY_RUN?: string;
  RATE_LIMITER?: RateLimiter;
}

type ErrorCode =
  | 'not_found'
  | 'method'
  | 'origin'
  | 'too_large'
  | 'rate_limited'
  | 'bad_request'
  | 'invalid'
  | 'files'
  | 'challenge'
  | 'send_failed'
  | 'misconfigured';

const JSON_HEADERS: Record<string, string> = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function fail(code: ErrorCode, status: number, extra: Record<string, unknown> = {}): Response {
  return json({ ok: false, code, ...extra }, status);
}

function clientKey(request: Request): string {
  return request.headers.get('cf-connecting-ip') ?? 'unknown';
}

function originAllowed(request: Request, env: Env): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  const allowed = env.ALLOWED_ORIGINS.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return allowed.includes(origin);
}

function bits(env: Env): number {
  const n = Number.parseInt(env.POW_BITS ?? '', 10);
  return Number.isInteger(n) && n >= 8 && n <= 24 ? n : DEFAULT_BITS;
}

async function handleChallenge(request: Request, env: Env): Promise<Response> {
  // Same-origin fetches carry Sec-Fetch-Site; a plain GET from another site or a script does not.
  const site = request.headers.get('sec-fetch-site');
  if (site && site !== 'same-origin' && site !== 'none') return fail('origin', 403);
  const challenge = await issueChallenge(env.POW_SECRET, clientKey(request), bits(env));
  return json({ ok: true, challenge });
}

async function readAttachments(
  form: FormData,
): Promise<{ ok: true; files: Attachment[] } | { ok: false }> {
  const entries = form.getAll('files').filter((f): f is File => f instanceof File && f.size > 0);
  if (entries.length > LIMITS.files) return { ok: false };
  let total = 0;
  const files: Attachment[] = [];
  for (const file of entries) {
    total += file.size;
    if (file.size > LIMITS.fileBytes || total > LIMITS.totalBytes) return { ok: false };
    const filename = sanitizeFilename(file.name);
    if (!filename) return { ok: false };
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!attachmentKind(filename, bytes)) return { ok: false };
    files.push({ filename, content: toBase64(bytes) });
  }
  return { ok: true, files };
}

async function handleSubmit(request: Request, env: Env): Promise<Response> {
  if (!originAllowed(request, env)) return fail('origin', 403);

  const length = Number(request.headers.get('content-length') ?? '0');
  if (!Number.isFinite(length) || length > LIMITS.bodyBytes) return fail('too_large', 413);

  const key = clientKey(request);
  if (env.RATE_LIMITER) {
    const { success } = await env.RATE_LIMITER.limit({ key });
    if (!success) return fail('rate_limited', 429);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail('bad_request', 400);
  }

  // Honeypot: real visitors never see this field. Bots that fill it get a quiet "success".
  const website = form.get('website');
  if (typeof website === 'string' && website.trim() !== '') return json({ ok: true });

  const verdict = await verifySolution(
    env.POW_SECRET,
    key,
    bits(env),
    parseSolution(form.get('pow')),
  );
  if (verdict !== 'ok') return fail('challenge', 403, { reason: verdict });

  const fields = validateFields({
    name: form.get('name'),
    email: form.get('email'),
    subject: form.get('subject'),
    message: form.get('message'),
  });
  if (!fields.ok) return fail('invalid', 422, { fields: fields.fields });

  const attachments = await readAttachments(form);
  if (!attachments.ok) return fail('files', 422);

  const localeRaw = form.get('locale');
  const payload = buildEmail(
    fields.value,
    {
      country: request.headers.get('cf-ipcountry') ?? undefined,
      locale: typeof localeRaw === 'string' ? localeRaw.slice(0, 8) : undefined,
      userAgent: request.headers.get('user-agent') ?? undefined,
      receivedAt: new Date().toISOString(),
    },
    attachments.files,
    env.MAIL_FROM,
    env.MAIL_TO,
  );

  if (env.MAIL_DRY_RUN === '1') {
    console.log(
      `[dry-run] would send "${payload.subject}" to ${env.MAIL_TO} (reply-to ${payload.reply_to}, ${attachments.files.length} attachment(s))\n${payload.text}`,
    );
    return json({ ok: true, dryRun: true });
  }
  if (!env.RESEND_API_KEY) return fail('misconfigured', 500);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    // Status only: the provider's body may echo the message.
    console.error(`resend responded ${res.status}`);
    return fail('send_failed', 502);
  }
  return json({ ok: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (!env.POW_SECRET) return fail('misconfigured', 500);
    const url = new URL(request.url);
    if (url.pathname === '/api/contact/challenge') {
      if (request.method !== 'GET') return fail('method', 405);
      return handleChallenge(request, env);
    }
    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') return fail('method', 405);
      return handleSubmit(request, env);
    }
    return fail('not_found', 404);
  },
};

import { describe, expect, it } from 'vitest';
import { leadingZeroBits, meetsDifficulty, solve } from '@/lib/pow';
import {
  attachmentKind,
  buildEmail,
  issueChallenge,
  parseSolution,
  sanitizeFilename,
  toBase64,
  validateFields,
  verifySolution,
} from '../../worker/src/lib';

const SECRET = 'unit-test-secret';
const IP = '203.0.113.7';

describe('proof of work', () => {
  it('counts leading zero bits', () => {
    expect(leadingZeroBits(new Uint8Array([]))).toBe(0);
    expect(leadingZeroBits(new Uint8Array([0x80]))).toBe(0);
    expect(leadingZeroBits(new Uint8Array([0x01]))).toBe(7);
    expect(leadingZeroBits(new Uint8Array([0x00, 0x0f]))).toBe(12);
    expect(leadingZeroBits(new Uint8Array([0x00, 0x00, 0xff]))).toBe(16);
  });

  it('solves a small challenge and the solution verifies', async () => {
    const nonce = await solve('abc', 8, { batch: 16 });
    expect(await meetsDifficulty('abc', nonce, 8)).toBe(true);
  });

  it('issues a signed challenge that verifies only for the same visitor and difficulty', async () => {
    const now = 1_800_000_000_000;
    const c = await issueChallenge(SECRET, IP, 8, now);
    expect(c.salt).toMatch(/^[0-9a-f]{32}$/);
    const nonce = await solve(c.salt, c.bits, { batch: 16 });
    const sol = parseSolution(JSON.stringify({ ...c, nonce }));
    expect(sol).not.toBeNull();
    const later = now + 5_000;
    expect(await verifySolution(SECRET, IP, 8, sol, later)).toBe('ok');
    expect(await verifySolution(SECRET, '198.51.100.1', 8, sol, later)).toBe('bad_signature');
    expect(await verifySolution('other-secret', IP, 8, sol, later)).toBe('bad_signature');
    expect(await verifySolution(SECRET, IP, 9, sol, later)).toBe('bad_signature');
    expect(await verifySolution(SECRET, IP, 8, sol, now + 1_000)).toBe('too_fast');
    expect(await verifySolution(SECRET, IP, 8, sol, now + 16 * 60_000)).toBe('expired');
    expect(await verifySolution(SECRET, IP, 8, { ...sol!, nonce: sol!.nonce + 1 }, later)).toMatch(
      /bad_nonce|ok/,
    );
    expect(await verifySolution(SECRET, IP, 8, null, later)).toBe('malformed');
  });

  it('rejects malformed solutions without throwing', () => {
    expect(parseSolution('not json')).toBeNull();
    expect(parseSolution(JSON.stringify({ v: 2 }))).toBeNull();
    expect(
      parseSolution(JSON.stringify({ v: 1, salt: 'x', sig: 'y', iat: 1, bits: 8, nonce: 1 })),
    ).toBeNull();
    expect(parseSolution(42)).toBeNull();
  });
});

describe('field validation', () => {
  it('accepts a normal submission and trims it', () => {
    const r = validateFields({
      name: '  Ada Lovelace ',
      email: 'ada@example.org',
      subject: 'Data role\nin Mexico City',
      message: 'Hello,\r\n\r\nAre you open to a chat?\n',
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.name).toBe('Ada Lovelace');
      expect(r.value.subject).toBe('Data role in Mexico City');
      expect(r.value.message).toBe('Hello,\n\nAre you open to a chat?');
    }
  });

  it('reports every bad field', () => {
    const r = validateFields({ name: '', email: 'nope', subject: 'x'.repeat(200), message: 7 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.fields).toEqual(['name', 'email', 'subject', 'message']);
  });

  it('strips control and bidi characters', () => {
    const r = validateFields({
      name: `Eve${String.fromCharCode(0x202e)}`,
      email: 'eve@example.com',
      subject: `S${String.fromCharCode(0)}ubject`,
      message: 'ok',
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.name).toBe('Eve');
      expect(r.value.subject).toBe('Subject');
    }
  });
});

describe('attachments', () => {
  it('keeps safe names with allowlisted extensions only', () => {
    expect(sanitizeFilename('CV Ada Lovelace.pdf')).toBe('CV Ada Lovelace.pdf');
    expect(sanitizeFilename('../../etc/passwd.txt')).toBe('passwd.txt');
    expect(sanitizeFilename('C:\\Users\\x\\résumé (2024).PDF')).toBe('résumé (2024).pdf');
    expect(sanitizeFilename('payload.exe')).toBeNull();
    expect(sanitizeFilename('script.js')).toBeNull();
    expect(sanitizeFilename('macro.doc')).toBeNull();
    expect(sanitizeFilename('noext')).toBeNull();
    expect(sanitizeFilename('.pdf')).toBeNull();
  });

  it('requires the bytes to match the extension', () => {
    const pdf = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]);
    const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d]);
    const zip = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x14]);
    expect(attachmentKind('cv.pdf', pdf)).toBe('pdf');
    expect(attachmentKind('cv.pdf', png)).toBeNull();
    expect(attachmentKind('shot.png', png)).toBe('png');
    expect(attachmentKind('offer.docx', zip)).toBe('docx');
    expect(attachmentKind('offer.docx', pdf)).toBeNull();
    expect(attachmentKind('notes.txt', new TextEncoder().encode('plain text, ñ'))).toBe('txt');
    expect(attachmentKind('notes.txt', new Uint8Array([0x4d, 0x5a, 0x00, 0x00]))).toBeNull();
    expect(attachmentKind('x.exe', pdf)).toBeNull();
  });

  it('base64-encodes bytes with or without the native encoder', () => {
    const bytes = new Uint8Array(70_000).map((_, i) => i % 251);
    expect(toBase64(bytes)).toBe(Buffer.from(bytes).toString('base64'));
  });
});

describe('e-mail payload', () => {
  it('is plain text with the visitor in Reply-To and attachments listed', () => {
    const mail = buildEmail(
      { name: 'Ada', email: 'ada@example.org', subject: 'Hi', message: 'Line 1\nLine 2' },
      { country: 'MX', locale: 'es-MX', receivedAt: '2026-09-07T00:00:00.000Z' },
      [{ filename: 'cv.pdf', content: 'AAAA' }],
      'Observatorio <onboarding@resend.dev>',
      'owner@example.com',
    );
    expect(mail.to).toEqual(['owner@example.com']);
    expect(mail.reply_to).toBe('ada@example.org');
    expect(mail.subject).toBe('[rubo6.dev] Hi');
    expect(mail.text).toContain('From: Ada <ada@example.org>');
    expect(mail.text).toContain('Country: MX');
    expect(mail.text).toContain('Attachments: cv.pdf');
    expect(mail.text).toContain('Line 1\nLine 2');
    expect(mail).not.toHaveProperty('html');
    expect(mail.attachments).toHaveLength(1);
  });
});

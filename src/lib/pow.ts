/**
 * Proof-of-work check for the contact form ("is a browser doing this work, or a spam script?").
 *
 * The Worker hands out a signed challenge `{ salt, bits }`; the browser searches a `nonce` such that
 * SHA-256(`${salt}:${nonce}`) starts with at least `bits` zero bits, and the Worker verifies one hash.
 * Cheap for one human (a second of background CPU while they type), expensive for a script that
 * wants to send thousands. Pure Web Crypto: the same code runs in browsers, in workerd and in Node
 * (unit tests). No third-party captcha script, so `script-src 'self'` stays intact (ADR-0012).
 */

const encoder = new TextEncoder();

export async function sha256(text: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(text)));
}

/** Number of leading zero bits in a byte array (0 for an empty array). */
export function leadingZeroBits(bytes: Uint8Array): number {
  let n = 0;
  for (const b of bytes) {
    if (b === 0) {
      n += 8;
      continue;
    }
    n += Math.clz32(b) - 24;
    break;
  }
  return n;
}

export function powInput(salt: string, nonce: number): string {
  return `${salt}:${nonce}`;
}

export async function meetsDifficulty(salt: string, nonce: number, bits: number): Promise<boolean> {
  return leadingZeroBits(await sha256(powInput(salt, nonce))) >= bits;
}

export interface SolveOptions {
  /** Called every batch with the number of hashes tried so far. */
  onProgress?: (hashes: number) => void;
  signal?: AbortSignal;
  /** Hashes per batch; digests inside a batch run concurrently to hide the per-call await cost. */
  batch?: number;
}

/**
 * Finds a nonce for `salt` at difficulty `bits`. Expected work is 2^bits hashes; with bits = 17 that is
 * roughly a second on a laptop and a few seconds on a phone, in a Web Worker while the visitor types.
 */
export async function solve(salt: string, bits: number, opts: SolveOptions = {}): Promise<number> {
  const batch = opts.batch ?? 64;
  let nonce = 0;
  for (;;) {
    if (opts.signal?.aborted) throw new DOMException('Proof of work aborted', 'AbortError');
    const candidates = Array.from({ length: batch }, (_, i) => nonce + i);
    const hashes = await Promise.all(candidates.map((n) => sha256(powInput(salt, n))));
    const hit = hashes.findIndex((h) => leadingZeroBits(h) >= bits);
    if (hit !== -1) return candidates[hit] as number;
    nonce += batch;
    opts.onProgress?.(nonce);
  }
}

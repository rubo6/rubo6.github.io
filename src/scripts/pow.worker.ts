/**
 * Web Worker that solves the contact form's proof-of-work off the main thread, so the page (sky,
 * dome, typing) stays smooth while it runs. Same-origin module worker: allowed by `script-src 'self'`.
 * Messages in: { salt, bits }. Messages out: { type: 'progress', hashes } … { type: 'done', nonce }.
 */
import { solve } from '@/lib/pow';

interface Job {
  salt: string;
  bits: number;
}

self.addEventListener('message', async (event: MessageEvent<Job>) => {
  const { salt, bits } = event.data;
  try {
    const nonce = await solve(salt, bits, {
      onProgress: (hashes) => {
        if (hashes % 4096 === 0) self.postMessage({ type: 'progress', hashes });
      },
    });
    self.postMessage({ type: 'done', nonce });
  } catch {
    self.postMessage({ type: 'error' });
  }
});

# ADR-0012 · A contact form after all: own Worker, own anti-bot, no third-party script

- Status: accepted · Date: 2026-09-07 · Supersedes the "no contact form" part of ADR-0004

## Context

ADR-0004 chose a `mailto:` link over a form because GitHub Pages has no backend and a form would hand visitor data to a third party. Rubo now wants recruiters to be able to write from the page itself, with a subject, a plain-text body and optional attachments, protected against bots, without breaking the security posture built since (strict CSP with `script-src 'self'`, no third-party code on the page, Cloudflare in front of the domain since ADR-0010).

## Decision

1. **Same-origin API on Cloudflare Workers.** `worker/` is a small Worker routed at `rubo6.dev/api/contact*` on the zone that already proxies the site. The browser talks to its own origin: no CORS, `connect-src 'self'` and the whole CSP stay unchanged. The static site and the Worker are deployed separately (`npm run worker:deploy`); the site never depends on the Worker being up (the `mailto:` link remains).
2. **E-mail through Resend** with the API key as a Worker secret. Plain-text mail, the visitor's address in `Reply-To`, attachments passed through. Until Rubo verifies the domain in Resend, the shared `onboarding@resend.dev` sender is used: it can only deliver to the account owner's address, which is exactly the recipient.
3. **Anti-bot without a captcha vendor.** Turnstile, reCAPTCHA and hCaptcha all need a script from a foreign origin, which would break the `script-src 'self'` invariant and add a tracker. Instead the form uses a **proof of work**: the Worker signs a challenge (HMAC, bound to the visitor's IP and to a timestamp), the browser solves it in a Web Worker while the visitor types (2^17 SHA-256 hashes, roughly a second on a laptop and a few on a phone), the Worker verifies one hash. Plus a honeypot field, a minimum fill time, a 15-minute challenge lifetime, and a per-IP **rate limit of 3 messages per minute** (Workers Rate Limiting binding). Cloudflare's WAF, Bot Fight Mode and the `humano` rule apply in front of all of it.
4. **Attachments are allowlisted twice**: extension and magic bytes must agree (PDF, DOCX, PNG, JPG, TXT), 3 files, 4 MB each, 6 MB in total; file names are sanitised. Nothing is stored; the Worker forwards and forgets. The mail body reminds Rubo that attachments come from a stranger.
5. **The dialog is native** (`<dialog>`, top layer, focus trapped by the browser) with a liquid-glass surface, an official Webb image (Crab Nebula: its pulsar is a repeating signal), an opening animation and its mirror on close, a bottom-sheet form on phones (ADR-0011 rules). Without JavaScript the card that opens it is not shown and the `mailto:` link keeps working.

## Consequences

- Two deployables. The Worker is a separate `wrangler deploy`; CI type-checks it and does a `--dry-run` bundle (`npm run check`), unit-tests its pure logic, and the Playwright suite exercises the dialog against mocked endpoints. Only Rubo can deploy it (Cloudflare account); steps in `docs/OWNER.md`.
- New secrets outside GitHub: `POW_SECRET` and `RESEND_API_KEY` live in the Worker. Rotating either is one `wrangler secret put`.
- A determined attacker can still pay the proof of work and send 3 messages a minute from each IP. That is spam Rubo deletes, not a breach; if it happens, raise `POW_BITS` or lower the rate limit in `worker/wrangler.jsonc`, or add Turnstile behind a new ADR (it would need a CSP change in two places).
- Workers free plan: 100 000 requests/day and 10 ms CPU per request. Base64-encoding 6 MB of attachments is the heaviest step; the runtime's native encoder keeps it under the limit. If Cloudflare ever reports CPU limit errors, lower `LIMITS.totalBytes`.
- The static site is still static: `output: 'static'`, no adapter. `/api/*` exists only at the edge.

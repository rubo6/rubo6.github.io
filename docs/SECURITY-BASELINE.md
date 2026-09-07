# Security and privacy baseline

Threat model: a public static site plus one small Cloudflare Worker (`/api/contact`, ADR-0012). Assets at risk: (1) the integrity of what visitors receive, (2) Rubo's GitHub and Cloudflare accounts, (3) Rubo's privacy and inbox, (4) the Worker's secrets. Attack surface: content files, client scripts, dependencies, GitHub Actions, DNS, the metadata the site publishes, and the form endpoint. Read this before adding any external origin, dependency or workflow, and before publishing anything about Rubo.

## Delivered page

- **Content-Security-Policy via `<meta>`** in `src/layouts/Base.astro` (GitHub Pages cannot set headers, so `frame-ancestors` and reporting are unavailable):

  ```
  default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://rubo6.goatcounter.com; font-src 'self';
  connect-src 'self' https://rubo6.goatcounter.com; media-src 'self'; object-src 'none';
  base-uri 'self'; form-action 'none'
  ```

  `upgrade-insecure-requests` is deliberately absent from the meta CSP: HTTPS is already forced by the `.dev` HSTS preload and by Cloudflare, and WebKit applies the directive even on `http://127.0.0.1`, which broke fonts and navigations in the Safari-engine Playwright runs. The Cloudflare header may keep it (production is HTTPS-only anyway).

  `style-src 'unsafe-inline'` is accepted (ADR-0005): styles cannot execute code and Astro inlines stylesheets. `script-src` never allows inline code. Any new origin = ADR + CSP edit + this file.

- **No inline JavaScript.** Astro `<script>` bundles to external files; `vite.build.assetsInlineLimit: 0` prevents Astro from inlining small chunks (it once did, and the live site lost all JavaScript while dev looked fine; `grep -c '<script type="module">' dist/index.html` must be 0). Server→client data goes through `<script type="application/json">` + `safeJson()`.
- **No third-party code runs on the page.** GoatCounter's `count.js` is a self-hosted copy in `public/js/` (ADR-0009); the only third-party traffic is the beacon and the public counter to `rubo6.goatcounter.com`. Fonts, images and icons are self-hosted.
- `referrer` meta `strict-origin-when-cross-origin`; external links `rel="noopener noreferrer"` (+ `me` for own profiles); one form (the contact dialog, next section), no cookies; `localStorage` holds two allowlisted preference strings; `robots.txt`, sitemap and `/.well-known/security.txt` (expires 2027-09-01, bump yearly) in `public/`.

## Contact form: the one dynamic endpoint (ADR-0012)

`worker/` runs on Cloudflare Workers at `rubo6.dev/api/contact*` and forwards messages to Rubo's inbox through Resend. It is stateless and stores nothing. Defences, in the order the request meets them:

| Layer                                              | What it stops                                                                                                                                          |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Cloudflare WAF, Bot Fight Mode, `humano` rate rule | scanners, known bad bots, floods (same as the rest of the site)                                                                                        |
| `Origin` allowlist                                 | cross-site POSTs (CSRF) and scripts posting from elsewhere; browsers always send `Origin` on POST                                                      |
| Body size cap (`Content-Length` ≤ 6.25 MB)         | memory and CPU abuse before the body is read                                                                                                           |
| Rate limit 3 / min / IP (Workers binding)          | spam bursts; independent from the site-wide `humano` rule                                                                                              |
| Honeypot `website`                                 | naive form bots (they get a fake success and nothing is sent)                                                                                          |
| Proof of work (`pow`)                              | cheap automation: the browser must present a nonce for a challenge signed with `POW_SECRET`, bound to the client IP, ≥ 3 s old, < 15 min old           |
| Field validation                                   | oversized or control-character payloads; e-mail syntax; newlines stripped from single-line fields (no header injection: Resend takes JSON)             |
| Attachment allowlist                               | extension **and** magic bytes must agree (PDF, DOCX, PNG, JPG, TXT); 3 files, 4 MB each, 6 MB total; names sanitised; no executables, archives, `.doc` |
| Plain-text mail                                    | nothing the visitor typed renders as HTML in Rubo's mail client                                                                                        |
| Generic errors, no logging                         | no stack traces or provider messages reach the client; visitor data is never logged (dry-run logging is local-only)                                    |

Rules for agents:

- Secrets (`POW_SECRET`, `RESEND_API_KEY`) exist only as Worker secrets. Never write them in `wrangler.jsonc`, `.dev.vars.example`, tests or docs. `worker/.dev.vars` is git-ignored.
- Do not add a captcha vendor (Turnstile, reCAPTCHA, hCaptcha): it needs a foreign `script-src` and `frame-src`. If spam ever beats the proof of work, first raise `POW_BITS` or lower the rate limit; a vendor needs an ADR and the two-place CSP change.
- Keep the Worker same-origin. No CORS headers, no `workers.dev` URL (`workers_dev: false`), no wildcard.
- Every new field or file type: validate in `worker/src/lib.ts` (allowlist), add a unit test, mirror the limit in `src/scripts/contact-signal.ts` for the user-facing message.
- Attachments are untrusted files delivered to Rubo's Gmail (which scans them). The mail footer says so; keep it.

## Code

- ESLint bans `eval` / `Function` / implied eval, `innerHTML` / `outerHTML` / `insertAdjacentHTML` / `document.write`, `Math.random` (`eslint.config.js`). Never disable them.
- TypeScript `strictest`; zod schemas gate every content file; URLs must be `https://`.
- Deterministic pseudo-randomness with `unitHash()` (FNV-1a) so builds are reproducible.
- Unit tests for the astronomy math; Playwright smoke tests assert the CSP and the absence of inline scripts.

## Supply chain

Lockfile committed; CI installs with `npm ci --ignore-scripts`; `npm audit --omit=dev --audit-level=high` gate; dependency review on PRs; CodeQL `security-extended`; Dependabot weekly (grouped); every action pinned to a full commit SHA; `permissions: {}` at workflow level and minimal per job; `persist-credentials: false` except the Lighthouse commit step; egress audited by harden-runner. Adding a dependency: justify it, `npm install <pkg>` (never hand-edit the lockfile), keep the audit clean. Secrets exist only as Actions secrets (`GH_TRAFFIC_TOKEN`, fine-grained, Administration read-only) and never reach the browser.

## Privacy: what the site may say about Rubo

Published on purpose: name, city, professional e-mail, GitHub and LinkedIn, public CV facts, the real job title, approved work metrics (see `trajectory`).

Never published (also see `AGENTS.md` → Never publish): phone, address, IDs, GPA, the LinkedIn photograph, internal Mercado Libre tool or program names other than "Rangers" and "Longtail", dashboards or internal deployment processes, business metrics beyond the approved ones, code of course projects a course forbids to publish.

Mechanisms that enforce it:

| Mechanism                  | Where                                  | Effect                                                                                                    |
| -------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `profile.links[].audience` | `Contact`, `CvPage`, JSON-LD           | `personal` links (Spotify, Xbox, Steam…) render only in the personal mode; `professional` ones everywhere |
| `projects.visibility`      | `Observatory`, `ProjectPage`, `CvPage` | `confidential`: no repo, disclaimer, out of the CV. `course`: no repo, disclaimer, stays in the CV        |
| `trajectory[].background`  | `Trajectory`                           | rankings and syllabi folded on the site, never printed                                                    |
| zod `httpsUrl`             | all collections                        | no `http://` links                                                                                        |
| Portrait pipeline          | `scripts/optimize-generated.mjs`       | illustrations only; the photograph is never committed                                                     |

The site is static, so anything rendered for the personal mode is still in the HTML. "Hidden" means hidden from the professional view, not secret. Anything that must stay secret does not enter the repository.

## Accepted risks

- `style-src 'unsafe-inline'` (see above).
- Meta CSP cannot set `frame-ancestors`; clickjacking is irrelevant without authenticated actions.
- Personal-mode content is present in the HTML for crawlers; nothing sensitive is placed there.

## Owner checklist (accounts, not code)

See `docs/OWNER.md`: GitHub 2FA and push protection (done), Cloudflare hardening (DNSSEC, e-mail anti-spoofing records, CAA, registrar lock), yearly `security.txt` bump, token rotation, Dependabot and CodeQL review.

## Threats, answered plainly

| Question                                                           | Answer                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Can someone "inspect element" and take the site down or change it? | No. DevTools edits only that visitor's local copy. The published files live on GitHub's CDN and change only through a push to `main` by an account with write access. Protecting the site means protecting the GitHub and Cloudflare accounts (2FA, push protection, no shared tokens).                                       |
| SQL injection, stored XSS, CSRF, auth bypass, session theft?       | No database, login or session anywhere. The one form posts to a stateless Worker that validates every field (allowlists, size caps), checks `Origin` (CSRF) and forwards plain text by e-mail; nothing is stored or rendered back. Pages are pre-built files.                                                                 |
| Spam or abuse through the contact form?                            | Proof of work + honeypot + 3 messages/min/IP + Cloudflare bot protection (section above). Worst case is spam in Rubo's inbox, not a compromise; raise `POW_BITS` or lower the limit in `worker/wrangler.jsonc`.                                                                                                               |
| A malicious attachment?                                            | Only PDF, DOCX, PNG, JPG, TXT whose bytes match the extension; 6 MB total; delivered to Gmail, which scans attachments. Rubo treats them as files from a stranger (the mail says so).                                                                                                                                         |
| Reflected or DOM XSS through our own JavaScript?                   | Mitigated by design: `script-src 'self'`, no inline JS, lint bans `innerHTML` and friends, client code only reads JSON we serialised with `safeJson()`. New scripts must keep to `textContent` and DOM APIs.                                                                                                                  |
| Supply chain (a dependency or an Action turning malicious)?        | Lockfile, `--ignore-scripts`, `npm audit` gate, dependency review, CodeQL, Dependabot, SHA-pinned actions, no third-party script origin. Residual risk: a poisoned build-time dependency; review Dependabot PRs instead of auto-merging.                                                                                      |
| Many requests from a bot or script (scraping, layer-7 flood)?      | GitHub Pages sits behind Fastly with volumetric protection and a soft bandwidth budget (100 GB/month): a burst cannot take the site down, a sustained flood could get it throttled. GitHub Pages has no rate limiting or WAF. **The only place to enforce a per-visitor request limit is Cloudflare's proxy** (next section). |
| Defacement through DNS?                                            | DNSSEC is enabled (DS at the registrar, RRSIG on every answer); registrar is Cloudflare with transfer lock. The domain cannot be re-pointed without the Cloudflare account.                                                                                                                                                   |
| Someone issuing a certificate for rubo6.dev?                       | CAA allows Let's Encrypt (GitHub Pages' CA). While Cloudflare Universal SSL is on, Cloudflare adds CAA for its own CAs too; expected if the proxy is used, removable by disabling Universal SSL if the site stays DNS-only.                                                                                                   |
| Spoofed e-mail from `@rubo6.dev`?                                  | Needs SPF `v=spf1 -all`, DMARC `p=reject` and a Null MX (pending, `docs/OWNER.md`). The domain sends no mail; these records declare it to receivers.                                                                                                                                                                          |
| Privacy leaks?                                                     | See the "Never publish" list in `AGENTS.md`; enforced by `audience`, `visibility`, `background` and `scripts/check-content.mjs`. Analytics are cookieless and aggregated.                                                                                                                                                     |

## Edge protection: Cloudflare proxy (applied 2026-09-06, ADR-0010)

Traffic reaches Cloudflare first (records proxied, SSL Full (strict), HSTS with preload). Cloudflare adds what GitHub Pages cannot: free managed WAF rules, the rate-limit rule `humano` (per IP, more than 60 requests in 10 s → block 10 s), Bot Fight Mode, Browser Integrity Check, layer-7 DDoS mitigation, and a Response Header Transform rule `security-headers` that sends `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` and a `Content-Security-Policy` header equal to the meta CSP plus `frame-ancestors 'none'`.

Rules for agents:

- **The CSP lives in two places**: the meta tag in `src/layouts/Base.astro` and the Cloudflare header. Change both or the browser enforces the intersection (the header may additionally carry `frame-ancestors 'none'` and `upgrade-insecure-requests`, which the meta version cannot or must not). Tell Rubo the exact new header value; only he can edit the Cloudflare rule.
- Never rely on Cloudflare features that rewrite HTML or inject scripts (Rocket Loader, Auto Minify, Mirage, Email Obfuscation); they are off and must stay off.
- GitHub's Pages settings show a DNS warning because the records resolve to Cloudflare; expected. HTTPS is enforced by Cloudflare and by the `.dev` HSTS preload.
- Blocked requests are visible in Cloudflare → Security → Analytics; a legitimate visitor should never trigger `humano` (a full page load is ~15–25 requests).

## Checklist for every change (any agent)

1. Content change: `npm run validate` (content check + schemas) and re-read "Never publish" in `AGENTS.md`.
2. New `<script>`, `fetch`, `<img>` or `<link>` to a foreign origin: stop. It needs an ADR, a CSP edit in `Base.astro` **and the same edit in the Cloudflare `security-headers` rule (ask Rubo)**, this file and the Playwright assertion updated. Prefer self-hosting (ADR-0009).
3. New dependency: `npm install <pkg>`, justify it in the commit, keep `npm audit` clean; never hand-edit the lockfile.
4. New workflow or action: pin to a full commit SHA, `permissions: {}` at workflow level, minimal per job, `persist-credentials: false`.
5. Client code: no `innerHTML`, no `eval`, no `Math.random`, no inline handlers; data through `safeJson()`.
6. Before shipping: `npm run test:e2e` (asserts the CSP, no inline scripts, no foreign scripts) and check that Best Practices stays 100 in `docs/lighthouse/latest.json` after deploy.
7. Worker change (`worker/`): `npm run check` (tsc + dry-run bundle) and `npm test`; keep errors generic, keep logging free of visitor data, keep the allowlists; tell Rubo to `npm run worker:deploy`.
8. Twice a year: refresh `public/js/count.js` from `https://gc.zgo.at/count.js`; bump `security.txt` `Expires` before 2027-09-01.

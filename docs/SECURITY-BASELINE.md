# Security and privacy baseline

Threat model: a public static site with no backend. Assets at risk: (1) the integrity of what visitors receive, (2) Rubo's GitHub and Cloudflare accounts, (3) Rubo's privacy. Attack surface: content files, client scripts, dependencies, GitHub Actions, DNS, and the metadata the site publishes. Read this before adding any external origin, dependency or workflow, and before publishing anything about Rubo.

## Delivered page

- **Content-Security-Policy via `<meta>`** in `src/layouts/Base.astro` (GitHub Pages cannot set headers, so `frame-ancestors` and reporting are unavailable):

  ```
  default-src 'self'; script-src 'self' https://gc.zgo.at; style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://rubo6.goatcounter.com; font-src 'self';
  connect-src 'self' https://rubo6.goatcounter.com; media-src 'self'; object-src 'none';
  base-uri 'self'; form-action 'none'; upgrade-insecure-requests
  ```

  `style-src 'unsafe-inline'` is accepted (ADR-0005): styles cannot execute code and Astro inlines stylesheets. `script-src` never allows inline code. Any new origin = ADR + CSP edit + this file.

- **No inline JavaScript.** Astro `<script>` bundles to external files; `vite.build.assetsInlineLimit: 0` prevents Astro from inlining small chunks (it once did, and the live site lost all JavaScript while dev looked fine; `grep -c '<script type="module">' dist/index.html` must be 0). Server→client data goes through `<script type="application/json">` + `safeJson()`.
- **One third party**: GoatCounter (cookieless analytics, ADR-0006): tag from `gc.zgo.at`, beacon and public counter from `rubo6.goatcounter.com`. Nothing else external at runtime; fonts, images and icons are self-hosted.
- `referrer` meta `strict-origin-when-cross-origin`; external links `rel="noopener noreferrer"` (+ `me` for own profiles); no forms, no cookies; `localStorage` holds two allowlisted preference strings; `robots.txt`, sitemap and `/.well-known/security.txt` (expires 2027-09-01, bump yearly) in `public/`.

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

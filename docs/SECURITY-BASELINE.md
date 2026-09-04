# Security baseline

Threat model: a public static site with no backend. Assets at risk are (1) the integrity of what visitors receive, (2) the author's GitHub account and repository, (3) the author's privacy. Attack surface: content files, client scripts, dependencies, GitHub Actions, and the metadata the site publishes.

## Controls

### Delivered page

| Control                                           | Where                    | Notes                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Content-Security-Policy via `<meta>`              | `src/layouts/Base.astro` | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests`. `frame-ancestors`/`report-uri` are not honoured in meta CSP (GitHub Pages cannot set headers). |
| No inline scripts                                 | everywhere               | Astro `<script>` bundles to external modules; the theme bootstrap is an external blocking file. Data crosses via `<script type="application/json">` + `safeJson()` (escapes `<`, `>`, `&`, U+2028/9).                                                                                                                   |
| One third-party origin (GoatCounter analytics)    | `Base.astro`             | Cookieless page counts, no personal data, honours DNT. CSP allows exactly `https://gc.zgo.at` (script) and `https://rubo6.goatcounter.com` (img/connect). Everything else is self-hosted (ADR-0006).                                                                                                                    |
| `referrer` meta `strict-origin-when-cross-origin` | `Base.astro`             |                                                                                                                                                                                                                                                                                                                         |
| External links                                    | all components           | `rel="noopener noreferrer"` (+ `me` for profile links)                                                                                                                                                                                                                                                                  |
| No forms, no cookies, no storage of visitor data  | —                        | `localStorage` holds only two allowlisted preference strings.                                                                                                                                                                                                                                                           |
| `robots.txt`, `sitemap`, `security.txt`           | `public/`                | `/.well-known/security.txt` with contact and expiry                                                                                                                                                                                                                                                                     |

### Code

| Control                                                                                                                  | Where                   |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| ESLint bans `eval`/`Function`/implied eval, `innerHTML`/`outerHTML`/`insertAdjacentHTML`/`document.write`, `Math.random` | `eslint.config.js`      |
| TypeScript `strictest`, `consistent-type-imports`                                                                        | `tsconfig.json`         |
| Deterministic pseudo-randomness (`unitHash`, FNV-1a)                                                                     | `src/scripts/sky.ts`    |
| Zod schemas gate every content file; URLs must be `https://`                                                             | `src/content.config.ts` |
| Unit tests for the math that renders the sky                                                                             | `tests/unit/`           |

### Supply chain

| Control                                                                                                                                                      | Where                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| Lockfile committed; CI installs with `npm ci --ignore-scripts`                                                                                               | `ci.yml`                 |
| `npm audit --omit=dev --audit-level=high` gate                                                                                                               | `ci.yml`                 |
| Dependency review on PRs (fail on high)                                                                                                                      | `ci.yml`                 |
| CodeQL `security-extended` weekly and on push/PR                                                                                                             | `codeql.yml`             |
| Dependabot weekly for npm and Actions, grouped                                                                                                               | `.github/dependabot.yml` |
| Every action pinned to a full commit SHA; `permissions: {}` at workflow level, minimal per job; `persist-credentials: false`; egress audit via harden-runner | all workflows            |
| Astro telemetry disabled                                                                                                                                     | local config             |

### Privacy

- The only personal data published is the professional e-mail, name, city and public profile links. No phone number anywhere, including the printable CV.
- Employer work is described at the level of the public CV (`visibility: confidential` hides repos and shows a disclaimer).
- Analytics: GoatCounter, cookieless and anonymous (no IP storage, no fingerprinting, aggregated stats only). Documented in ADR-0006.

## Owner checklist (cannot be automated from the repo)

- [ ] Two-factor authentication enabled on the GitHub account
- [ ] Branch protection on `main` (require CI status, disallow force-push) — optional given direct-push workflow, recommended once collaborators exist
- [ ] Secret scanning + push protection enabled in repository settings (free for public repos)
- [ ] Review Dependabot PRs weekly; CodeQL alerts monthly
- [ ] Rotate the `security.txt` `Expires` date yearly (currently 2027-09-01)

## Known accepted risks

- `style-src 'unsafe-inline'`: required by per-element `style` attributes and Astro's inlined stylesheets. Inline styles cannot execute code; exfiltration via CSS is not a concern on a site with no secrets in the DOM.
- Meta-delivered CSP cannot set `frame-ancestors`; clickjacking is irrelevant for a site with no authenticated actions.

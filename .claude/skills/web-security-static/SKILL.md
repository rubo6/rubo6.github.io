---
name: web-security-static
description: Security review and hardening checklist for a static site on GitHub Pages (Astro, no backend) — Content-Security-Policy via meta tag, inline-script bans, third-party origins, supply-chain hygiene for npm and GitHub Actions, privacy of published content, and what GitHub Pages cannot do (headers, frame-ancestors). Use before adding any external script, image host, font, analytics or dependency; when a CSP error appears in the console; when touching .github/workflows; when reviewing content for PII; or when someone asks "is this safe?" about rubo6.dev.
---

# Web security for a static site

This skill distils OWASP guidance and MercadoLibre's frontend security rules for the one architecture this repo has: **static HTML on GitHub Pages, no server, no auth, no forms**. The threat surface is (1) what visitors receive, (2) the owner's GitHub account and CI, (3) the owner's privacy.

## 1. Rules that always apply

- **No inline JavaScript.** Astro `<script>` → external bundle; data via `<script type="application/json">` + `safeJson()`. Never `define:vars`, `is:inline` JS, `set:html` with untrusted data, `eval`, `Function`, `innerHTML`, `document.write`. ESLint enforces the bans; do not disable them.
- **No `Math.random()`** — deterministic hashes (`unitHash`) or `crypto.getRandomValues`.
- **Every external origin is an explicit decision**: add it to the CSP, write an ADR, update `docs/SECURITY-BASELINE.md` and the README claim. Today the only third party is GoatCounter (`gc.zgo.at` script, `rubo6.goatcounter.com` beacon).
- **Links out**: `rel="noopener noreferrer"`; https only (zod `httpsUrl` enforces it in content).
- **No secrets in the repo.** Build-time credentials live in GitHub Actions secrets and are read from `process.env` inside loaders that run only at build; never log them, never pass them to the client.
- **No PII beyond the professional e-mail.** No phone, address, IDs, private repos, internal employer names or metrics. `visibility: confidential` for employer work.

## 2. CSP on GitHub Pages

Pages cannot set HTTP headers, so the policy is a `<meta http-equiv="Content-Security-Policy">` in `Base.astro`. Consequences:

- `frame-ancestors`, `report-uri`/`report-to` and `sandbox` are ignored in meta CSP. Accept it; there are no authenticated actions to clickjack.
- `style-src 'unsafe-inline'` is required (per-element `style` attributes, Astro inlined CSS). Styles cannot execute code.
- Keep `script-src` free of `'unsafe-inline'` and `'unsafe-eval'` forever.
- `vite.build.assetsInlineLimit: 0` must stay: otherwise Astro inlines small chunks and fonts as `data:` and production breaks while dev works.

Debug recipe: open the deployed page, read the console; a CSP violation names the directive and the blocked URL. Fix the source (external file, allowed origin) instead of loosening the directive. Verify `grep -c '<script type="module">' dist/index.html` is 0.

## 3. Supply chain

- `package-lock.json` committed; CI runs `npm ci --ignore-scripts`; `npm audit --omit=dev --audit-level=high` is a gate; dependency review on PRs; CodeQL weekly.
- Every GitHub Action pinned to a full commit SHA with a version comment; Dependabot bumps them. `permissions: {}` at workflow level, minimal per job, `persist-credentials: false`, harden-runner egress audit.
- New dependency: is it needed at runtime? (prefer build-time or none) · maintained? · licence compatible (MIT/Apache/BSD/ISC)? · install with `npm install <pkg>`, never hand-edit the lockfile.

## 4. Owner-side controls (cannot be automated here)

2FA on GitHub, push protection at account level, Dependabot alerts, private vulnerability reporting, `security.txt` expiry (yearly), domain registrar lock and auto-renew, Cloudflare DNS records left **DNS-only** (grey) so GitHub can issue the certificate, **Enforce HTTPS** on in Pages settings.

## 5. Review checklist for a change

1. Does it add an origin, a script, a font, an image host or a dependency? → §1 rules, ADR.
2. Does it render any string from content? Astro escapes by default; only `set:html` is dangerous.
3. Does it read `process.env`? → build-time only, fail-soft, no logging of values.
4. Does it publish anything about a person or an employer? → CONTENT-GUIDE privacy rules.
5. Does CI still run `npm run validate` + audit? Workflows still SHA-pinned?
6. After deploy: console clean of CSP errors in the Browser pane on the live domain.

## Where this came from

Adapted from a team security skill written for a Next.js + Firebase product; everything Firebase-specific (Firestore rules, App Check, Cloud Functions, Firebase Hosting headers) was dropped because this site has no backend. If the site ever grows a backend, start from OWASP Top 10 and the platform's official security docs instead of extending this file.

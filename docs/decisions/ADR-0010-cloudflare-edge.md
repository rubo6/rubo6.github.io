# ADR-0010 · Cloudflare proxy in front of GitHub Pages (WAF, rate limit, security headers)

- Status: accepted · Date: 2026-09-06 · Applied by Rubo in the Cloudflare dashboard

## Context

GitHub Pages cannot rate-limit, filter bots or send security response headers, and a meta CSP cannot express `frame-ancestors`. Rubo asked for a per-visitor request limit and the strongest protection available at no cost. Until this date the DNS records were DNS-only (ADR-0004 era), which kept GitHub in charge of TLS.

## Decision

All `A`, `AAAA` and `CNAME www` records are **proxied** through Cloudflare (Free plan) with this configuration, which must be preserved or changed only through a new ADR:

- SSL/TLS: mode **Full (strict)** (fallback Full only if GitHub's certificate renewal fails, error 526); Always Use HTTPS; minimum TLS 1.2; TLS 1.3; HSTS 6 months with includeSubDomains and preload; No-Sniff; Automatic HTTPS Rewrites. Universal SSL stays on (Cloudflare's CAA entries alongside `letsencrypt.org` are therefore expected).
- Security: Cloudflare free managed ruleset; **rate limiting rule `humano`**: URI path not `/robots.txt`, per IP, more than 60 requests in 10 s → block 10 s; Bot Fight Mode; Browser Integrity Check; "I'm under attack" mode off.
- Rules → Response Header Transform `security-headers` (all requests, set static): `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`, `Cross-Origin-Opener-Policy: same-origin`, and `Content-Security-Policy` equal to the meta CSP in `src/layouts/Base.astro` plus `frame-ancestors 'none'`.
- Caching: level Standard, Browser Cache TTL "Respect Existing Headers". Speed: Rocket Loader, Auto Minify, Mirage, Polish, Email Address Obfuscation **off** (they inject inline scripts or rewrite assets and would break the CSP).
- DNS hygiene kept from before: DNSSEC, CAA for `letsencrypt.org` (`issue` and `issuewild`), SPF `v=spf1 -all`, DMARC `p=reject`, Null MX.

## Consequences

- Layer-7 floods and scrapers hit Cloudflare first; a single IP is limited to 60 requests per 10 s. Security headers score A/A+ on securityheaders.com.
- **Keep the CSP header and the meta CSP identical** (except `frame-ancestors`, meta-only cannot carry it). Any CSP change in `Base.astro` must be mirrored in the Cloudflare rule; `docs/SECURITY-BASELINE.md` checklist item 2 covers it.
- GitHub's Pages settings show a DNS warning because it now resolves to Cloudflare IPs; that is expected. HTTPS is enforced by Cloudflare and by the `.dev` HSTS preload.
- Cloudflare Web Analytics is still not used; GoatCounter remains the only analytics (ADR-0006/0009).
- Rollback: set the records back to DNS-only, disable Universal SSL, delete the rate-limit and transform rules.

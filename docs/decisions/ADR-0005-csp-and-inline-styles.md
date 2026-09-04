# ADR-0005 · Meta-delivered CSP with strict scripts and inline styles allowed

- Status: accepted · Date: 2026-09-03

## Context

GitHub Pages cannot set HTTP headers, so the Content-Security-Policy must be delivered through a `<meta http-equiv>` tag. Astro emits per-element `style="--var:…"` attributes (nebula positions, star dust) and inlines small stylesheets; the Astro dev toolbar injects inline scripts.

## Decision

- `script-src 'self'` with **no** inline scripts. The theme bootstrap is an external blocking script; server→client data travels in `<script type="application/json">` via `safeJson()`.
- `style-src 'self' 'unsafe-inline'`: inline styles cannot execute code, and hashing thousands of generated style attributes is impractical.
- Dev toolbar disabled so development runs under the same CSP as production.
- `frame-ancestors` and reporting are accepted as unavailable in meta CSP.

## Consequences

- XSS through script injection is blocked even if content were ever compromised.
- Any future need for an external script or origin must update the CSP and this ADR.

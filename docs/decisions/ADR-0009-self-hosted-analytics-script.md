# ADR-0009 · Self-host GoatCounter's count.js; `script-src 'self'` only

- Status: accepted · Date: 2026-09-06 · Amends ADR-0006

## Context

ADR-0006 loaded GoatCounter's tag from `https://gc.zgo.at/count.js`, the one external script origin in the CSP. A third-party script origin is the classic supply-chain hole of a static site: if that host or its CDN were compromised, arbitrary JavaScript would run on rubo6.dev with the CSP's blessing. Subresource Integrity is not practical because GoatCounter updates the file in place.

## Decision

Copy `count.js` (ISC licence) into `public/js/count.js` and load it from our own origin. `script-src` returns to `'self'`; `img-src` and `connect-src` keep `https://rubo6.goatcounter.com` for the beacon and the public visit counter. The Playwright suite now asserts that **no** `<script>` loads from a foreign origin.

## Consequences

- No third-party code can execute on the site. The only third-party traffic is an image/fetch beacon to GoatCounter.
- The copy must be refreshed by hand (a few times a year, or when GoatCounter announces a change): download `https://gc.zgo.at/count.js`, diff, replace, run `npm run validate`. Recorded in `docs/OWNER.md`.
- Rollback: restore the external `src` and `https://gc.zgo.at` in `script-src` (both in `src/layouts/Base.astro`) and the filter in `tests/e2e/smoke.spec.ts`.

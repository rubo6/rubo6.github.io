# ADR-0006 · Cookieless analytics with GoatCounter

- Status: accepted · Date: 2026-09-03

## Context

The author wants to know how many people visit the site. ADR-0004 ruled out third-party scripts and ADR-0005 fixed a strict CSP. Any analytics solution therefore has to be justified against those two decisions.

## Decision

Use **GoatCounter** (https://rubo6.goatcounter.com), an open-source, cookieless analytics service:

- No cookies, no persistent identifiers, no personal data stored; page views are aggregated. It honours Do-Not-Track and does not count `localhost`.
- Loaded with the standard tag (`gc.zgo.at/count.js`, `async`) from `Base.astro`. The `is:inline` directive is required because the script is external and carries `data-goatcounter` attributes; it is not inline JavaScript.
- CSP widened by exactly two origins: `script-src` gains `https://gc.zgo.at`; `img-src` and `connect-src` gain `https://rubo6.goatcounter.com`. `script-src` still forbids inline code.
- The "zero third-party requests" claim across the site, README and docs is replaced by "no cookies, no trackers".

## Consequences

- Visitors are counted without consent banners (no personal data is processed).
- One external dependency at runtime; if GoatCounter is unreachable the page is unaffected (`async`).
- Alternatives considered: Cloudflare Web Analytics (also cookieless, needs a Cloudflare account), Plausible/Umami cloud (paid), self-hosting (needs a server). GoatCounter is free for personal use and already set up by the author.
- Rollback: remove the `<script>` in `Base.astro` and the two CSP origins.

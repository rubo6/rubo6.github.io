# Architecture

```
src/content (JSON/MD, zod) ─► src/lib/content.ts (locale fallback) ─► src/components (Astro) ─► dist/ (static HTML)
src/lib/astro (pure math, tested) ─────────────────────────────────────┘        │
src/loaders (GitHub API at build) ─► repoStats, contributions collections       ├─► src/scripts/*.ts (small client modules)
                                                                                └─► src/styles/global.css (tokens)
push to main / daily cron ─► deploy.yml (withastro/action → deploy-pages) ─► https://rubo6.dev ─► lighthouse.yml
```

## Build and hosting

- Astro 7, `output: 'static'`, built-in i18n (`defaultLocale: 'en'`, `prefixDefaultLocale: false`), `@astrojs/sitemap`, Tailwind 4 as a Vite plugin, TypeScript `strictest`, ClientRouter view transitions.
- `vite.build.assetsInlineLimit: 0` keeps every JS chunk and font external (the CSP forbids inline scripts). `build.inlineStylesheets: 'always'` inlines CSS (allowed by `style-src 'unsafe-inline'`, ADR-0005) and removed ~12 render-blocking requests.
- `devToolbar` is disabled: it injects inline scripts the CSP blocks.
- `npm run build` first runs `scripts/generate-og.mjs` (Open Graph PNGs for log entries), then `astro build`. Output: ~100 pages (3 locales × home, projects, CV, log index and entries, now, 404), sitemap, robots, icons, OG images.
- Hosting: GitHub Pages with the custom domain `rubo6.dev` (`public/CNAME`); DNS at Cloudflare, records DNS-only (grey cloud) so GitHub issues the certificate.

## Routing

```
src/pages/index.astro                → Home            /            (+ es/, pt-br/)
src/pages/projects/[key].astro       → ProjectPage     /projects/<key>
src/pages/cv.astro                   → CvPage          /cv
src/pages/log/index.astro, [key]     → LogPage, LogEntry   /log, /log/<key>, /log/rss.xml
src/pages/now.astro                  → NowPage         /now
src/pages/404.astro
```

Page files are one-liners; shared `getStaticPaths` live in `src/lib/routes.ts`. `Base.astro` emits `hreflang` alternates, `x-default`, the CSP meta, OG/Twitter tags and loads `public/theme-init.js` (blocking, external) plus `src/scripts/alive.ts`.

## Content layer

Collections and loaders are declared in `src/content.config.ts`; the schema comments there are the field reference. `src/lib/content.ts` is the only module that calls `getCollection`; it implements English fallback (`pickLocale`, `getProjects` merges by `key`), `pick()` for localized records and `formatMonth()` (Intl, UTC-safe). Components never read collections directly.

Build-time loaders (fail-soft: on error they log a warning and the UI omits the block):

- `src/loaders/github.ts` → `repoStats`: for every `repo:` in `src/content/projects/en/*.md`, stars, forks, language, last push; with the `GH_TRAFFIC_TOKEN` secret also 14-day views/clones.
- `src/loaders/contributions.ts` → `contributions`: 12-month contribution calendar via GraphQL when the token is present; otherwise a 90-day window from public events. `Contributions.astro` renders it as an SVG heatmap in the personal universe and hides it when the anonymous fallback has fewer than 10 contributions.

The token exists only in GitHub Actions; the site never talks to GitHub from the browser.

## Client modules (`src/scripts/`)

Astro ships no JavaScript by default. Each module is mounted from a component `<script>` through `src/scripts/lifecycle.ts`: `onReady(init)` for idempotent initialisers (they mark elements with `data-bound`) and `remountOnSwap(mount)` for modules that own observers or loops and return a dispose function. Both re-run after every ClientRouter navigation (`astro:after-swap`); never wire that listener by hand.

| Module           | Mounted by           | Responsibility                                                                                                                                                                                  |
| ---------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `universe.ts`    | `Nav.astro`          | theme / mode / language / menu controls, active nav anchor, `.reveal` observer, `universe:*` events                                                                                             |
| `sky.ts`         | `Hero.astro`         | canvas star map: catalogue → Alt/Az → stereographic projection; static layer cached per second, twinkle ≤ 30 fps (1 fps on phones), warp on mode change, stops off-screen; exports `unitHash()` |
| `orbits.ts`      | `Trajectory.astro`   | planets positioned by JS; an IntersectionObserver marks the entry being read and the SVG `viewBox` glides to its planet (camera); reduced motion → static planets, camera jumps                 |
| `observatory.ts` | `Observatory.astro`  | nebula focus / dim / zoom, panels, Escape and arrow keys, `#observatory:<id>` deep links                                                                                                        |
| `counters.ts`    | `LiveCounters.astro` | live durations from `data-start` / `data-end`                                                                                                                                                   |
| `alive.ts`       | `Base.astro`         | pointer spotlight for `.glow` (`--mx/--my`), dome-shutter overlay around navigations; both off under reduced motion                                                                             |
| Footer module    | `Footer.astro`       | refreshes the moon phase; fetches the GoatCounter public counter once per session (line is only rendered when the endpoint answered at build time)                                              |

Data reaches the client only through `<script type="application/json">` produced with `safeJson()` (`src/lib/json.ts`, escapes `<>&` and U+2028/9) and read with `readJson()`.

## Theming

Two attributes on `<html>`: `data-theme` (`night` | `atlas`) and `data-mode` (`pro` | `personal`), set before first paint by `public/theme-init.js` from allowlisted `localStorage` values or `prefers-color-scheme`. Every colour token is a registered `@property` and `html` transitions them, so a mode switch animates. Mode-dependent copy is rendered twice and toggled with CSS (`[data-mode='personal'] .personal-only { display: block }`). Tailwind reads the tokens through `@theme inline`.

## Astronomy (`src/lib/astro/`)

`time.ts` (Julian date, GMST per Meeus 12.4, local sidereal time), `coords.ts` (equatorial → horizontal, stereographic zenith projection, magnitude → radius), `moon.ts` (phase from a reference new moon and the mean synodic month), `duration.ts` (calendar-aware durations for the clocks). Tests: `tests/unit/astro.test.ts` against Meeus worked examples. Catalogue: `src/data/bright-stars.json` (150 stars, 29 constellation figures; new stars need exact J2000 coordinates).

## Imagery pipeline

Originals from ESA/Webb and ESA/Hubble live in `src/assets/nebulae/raw/` under **Git LFS** (`git lfs pull` to fetch; CI never needs them). Derived files are normal: `scripts/optimize-nebulae.mjs` → `src/assets/nebulae/<id>.{avif,webp}` (only ids registered in `src/assets/nebulae/credits.json`), `scripts/optimize-scenes.mjs` → `src/assets/scenes/<id>.{avif,webp}` (1600×900 backdrops, ids in `src/assets/scenes/credits.json`, rendered by `SceneBackdrop.astro`). Portraits are illustrations generated by Rubo from his own photo (`scripts/optimize-generated.mjs`); the photograph itself is never committed. History was rewritten on 2026-09-05 to move raw blobs into LFS; older clones must be re-cloned.

## CI/CD

- `ci.yml`: `npm ci --ignore-scripts`, `npm run validate`, Playwright smoke suite (`tests/e2e/smoke.spec.ts`, desktop + Pixel 7, hermetic: third-party requests aborted, `workers: 1`, `ASTRO_PREVIEW_BACKGROUND=1` so Astro's preview does not daemonise), `npm audit --omit=dev --audit-level=high`; dependency review on PRs.
- `deploy.yml`: build with `withastro/action`, publish with `actions/deploy-pages`; on push to `main`, manual dispatch and a daily cron (05:17 America/Mexico_City). `GH_TRAFFIC_TOKEN` is read here.
- `lighthouse.yml`: after each successful deploy, weekly and on demand; three mobile runs (median kept) plus desktop against the live URL; `scripts/lighthouse-summary.mjs` writes `docs/lighthouse/latest.json` and `history.jsonl` (committed with `[skip ci]`; `ci.yml`/`deploy.yml` ignore that folder). README badges read `latest.json`. Compare `benchmarkIndex` before comparing scores.
- `codeql.yml`: weekly and on push, `security-extended`. All actions pinned to commit SHAs, `permissions: {}` at workflow level, Dependabot weekly.

## Local checks

`node scripts/vitals.mjs` (after a build; uses `astro preview` on :4173) prints LCP, CLS, long tasks and transfer weight per key page for desktop and a throttled phone. Lighthouse locally needs installed Google Chrome via `CHROME_PATH` and an idle machine; prefer the CI numbers.

## Gotchas

- After changing a collection schema the dev server may return stale entries (new fields `undefined`): stop it, delete `.astro/data-store.json`, restart. `astro build` is unaffected.
- JSX comments inside Astro attribute lists break the ESLint parser; use HTML comments above the element.
- A rule written inside `<style is:global>` with `:global()` is silently dropped; write the plain selector.
- Never put literal U+2028/2029 or other invisible characters in source; build regexes from char codes.
- Prettier reformats content JSON; run `npm run format` before diffing.

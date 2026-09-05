# Architecture reference

## Build and hosting

- Astro 7, `output: 'static'`, i18n built-in (`defaultLocale: 'en'`, `prefixDefaultLocale: false`), `@astrojs/sitemap`, Tailwind CSS 4 as a Vite plugin, TypeScript `strictest`.
- `vite.build.assetsInlineLimit: 0` — every JS chunk and font stays an external file (CSP). `inlineStylesheets: 'auto'` is fine because `style-src` allows inline styles.
- `devToolbar` disabled (it injects inline scripts the CSP blocks).
- Output: 34 static pages (3 locales × home, ~8 project pages, CV) + 404, sitemap, robots, icons, OG image. Deployed by `.github/workflows/deploy.yml` (`withastro/action` → `actions/deploy-pages`) on push to `main`, manual dispatch and a daily cron at 05:17 America/Mexico_City.
- CI (`ci.yml`): `npm ci --ignore-scripts` → format check → lint → `astro check` → vitest → build → Playwright smoke tests (`tests/e2e/smoke.spec.ts`, Chromium desktop + Pixel 7, served by `astro preview` with `ASTRO_PREVIEW_BACKGROUND=1` so Astro 7 does not daemonise it in agent shells) → `npm audit --omit=dev --audit-level=high`; dependency review on PRs. `codeql.yml` weekly + on push. All actions pinned to commit SHAs; Dependabot updates them (TypeScript majors ignored because typescript-eslint lags).

## Routing and locales

```
src/pages/index.astro            → Home locale="en"      /
src/pages/es/index.astro         → Home locale="es"      /es/
src/pages/pt-br/index.astro      → Home locale="pt-br"   /pt-br/
src/pages/projects/[key].astro   → ProjectPage           /projects/<key>   (+ es/, pt-br/)
src/pages/cv.astro               → CvPage                /cv               (+ es/, pt-br/)
src/pages/404.astro
```

Page files are one-liners; `src/lib/routes.ts` holds the shared `getStaticPaths`. `Base.astro` emits `hreflang` alternates and `x-default`. Locale metadata (labels, `htmlLang`, Intl tags) lives in `src/i18n/ui.ts` → `localeMeta`.

## Content layer

`src/content.config.ts` declares seven collections with zod schemas:

| Collection       | Loader                                    | Locale strategy                                                                      |
| ---------------- | ----------------------------------------- | ------------------------------------------------------------------------------------ |
| `profile`        | `glob('*.json')` in `src/content/profile` | one file per locale; `dates` drive the live clocks                                   |
| `trajectory`     | `glob('*.json')`                          | one file per locale, array of entries with `orbit` index                             |
| `projects`       | `glob('**/*.md')`                         | folder per locale; cross-locale `key` = URL slug; loader id is path-based (`en/foo`) |
| `nebulae`        | `file('nebulae.json')`                    | locale-independent + `labels`/`descriptions` records                                 |
| `skills`         | `file('skills.json')`                     | locale-independent + `labels`                                                        |
| `certifications` | `file('certifications.json')`             | locale-independent                                                                   |
| `personal`       | `glob('*.json')`                          | one file per locale                                                                  |

`src/lib/content.ts` is the only consumer of `getCollection`; it implements English fallback (`pickLocale`, `getProjects` merging by `key`) and helpers `pick()` (localized record) and `formatMonth()` (Intl, UTC-safe).

## Client modules (`src/scripts`)

| Module                 | Mounted from                      | Notes                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `universe.ts`          | `Nav.astro`                       | Theme/mode/lang/menu controls, active anchor observer, `.reveal` observer (+2.5 s safety net), dispatches `universe:theme` / `universe:mode` custom events; `initUniverseControls()` is idempotent (`data-bound`) and re-run on `astro:after-swap`                                                                                                                                                                    |
| `sky.ts`               | `Hero.astro`                      | `mountSky()` canvas renderer: LST → Alt/Az → stereographic zenith projection (north up, east left), horizon ring + cardinal marks, constellation lines, magnitude-sized stars with deterministic twinkle (`unitHash`), labels for the 14 brightest visible, warp streaks for 900 ms on mode change, pauses when hidden/off-screen, reduced-motion → static + 60 s refresh. Also exports `unitHash()` and `readJson()` |
| `counters.ts`          | `LiveCounters.astro`              | reads `data-start`/`data-end`, renders calendar durations every second (60 s under reduced motion)                                                                                                                                                                                                                                                                                                                    |
| `observatory.ts`       | `Observatory.astro`               | focus/dim/zoom nebulae via `--fx/--fy/--fs`, shows the matching panel, Escape/arrow keys, `history.replaceState` hash `#observatory:<id>` (`#universe:<id>` for the personal scene), deep-link scrolls the field into view                                                                                                                                                                                            |
| Footer inline module   | `Footer.astro`                    | recomputes moon phase and SVG path client-side                                                                                                                                                                                                                                                                                                                                                                        |
| `public/theme-init.js` | `Base.astro` (blocking, external) | sets `data-theme`/`data-mode` from allowlisted `localStorage` values or `prefers-color-scheme`, adds `html.js`                                                                                                                                                                                                                                                                                                        |

Data reaches the client only through `<script type="application/json" id="…">` produced with `safeJson()` (`src/lib/json.ts` — escapes `<>&` and U+2028/9 via char codes, no invisible characters in source).

## Theming model

Two attributes on `<html>`: `data-theme` (`night` | `atlas`) and `data-mode` (`pro` | `personal`). All colour tokens are registered `@property` and `html` transitions them over `--dur-universe` (1400 ms), so a mode switch animates. Components ship both copies of mode-dependent text and toggle with CSS (`[data-mode='personal'] .x-pro { display:none }`). Tailwind reads the tokens through `@theme inline`.

## Astronomy library (`src/lib/astro`)

`time.ts` (JD, GMST Meeus 12.4, LST, `formatHours`), `coords.ts` (`equatorialToHorizontal`, `horizontalToScreen`, `magnitudeToRadius`), `moon.ts` (mean synodic month from reference new moon JD 2451550.2597), `duration.ts` (calendar-aware `duration()`, `parseContentDate()` at UTC−6). Tests: `tests/unit/astro.test.ts` (Meeus 12.a, 13.b, known moons, month clamping).

Catalogue: `src/data/bright-stars.json` — 150 stars (name, constellation, RA hours, Dec degrees, V mag) + 29 constellation figures as name pairs. Adding a star requires exact J2000 coordinates.

> Gotcha: after changing a collection schema, the dev server's incremental glob loader may keep stale parsed entries (new fields come back `undefined`). Stop the server, delete `.astro/data-store.json`, restart. `astro build` is not affected.

## Lighthouse in CI

`lighthouse.yml` (workflow_run after Deploy, weekly cron, manual): `npx lighthouse@13` mobile + desktop against the live URL on ubuntu-latest, `scripts/lighthouse-summary.mjs` → `docs/lighthouse/{latest.json,history.jsonl}` + job summary, committed by github-actions[bot] with `[skip ci]`; `ci.yml`/`deploy.yml` have `paths-ignore: docs/lighthouse/**`. Locally Lighthouse needs the installed Google Chrome via `CHROME_PATH` and an idle machine (WhisperFlow's `pythonw` alone eats ~0.8 cores).

## Large files (Git LFS)

`src/assets/nebulae/raw/*.{jpg,jpeg,png}` are LFS-tracked originals (11 files, ~91 MB). CI checkouts do not fetch LFS (`actions/checkout` default), so builds never depend on them; the derived AVIF/WebP are normal files. To regenerate derived images: `git lfs pull`, then `node scripts/optimize-nebulae.mjs` / `optimize-scenes.mjs`. History was rewritten with `git filter-repo` on 2026-09-05 (pack went from ~28 MB to ~10 MB); Rubo approved the force-push.

## Performance budget for motion

- The sky canvas is the most expensive thing on the site. `sky.ts` recomputes star positions and the static layer (horizon, constellation lines, labels) once per second into an offscreen canvas; per frame it only blits that layer and draws twinkling stars with a pre-rendered glow sprite. Twinkle is capped at 30 fps (15 fps on coarse pointers); the loop stops when the hero is off-screen or the tab is hidden. Before this, a 4× throttled phone spent ~100 % of its main thread on the canvas at idle.
- `filter: blur()` entrance animations run only on `(hover: hover) and (pointer: fine) and (min-width: 900px)`; phones get the opacity/transform version.
- Measure with `node scripts/vitals.mjs` against `astro preview` (desktop + 4× throttled Pixel 7; LCP/CLS/long tasks/weight per page). Lighthouse CLI cannot launch Chrome on Rubo's machine (chrome-launcher `spawn UNKNOWN`) and PageSpeed Insights' anonymous quota is shared, so vitals.mjs is the local sanity check; run real Lighthouse from Chrome DevTools on the live site when needed.

## Trajectory camera (`src/scripts/orbits.ts`)

Planets are positioned by JS (rotate transform, ≤ 30 fps while the section is on screen); an IntersectionObserver band around the viewport centre marks the entry being read (`[data-entry-index]` ↔ `.planet[data-index]`), the SVG `viewBox` lerps to that planet (zoom 1.5–2.6, inner orbits closer) and the planet gets a halo (`.is-active`). No active entry → whole system. Reduced motion → static planets, camera jumps.

## Visit counter

`Footer.astro` fetches `https://rubo6.goatcounter.com/counter/TOTAL.json` once per page session and shows the total (`[data-visits]`, hidden until it arrives). GoatCounter only serves that endpoint with CORS when **Settings → Site → "Allow adding visitor counts on your website"** is enabled; until Rubo enables it the footer simply omits the line. `connect-src` already allows the origin.

## Personal universe imagery

Personal clusters map to official images by id in `Observatory.astro` (`astronomy → academic` Carina, `music → music` Butterfly NGC 6302 heic2011b, `gaming → gaming` Cat's Eye NGC 6543 heic0414a, `water → personal` Helix). Credits render inside each panel. `scripts/optimize-nebulae.mjs` only processes raw files whose id is registered in `src/assets/nebulae/credits.json` (raw/ also holds scene originals). Section backdrops: Trajectory → `rho-ophiuchi` (weic2316a), Skills → `ngc604` (weic2407a), Contact → `stephans-quintet`.

## Alive layer (session 3)

- `src/scripts/alive.ts` (loaded from `Base.astro`): pointer spotlight for `.glow` elements (writes `--mx/--my`), dome-shutter overlay (`[data-dome]`) closed/opened around ClientRouter navigations via `astro:before-preparation` (`loader` override) and `astro:after-swap`; both skipped under reduced motion.
- `global.css`: `.glow`, `.lift`, `@utility glass`, keyframes `breathe`, `pulse-dot`, `sweep`, `.spin-slow/.spin-slower`, `.dome-shutter`, `::view-transition-old/new(root)` (blur + scale cross-dissolve), stronger `.reveal` (blur + scale) and `.reveal-stagger`.
- `Ticker.astro`: CSS-only marquee (duplicated list, `translate3d(-50%)`, pause on hover, static under reduced motion). Home has two: deep-sky objects (left) after the hero, stack (right) before the footer.
- `SceneBackdrop.astro` + `src/assets/scenes/` (`scripts/optimize-scenes.mjs`): official JWST backdrops behind page heads (log index: Tarantula; Now: WR 124; 404: Cartwheel; contact section: Stephan's Quintet; log entries with `scene:` frontmatter, e.g. pulsars → Crab).
- Idle loops: SectionHeading reticle (`spin-slow`), footer pulsar beam, nav brand orbit, portrait breathing glow, live-counter pulse dots; hover: constellation stars scale + tooltip with `via`.

## Study log (`posts`) and Now page

- `posts` collection (`src/content/posts/<locale>/*.md`), accessors `getPosts/getPost/readingMinutes/formatLongDate` in `lib/content.ts`, routes `/log`, `/log/[key]`, `/log/rss.xml` per locale (`lib/rss.ts`), `LogLatest` on home, `LogFilters` (client-side search + area chips + term select, URL-synced), per-entry OG PNGs from `scripts/generate-og.mjs` (prebuild step in `npm run build`, output `public/og/log/`).
- `now` collection (`src/content/now/<locale>.json`) → `/now` per locale via `NowPage.astro`.

## GitHub loader (`src/loaders/github.ts`)

Astro Content Layer loader registered as the `repoStats` collection. At build it discovers every `repo:` in `src/content/projects/en/*.md`, calls `https://api.github.com/repos/<owner>/<name>` (stars, forks, language, last push) and, when `GH_TRAFFIC_TOKEN` is in the environment (Actions secret, fine-grained PAT with Administration read-only), `/traffic/views` and `/traffic/clones` (14-day windows). Fail-soft: errors are logged as warnings and the collection stays empty, so offline builds pass and the UI simply omits the stats row. Consumed by `Observatory.astro` (star cards) and `ProjectPage.astro`. The daily cron in `deploy.yml` keeps numbers fresh.

## Contributions loader (`src/loaders/contributions.ts`)

`contributions` collection, one entry (id = GitHub login discovered from the profile's GitHub link). With `GH_TRAFFIC_TOKEN` it queries GraphQL `contributionsCollection.contributionCalendar` (12 months, same as the profile page); without a token, or if GraphQL rejects the token, it falls back to `GET /users/{login}/events/public` (≤ 90 days / 300 events, PushEvent weighted by `distinct_size`). `Contributions.astro` renders a pure-SVG heatmap (53×7 max, `data-level` 0–4 coloured from `--accent`) inside `.personal-extra`; `Observatory.astro` hides it when the fallback has < 10 contributions. No client JS, no browser requests.

## Analytics

GoatCounter tag in `Base.astro` (`is:inline` external script with `data-goatcounter`), origins whitelisted in the CSP. Dashboard: https://rubo6.goatcounter.com. ADR-0006.

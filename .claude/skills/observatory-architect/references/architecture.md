# Architecture reference

## Build and hosting

- Astro 7, `output: 'static'`, i18n built-in (`defaultLocale: 'en'`, `prefixDefaultLocale: false`), `@astrojs/sitemap`, Tailwind CSS 4 as a Vite plugin, TypeScript `strictest`.
- `vite.build.assetsInlineLimit: 0` — every JS chunk and font stays an external file (CSP). `inlineStylesheets: 'auto'` is fine because `style-src` allows inline styles.
- `devToolbar` disabled (it injects inline scripts the CSP blocks).
- Output: 34 static pages (3 locales × home, ~8 project pages, CV) + 404, sitemap, robots, icons, OG image. Deployed by `.github/workflows/deploy.yml` (`withastro/action` → `actions/deploy-pages`) on push to `main`, manual dispatch and a daily cron at 05:17 America/Mexico_City.
- CI (`ci.yml`): `npm ci --ignore-scripts` → format check → lint → `astro check` → vitest → build → `npm audit --omit=dev --audit-level=high`; dependency review on PRs. `codeql.yml` weekly + on push. All actions pinned to commit SHAs; Dependabot updates them (TypeScript majors ignored because typescript-eslint lags).

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

## GitHub loader (`src/loaders/github.ts`)

Astro Content Layer loader registered as the `repoStats` collection. At build it discovers every `repo:` in `src/content/projects/en/*.md`, calls `https://api.github.com/repos/<owner>/<name>` (stars, forks, language, last push) and, when `GH_TRAFFIC_TOKEN` is in the environment (Actions secret, fine-grained PAT with Administration read-only), `/traffic/views` and `/traffic/clones` (14-day windows). Fail-soft: errors are logged as warnings and the collection stays empty, so offline builds pass and the UI simply omits the stats row. Consumed by `Observatory.astro` (star cards) and `ProjectPage.astro`. The daily cron in `deploy.yml` keeps numbers fresh.

## Analytics

GoatCounter tag in `Base.astro` (`is:inline` external script with `data-goatcounter`), origins whitelisted in the CSP. Dashboard: https://rubo6.goatcounter.com. ADR-0006.

# Architecture

## Overview

```
content (JSON/MD, zod) ──► lib/content.ts (locale fallback) ──► Astro components ──► static HTML
                                                     ▲                    │
lib/astro (pure math, tested) ───────────────────────┘                    ├─► scripts/*.ts (client islands)
                                                                          └─► styles/global.css (tokens)
GitHub Actions: push to main ─► withastro/action (build) ─► deploy-pages ─► rubo6.dev
                daily cron  ─► same pipeline (keeps build-time data fresh)
```

## Build

- `astro build` produces `dist/` with one HTML file per route per locale (31 pages today), hashed assets under `dist/_astro/`, `sitemap-index.xml`, `robots.txt`, icons and the OG image.
- Output is fully static (`output: 'static'`). There is no server, no middleware, no runtime environment variables.
- `vite.build.assetsInlineLimit: 0` keeps every JS chunk and font as an external file (the CSP forbids inline scripts and `data:` fonts). `inlineStylesheets: 'auto'` lets Astro inline tiny stylesheets; `style-src` allows `'unsafe-inline'` for that reason (styles cannot execute code; scripts stay strict).

## Routing and i18n

- Astro's built-in i18n with `defaultLocale: 'en'` and `prefixDefaultLocale: false`: English at `/`, Spanish at `/es/`, Portuguese at `/pt-br/`.
- Each locale has thin page files (`src/pages/<locale>/…`) that render shared components (`Home.astro`, `ProjectPage.astro`, `CvPage.astro`). Adding a locale means adding page files + content, not duplicating components.
- `hreflang` alternates and `x-default` are emitted in `Base.astro`; the sitemap integration is configured with the same locale map.

## Content pipeline

- Collections are declared in `src/content.config.ts` with the `glob` and `file` loaders. Schemas are the contract: builds fail on invalid content.
- `src/lib/content.ts` is the only place that knows the fallback rule (missing locale → English). Components never call `getCollection` directly.
- Projects use a cross-locale `key` (URL slug). Loader ids are path-derived (`en/foo`, `es/foo`) so the same key can exist in several locales.

## Client-side code

Astro ships zero JavaScript by default; these modules are the exceptions, each mounted from a component `<script>` and re-mounted on `astro:after-swap` (View Transitions):

| Module                       | Mounted by           | Responsibility                                                                                                   |
| ---------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `scripts/universe.ts`        | `Nav.astro`          | Theme/mode/language/menu controls, active nav anchor, `.reveal` observer, `universe:*` events                    |
| `scripts/sky.ts`             | `Hero.astro`         | Canvas star map: catalogue → Alt/Az → stereographic projection; twinkle; warp on mode change; pauses when hidden |
| `scripts/counters.ts`        | `LiveCounters.astro` | Live durations from `data-start`/`data-end`                                                                      |
| `scripts/observatory.ts`     | `Observatory.astro`  | Nebula focus/zoom, panels, keyboard navigation, URL hash sync                                                    |
| `Footer.astro` inline module | `Footer.astro`       | Refreshes moon phase on the client                                                                               |

Data crosses from server to client only through `<script type="application/json">` elements serialized with `safeJson()`; scripts read them with `readJson()` (JSON.parse of `textContent`). No inline JS, no `define:vars`.

## Theming model

Two orthogonal axes on `<html>`: `data-theme="night|atlas"` and `data-mode="pro|personal"`. `public/theme-init.js` sets both before first paint from `localStorage` (allowlisted values) or `prefers-color-scheme`. Every token is a registered `@property` and `html` declares `transition` on them, so a mode switch interpolates colours over `--dur-universe`. Components swap copy per mode with CSS (`[data-mode='personal'] .x-pro { display: none }`) so both variants are in the static HTML.

## Astronomy

`src/lib/astro/` is framework-free TypeScript:

- `time.ts` — Julian date, GMST (Meeus 12.4), LST, formatting.
- `coords.ts` — equatorial → horizontal, stereographic zenith projection, magnitude → radius.
- `moon.ts` — phase/age/illumination from a reference new moon and the mean synodic month.
- `duration.ts` — calendar-aware elapsed time for the mission clocks.

Tests in `tests/unit/astro.test.ts` check against Meeus worked examples (12.a, 13.b) and known lunar phases.

## CI/CD

- `ci.yml`: `npm ci --ignore-scripts`, format check, lint, `astro check`, tests, build, `npm audit --audit-level=high`; dependency review on PRs.
- `deploy.yml`: build with `withastro/action` and publish with `actions/deploy-pages`; runs on push to `main`, manual dispatch and a daily cron.
- `codeql.yml`: weekly + on push/PR, `security-extended` queries.
- All actions pinned to commit SHAs; `permissions: {}` at workflow level, granted per job.

## Local development

`npm run dev` (Node ≥ 22.12). The Browser pane launch config `.claude/launch.json` starts Astro with an explicit Node binary. The dev toolbar is disabled because it injects inline scripts blocked by the CSP.

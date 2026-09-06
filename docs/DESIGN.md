# Design system — "Observatory"

Real astronomy, not neon space. A live star map computed from a catalogue, nebulae as regions of work, orbits as a career, constellations as skills. Two lenses on the same sky (**professional** formal, **personal** warm) and two lighting conditions (**night**: the void, near-black with a trace of blue; **atlas**: 19th-century star-atlas paper). Rubo dislikes the light theme but asked to keep it; fix its legibility, do not redesign it.

Anti-goals: neon grids, "tron" aesthetics, generic fonts (Inter/Roboto), purple-on-white gradients, stock space art with planets and spaceships, AI imagery presented as photography.

## Tokens (`src/styles/global.css`, all registered `@property` so they interpolate)

| Token                      | Night · Pro                   | Night · Personal              | Atlas · Pro                   | Atlas · Personal              |
| -------------------------- | ----------------------------- | ----------------------------- | ----------------------------- | ----------------------------- |
| `--bg-0 / --bg-1 / --bg-2` | `#060814 / #0b0f22 / #131a38` | `#0a0616 / #150e2b / #22183f` | `#f6f1e7 / #efe7d6 / #e6dcc6` | `#f8efe4 / #f1e3d0 / #e8d5bb` |
| `--ink / --ink-muted`      | `#f4efe6 / #b9b6c9`           | same                          | `#1b2240 / #4e5470`           | same                          |
| `--accent` (primary)       | gold `#f2c46d`                | coral `#f07a6e`               | `#a67c2e`                     | `#b8473c`                     |
| `--accent-2`               | coral                         | gold                          | `#b8473c`                     | `#a67c2e`                     |
| `--accent-3` (data, mono)  | cyan `#9ad9e8`                | mint `#a8e6cf`                | `#2e7c8c`                     | `#2f7f6a`                     |
| `--line`                   | `#f4efe61f`                   | same                          | `#1b224024`                   | same                          |

Contrast: body text always `--ink` / `--ink-muted` (≥ 6:1). Atlas gold is for large text and lines only (3.6:1); text on a gold button in atlas uses `#0b1026` (`[data-theme='atlas'] .btn-primary`). Print styles reset everything to black on white.

Type: Fraunces Variable for display (`opsz 144`, `SOFT 30`, `WONK 1`), Instrument Sans Variable for body, JetBrains Mono Variable for data and kickers. Fluid scale `--text-xs … --text-4xl` via `clamp()`. Self-hosted with Fontsource; two above-the-fold fonts are preloaded.

Layout: content width `72rem`, gutters `1.25rem`, sections 5–6 rem apart, radii `0.375 / 0.75 / 1.25rem`, 1px `--line` borders, `color-mix` translucent fills, light blur on floating surfaces. Composition is asymmetric on purpose.

## Motion

- Entrances: `.reveal` + `data-delay` 1–4; `.reveal-solid` for above-the-fold copy (no opacity fade). Blur-based entrances only on `(hover: hover) and (pointer: fine) and (min-width: 900px)`.
- Universe switch: tokens interpolate over `--dur-universe` (1400 ms) plus a 900 ms canvas warp.
- Idle loops are symmetric and slow: section reticles (`spin-slow`), footer pulsar beam, nav brand orbit, portrait breathing glow, counter pulse dots, two CSS marquee tickers (`Ticker.astro`, pause on hover).
- Navigation: dome-shutter overlay + `::view-transition` blur cross-dissolve (`alive.ts`).
- Hover life: `.glow` pointer spotlight, `.lift`, constellation stars scale 1.8× with an outlined label and come to the front.
- Only `transform`, `opacity` and registered tokens animate. `prefers-reduced-motion`: sky static (refresh every 60 s), planets still, no shutter, no marquee, reveals instant. Coarse pointers: no gas drift, sky at 1 fps.
- Budget: the sky canvas is the most expensive element; keep the static layer cached and the loop stopped when the hero is off-screen (`scripts/vitals.mjs` measures it).

## Components

| Component                        | Notes                                                                                                                                                |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Nav`                            | sticky, blurred; mode switch (`role="switch"`), theme button, language listbox, mobile menu                                                          |
| `Hero` + `Portrait` + sky canvas | headline/tagline from `profile`, illustrated portrait with medium tabs, sidereal clock with hint, mission clocks (`LiveCounters`)                    |
| `Observatory`                    | nebulae with official imagery behind procedural gas; focus dims siblings and opens a panel; personal scene maps clusters to images (`personalImage`) |
| `Trajectory`                     | SVG orbits (work gold, leadership coral, education cyan dashed) with camera follow; entry cards `.entry-body`; `background` folded in `<details>`    |
| `Constellation`                  | one SVG per skill group; star radius by level; tooltips with `via`; certifications box                                                               |
| `Contact`                        | cards over the Stephan's Quintet backdrop; copy-email button; `personal-only` cards for leisure links                                                |
| `Footer`                         | moon disc, build date, visit counter, pulsar beacon; no source-code link by Rubo's choice                                                            |
| `SceneBackdrop`                  | official JWST/Hubble header or section backdrop with credit link; ids in `src/assets/scenes/credits.json`                                            |
| `CvPage`                         | print-ready CV: one column in print, comma separators, skills `level >= 3`, `background` never printed, back link                                    |

Conventions: a section is `<section id class="… container-content" aria-labelledby>` + `SectionHeading`; mode copy is rendered twice and toggled with CSS; external links get `rel="noopener noreferrer"` (+ `me` for own profiles); icon-only buttons need `aria-label`; buttons are `.btn .btn-primary|.btn-ghost|.btn-sm`.

## Imagery policy

Only official JWST / Hubble / ESO releases (public domain or CC BY 4.0) with credit and source URL recorded in `src/assets/nebulae/credits.json` or `src/assets/scenes/credits.json`, converted to AVIF/WebP (nebulae ≤ ~180 KB, backdrops ≤ ~200 KB). Portraits are illustrations made by Rubo from his own photograph and are labelled as such; the real photo is never committed. See `docs/ARCHITECTURE.md` → Imagery pipeline for the scripts.

## Accessibility checklist

Semantic landmarks · one `h1`, ordered headings · skip link · visible `:focus-visible` · keyboard: Tab everything, Escape closes menus and panels, arrows move between nebulae · `aria-pressed` on nebulae, `aria-live="polite"` on panels, `role="timer"` on clocks · contrast ≥ 4.5:1 in both themes (CI runs Lighthouse in the light scheme, so atlas problems show up there) · touch targets ≥ 44 px · safe-area padding · reduced motion honoured.

## Before merging visual work

Both themes × both modes · mobile (375 px) and desktop (≥ 1280 px) · keyboard · reduced motion · no new third-party request in the Network panel · `npm run validate`.

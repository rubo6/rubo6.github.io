# Design system — "Observatory"

## Concept

The site is a personal observatory. Real astronomy, not neon space: a live star map computed from a catalogue, nebulae as regions of work, orbits as a career, constellations as skills. Two lenses on the same sky: **professional** (formal register) and **personal** (warm register). Two lighting conditions: **night** (deep indigo sky) and **atlas** (19th-century star-atlas paper).

Anti-goals: pure black backgrounds, neon grids, generic fonts (Inter/Roboto), purple-on-white gradients, stock "space" imagery with planets and spaceships.

## Tokens (`src/styles/global.css`)

All tokens are registered `@property` custom properties so they interpolate when `data-theme` or `data-mode` changes.

| Token         | Night · Pro    | Night · Personal | Atlas · Pro | Atlas · Personal | Role                                                     |
| ------------- | -------------- | ---------------- | ----------- | ---------------- | -------------------------------------------------------- |
| `--bg-0`      | `#0b1026`      | `#160f2e`        | `#f6f1e7`   | `#f8efe4`        | Page background                                          |
| `--bg-1`      | `#111838`      | `#22183f`        | `#efe7d6`   | `#f1e3d0`        | Cards, nav                                               |
| `--bg-2`      | `#1a2350`      | `#2f2255`        | `#e6dcc6`   | `#e8d5bb`        | Highlights, moon disc                                    |
| `--ink`       | `#f4efe6`      | same             | `#1b2240`   | same             | Text                                                     |
| `--ink-muted` | `#b9b6c9`      | same             | `#4e5470`   | same             | Secondary text                                           |
| `--accent`    | `#f2c46d` gold | `#f07a6e` coral  | `#a67c2e`   | `#b8473c`        | Primary CTA, stars, focus ring                           |
| `--accent-2`  | `#f07a6e`      | `#f2c46d`        | `#b8473c`   | `#a67c2e`        | Leadership, secondary emphasis                           |
| `--accent-3`  | `#9ad9e8`      | `#a8e6cf`        | `#2e7c8c`   | `#2f7f6a`        | Data/mono labels, education                              |
| `--sky-angle` | `200deg`       | `320deg`         | `200deg`    | `320deg`         | Body gradient direction (animates the "universe moving") |

Contrast: `--ink` on `--bg-0` ≥ 13:1 in every combination; `--ink-muted` ≥ 6:1; `--accent` text on dark ≥ 9:1. On atlas, gold `#a67c2e` is reserved for large text and lines (3.6:1), never body copy.

## Typography

- **Display:** Fraunces Variable (`opsz 144`, `SOFT 30`, `WONK 1`). Headlines are dramatic: `h1` ≈ 3.2–6.4rem fluid.
- **Body:** Instrument Sans Variable, 1rem–1.125rem fluid, line-height 1.6.
- **Mono/data:** JetBrains Mono Variable, tabular numerals, letter-spaced uppercase for kickers and labels.
- Fluid scale via `clamp()`: `--text-xs … --text-4xl`. Headings use `text-wrap: balance`; paragraphs `text-wrap: pretty`.
- Fonts are self-hosted with Fontsource; no Google Fonts.

## Spatial system

- Content width `72rem`, gutters `1.25rem`. Sections separated by 5–6rem of vertical space.
- Radii: `0.375 / 0.75 / 1.25rem`, pills for buttons and chips.
- Surfaces: 1px `--line` borders, `color-mix` translucent fills, light `backdrop-filter` blur on floating elements (nav, hero meta).
- Composition is asymmetric on purpose: hero copy left, sky meta bottom-right; observatory nebulae scattered by real-ish sky positions; trajectory orbits sticky left with the log scrolling right.

## Motion

- One orchestrated entrance per section (`.reveal` + `data-delay` 1–4, 90ms steps, 900ms `--ease-out`).
- Universe switch: `--dur-universe` 1400ms token interpolation + canvas radial warp streaks for 900ms.
- Ambient: star twinkle (deterministic phase per star), nebula gas drift (40–70s), orbit rotation (40s+).
- Only `transform` and `opacity` animate. `prefers-reduced-motion` disables twinkle/drift/orbits and makes reveals instant; the sky still updates once a minute.

## Components

| Component            | Notes                                                                                                                                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Nav`                | Sticky, blurred. Universe switch (role=switch), theme button, language listbox, mobile menu. Active anchor via IntersectionObserver.                                                                      |
| `Hero` + `SkyCanvas` | Canvas behind copy, veil gradient for legibility, sidereal clock card, mission clocks.                                                                                                                    |
| `Observatory`        | Procedural nebulae: three blurred radial-gradient layers (`--c1..3`), deterministic star dust, label below. Focus state dims siblings, scales the active nebula, zooms the deep field, reveals the panel. |
| `Trajectory`         | SVG orbits (work = gold, leadership = coral, education = cyan dashed) + timeline log.                                                                                                                     |
| `Constellation`      | SVG per skill group; node radius by level; nearest-neighbour lines.                                                                                                                                       |
| `Contact`            | Cards; copy-email button; external links `rel="noopener noreferrer"`.                                                                                                                                     |
| `Footer`             | Moon phase disc (SVG path from illumination), build date, source link.                                                                                                                                    |

## Imagery policy

The renderer is procedural so the site needs no images. When adding photography, use **official JWST / Hubble / ESO releases** (public domain or CC BY 4.0 with credit), convert to AVIF/WebP, keep under ~150 KB per nebula, and record the credit in `nebulae.json → credit`. AI-generated imagery must be labelled as such in the credit. Prompts for generated assets are in `ASSET-PROMPTS.md`.

### Imagery in use (2026-09-04)

- Nebulae: official ESA/Webb and ESA/Hubble releases (CC BY 4.0), 1200×1200 AVIF/WebP ≤ 180/260 KB, credits and source URLs in `src/assets/nebulae/credits.json`, rendered behind the procedural gas with a radial mask. Rerun `node scripts/optimize-nebulae.mjs` after changing crops.
- Portraits and backgrounds: illustrations generated by the owner from his own photograph (GPT Image 2 / Nano Banana), optimized by `scripts/optimize-generated.mjs`; labelled "illustrated portrait" in the UI. The real photograph is never committed.

## Quality checklist (before merging visual work)

- [ ] Both themes × both modes screenshot-checked
- [ ] Mobile (375px) and desktop (≥1280px)
- [ ] Keyboard: every control reachable, focus visible, Escape closes overlays
- [ ] Reduced motion honoured
- [ ] Contrast ≥ 4.5:1 for text
- [ ] No new third-party request in the Network panel

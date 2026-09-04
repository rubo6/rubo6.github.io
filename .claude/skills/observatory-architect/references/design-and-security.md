# Design and security reference

## Tokens (`src/styles/global.css`)

| Token                      | Night·Pro                     | Night·Personal                | Atlas·Pro                     | Atlas·Personal                |
| -------------------------- | ----------------------------- | ----------------------------- | ----------------------------- | ----------------------------- |
| `--bg-0 / --bg-1 / --bg-2` | `#0b1026 / #111838 / #1a2350` | `#160f2e / #22183f / #2f2255` | `#f6f1e7 / #efe7d6 / #e6dcc6` | `#f8efe4 / #f1e3d0 / #e8d5bb` |
| `--ink / --ink-muted`      | `#f4efe6 / #b9b6c9`           | same                          | `#1b2240 / #4e5470`           | same                          |
| `--accent` (primary)       | gold `#f2c46d`                | coral `#f07a6e`               | `#a67c2e`                     | `#b8473c`                     |
| `--accent-2`               | coral                         | gold                          | `#b8473c`                     | `#a67c2e`                     |
| `--accent-3` (data/mono)   | cyan `#9ad9e8`                | mint `#a8e6cf`                | `#2e7c8c`                     | `#2f7f6a`                     |
| `--sky-angle`              | 200deg                        | 320deg                        | 200deg                        | 320deg                        |

All are `@property`-registered so they interpolate. Atlas gold is only for large text/lines (3.6:1); body text always uses `--ink`/`--ink-muted` (≥ 6:1).

Type: Fraunces Variable (display, `opsz 144 / SOFT 30 / WONK 1`), Instrument Sans Variable (body), JetBrains Mono Variable (mono). Fluid scale `--text-xs … --text-4xl` via `clamp()`. Self-hosted via Fontsource, no Google Fonts.

Motion: `.reveal` + `data-delay 1–4`; only `transform`/`opacity`; ambient twinkle/drift/orbit; universe switch 1400 ms; `prefers-reduced-motion` disables ambient motion and makes reveals instant. Never `transition: all`.

## Component conventions

- Section = `<section id class="… container-content" aria-labelledby>` + `SectionHeading` (kicker number, title, lead, optional `leadPersonal`).
- Mode-dependent copy: render both, hide with `[data-mode='personal'] .x-pro`.
- Cards: 1px `--line` border, `color-mix` translucent fill, `--radius-lg`.
- Buttons `.btn .btn-primary|.btn-ghost|.btn-sm` (global in `Hero.astro`).
- External links: `rel="noopener noreferrer"` (+ `me` for own profiles), `target="_blank"` only for external.
- Icons inline SVG with `aria-hidden`; icon-only buttons need `aria-label`.

## Accessibility checklist

Semantic landmarks; one `h1`; heading order; skip link; visible `:focus-visible` (2px accent); keyboard: Tab everything, Escape closes menus/focus, arrows between nebulae; `role="switch"` + `aria-checked` on the mode toggle; `aria-pressed` on nebulae; `aria-live="polite"` on panels; `role="timer"` on clocks; contrast ≥ 4.5:1 text; touch targets ≥ 44px; `viewport-fit=cover` + safe-area padding on nav/footer; `text-wrap: balance/pretty`; reduced motion honoured; no `user-scalable=no`.

## Content-Security-Policy (`Base.astro`, meta-delivered)

```
default-src 'self';
script-src 'self' https://gc.zgo.at;                 # GoatCounter tag; no inline scripts, ever
style-src 'self' 'unsafe-inline';                    # per-element style attributes + Astro inlined CSS (ADR-0005)
img-src 'self' data: https://rubo6.goatcounter.com;  # analytics beacon
font-src 'self';
connect-src 'self' https://rubo6.goatcounter.com;
media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests
```

`frame-ancestors` and reporting are not honoured in meta CSP. Any new origin = ADR + CSP edit + README/SECURITY-BASELINE update.

Why it once broke: Astro inlined `<script type="module">` chunks under 4 KB and a tiny font as `data:`; production lost all interactivity while dev was fine. `vite.build.assetsInlineLimit: 0` prevents it. Check `grep -c '<script type="module">' dist/index.html` → must be 0.

## Lint rules that encode security (`eslint.config.js`)

`no-eval`, `no-implied-eval`, `no-new-func`; `no-restricted-properties`: `Math.random`, `innerHTML`, `outerHTML`; `no-restricted-syntax`: `insertAdjacentHTML`, `document.write`. Do not disable them; change the code.

## Supply chain

Lockfile committed; CI installs with `--ignore-scripts`; `npm audit` gate; dependency review on PRs; CodeQL security-extended; Dependabot weekly (grouped); actions pinned to SHAs; `permissions: {}` at workflow level; `persist-credentials: false`; egress audited by harden-runner. Adding a dependency: justify, `npm install <pkg>` (never hand-edit the lockfile), keep audit clean.

## Privacy rules

Professional e-mail only. No phone, address or IDs anywhere (CV included). Employer work at public-CV level (`visibility: confidential`). Analytics cookieless (GoatCounter). `security.txt` expires 2027-09-01 — bump yearly.

## Gotchas seen in practice

- YAML: colons inside unquoted frontmatter strings → quote them.
- Never put literal U+2028/2029 or other invisible characters in source; build regexes from char codes.
- Windows paths inside Python heredocs: use forward slashes (`\U` escapes break).
- `npm.cmd` from the portable Node 24 folder may still launch the system Node 20; call `node.exe` explicitly (see `.claude/launch.json`).
- Prettier reformats content JSON; run `npm run format` before diffing.

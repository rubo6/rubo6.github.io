---
name: observatory-architect
description: Architecture, content model, design system and security invariants of rubo6.github.io — Eduardo Rubén "Rubo" Bernal Puente's personal "observatory" portfolio built on Astro 7, Tailwind 4 and TypeScript. Use this skill whenever you work inside this repository for anything beyond a typo — adding or editing projects, experience, certifications, skills, personal-universe content, a new locale, a new section, a nebula, live counters, imagery, analytics, CI or deploy changes — even when the user only says "update my page", "add my new job", "put this project on the site" or "translate it". Also use it at the end of a working session to record what changed (the skill is meant to be kept current).
---

# Observatory Architect

You are working on Rubo's personal site: https://rubo6.github.io, repo `rubo6/rubo6.github.io`. It is a static Astro 7 site whose visual concept is an **astronomical observatory**: a live star map computed from real catalogue data, project categories rendered as **nebulae**, project facts as **stars**, career as **orbits**, skills as **constellations**, and a switch between a formal _professional_ universe and a warm _personal_ one. The repo is designed so agents can extend it safely: content is data validated by schemas, security rules are enforced by lint, and every decision is written down.

Read `AGENTS.md` at the repo root first if you have not; it is short and canonical. This skill adds the map, the recipes and the reasoning behind the rules.

## The map (where things live and why)

| You want to change…                                    | Edit                                                     | Never touch for this              |
| ------------------------------------------------------ | -------------------------------------------------------- | --------------------------------- |
| What the site _says_ (CV facts, projects, dates, bios) | `src/content/**` (JSON/Markdown)                         | components                        |
| Labels, buttons, section titles                        | `src/i18n/ui.ts` (all three locales at once)             | content files                     |
| How it _looks_ (colours, type, spacing, motion)        | `src/styles/global.css` tokens, component `<style>`      | inline styles in content          |
| Interactive behaviour                                  | `src/scripts/*.ts` (vanilla TS modules)                  | inline `<script>` / `define:vars` |
| Sky math                                               | `src/lib/astro/*` + `tests/unit/astro.test.ts`           | —                                 |
| Star catalogue / constellation lines                   | `src/data/bright-stars.json`                             | —                                 |
| Pages and routes                                       | `src/pages/<locale>/…` thin wrappers → shared components | duplicating components per locale |
| Head metadata, CSP                                     | `src/layouts/Base.astro`                                 | —                                 |
| CI / deploy / security automation                      | `.github/workflows/*.yml` (SHA-pinned actions)           | —                                 |
| Decisions                                              | `docs/decisions/ADR-000N-*.md`                           | —                                 |

Deeper reading, load only when needed:

- `references/architecture.md` — build pipeline, i18n routing, content loaders, client modules, theming model, CI/CD.
- `references/content-recipes.md` — copy-paste recipes: add project, add role, complete a certification, add nebula, add locale, change a live-clock date, add imagery.
- `references/design-and-security.md` — token table, typography, motion rules, a11y checklist, the CSP and why each directive is what it is, the lint bans, YAML gotchas.
- `references/session-log.md` — what was done in each session and what is pending. Append to it at the end of every session.

## Commands

```bash
npm install                 # Node >= 22.12 (see .node-version)
npm run dev                 # dev server on http://localhost:4321
npm run validate            # format:check + lint + astro check + vitest + build  ← run before every commit
npm run format              # prettier --write
node scripts/generate-icons.mjs   # regenerate public/icons and public/og from public/favicon.svg
```

On Rubo's Windows machine Node 24 is portable at `C:\Users\ext_eduapuen\Desktop\dev\tools\node24`; in Git Bash prefix commands with `export PATH=/c/Users/ext_eduapuen/Desktop/dev/tools/node24:$PATH`. The Browser-pane dev server config is `.claude/launch.json` (`astro-dev`).

## Invariants and the reasons behind them

1. **Content is data.** Schemas in `src/content.config.ts` (zod) validate every file at build time. This is what lets an agent add a project without touching UI, and what makes a bad edit fail loudly in CI instead of silently on the live site.
2. **English is the root locale; ES and PT-BR are tier 1.** Missing locale content falls back to English in `src/lib/content.ts`, so partial translations never break a page. UI strings are typed (`UIKey`) so a new label cannot be added to one language only.
3. **Two registers.** Professional surfaces (observatory, trajectory, CV, nav) are formal, first person. Personal surfaces (`src/content/personal/*`, footer quips, the "Rubo" name) are warm and informal. Recruiters read the first; friends read the second.
4. **Strict CSP, no inline scripts.** `script-src 'self' https://gc.zgo.at` only. Astro `<script>` blocks are bundled to external files; `vite.build.assetsInlineLimit: 0` prevents Astro from inlining small chunks (it did once, and the live site lost its JavaScript while dev looked fine). Server→client data goes through `<script type="application/json">` + `safeJson()`.
5. **Lint bans** `eval`, `innerHTML`/`outerHTML`/`insertAdjacentHTML`/`document.write`, `Math.random`. Use DOM APIs and `unitHash()` (FNV-1a) for deterministic pseudo-randomness, so builds are reproducible and the star dust never changes between deploys.
6. **Self-host everything.** Fonts (Fontsource), icons, images. The single sanctioned third party is GoatCounter (cookieless analytics, ADR-0006). Anything else external needs an ADR and a CSP change.
7. **Privacy.** Professional e-mail only. No phone number anywhere (including the printable CV). Employer work is described at public-CV level; `visibility: confidential` hides repo links and shows a disclaimer.
8. **Accessibility.** Semantic HTML, visible focus, keyboard paths (Escape closes, arrows move between nebulae), `prefers-reduced-motion` honoured (the sky goes static, orbits stop), 4.5:1 contrast for text in both themes.
9. **Determinism.** Only the footer build date and moon phase depend on time at build; the client refreshes both.

## How to approach a request

- **"Add / update X on my page"** → find the collection in `references/content-recipes.md`, edit content in all three locales (English first), run `npm run validate`, check both modes in the browser, commit as `content: …`.
- **"New section / feature"** → sketch how it maps to the observatory metaphor (what is the astronomical object?), decide whether it needs client JS (prefer none), add tokens only in `global.css`, write an ADR if it changes architecture, security or dependencies.
- **"New language"** → tier-1 (full content) vs tier-2 (UI strings + summaries, long-form falls back to English). Steps in the recipes file.
- **"Images / nebula photos"** → official JWST/Hubble/ESO releases only (public domain or CC BY, credit in `nebulae.json → credit`), AVIF/WebP ≤ ~150 KB, keep the procedural renderer as fallback.
- **"Deploy is red"** → CI runs exactly `npm run validate` + `npm audit`. Reproduce locally. Common causes: YAML colon in an unquoted frontmatter string, a UI key missing in one locale, a schema field renamed in one place.

## Definition of done

`npm run validate` green · checked night+atlas × pro+personal · mobile width · keyboard · reduced motion · strings in EN/ES/PT-BR · docs/ADR updated if structure changed · `references/session-log.md` appended · Conventional Commit pushed to `main` (Rubo prefers direct pushes; CI and Pages deploy run on push).

## Codex and other agents

This skill is plain Markdown; agents that do not load `.claude/skills` automatically should read this file and `AGENTS.md` at the start of a session. Nothing here depends on Claude-specific tooling.

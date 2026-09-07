# AGENTS.md — how to work in this repository

Canonical guide for any coding agent (Claude, GPT/Codex, Cursor, Copilot, small models included) and for humans. `CLAUDE.md` and `.claude/skills/observatory-architect/SKILL.md` only point here. It is written so that most tasks need **this file plus one document** from `docs/`.

## What this is

The personal site of Eduardo Rubén "Rubo" Bernal Puente: https://rubo6.dev (GitHub Pages, repo `rubo6/rubo6.github.io`). Astro 7 static output, TypeScript strict, Tailwind CSS 4, no UI framework, no cookies. The visual concept is an **astronomical observatory**: projects are nebulae, project facts are stars, the career is drawn as orbits, skills as constellations. Two modes (professional / personal), two themes (night / atlas), three locales (EN at `/`, ES at `/es/`, PT-BR at `/pt-br/`).

## Read only what the task needs

| Task                                                                                    | Read first                  | Then edit                                              |
| --------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------ |
| Change what the site **says** (job, project, skill, certification, post, personal item) | `docs/CONTENT.md`           | `src/content/**`, labels in `src/i18n/ui.ts`           |
| Change how it **looks** (colours, type, spacing, motion, a component)                   | `docs/DESIGN.md`            | `src/styles/global.css` tokens, component `<style>`    |
| Change **behaviour**, build, routing, loaders, CI                                       | `docs/ARCHITECTURE.md`      | `src/scripts/`, `src/components/`, `.github/workflows` |
| Add an external origin or dependency; any privacy question                              | `docs/SECURITY-BASELINE.md` | `src/layouts/Base.astro` CSP + a new ADR               |
| Something only Rubo can do (accounts, tokens, DNS, GoatCounter)                         | `docs/OWNER.md`             | nothing; tell Rubo                                     |
| What Rubo still owes, roadmap, portfolio ideas                                          | `docs/PENDING.md`           | that file                                              |
| Why something is the way it is                                                          | `docs/decisions/ADR-*.md`   | add an ADR, never rewrite an accepted one              |
| Evidence for academic skills (official syllabi)                                         | `docs/research/*.md`        | —                                                      |

Do not read components to change content. Do not read every content file to change one. Do not load `docs/research/*` unless you are adding an academic skill.

## Commands

```bash
npm install                 # Node 24 (see .node-version); Node >= 22.12 works
npm run dev                 # http://localhost:4321
npm run new -- project <key>   # scaffold a project in EN/ES/PT-BR with TODO markers
npm run new -- post <key>      # scaffold a log entry in EN/ES
npm run format              # prettier --write (content JSON gets reformatted; run before diffing)
npm run validate            # format:check + lint + astro check + unit tests + content check + build. Run ONCE at the end.
npm run test:e2e            # Playwright smoke suite against dist/ (after a build; `npx playwright install chromium` once)
```

CI runs exactly `npm run validate`, then the Playwright suite, then `npm audit`. If validate passes locally, CI passes. Pushing to `main` deploys; a daily cron rebuilds so build-time data (GitHub stats, moon, counters) stays fresh. Lighthouse runs on a GitHub runner after each deploy and writes `docs/lighthouse/latest.json`; never trust a Lighthouse number from a busy laptop.

On Rubo's Windows machine Node lives at `C:\Users\ext_eduapuen\Desktop\dev\tools\node24` (Git Bash: `export PATH=/c/Users/ext_eduapuen/Desktop/dev/tools/node24:$PATH`).

## Invariants (do not break)

1. **Content is data.** Every text, date, link and list lives in `src/content/` and is validated by zod in `src/content.config.ts`. Never hardcode CV facts in components. A bad edit fails the build with a precise message; that is the safety net.
2. **English is the root; ES and PT-BR follow.** Content missing in a locale falls back to English (`src/lib/content.ts`). UI strings in `src/i18n/ui.ts` must be added to the three locales at once (the `UIKey` type enforces it).
3. **Two registers.** Professional surfaces (observatory, trajectory, CV, nav, contact) are formal, first person. Personal surfaces (`src/content/personal/*`, footer quips) are warm and informal.
4. **Strict CSP, no inline JS.** `script-src 'self'` (GoatCounter's count.js is self-hosted in `public/js/`, ADR-0009). Astro `<script>` blocks are bundled to files; `vite.build.assetsInlineLimit: 0` keeps them external. Server→client data goes through `<script type="application/json">` + `safeJson()`. Never `define:vars`, never `is:inline` JavaScript, never `set:html` with untrusted data. The same CSP is also sent as a header by Cloudflare (ADR-0010): any CSP change must be mirrored there by Rubo.
5. **Lint bans** `eval`, `innerHTML`/`outerHTML`/`insertAdjacentHTML`/`document.write`, `Math.random`. Use DOM APIs and `unitHash()` for deterministic pseudo-randomness. Never disable a rule; change the code.
6. **Self-host everything.** Fonts, icons, images, scripts. The single sanctioned third party is GoatCounter (cookieless analytics, ADR-0006). Any other external origin needs an ADR and a CSP change.
7. **Privacy.** Professional e-mail only. No phone, address, IDs or GPA anywhere, CV included. Profile links carry an `audience`: only `professional` ones (GitHub, LinkedIn) reach the professional mode, the CV and the JSON-LD; leisure profiles are `personal`. Employer work stays at public-CV level (`visibility: confidential`); course work whose code cannot be published is `visibility: course`.
8. **Accessibility and every device.** Semantic HTML, one `h1`, visible focus, keyboard paths (Escape closes, arrows move between nebulae), `prefers-reduced-motion` honoured (sky static, orbits still), 4.5:1 text contrast in both themes. Phones and Safari are first-class: every animation ships with a phone form (adapted, never removed) and the e2e suite runs in Chromium and WebKit (`docs/DESIGN.md` → Responsive and browser rules, ADR-0011).
9. **Determinism.** Only the footer build date, moon phase and build-time loaders depend on time. No random layouts.
10. **Large binaries only in Git LFS** (`src/assets/nebulae/raw/`, see `.gitattributes`). Derived AVIF/WebP are normal files.

## Voice rules (any public text, all locales)

1. One astronomical metaphor per section, not per sentence; the design already carries the concept.
2. No indirect self-praise ("boring" as a virtue, "honest" pipelines, "the interesting part is not X but Y"). Say what was done and what changed.
3. At most one triad per paragraph.
4. No adverbs of degree ("markedly", "deliberately", "happily"). A number if there is one; otherwise the plain sentence.
5. One idea per bullet. A semicolon means two bullets.
6. `·` only in UI labels. In running text, job titles, company names and skill lists use commas and parentheses (CV parsers do not understand the middle dot).
7. Vary bullet openers.
8. Log titles carry one concrete hook, never a "Nth term:" or "Lab log:" prefix.
9. **One job title, everywhere**: "Junior Data Analyst (Data & Analytics Engineering), Contractor" at "Mercado Libre (Mercado Pago Point)". Also in JSON-LD `jobTitle` and in project roles. The engineering work is described in the bullets.
10. Institution rankings, admission statistics and full syllabi go to `trajectory[].background` (folded on the site, never in the CV), not to bullets.

## Never publish

Phone number · home address · IDs · GPA (ITAM or Bátiz) · the LinkedIn portrait photograph (never commit it) · internal Mercado Libre tool or program names other than "Rangers" and "Longtail" · dashboards, internal repo or deployment processes · business metrics beyond the ones already in `trajectory` (the subscriptions-per-agent figure was approved by Rubo on 2026-09-06) · leisure profile links in the professional mode · code of course projects marked `visibility: course`.

## Definition of done

`npm run validate` green · security checklist in `docs/SECURITY-BASELINE.md` when scripts, origins, dependencies or workflows changed · affected pages checked in the browser in both modes (and both themes if styles changed; mobile width if layout changed) · strings and content in EN/ES/PT-BR · docs updated when structure or behaviour changed · Conventional Commit (`content:`, `feat:`, `fix:`, `docs:`, `chore:`) pushed to `main` (Rubo prefers direct pushes).

## Working cheaply (small models, limited credit)

- Scaffold with `npm run new`, fill the TODO markers, run `npm run format`, then one `npm run validate`.
- Copy an existing sibling file instead of inventing structure; the schema comment in `src/content.config.ts` is the field reference.
- Content changes never need a browser check beyond the one page they affect.
- Do not open `dist/`, `node_modules/`, `docs/lighthouse/*.jsonl` or `src/data/bright-stars.json` unless the task is about them.
- Known gotchas: quote YAML strings that contain a colon; after a schema change stop the dev server and delete `.astro/data-store.json`; Windows paths in Python heredocs need forward slashes.

# AGENTS.md — working in this repository

This file is the canonical instruction set for AI coding agents (Claude Code, Codex, Cursor, Copilot…) and a good primer for humans. `CLAUDE.md` defers here.

## What this is

The personal site of Eduardo Rubén "Rubo" Bernal Puente, deployed to GitHub Pages at https://rubo6.dev. Astro 7 (static), TypeScript strict, Tailwind CSS 4, zero UI framework, zero third-party runtime requests. Concept: an astronomical **observatory** (see [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md)).

## Commands

```bash
npm install                # Node >= 22.12 (see .node-version)
npm run dev                # dev server on :4321
npm run validate           # format:check + lint + check (types) + test + build — run before every commit
npm run format             # prettier --write
node scripts/generate-icons.mjs   # regenerate public/icons and public/og from public/favicon.svg
```

CI runs exactly `npm run validate` plus `npm audit`. If it fails locally it will fail in CI.

## Invariants (do not break)

1. **Content is data.** All texts, dates, links and lists live in `src/content/` and are validated by `src/content.config.ts`. Never hardcode CV facts in components. To change what the site _says_, edit content; to change how it _looks_, edit components/styles.
2. **English is mandatory, other locales fall back.** Every content entry exists in `en`; `es` and `pt-br` are optional but expected for tier-1 content. UI strings live in `src/i18n/ui.ts` and must be added to all three locales at once (`UIKey` type enforces it).
3. **Tone.** Professional surfaces (observatory, trajectory, CV, nav) use a formal register; personal surfaces (personal universe, footer quips) are warm and informal. Keep this split per locale.
4. **Security rules are enforced by lint and must stay that way:** no `eval`/`Function`, no `innerHTML`/`outerHTML`/`insertAdjacentHTML`/`document.write`, no `Math.random`. Use DOM APIs, `textContent`, and deterministic hashes (`unitHash` in `src/scripts/sky.ts`) or `crypto.getRandomValues`.
5. **No inline scripts.** The CSP is `script-src 'self'`. Use Astro `<script>` (bundled) and pass data through `<script type="application/json">` serialized with `safeJson()` from `src/lib/json.ts`. Never use `define:vars`, `is:inline` scripts, or `set:html` with untrusted data.
6. **Self-host everything; one sanctioned third party.** Fonts, icons, images and scripts are self-hosted. The single exception is GoatCounter (cookieless analytics, ADR-0006) and its two origins in the CSP. Adding any other external `<script>`, `<link>`, `<img>` or `fetch` is a design decision that needs an ADR and a CSP change.
7. **No secrets, no PII beyond the professional e-mail.** No phone numbers, no home address, no tokens. Anything needing a credential runs in GitHub Actions with a repository secret at build time.
8. **Accessibility is not optional.** Semantic HTML, visible focus, keyboard paths for every interaction, `prefers-reduced-motion` honoured, 4.5:1 contrast for text, `aria-*` where semantics fall short. Check both themes and both modes.
9. **Determinism.** Builds must be reproducible: no random layouts, no time-dependent markup except the footer build date and moon phase (which the client refreshes).

## Where things are

| Path                         | Purpose                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| `src/content/`               | All content (JSON/Markdown) — see [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md)                        |
| `src/content.config.ts`      | Zod schemas; the contract for every collection                                                          |
| `src/i18n/ui.ts`             | UI strings, locale metadata, `localePath()`, `clientStrings()`                                          |
| `src/lib/astro/`             | Pure astronomy math (tested)                                                                            |
| `src/lib/content.ts`         | Typed accessors with English fallback                                                                   |
| `src/scripts/`               | Client-side TypeScript modules (sky canvas, universe controls, observatory, counters)                   |
| `src/components/`            | Astro components; `Home.astro` composes the landing page                                                |
| `src/pages/`                 | Routes for `en` (root), `es/`, `pt-br/`; project pages and CV per locale; `404`                         |
| `src/styles/global.css`      | Design tokens (`@property`), themes, modes, base styles, motion                                         |
| `src/data/bright-stars.json` | Star catalogue and constellation lines                                                                  |
| `public/theme-init.js`       | Blocking theme/mode bootstrap (external on purpose, CSP)                                                |
| `.github/workflows/`         | `deploy.yml` (Pages + daily cron), `ci.yml`, `codeql.yml`                                               |
| `docs/`                      | Plan, architecture, design system, content guide, security baseline, ADRs, asset prompts, questionnaire |

## How to do common tasks

- **Add a project:** new `src/content/projects/en/<key>.md` (+ `es/`, `pt-br/`). Frontmatter fields are documented in `content.config.ts`. `key` is the URL slug and must match across locales. Set `visibility: confidential` for employer work: it hides the repo link and shows a disclaimer.
- **Add a nebula (category):** append to `src/content/nebulae.json` **and** extend the `nebula` enum in `content.config.ts` (two places: `nebulae` and `projects`). Give it a real astronomical object, a 3-colour palette and a `scene` position (percent).
- **Add a UI string:** add the key to `en`, `es`, `pt-br` in `src/i18n/ui.ts`; TypeScript will fail until all three exist.
- **Add a locale:** extend `locales` in `src/i18n/ui.ts` and `astro.config.ts`, add `src/pages/<locale>/…` mirroring `es/`, add content files. Consider tier-2 (UI + summaries only) before full translation.
- **Change design tokens:** only in `src/styles/global.css`. Every colour must remain a registered `@property` so mode switches animate.
- **Add a dependency:** justify it (an ADR if it is runtime code), run `npm install <pkg>` (never hand-edit the lockfile), keep `npm audit --audit-level=high` clean.

## Recurring content tasks

- **A certification is completed** (DataCamp, AWS Academy, Anthropic, the Ibero AI diploma in Dec 2026): edit `src/content/certifications.json` → set `status: "earned"`, `date: "YYYY-MM-DD"`, add `url` (Credly / badge / public PDF, https only) and refresh `skills`. If it is a new certification, add an entry with a unique `id`. Then run `npm run validate`, check the "In progress" nebula and the CV page in all three locales, commit as `content: certification <name> earned`. When _all_ current ones are earned, rename the `upcoming` nebula labels to "Certifications" in `src/content/nebulae.json` (labels/descriptions in EN/ES/PT-BR).
- **A new job or role**: add an entry to `src/content/trajectory/<locale>.json` (all three), set `orbit: 0` for it and shift the others by one, update `dates.meliStart` (or add a new date key) in `profile/*.json` if a live clock should follow it, and add a `professional` project if there is public work to show.
- **A repository goes public**: add `repo: owner/name` to the matching project (all locales) and, if it was `visibility: confidential`, decide with Rubo whether it can become `public`.
- **A new personal interest**: add a cluster to `src/content/personal/<locale>.json` with a real astronomical object as its `object`.

## Skills for agents

- `.claude/skills/observatory-architect/` — the project skill: architecture map, recipes, design/security references and a per-session log. Claude Code loads it automatically; Codex and other agents should read its `SKILL.md` and `references/` at the start of a session. Update `references/session-log.md` at the end of every session.

## Definition of done

- `npm run validate` passes.
- Checked in the browser: night + atlas themes, professional + personal modes, mobile width, keyboard navigation, reduced motion.
- New strings exist in EN/ES/PT-BR.
- Docs updated when structure or behaviour changed (this file, `docs/`, README).
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `content:`).

## Do not

- Do not add a contact form, analytics, cookie banners or chat widgets.
- Do not put the phone number anywhere, including the printable CV.
- Do not weaken the CSP (`script-src` must stay `'self'`).
- Do not commit `dist/`, `.astro/`, `node_modules/` or `.env*`.
- Do not disable lint rules to make code pass; fix the code.

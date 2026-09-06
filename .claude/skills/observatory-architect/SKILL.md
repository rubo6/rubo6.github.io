---
name: observatory-architect
description: Entry point for any change to rubo6.dev, Eduardo Rubén "Rubo" Bernal Puente's personal "observatory" portfolio (Astro 7, Tailwind 4, TypeScript, GitHub Pages). Use it whenever you work inside this repository for anything beyond a typo — adding or editing a job, project, skill, certification, log entry, personal item or link; changing looks, behaviour, CI or deploy; or when the user says "update my page", "add my new job", "put this project on the site", "translate it".
---

# Observatory Architect

Everything you need is in the repository, written so that one file plus one document cover most tasks:

1. Read `AGENTS.md` (map, commands, invariants, voice rules, what never to publish, definition of done).
2. Open only the `docs/` file that the task table in AGENTS.md points to:
   - `docs/CONTENT.md` to change what the site says (with copy-paste examples per collection).
   - `docs/DESIGN.md` to change how it looks.
   - `docs/ARCHITECTURE.md` to change behaviour, build or CI.
   - `docs/SECURITY-BASELINE.md` before any external origin, dependency or privacy question.
   - `docs/OWNER.md` for things only Rubo can do; `docs/PENDING.md` for what he still owes.
3. Scaffold with `npm run new -- project <key>` or `npm run new -- post <key>`, fill the `TODO` markers in EN/ES/PT-BR, run `npm run format`, then `npm run validate` once.
4. Commit with a Conventional Commit and push to `main`.

Claude Code specifics: Node 24 is portable at `C:\Users\ext_eduapuen\Desktop\dev\tools\node24` (Git Bash: `export PATH=/c/Users/ext_eduapuen/Desktop/dev/tools/node24:$PATH`); the Browser pane dev server is `.claude/launch.json` → `astro-dev`. After a schema change stop the dev server and delete `.astro/data-store.json`.

Do not create new documentation files; extend the existing ones. Record decisions as `docs/decisions/ADR-000N-*.md`.

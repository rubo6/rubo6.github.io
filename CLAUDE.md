# CLAUDE.md

Read [AGENTS.md](AGENTS.md) first — it is the canonical guide for any agent working here.

Claude Code specifics:

- Local Node lives at `C:\Users\ext_eduapuen\Desktop\dev\tools\node24` on the author's machine (portable, no admin). `.claude/launch.json` already points the Browser pane dev server at it.
- Prefer verifying visual changes in the Browser pane (`astro-dev` launch config) in both themes, both modes and the mobile preset before committing.
- Keep the session plan in `docs/PLAN.md` up to date when scope changes; the open questions for the author are in `docs/QUESTIONNAIRE.md`.
- Commit with Conventional Commits and push to `main` (the author chose direct pushes; CI + deploy run on push).

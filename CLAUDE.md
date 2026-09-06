# CLAUDE.md

Read [AGENTS.md](AGENTS.md) first; it is the canonical guide and tells you which single `docs/` file to open for each kind of task.

Claude Code specifics:

- Node 24 is portable at `C:\Users\ext_eduapuen\Desktop\dev\tools\node24` on the author's machine (no admin). `.claude/launch.json` (`astro-dev`) already points the Browser pane dev server at it.
- Verify visual changes in the Browser pane in both modes before committing; content-only changes need a single page check.
- Commit with Conventional Commits and push to `main` (the author chose direct pushes; CI and deploy run on push).

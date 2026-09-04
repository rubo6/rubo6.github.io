# Session log

Append one entry per working session: what changed, decisions, what is pending. Newest first. Keep entries factual and short; details belong in ADRs and docs.

## 2026-09-03 · Session 1 (Claude Code, Fable 5.1) — rebuild from scratch

**Done**

- Replaced the vanilla HTML site with Astro 7 + Tailwind 4 + TypeScript strict; 34 static pages, EN root + ES + PT-BR.
- Observatory concept: live sky canvas (150-star catalogue, sidereal time, tested against Meeus), nebulae = project categories, orbits = trajectory, constellations = skills, professional ⇄ personal universe switch with token interpolation and canvas warp.
- Content collections with zod; all CV content in three locales; questionnaire answers applied (real dates, personal universe: astronomy/music/gaming/swimming, soft skills with evidence, WhisperFlow project, Spotify/Steam links, birthday → personal age clock).
- Trajectory aligned with LinkedIn (DataLab Jan–Dec 2025, AIESEC IGV + OGV).
- Security: meta CSP (script-src 'self' + GoatCounter), lint bans, SHA-pinned workflows, CI gate, CodeQL, Dependabot, security.txt, SECURITY.md, SECURITY-BASELINE.
- Docs: README (banner, badges, Mermaid), AGENTS.md, CLAUDE.md, ARCHITECTURE, DESIGN-SYSTEM, CONTENT-GUIDE, OWNER-GUIDE, ASSET-PROMPTS, QUESTIONNAIRE, ADR-0001…0006.
- Analytics: GoatCounter (rubo6.goatcounter.com) cookieless, ADR-0006.
- WhisperFlow published to `rubo6/whisperflow` from a sanitized copy (no runtime/models/personal config, no corporate security-tool mentions).
- Tooling: portable Node 24 at `Desktop/dev/tools/node24`, user PATH repaired, Browser-pane launch config.

**Decisions**: see ADRs. Direct pushes to `main`. Pages source switched to GitHub Actions by Rubo.

**Incidents**: Astro inlined small scripts → CSP blocked them in production (fixed with `assetsInlineLimit: 0`). YAML colon in WhisperFlow summary broke one build (quoted).

**Pending / next**

- Official JWST/Hubble imagery per nebula (Carina first, Rubo's favourite).
- Build-time GitHub loader (stars, forks, commits; traffic with `GH_TRAFFIC_TOKEN` once Rubo creates it).
- Tier-2 locales (FR, DE, IT, JA, ZH) via translation subagent.
- Illustrated avatar (prompts in docs/ASSET-PROMPTS.md §4) once generated.
- Custom domain (Rubo leaning `.dev`; guide in docs/OWNER-GUIDE.md §5).
- Lighthouse run; Playwright smoke tests; automated CV PDF.
- WhisperFlow: models as GitHub Release assets; README polish; dictionary default.
- Rubo's account tasks: 2FA, push protection (account level), Steam public, certifications when earned.

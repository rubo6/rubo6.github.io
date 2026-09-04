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

**Late additions (same day)**

- Custom domain `rubo6.dev` (Cloudflare Registrar, DNS-only A + CNAME www; Pages custom domain apex). `site` switched, `public/CNAME`, security.txt canonical, README links.
- Build-time GitHub loader (`src/loaders/github.ts`, collection `repoStats`) → stars/forks/language/last push on project cards and pages; traffic (views/clones, 14 d) when `GH_TRAFFIC_TOKEN` is present in the deploy build.
- Companion skills copied into `.claude/skills/` (ui-ux-master, web-design-guidelines, web-accessibility, pwa-native-feel — adapted, internal references removed) plus a new `web-security-static`; referenced from this skill.
- Rubo completed: 2FA, push protection, Dependabot/CodeQL/private reporting, `GH_TRAFFIC_TOKEN` secret, GoatCounter account, WhisperFlow repo created and pushed (2 commits).

**Lighthouse pass (same day)**: desktop 95/98/100/100, mobile 79/98/100/100 before fixes. Fixes: sky palette cached instead of `getComputedStyle` per frame (forced reflow), sky mounted on `requestIdleCallback`, two above-the-fold fonts preloaded via `?url` imports, deep-field nodes 90→56 per scene, clocks heading h3→h2 (heading order), mode switch accessible name includes visible labels. After fixes: mobile 90/100/100/100, desktop 93/100/100/100 (LCP mobile 3.3 s is the remaining lever: hero text depends on the Fraunces font; consider `font-display: optional` for display or a smaller subset). Added JSON-LD `Person` on the home page and Xbox gamertag (Steam link removed while the profile is private). WhisperFlow release `v0.1.0` published by Rubo (5 assets); Enforce HTTPS and AAAA records done.

**Pending / next**

- Official JWST/Hubble imagery per nebula (Carina first, Rubo's favourite).
- Build-time GitHub loader (stars, forks, commits; traffic with `GH_TRAFFIC_TOKEN` once Rubo creates it).
- Tier-2 locales (FR, DE, IT, JA, ZH) via translation subagent.
- Illustrated avatar (prompts in docs/ASSET-PROMPTS.md §4) once generated.
- Custom domain (Rubo leaning `.dev`; guide in docs/OWNER-GUIDE.md §5).
- Lighthouse run; Playwright smoke tests; automated CV PDF.
- WhisperFlow: Rubo uploads the four model zips + SHA256SUMS.txt from `Desktop/WhisperFlow-dist/release-assets/` as a GitHub Release (tag `v0.1.0`); then test `scripts/fetch_release_models.py` end to end.
- Rubo's account tasks: 2FA, push protection (account level), Steam public, certifications when earned.

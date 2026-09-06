# Session log

Append one entry per working session: what changed, decisions, what is pending. Newest first. Keep entries factual and short; details belong in ADRs and docs.

## 2026-09-04 · Session 2 (Claude Code, Fable 5.1) — imagery, portrait, study log

**Done**

- Owner-generated art integrated: three illustrated portraits (editorial / constellation / atlas) in a hero "eyepiece" that follows theme×mode, with optional video/photo tabs rendered only when files exist; hero Milky Way background; personal-scene background. `scripts/optimize-generated.mjs`; raw PNGs git-ignored.
- Official nebula imagery (ESA/Webb + ESA/Hubble, CC BY 4.0) via subagent: `src/assets/nebulae/*.avif|webp` + `credits.json`, `scripts/optimize-nebulae.mjs`; rendered behind the procedural gas with a radial mask; credit line in each panel. Raw JPEGs untracked (they slipped into commit 0a35329; removed from the tree in the next commit, still in history ≈18 MB).
- Study log ("bitácora"): `posts` collection, 9 entries × EN/ES following the official Plan B curriculum (research subagent, sources in ADR-0007), routes `/log/`, `/log/<key>`, `/log/rss.xml` per locale, latest-3 section on home, nav link. `@astrojs/rss` added.
- Lighthouse on rubo6.dev after imagery + portrait + log: **mobile 96/100/100/100, desktop 100/100/100/100** (LCP mobile 2.8 s, TBT 40 ms, CLS 0). JSON-LD Person; Xbox gamertag.
- WhisperFlow: release v0.1.0 published by Rubo; README Mermaid fixed by subagent (5726c4f).

- Later in session 2: portrait video (Veo, 720×1280, 8 s) live in the eyepiece; CECyT 9 "Juan de Dios Bátiz" (IPN, Técnico en Programación, 2018-08-13 → 2021-07-23, Plan 2008) added to trajectory, CV and certifications with sourced selectivity data (COMIPEMS cut-off 102–106/128, highest IPN campus); log entries for AIESEC (iGV member + oGV team leader, 2024) and the Bátiz, EN/ES; `leadership` area added to posts. Research sources are in the two subagent briefings (AIESEC official pages, IPN/CECyT 9 Plan 2008 PDF, Gaceta Politécnica, El Universal 2012, Infobae 2024, COMIPEMS press tables). WhisperFlow release downloader tested end-to-end (denoise-vad pack).

- Even later in session 2: ffmpeg installed via winget (user scope) at `%LOCALAPPDATA%/Microsoft/WinGet/Packages/Gyan.FFmpeg_…/bin`; portrait video re-encoded to 4:5 MP4 (431 KB) + WebM (364 KB). Seven new log entries EN/ES (MPI BoW, Keeper, ECOBOX, WhisperFlow, Carina, pulsars, Helix JWST 2026). Log filters/search with URL state, `updated` field, per-entry OG images, `/now` page. Total 18 entries, 94 pages.

- Rankings research applied: ITAM (QS 2027 751–760, Employment Outcomes 1st MX/30th world, Economics =185, Reforma 1st 2024–26), Ibero (QS 851–900, CIEES 2025–2032, Reforma 2025) and Bátiz (COMIPEMS 2024 cut-off 102 vs 94, ENLACE 5× to 2012). New optional `sources[]` on trajectory entries rendered as small links (`trajectory.sources` i18n key). ITAM graduation text fixed to May 2027.

- GitHub contributions heatmap (`contributions` collection + `Contributions.astro`, personal universe). Playwright smoke suite added (`tests/e2e/smoke.spec.ts`, 2 device projects) and wired into CI after the build; traces uploaded on failure.

## Session 3 — 2026-09-05 (overnight autonomous run)

- Rankings for ITAM/Ibero/Bátiz with `sources[]`; contributions heatmap; Playwright suite in CI.
- Alive layer: tickers, spotlight, lift, dome shutter, view-transition cross-dissolve, reticles, pulsar, breathing portrait, pulse dots; five official JWST scene backdrops (Crab, Cartwheel, Tarantula, WR 124, Stephan's Quintet).
- Research: official syllabi of Bátiz Plan 2008 and ITAM LCD Plan B saved in `docs/research/`; derived hard skills (`via` provenance on every skill star, new `foundations` group), trajectory bullets and sources updated.
- `docs/QUESTIONNAIRE-2.md` (60 questions on MeLi + school) for Rubo to answer.
- Perf pass after measuring with `scripts/vitals.mjs`: sky canvas cached static layer + glow sprite + 30/15 fps cap; blur reveals desktop-only. New log entry `de-los-temarios-a-las-estrellas` (EN/ES). Report for Rubo in `docs/REPORT-2026-09-05.md`.

## Session 3b — 2026-09-05 (after Rubo's questionnaire)

- Questionnaire 2 answered by dictation and applied (MeLi role/area/impact without internal tool names, graduation May 2028, ECOBOX honest framing, AIESEC/Ibero/Bátiz details, personal facts, AWS Academy names, new entry `mi-primera-entrevista`). Follow-up questions appended to `docs/QUESTIONNAIRE-2.md`.
- Raw telescope JPEGs purged from history with git-filter-repo and re-added via Git LFS; force-pushed main.
- Lighthouse works with the installed Google Chrome (`CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe`); live 2026-09-05 before perf polish: mobile 93/100/100/100 (LCP 3.0 s), desktop 96/100/100/100 (Speed Index 2.0 s).
- WhisperFlow personal dictionary extended with ~100 terms from the dictation.

## Session 3c — 2026-09-05 (Rubo's visual feedback)

- Fixed: overlapping labels in the personal universe (new positions), cramped trajectory cards (padding + frame), Longtail wording, MeLi dates (Rangers in Mexico since Sep 2025, Rubo on it since Jan 2026; BR/AR not his), heatmap legend removed and heatmap only with the 12-month calendar, CV without Spotify/Xbox and with a back link, footer without the source link, sidereal-time hint, contact/trajectory/skills sections padded with backdrops, light-theme visibility of orbits and backdrops.
- New: real nebulae in the personal universe, Rho Ophiuchi + NGC 604 backdrops, magnified skill labels on hover (SVG text scale + bring-to-front), near-black palette (`--bg-0 #060814`, personal `#0a0616`), trajectory camera following the active entry (`orbits.ts`), GoatCounter visit counter (needs the public counter setting).
- Rubo confirmed "Rangers" can be named; the IA course project is a different project from Keeper (repos pending).

**Pending / next**

- Rubo to supply: portrait video (Veo prompt in ASSET-PROMPTS §5) → `public/media/portrait.mp4|webm`; real photo later → `src/assets/generated/photo.*`; PT-BR versions of the log (currently EN fallback).
- Tier-2 locales + translation pass at the very end (Rubo's decision).
- Mobile LCP (Fraunces) still the perf lever; consider `font-display: optional` or smaller subset.
- Consider purging the 18 MB raw JPEGs from history only if the repo size becomes a problem (needs force-push; Rubo's call).

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

## Session 3d — 2026-09-05 (visit counter live, link audiences, recruiter/ATS review)

- GoatCounter visitor counter enabled by Rubo; footer shows the total on rubo6.dev (build-time gate + client fetch).
- `profile.links[].audience` (`professional` | `personal`, default professional). Spotify/Xbox/Steam are `personal`: hidden outside `[data-mode='personal']` in Contact, excluded from the CV and from JSON-LD `sameAs`. Rule recorded in SKILL.md invariant 7, design-and-security.md (table) and content-recipes.md.
- `docs/REVIEW-2026-09-05-recruiter-ats.md`: full-content review as a top-tier recruiter and as an ATS parser, plus writing tics and proposed rewrites (EN/ES). Nothing applied yet; six decisions pending from Rubo (single job title, school rankings, low-level skills, in-progress certifications, platform recognition wording, voice rules).
- Known follow-ups from that review if approved: MeLi project `period.start` 2025-10-01 → 2025-11-03; CV print single column; `·` out of job-title strings; CV page title "Eduardo Ruben Bernal Puente - CV".

## Session 3e — 2026-09-06 (review applied)

- Rubo's decisions on the recruiter/ATS review applied in EN/ES/PT-BR: single real job title everywhere; MeLi project dates = his start (origin in October 2025 explained in the body); platform impact with real numbers (avg. monthly subscriptions per agent 4 → 18 → 27, Jan/Jun/Sep 2026, publishable per Rubo); `trajectory[].background` folds rankings, admission stats and full syllabi (site only, `<details>`); CV prints skills level ≥ 3, one column, comma separators, page title with his name; voice rules recorded in SKILL.md; rewrites and log-title cleanup done.
- Certifications stay generic until earned. Repos for Keeper / Bag-of-Words / production pipeline still pending from Rubo.

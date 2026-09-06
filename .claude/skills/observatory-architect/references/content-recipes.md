# Content recipes

Every recipe ends with `npm run validate`, a browser check in both modes, and a `content:` commit. Content goes in English first; Spanish and Portuguese follow the same structure. Quote any frontmatter string that contains a colon (`summary: "…: …"`), otherwise YAML turns it into a mapping and the build fails.

## Add a profile link (GitHub, Spotify, Steam…)

`src/content/profile/{en,es,pt-br}.json → links[]`: `{ label, url (https), kind, audience }`. `audience: professional` only for career identities (GitHub, LinkedIn, Scholar/ORCID); everything leisure-related is `audience: personal` and shows only in the personal universe. Same entry in the three locales.

## Add a log entry (bitácora)

1. Create `src/content/posts/en/<key>.md` and `src/content/posts/es/<key>.md` (PT-BR falls back to EN). Frontmatter: `title`, `key`, `locale`, `date` (never in the future), optional `updated`, `summary` (≤ 280 chars), `area` (`math` · `stats` · `computing` · `datascience` · `economics` · `humanities` · `astronomy` · `work` · `leadership`), optional `semester`, `courses[]`, `tags[]`, `featured`, `draft`, optional `scene` (official-imagery backdrop id from `src/assets/scenes/credits.json`: `crab` · `cartwheel` · `tarantula` · `wr124` · `stephans-quintet`). Quote any string containing a colon.
2. Body: first person, 350–600 words, `##` sections, end with a "What I take with me / Lo que me llevo" section. No invented grades, names or anecdotes; facts about institutions need a source in the research briefing or the entry text.
3. The Open Graph image is generated automatically from the English title by `scripts/generate-og.mjs` (runs in `npm run build`). Filters/search on `/log` pick up the new area and term automatically.
4. Run `npm run validate`; commit as `content(log): …`.

## Update the "Now" page

Edit `src/content/now/{en,es,pt-br}.json`: bump `updated` and edit the `sections[].items`. It is meant to be refreshed every few weeks by hand.

## Add or adjust a skill (a star in a constellation)

`src/content/skills.json`: group `id`, localized `labels`, real `constellation`, `items[]` with `name` (short; ≤ ~28 chars so labels do not collide), `level` 1–4, optional `since`, optional `via` (provenance shown as tooltip: "detail — course · institution"). Academic skills must map to a syllabus in `docs/research/batiz-plan-2008-temarios.md` or `docs/research/itam-lcd-plan-b-temarios.md`; work skills to the trajectory. Keep ≤ 13 items per group (3-column layout).

## Add a project (a star in a nebula)

1. Create `src/content/projects/en/<key>.md` (copy an existing one). Required frontmatter: `title`, `key` (URL slug, `[a-z0-9-]`, identical in every locale), `locale`, `nebula` (`professional` · `academic` · `research` · `personal` · `community` · `upcoming`), `summary` (≤ 240 chars), `role`, `period: { start, end|null }`, `stack[]`, `highlights[]` (1–8 short facts — the stars), optional `repo` (`owner/name`), `links[]`, `featured`, `order`, `visibility` (`public` | `confidential`).
2. Body: 1–3 short first-person paragraphs. No confidential employer details.
3. Add `es/` and `pt-br/` versions (missing locales fall back to English).
4. Featured + public projects appear in the CV page automatically.

## Add or update a role / study (trajectory orbit)

Edit `src/content/trajectory/{en,es,pt-br}.json`: `id`, `kind` (`work` | `leadership` | `education`), `org`, `orgUrl`, `role`, `location`, `start`, `end` (`null` = present), `summary?`, `bullets[]`, `stack[]`, `orbit` (0 = innermost = most recent; renumber the others). Bullets in the CV voice, results over duties. Optional `sources[]` (`{ label, url }`, https only) renders a small "Sources" line under the entry — use it for reputation/ranking claims and for official syllabi (see `docs/research/`).

## Complete a certification

`src/content/certifications.json`: set `status: "earned"`, `date`, `url` (https verification link), refresh `skills`. New ones need a unique `id`. Statuses: `earned` | `in-progress` | `expected`. They render in the Skills section box and in the CV. Once all are earned, rename the `upcoming` nebula in `nebulae.json` to "Certifications" in the three locales.

## Change a live clock date

`src/content/profile/{locale}.json → dates`: `meliStart`, `itamStart`, `graduation`, `birthday` (optional; drives the personal-mode age clock). Add a new clock in `src/components/LiveCounters.astro` (`clocks` array) plus a `counters.<id>` string in `ui.ts` for all locales.

## Add a nebula (category)

1. Append to `src/content/nebulae.json`: `id`, real `object` (`name`, `designation`, `constellation`, `distanceLy`), `labels`/`descriptions` in EN/ES/PT-BR, `scene` (`x`, `y` percent, `scale`), 2–4 colour `palette`, optional `image`/`credit`.
2. Extend the `nebula` enum in `src/content.config.ts` in **both** places (`nebulae.id` and `projects.nebula`).
3. Check label overlap on desktop and mobile (mobile clamps positions to 22–78 % / 14–80 %).

## Add a personal cluster

`src/content/personal/{locale}.json → clusters[]`: `id`, `title`, `object` (a real deep-sky object), `blurb` (informal), `items[]`. The scene positions the first five clusters automatically; more than five needs a new entry in `personalScene` inside `Observatory.astro`.

## Add a UI string

Add the key to `en`, `es` and `pt-br` in `src/i18n/ui.ts`. The `UIKey` type makes the build fail until all three exist. If a client script needs it, expose it through `clientStrings()`.

## Add a locale

- Tier 1 (full): add the code to `locales` in `src/i18n/ui.ts` and `astro.config.ts` (i18n + sitemap map), add `localeMeta`, add a full `ui` table, create `src/pages/<locale>/{index,cv}.astro` and `projects/[key].astro` mirroring `es/`, add content files for every collection. Update `hreflang` automatically via `locales`.
- Tier 2 (UI + summaries only): same wiring but only `ui.ts` and `profile`/`nebulae` labels; long-form content falls back to English by design. Consider a subagent for translation and have a human check tone.

## Add a scene backdrop (page/section header image)

1. Download the official release (ESA/Webb `https://cdn.esawebb.org/archives/images/large/<id>.jpg`, ESA/Hubble equivalent) into `src/assets/nebulae/raw/` (git-ignored).
2. Add an entry to `src/assets/scenes/credits.json` (`id`, `release`, `object`, `source`, `telescope`, `instrument`, `released`, `credit`, `license`, `crop`, `uses`).
3. Run `node scripts/optimize-scenes.mjs` → `src/assets/scenes/<id>.{avif,webp}` (1600×900, ≤ ~200 KB each). Commit the outputs.
4. Extend the `SceneId` type in `SceneBackdrop.astro` and the `scene` enum in `content.config.ts`; render with `<SceneBackdrop id="…" locale={locale} variant="header|section" />` inside a `position: relative; isolation: isolate` container.

## Add imagery to a nebula

Official JWST / Hubble / ESO releases only (public domain or CC BY 4.0; credit required). Convert to AVIF/WebP ≤ ~150 KB, place in `src/assets/nebulae/`, set `image` and `credit` in `nebulae.json`, render with `<Image>` behind the procedural gas layers (keep the procedural renderer as fallback). Never AI-generated imagery presented as real photography.

## Publish a repository stat

Public data (stars, forks, language, last commit) can be fetched at build time with a custom Astro content loader (planned). Traffic (views/clones) needs the `GH_TRAFFIC_TOKEN` secret (fine-grained, Administration read-only) read only inside GitHub Actions.

## Regenerate icons / OG image

Edit `public/favicon.svg`, run `node scripts/generate-icons.mjs`, commit the PNGs.

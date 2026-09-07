# Content guide

Everything the site says lives in `src/content/`. Zod schemas in `src/content.config.ts` validate every file at build time, so a wrong field name or a bad date fails `npm run validate` with the exact path and message. English is mandatory; Spanish and Portuguese are expected for everything a visitor reads; a missing locale falls back to English.

Rules that apply to every collection: dates are `YYYY-MM-DD`; URLs must start with `https://`; quote any YAML string that contains a colon; follow the voice rules and the "never publish" list in `AGENTS.md`; content commits are `content: <what changed>`.

Scaffolds: `npm run new -- project <key>` and `npm run new -- post <key>` create the files with `TODO` markers; `npm run validate` refuses to build while a `TODO` remains in `src/content/`.

## Collections at a glance

| Collection       | Files                           | What it renders                                                        |
| ---------------- | ------------------------------- | ---------------------------------------------------------------------- |
| `profile`        | `profile/{en,es,pt-br}.json`    | Hero headline/tagline, CV summary, contact cards, live clocks, JSON-LD |
| `trajectory`     | `trajectory/{en,es,pt-br}.json` | Orbits section and CV Experience / Education / Leadership              |
| `projects`       | `projects/<locale>/<key>.md`    | Stars inside nebulae, `/projects/<key>` pages, CV "Selected projects"  |
| `nebulae`        | `nebulae.json`                  | The six project categories (real deep-sky objects)                     |
| `skills`         | `skills.json`                   | Constellations; CV prints items with `level >= 3`                      |
| `certifications` | `certifications.json`           | "In progress" nebula box and CV                                        |
| `personal`       | `personal/{en,es,pt-br}.json`   | Personal universe: clusters, soft skills, fun facts                    |
| `posts`          | `posts/<locale>/<key>.md`       | Study log `/log`, `/log/<key>`, RSS, "latest" block on home            |
| `now`            | `now/{en,es,pt-br}.json`        | `/now` page                                                            |

Build-time collections that are not files: `repoStats` (GitHub API per `repo:` in projects) and `contributions` (GitHub calendar). See `docs/ARCHITECTURE.md`.

## profile

```json
{
  "headline": "Junior Data Analyst at Mercado Libre, analytics engineering for Mercado Pago Point. Data Science at ITAM, class of 2028.",
  "tagline": "one sentence, no metaphor",
  "summary": "CV summary, 3–5 sentences, real title first",
  "personalIntro": "informal, first person",
  "email": "eruben.bernal@gmail.com",
  "links": [
    {
      "label": "GitHub",
      "url": "https://github.com/rubo6",
      "kind": "github",
      "audience": "professional"
    },
    {
      "label": "Spotify",
      "url": "https://open.spotify.com/user/…",
      "kind": "spotify",
      "audience": "personal"
    }
  ],
  "dates": {
    "meliStart": "2025-11-03",
    "itamStart": "2023-01-09",
    "graduation": "2028-05-10",
    "birthday": "2003-06-15"
  },
  "languages": [{ "name": "English", "level": "Professional working proficiency" }],
  "softSkills": [{ "name": "Team leadership", "evidence": "one concrete fact from work or study" }]
}
```

- `links[].audience`: `professional` (GitHub, LinkedIn, Scholar, ORCID) shows everywhere including the CV and the JSON-LD `sameAs`; `personal` (Spotify, Xbox, Steam, Discord…) shows only while the personal universe is active. When in doubt, `personal`.
- `dates` drive the live clocks in the hero (`LiveCounters.astro`). `birthday` drives the personal-mode age clock.
- `softSkills` are professional (Skills section box and CV) and hidden while the personal mode is active (`[data-mode='personal'] .soft`); each needs a verifiable `evidence` sentence.

## trajectory

One JSON per locale: `{ "locale": "en", "entries": [ … ] }`. Entry:

```json
{
  "id": "meli-point",
  "kind": "work",
  "org": "Mercado Libre (Mercado Pago Point)",
  "orgUrl": "https://www.mercadopago.com.mx/point",
  "role": "Junior Data Analyst (Data & Analytics Engineering), Contractor",
  "location": "Mexico City",
  "start": "2025-11-03",
  "end": null,
  "summary": "optional one-paragraph context",
  "bullets": ["one idea per bullet, results over duties"],
  "stack": ["BigQuery", "SQL"],
  "sources": [{ "label": "QS 2027", "url": "https://…" }],
  "background": ["rankings, admission stats, full syllabi: folded on the site, never in the CV"],
  "orbit": 0
}
```

- `kind`: `work` | `leadership` | `education`. `end: null` means present.
- `orbit`: 0 is the innermost, most recent orbit; when adding a new role set it to 0 and shift the others by one.
- `org` and `role` use parentheses and commas, never `·` (CV parsers).
- Same `id` and structure in the three locales.

## projects

`src/content/projects/en/<key>.md` plus `es/` and `pt-br/`. `key` is the URL slug and must be identical in every locale.

```md
---
title: Keeper Save Probability
key: keeper-save-probability
locale: en
nebula: research
summary: Interpretable goalkeeper save-probability prototype on 577 labeled World Cup 2022 shots.
role: Author
period: { start: '2025-01-15', end: '2025-05-30' }
stack: [Python, scikit-learn, NumPy]
highlights:
  - 577 labeled shots from the 2022 World Cup
  - Logistic regression chosen for interpretability
repo: rubo6/keeper-save-probability
links:
  - { label: 'Paper', url: 'https://…' }
featured: true
order: 30
visibility: public
---

One to three short first-person paragraphs. This is the project "log".
```

- `nebula`: `professional` · `academic` · `research` · `personal` · `community` · `upcoming`.
- `highlights`: 1–8 short facts; each is a star.
- `visibility`: `public` (repo link and GitHub stats shown) · `confidential` (employer work: no repo, disclaimer, excluded from the CV) · `course` (university work whose code cannot be published: disclaimer, no repo, still in the CV).
- `featured` projects that are not `confidential` appear in the CV.
- Employer projects: dates are Rubo's involvement; the body may say when the project itself started.

## nebulae

`nebulae.json`: one object per category with a real deep-sky object (`object.name`, `designation`, `constellation`, `distanceLy`), `labels` and `descriptions` per locale, `scene` `{ x, y, scale }` in percent, a 2–4 colour `palette`, optional `image` and `credit`. Adding a category also means extending the `nebula` enum in `src/content.config.ts` in both places (`nebulae.id`, `projects.nebula`) and checking label overlap on mobile.

## skills

```json
{ "name": "BigQuery", "level": 4, "since": 2025, "via": "Mercado Libre" }
```

Groups have an `id`, localized `labels`, a real `constellation` name and up to ~13 `items`. `level` 1–4 sizes the star; the CV prints only `level >= 3`. `via` is the provenance shown as tooltip ("course, institution" or job). Academic skills must map to a syllabus in `docs/research/`; never invent proficiency. Keep names ≤ ~28 characters so labels do not collide.

## certifications

```json
{
  "id": "aws-academy",
  "name": "AWS Academy — Cloud Foundations",
  "issuer": "AWS Academy",
  "status": "in-progress",
  "date": null,
  "url": null,
  "skills": ["Cloud"]
}
```

`status`: `earned` | `in-progress` | `expected`. When Rubo sends a verification link: `status: "earned"`, `date`, `url`. Names stay generic until the certificate exists. When all are earned, rename the `upcoming` nebula labels to "Certifications" in `nebulae.json`.

## personal

`intro`, `clusters[]` (`id`, `title`, `object` = a real deep-sky object, `blurb`, `items[]`), `funFacts[]`. Informal register. Soft skills do not belong here (they moved to `profile.softSkills` on 2026-09-06 because recruiters read the professional mode). The first five clusters are positioned automatically; a sixth needs a new entry in `personalScene` inside `Observatory.astro` and an image mapping in `personalImage`.

## posts (study log)

```md
---
title: 'Sigma-algebras, SQL and the Porfiriato'
key: probabilidad-bases-de-datos-historia-mexico
locale: en
date: '2024-12-06'
summary: '≤ 280 characters'
area: stats
semester: 'Otoño 2024'
courses: ['Probability I']
tags: ['probability']
featured: false
scene: crab
---
```

- `area`: `math` · `stats` · `computing` · `datascience` · `economics` · `humanities` · `astronomy` · `work` · `leadership`.
- `scene` (optional header image): `crab` · `cartwheel` · `tarantula` · `wr124` · `stephans-quintet`.
- `date` never in the future; `updated` optional; `draft: true` hides it.
- Body 350–600 words, first person, `##` sections, ends with a "What I take with me" section. No invented grades, names or anecdotes.
- EN and ES are required; PT-BR falls back to EN. The OG image is generated from the English title at build.

## now

`now/<locale>.json`: `updated` date and `sections[]` (`id`, `title`, `items[]`). Refresh by hand every few weeks; bump `updated`.

## UI strings

`src/i18n/ui.ts`: add the key to `en`, `es` and `pt-br`; the build fails until all three exist, and `npm run check:content` fails if a key is never used. Client scripts get strings through `clientStrings()`.

## Recurring tasks

- **New job**: add a trajectory entry with `orbit: 0` in the three locales, renumber the others, update `profile.dates.meliStart` (or add a date key) if a clock should follow it, add a `professional` project if there is public work, update `now`.
- **Certification earned**: see `certifications` above; also refresh the `now` "Studying" items.
- **Repository goes public**: add `repo: owner/name` to the project in all locales; if it was `course` or `confidential`, Rubo decides whether it becomes `public`.
- **New personal interest**: add a cluster with a real astronomical object.
- **New locale**: tier 1 = full content + `ui.ts` table + `src/pages/<locale>/` mirroring `es/` + `locales` in `ui.ts` and `astro.config.ts`; tier 2 = `ui.ts` and `profile`/`nebulae` labels only, long-form falls back to English.

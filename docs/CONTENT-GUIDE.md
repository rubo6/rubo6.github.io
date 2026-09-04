# Content guide

Everything the site says lives in `src/content/`. Schemas in `src/content.config.ts` validate every file at build time; a typo in a field name or a bad date fails `npm run validate` with a precise message.

## Locales and fallback

- `en` is mandatory. `es` and `pt-br` are expected for all user-facing content.
- If a locale is missing for a project, the English version is rendered in its place. UI strings always fall back to English.
- Keep the **tone** rules: formal in professional content (projects, trajectory, CV), warm and informal in `personal/*.json`.

## Collections

### `profile/<locale>.json`

Identity, headline, tagline, summary, personal intro, location (lat/lon feed the sky), professional e-mail, links, languages and the **dates that drive the live clocks**:

```json
"dates": { "meliStart": "2025-10-01", "itamStart": "2023-08-01", "graduation": "2027-12-01" }
```

### `trajectory/<locale>.json`

Array of entries with `kind` (`work` | `leadership` | `education`), `org`, `role`, `location`, `start`, `end` (`null` = present), `bullets`, `stack`, and `orbit` (0 = innermost/most recent). Keep bullets factual and in the CV's voice.

### `projects/<locale>/<key>.md`

Frontmatter:

| Field            | Required | Notes                                                                            |
| ---------------- | -------- | -------------------------------------------------------------------------------- |
| `title`          | yes      |                                                                                  |
| `key`            | yes      | URL slug, identical across locales, `[a-z0-9-]`                                  |
| `locale`         | yes      | `en` / `es` / `pt-br`                                                            |
| `nebula`         | yes      | `professional` · `academic` · `research` · `personal` · `community` · `upcoming` |
| `summary`        | yes      | ≤ 240 chars                                                                      |
| `role`, `period` | yes      | `period: { start: 'YYYY-MM-DD', end: null }`                                     |
| `stack`          | yes      | 1+ items                                                                         |
| `highlights`     | yes      | 1–8 short facts — these are the stars of the nebula                              |
| `repo`           | no       | `owner/name`; hidden when `visibility: confidential`                             |
| `links`          | no       | `{ label, url }` https only                                                      |
| `featured`       | no       | featured projects appear in the CV                                               |
| `order`          | no       | lower first                                                                      |
| `visibility`     | no       | `public` (default) or `confidential` (employer work: no repo, disclaimer shown)  |

The Markdown body is the "log": 1–3 short paragraphs, first person, no confidential details for employer work.

### `nebulae.json`

One entry per category: real object (`name`, `designation`, `constellation`, `distanceLy`), localized `labels` and `descriptions`, `scene` position (`x`, `y` in percent, `scale`), a 2–4 colour `palette`, optional `image` + `credit`. Adding a category also requires extending the `nebula` enum in `content.config.ts`.

### `skills.json`

Groups with localized labels, a real constellation name, and items with `level` 1–4 (familiar → expert) and an optional `via` (provenance: course · institution, job or project; shown as the star's tooltip and read by screen readers). Level drives star size. Every academic skill must be backed by a syllabus in `docs/research/` — never invent proficiency.

### `certifications.json`

`status`: `earned` | `in-progress` | `expected`; add `url` when a verification link exists.

### `personal/<locale>.json`

`intro`, `clusters` (interest nebulae: `title`, `object`, `blurb`, `items`), `softSkills` (`name` + `evidence`), `funFacts`. Informal register.

## Writing rules

- Numbers and dates as data, not prose; the UI formats them per locale.
- No phone numbers, home address, IDs or internal company details. The professional e-mail is the only contact.
- Prefer verifiable statements ("577 labeled shots") over adjectives.
- English titles in Title Case for projects; Spanish/Portuguese in sentence case.

## Checklist

1. Edit or add files under `src/content/`.
2. `npm run validate`.
3. Check the affected section in the browser in both modes.
4. Commit as `content: <what changed>`.

# ADR-0007 · Study log ("bitácora") as a content collection, official telescope imagery, illustrated portraits

- Status: accepted · Date: 2026-09-04

## Context

The owner wants the site to grow over time and to show the substance of the ITAM Data Science degree (mathematics, statistics, computing, economics, and the humanistic General Studies core), plus a stronger visual identity: real nebula photographs and a portrait.

## Decision

1. **Study log** as a `posts` content collection (Markdown per entry per locale, cross-locale `key`, `area` enum driving colour), routes `/log/`, `/log/<key>` and `/log/rss.xml` per locale, latest three entries on the home page. Entries follow the official Plan B curriculum (9 terms, Jan 2023 → May 2027) and the published ITAM syllabi; where ITAM publishes no syllabus the entry describes typical content without inventing course codes or grades. First person, no fabricated anecdotes. `@astrojs/rss` added (build-time only).
2. **Nebula imagery**: official ESA/Webb and ESA/Hubble releases under CC BY 4.0, cropped to 1200×1200, credited by name, telescope, instrument, licence and source URL in `src/assets/nebulae/credits.json` and in the UI panel. The procedural renderer remains as the fallback when no image exists for a nebula. Raw publication JPEGs are git-ignored.
3. **Portrait**: three owner-generated illustrations (editorial, constellation, atlas engraving) selected by theme and mode, in an "eyepiece" frame with optional video and photo tabs that render only when the media files exist. Labelled as illustrations. The owner's real photograph is not committed.

## Consequences

- Content growth is a matter of adding Markdown; RSS lets readers follow.
- Imagery licence obligations are met by the visible credit line and the credits file.
- One new build-time dependency (`@astrojs/rss`); no runtime scripts added.

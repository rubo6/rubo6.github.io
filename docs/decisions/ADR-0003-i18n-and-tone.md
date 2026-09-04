# ADR-0003 · English root locale, tiered languages, dual register

- Status: accepted · Date: 2026-09-03

## Context

The CV targets international employers; the author is Mexican and works in a Latin American company where Portuguese matters. The author also asked for a formal tone in professional sections and an informal one in personal sections.

## Decision

- Tier 1 (full content): **EN at `/`**, **ES at `/es/`**, **PT-BR at `/pt-br/`**.
- Tier 2 (planned): FR, DE, IT, JA, ZH with UI strings and summaries only; long-form content falls back to English.
- Register: professional surfaces formal, personal universe warm and informal, per locale. Enforced editorially via CONTENT-GUIDE.md; structurally via separate content files (`personal/*` vs the rest) and per-mode copy in components.
- Missing locale content falls back to English at the accessor layer (`src/lib/content.ts`).

## Consequences

- `UIKey` typing forces every UI string into all tier-1 locales.
- Adding a locale is mechanical (pages + content), documented in AGENTS.md.

# ADR-0001 · Astro 7 static site instead of vanilla HTML or Next.js

- Status: accepted · Date: 2026-09-03

## Context

The previous site was three hand-written files with placeholder links. The goal is a portfolio that demonstrates engineering discipline, stays cheap to host on GitHub Pages, and can be edited by AI agents without breaking layout.

## Decision

Use Astro 7 with `output: 'static'`, TypeScript strict and Tailwind CSS 4 via the Vite plugin. No UI framework; interactivity is small vanilla TypeScript modules.

## Consequences

- Zero JavaScript by default, 31 pages build in under two seconds, Lighthouse-friendly.
- Content collections with zod give agents a validated contract for content.
- Requires Node ≥ 22.12 locally and in CI (`.node-version`).
- Alternatives rejected: Next.js static export (heavier runtime, React not needed), plain HTML (no schema, no i18n, no build-time validation).

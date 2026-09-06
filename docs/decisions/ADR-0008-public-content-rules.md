# ADR-0008 · Public content rules and documentation reset

- Status: accepted · Date: 2026-09-06

## Context

A review of the site as a top-tier recruiter and as an ATS parser (2026-09-05) found three problems: the job title was inflated and inconsistent across surfaces, institution rankings and full syllabi crowded the bullets, and the prose repeated the same devices in a way readers associate with generated text. Leisure profiles (Spotify, Xbox) also appeared in the professional mode and the CV. Separately, the documentation had grown into overlapping session logs, plans, questionnaires and reports that a small model cannot afford to read.

## Decision

1. **One real job title everywhere** ("Junior Data Analyst (Data & Analytics Engineering), Contractor" at "Mercado Libre (Mercado Pago Point)"), including JSON-LD and project roles. Engineering work is described in bullets.
2. **`profile.links[].audience`** (`professional` | `personal`): personal links render only in the personal universe and never in the CV or structured data.
3. **`trajectory[].background`**: rankings, admission statistics and full syllabi are kept but folded on the site and never printed in the CV.
4. **`projects.visibility: course`** for university work whose code cannot be published; `confidential` stays for employer work.
5. **Voice rules** (AGENTS.md) govern all public text in the three locales.
6. **Approved metrics only**: the average monthly subscriptions per agent (4 → 18 → 27, Jan/Jun/Sep 2026) is the one business figure Rubo authorised; nothing else from Mercado Libre is quantified.
7. **Documentation reset**: `AGENTS.md` is the single entry point; `docs/` keeps one file per concern (CONTENT, ARCHITECTURE, DESIGN, SECURITY-BASELINE, OWNER, PENDING) plus ADRs, research evidence and Lighthouse data. Session logs, plans, questionnaires and review reports were deleted (history stays in git). Generic copied skills were removed; the project skill only points to AGENTS.md.

## Consequences

- Recruiters and parsers see one title, month-year dates, comma-separated skills and a one-column printable CV.
- Nothing factual was lost: institution text lives in `background`, decisions live in ADRs.
- Any agent, including small models, can do most tasks after reading AGENTS.md and one document. New conventions must be added to those files, not to new ones.

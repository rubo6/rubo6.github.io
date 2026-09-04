# ADR-0002 · "Observatory" concept with real astronomy, no images required

- Status: accepted · Date: 2026-09-03

## Context

The author's main interest is astronomy and the previous "tron" aesthetic was rejected. The site must feel technological and immersive while staying fast and honest about what it shows.

## Decision

- The hero renders the actual sky above Mexico City from a curated bright-star catalogue using in-house sidereal-time and coordinate math, unit-tested against Meeus.
- Categories of work are **nebulae** modelled after real objects (Orion, Carina, Eagle, Helix, Lagoon, Horsehead); project highlights are **stars**; career is **orbits**; skills are **constellations**.
- Nebulae are rendered procedurally (layered gradients + deterministic star dust) so the site works without any image. Official JWST/Hubble imagery can be added later per nebula with credit.
- All pseudo-random visuals derive from a hash of stable names (FNV-1a), never `Math.random`.

## Consequences

- Reproducible builds and a strong "this person knows what they are doing" signal for technical visitors.
- Requires keeping the catalogue and lines file accurate; adding stars is a data change.
- Imagery policy documented in DESIGN-SYSTEM.md.

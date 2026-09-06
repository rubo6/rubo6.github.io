<p align="center">
  <img src=".github/assets/banner.svg" alt="Rubo · Observatory — Eduardo Rubén Bernal Puente, Junior Data Analyst and Data Science student" width="100%">
</p>

<p align="center">
  <a href="https://rubo6.dev"><img alt="Live site" src="https://img.shields.io/badge/live-rubo6.dev-f2c46d?style=flat-square&labelColor=0b1026"></a>
  <a href="https://github.com/rubo6/rubo6.github.io/actions/workflows/deploy.yml"><img alt="Deploy" src="https://github.com/rubo6/rubo6.github.io/actions/workflows/deploy.yml/badge.svg"></a>
  <a href="https://github.com/rubo6/rubo6.github.io/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/rubo6/rubo6.github.io/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://github.com/rubo6/rubo6.github.io/actions/workflows/codeql.yml"><img alt="CodeQL" src="https://github.com/rubo6/rubo6.github.io/actions/workflows/codeql.yml/badge.svg"></a>
  <img alt="Astro 7" src="https://img.shields.io/badge/Astro-7-BC52EE?style=flat-square&logo=astro&logoColor=white&labelColor=0b1026">
  <img alt="TypeScript strict" src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white&labelColor=0b1026">
  <img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=0b1026">
  <a href="https://github.com/rubo6/rubo6.github.io/actions/workflows/lighthouse.yml"><img alt="Lighthouse mobile performance" src="https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/rubo6/rubo6.github.io/main/docs/lighthouse/latest.json&query=%24.mobile.performance&label=Lighthouse%20mobile&color=f2c46d&style=flat-square&labelColor=0b1026"></a>
  <a href="https://github.com/rubo6/rubo6.github.io/actions/workflows/lighthouse.yml"><img alt="Lighthouse desktop performance" src="https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/rubo6/rubo6.github.io/main/docs/lighthouse/latest.json&query=%24.desktop.performance&label=Lighthouse%20desktop&color=f2c46d&style=flat-square&labelColor=0b1026"></a>
  <img alt="Cookies: 0" src="https://img.shields.io/badge/cookies-0-9ad9e8?style=flat-square&labelColor=0b1026">
</p>

<p align="center">
  <b>English</b> · <a href="https://rubo6.dev/es/">Español</a> · <a href="https://rubo6.dev/pt-br/">Português</a>
</p>

---

# Rubo · Observatory

**Live at [rubo6.dev](https://rubo6.dev).**

My personal site is an **observatory**. The hero renders the real sky above Mexico City at the moment you open it, computed from a bright-star catalogue with sidereal-time math written in TypeScript and covered by unit tests. Projects live inside **nebulae** (official JWST and Hubble imagery, credited), each highlight is a **star**, my trajectory is drawn as **orbits** with a camera that follows the entry you are reading, and skills as **constellations**. A switch flips the whole universe from _professional_ to _personal_.

It is also a small engineering project: static output, content separated from presentation, security rules enforced by lint, no cookies (only a cookieless page count), and a repository documented so that humans and AI coding agents, including small models, can extend it safely.

## On the site

| Section               | What it is                                                                                                     | Data                                                         |
| --------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Sky**               | Live star map over CDMX (150 stars, 29 constellation figures), local sidereal clock, mission clocks            | `src/data/bright-stars.json`, `src/content/profile/*.json`   |
| **Observatory**       | Nebulae = project categories, stars = project facts; click to focus the telescope                              | `src/content/nebulae.json`, `src/content/projects/<locale>/` |
| **Personal universe** | The informal half: astronomy, music, gaming, swimming, soft skills with evidence, GitHub contribution calendar | `src/content/personal/*.json`                                |
| **Trajectory**        | Work, leadership and education as orbits; institution details folded                                           | `src/content/trajectory/*.json`                              |
| **Skills**            | Constellations sized by proficiency, each star with its provenance; certifications                             | `src/content/skills.json`, `src/content/certifications.json` |
| **Log** and **Now**   | Study log by term with filters and RSS; what I am doing this month                                             | `src/content/posts/<locale>/`, `src/content/now/*.json`      |
| **CV**                | Print-ready, parser-friendly résumé generated from the same content, in three languages                        | `/cv`, `/es/cv`, `/pt-br/cv`                                 |

Two themes (**night** / **atlas**) × two modes (**professional** / **personal**), three languages (EN root, ES, PT-BR), `prefers-reduced-motion` respected everywhere.

## How it works

```mermaid
flowchart LR
  subgraph Content["src/content (zod-validated)"]
    P[profile] --- T[trajectory] --- PR[projects] --- S[skills] --- L[posts]
  end
  subgraph Lib["src/lib + src/loaders"]
    A[astro/ · JD · GMST · Alt/Az · moon]
    CT[content.ts · locale fallback]
    G[GitHub stats + contributions at build]
  end
  subgraph UI["src/components (Astro, no UI framework)"]
    H[Hero + sky canvas] --> O[Observatory] --> TR[Trajectory] --> K[Constellation] --> F[Footer]
  end
  Content --> CT --> UI
  G --> UI
  A --> H
  UI -->|astro build| D[dist/ ~100 static pages]
  D -->|GitHub Actions| GH[(GitHub Pages · rubo6.dev)]
  GH -->|after deploy| LH[Lighthouse → docs/lighthouse]
```

- **Astro 7** static output, i18n routing, view transitions. Interactive parts are small vanilla TypeScript modules in `src/scripts/`.
- **Tailwind CSS 4** as a Vite plugin; design tokens are registered CSS `@property` values so a mode switch interpolates every colour.
- **Real astronomy** in `src/lib/astro` (Julian dates, sidereal time, equatorial→horizontal, stereographic projection, moon phase) validated against Meeus.
- **No randomness**: star dust and twinkle phases derive from an FNV-1a hash, so every build is reproducible.

## Edit content

```bash
npm run new -- project <key>   # scaffolds EN/ES/PT-BR with TODO markers
npm run new -- post <key>      # scaffolds a log entry
npm run validate               # schemas tell you exactly what is wrong
```

Guide with an example per collection: [docs/CONTENT.md](docs/CONTENT.md).

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run validate   # format · lint · types · tests · content check · build (what CI runs)
npm run test:e2e   # Playwright smoke tests against the built site
```

Node 24 (`.node-version`). Pushing to `main` deploys; a daily cron rebuilds so build-time data stays fresh; Lighthouse runs on a GitHub runner after each deploy.

## For AI agents

Start with [AGENTS.md](AGENTS.md): it maps each kind of task to the single document to read, and lists the invariants, voice rules and what must never be published. Decisions are in [docs/decisions](docs/decisions).

## Security

- Strict Content-Security-Policy via `<meta>`: no inline scripts; the only external origin is GoatCounter, a cookieless analytics service.
- ESLint bans `eval`, `innerHTML`, `document.write`, `Math.random`.
- CI: format, lint, types, tests, build, `npm audit`, dependency review, CodeQL; Dependabot weekly; all actions pinned to commit SHAs with least-privilege permissions.
- No forms, no cookies, no phone number. Report an issue: [SECURITY.md](SECURITY.md) or `/.well-known/security.txt`.

## Credits

Type: [Fraunces](https://github.com/undercasetype/Fraunces), [Instrument Sans](https://github.com/Instrument/instrument-sans), [JetBrains Mono](https://www.jetbrains.com/lp/mono/) (self-hosted via Fontsource). Star data: hand-curated subset of the Yale Bright Star Catalogue. Astronomy formulas: Jean Meeus, _Astronomical Algorithms_. Imagery: ESA/Webb and ESA/Hubble releases (CC BY 4.0), credited in place.

## License

Code is MIT ([LICENSE](LICENSE)). Content in `src/content` (texts, CV data) is © Eduardo Rubén Bernal Puente, all rights reserved.

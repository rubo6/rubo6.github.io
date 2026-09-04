# Security policy

This is a static personal website. It has no backend, no database, no authentication and stores no visitor data. The attack surface is the build pipeline and the static assets themselves.

## Reporting a vulnerability

Please e-mail **eruben.bernal@gmail.com** with the subject `[security] rubo6.github.io`. Include the affected URL or file, steps to reproduce and, if possible, a suggested fix. You should get an acknowledgement within 72 hours. Please do not open a public issue for security reports.

Machine-readable version: [`/.well-known/security.txt`](https://rubo6.github.io/.well-known/security.txt).

## Scope

In scope:

- Content injection or XSS through content files, build scripts or client scripts
- Supply-chain issues in dependencies or GitHub Actions
- Misconfiguration of the Content-Security-Policy or other security metadata
- Leaks of private data in the repository or the built site

Out of scope:

- GitHub Pages infrastructure (report to GitHub)
- Denial-of-service against GitHub Pages
- Issues in third-party sites linked from this one

## Controls in place

See [docs/SECURITY-BASELINE.md](docs/SECURITY-BASELINE.md) for the full list. Highlights: strict CSP with `script-src 'self'`; no inline scripts; zero third-party runtime requests; lint rules banning `eval`, `innerHTML` and `Math.random`; CodeQL, dependency review, `npm audit` and Dependabot in CI; every GitHub Action pinned to a commit SHA with least-privilege permissions.

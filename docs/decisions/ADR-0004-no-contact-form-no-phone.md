# ADR-0004 · No contact form, no third-party services, no phone number

- Status: accepted · Date: 2026-09-03

## Context

The old site had a fake form and listed a personal phone number in the CV. GitHub Pages has no backend; any form would post visitor data to a third party.

## Decision

- Contact is a professional e-mail (`eruben.bernal@gmail.com`), LinkedIn and GitHub. A copy-to-clipboard button replaces the form.
- No phone number on the site or in the generated CV.
- No cookie banners, chat widgets or embedded third-party scripts other than the cookieless analytics accepted later in ADR-0006.

## Consequences

- Nothing to secure server-side; the CSP can stay strict.
- Analytics were added in ADR-0006 under the cookieless constraint.

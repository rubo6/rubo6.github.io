---
title: Production-style data pipeline
key: production-data-pipeline
locale: en
nebula: personal
summary: End-to-end CSV ingestion, cleaning and reporting workflow with automated tests, CI, operational docs and load testing.
role: Author
period: { start: '2025-03-01', end: '2025-06-30' }
stack: [Python, Pandas, pytest, GitHub Actions, Docker]
highlights:
  - Idempotent ingestion and cleaning jobs
  - Automated tests and continuous integration
  - Operational documentation and runbooks
  - Load testing to characterize throughput
featured: true
order: 10
---

A CSV ingestion pipeline built like the ones I would want to inherit: re-runnable jobs, a test per step, and a
runbook that says what to do when something fails.

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

A deliberately "boring" pipeline built the way production systems are built: every job can be re-run
safely, every step is tested, and the documentation explains how to operate it, not just how it works.

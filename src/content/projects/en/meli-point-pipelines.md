---
title: ETL/ELT pipelines and warehouse models for Point
key: meli-point-pipelines
locale: en
nebula: professional
summary: Production pipelines in BigQuery and an internal orchestrator that feed analytics, dashboards and operational reporting for Mercado Pago Point.
role: Data Engineer
period: { start: '2025-10-01', end: null }
stack: [BigQuery, SQL, Python, Internal orchestration platform, Looker]
highlights:
  - Idempotent daily snapshots with timezone-safe partitioning (America/Mexico_City)
  - Warehouse, reporting and operational layers validated for consistency
  - Data-architecture migration to a new backend without breaking downstream consumers
  - Pre-load audits and reconciliation queries as first-class pipeline steps
featured: true
order: 2
visibility: confidential
---

The pipelines that keep Point's analytics honest: ingestion, cleaning, modelling and validation in BigQuery,
orchestrated by an internal platform. My focus is reliability: idempotent jobs, explicit audits before loads,
and documentation that makes every step reproducible.

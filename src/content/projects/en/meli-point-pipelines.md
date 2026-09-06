---
title: ETL/ELT pipelines and warehouse models for Point
key: meli-point-pipelines
locale: en
nebula: professional
summary: Production pipelines in BigQuery and an internal orchestrator that feed analytics, dashboards and operational reporting for Mercado Pago Point.
role: Junior Data Analyst (data layer owner)
period: { start: '2025-11-03', end: null }
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

Ingestion, modelling and validation in BigQuery, scheduled by an internal orchestrator. Idempotent daily
snapshots partitioned in America/Mexico_City, audits before every load, and documentation that lets a teammate
rerun any step. The pipelines predate me by a month (October 2025); I have owned them since joining in November.

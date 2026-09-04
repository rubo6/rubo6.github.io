---
title: Pipelines ETL/ELT y modelos de warehouse para Point
key: meli-point-pipelines
locale: es
nebula: professional
summary: Pipelines en producción sobre BigQuery y un orquestador interno que alimentan analítica, dashboards y reportería operativa de Mercado Pago Point.
role: Data Engineer
period: { start: '2025-10-01', end: null }
stack: [BigQuery, SQL, Python, Plataforma interna de orquestación, Looker]
highlights:
  - Snapshots diarios idempotentes con particionado seguro por zona horaria (America/Mexico_City)
  - Capas de warehouse, reporting y operación validadas por consistencia
  - Migración de arquitectura de datos a un nuevo backend sin romper a los consumidores
  - Auditorías previas a la carga y consultas de reconciliación como pasos de primera clase
featured: true
order: 2
visibility: confidential
---

Los pipelines que mantienen honesta la analítica de Point: ingesta, limpieza, modelado y validación en BigQuery,
orquestados por una plataforma interna. Mi enfoque es la confiabilidad: jobs idempotentes, auditorías explícitas
antes de cargar y documentación que hace reproducible cada paso.

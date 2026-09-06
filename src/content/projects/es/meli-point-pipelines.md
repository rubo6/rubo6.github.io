---
title: Pipelines ETL/ELT y modelos de warehouse para Point
key: meli-point-pipelines
locale: es
nebula: professional
summary: Pipelines en producción sobre BigQuery y un orquestador interno que alimentan analítica, dashboards y reportería operativa de Mercado Pago Point.
role: Analista de Datos Jr. (responsable de la capa de datos)
period: { start: '2025-11-03', end: null }
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

Ingesta, modelado y validación en BigQuery, programados por un orquestador interno. Snapshots diarios
idempotentes particionados en America/Mexico_City, auditorías antes de cada carga y documentación que permite a
cualquier compañero volver a correr un paso. Los pipelines empezaron un mes antes que yo (octubre de 2025); están
a mi cargo desde que entré en noviembre.

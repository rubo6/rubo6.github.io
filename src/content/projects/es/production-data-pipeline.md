---
title: Pipeline de datos estilo producción
key: production-data-pipeline
locale: es
nebula: personal
summary: Flujo completo de ingesta, limpieza y reporte de CSV con pruebas automatizadas, CI, documentación operativa y pruebas de carga.
role: Autor
period: { start: '2025-03-01', end: '2025-06-30' }
stack: [Python, Pandas, pytest, GitHub Actions, Docker]
highlights:
  - Jobs de ingesta y limpieza idempotentes
  - Pruebas automatizadas e integración continua
  - Documentación operativa y runbooks
  - Pruebas de carga para caracterizar el throughput
featured: true
order: 10
---

Un pipeline deliberadamente "aburrido", construido como se construyen los sistemas en producción: cada job se
puede volver a correr sin riesgo, cada paso tiene pruebas y la documentación explica cómo operarlo, no solo cómo
funciona.

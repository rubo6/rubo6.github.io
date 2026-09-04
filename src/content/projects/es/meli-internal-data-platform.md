---
title: Plataforma interna de datos para Mercado Pago Point
key: meli-internal-data-platform
locale: es
nebula: professional
summary: Plataforma web que centraliza flujos operativos y acceso a datos para el equipo de Point, construida con Next.js 16 y Firebase sobre BigQuery.
role: Data / Analytics Engineer
period: { start: '2025-10-01', end: null }
stack: [Next.js 16, TypeScript, Firebase Functions, Firestore, BigQuery, Google Sheets]
highlights:
  - Centraliza flujos operativos que antes vivían en hojas de cálculo dispersas
  - Doble capa Firestore + BigQuery con flujos productor-consumidor rediseñados para una migración de backend
  - Integraciones con Google Sheets para equipos que siguen operando en hojas de cálculo
  - Documentación de arquitectura, changelogs y handoffs mantenidos junto al código
featured: true
order: 1
visibility: confidential
---

Es un producto interno, así que el detalle se queda al nivel del CV público. La plataforma le da al equipo de
Mercado Pago Point un solo lugar para ejecutar flujos operativos y consultar datos curados, reemplazando hojas
de cálculo ad hoc.

Lo que está a mi cargo: la capa de datos (modelos en BigQuery y colecciones de Firestore), las Cloud Functions
que mueven datos entre ambas y la documentación que permite al resto del equipo operarla y extenderla.

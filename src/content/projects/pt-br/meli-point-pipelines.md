---
title: Pipelines ETL/ELT e modelos de warehouse para o Point
key: meli-point-pipelines
locale: pt-br
nebula: professional
summary: Pipelines em produção no BigQuery e um orquestrador interno que alimentam analytics, dashboards e relatórios operacionais do Mercado Pago Point.
role: Data Engineer
period: { start: '2025-10-01', end: null }
stack: [BigQuery, SQL, Python, Plataforma interna de orquestração, Looker]
highlights:
  - Snapshots diários idempotentes com particionamento seguro por fuso horário (America/Mexico_City)
  - Camadas de warehouse, relatórios e operação validadas por consistência
  - Migração da arquitetura de dados para um novo backend sem quebrar os consumidores
  - Auditorias pré-carga e consultas de reconciliação como etapas de primeira classe
featured: true
order: 2
visibility: confidential
---

Os pipelines que mantêm honesto o analytics do Point: ingestão, limpeza, modelagem e validação no BigQuery,
orquestrados por uma plataforma interna. Meu foco é confiabilidade: jobs idempotentes, auditorias explícitas
antes de carregar e documentação que torna cada etapa reproduzível.

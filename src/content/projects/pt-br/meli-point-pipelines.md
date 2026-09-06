---
title: Pipelines ETL/ELT e modelos de warehouse para o Point
key: meli-point-pipelines
locale: pt-br
nebula: professional
summary: Pipelines em produção no BigQuery e um orquestrador interno que alimentam analytics, dashboards e relatórios operacionais do Mercado Pago Point.
role: Analista de Dados Jr. (responsável pela camada de dados)
period: { start: '2025-11-03', end: null }
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

Ingestão, modelagem e validação no BigQuery, agendadas por um orquestrador interno. Snapshots diários
idempotentes particionados em America/Mexico_City, auditorias antes de cada carga e documentação que permite a
qualquer colega reexecutar uma etapa. Os pipelines começaram um mês antes de mim (outubro de 2025); são minha
responsabilidade desde que entrei em novembro.

---
title: Plataforma interna de dados para o Mercado Pago Point
key: meli-internal-data-platform
locale: pt-br
nebula: professional
summary: Plataforma web que centraliza fluxos operacionais e acesso a dados para a equipe do Point, construída com Next.js 16 e Firebase sobre BigQuery.
role: Analista de Dados Jr. (responsável pela camada de dados)
period: { start: '2025-11-03', end: null }
stack: [Next.js 16, TypeScript, Firebase Functions, Firestore, BigQuery, Google Sheets]
highlights:
  - Centraliza fluxos operacionais que antes viviam em planilhas dispersas
  - Camada dupla Firestore + BigQuery com fluxos produtor-consumidor redesenhados para uma migração de backend
  - Integrações com Google Sheets para equipes que ainda operam em planilhas
  - Documentação de arquitetura, changelogs e handoffs mantidos junto ao código
featured: true
order: 1
visibility: confidential
---

É um produto interno, então o detalhe fica no nível do CV público. A plataforma dá à equipe do Mercado Pago
Point um lugar para executar fluxos operacionais e consultar dados curados em vez de planilhas dispersas. O
projeto começou em outubro de 2025; assumi quando entrei em novembro e desde então é minha responsabilidade.

O que está sob minha responsabilidade: a camada de dados (modelos no BigQuery e coleções no Firestore), as Cloud
Functions que movem dados entre elas e a documentação que permite ao resto da equipe operá-la e estendê-la.

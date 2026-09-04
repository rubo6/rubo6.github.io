---
title: Pipeline de dados estilo produção
key: production-data-pipeline
locale: pt-br
nebula: personal
summary: Fluxo completo de ingestão, limpeza e relatório de CSV com testes automatizados, CI, documentação operacional e testes de carga.
role: Autor
period: { start: '2025-03-01', end: '2025-06-30' }
stack: [Python, Pandas, pytest, GitHub Actions, Docker]
highlights:
  - Jobs de ingestão e limpeza idempotentes
  - Testes automatizados e integração contínua
  - Documentação operacional e runbooks
  - Testes de carga para caracterizar o throughput
featured: true
order: 10
---

Um pipeline deliberadamente "chato", construído como os sistemas de produção são construídos: cada job pode ser
reexecutado com segurança, cada etapa é testada e a documentação explica como operá-lo, não apenas como funciona.

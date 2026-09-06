---
title: Bag-of-Words paralelo
key: parallel-bag-of-words
locale: pt-br
nebula: academic
summary: Bag-of-Words serial e paralelo com MPI em C++17, com particionamento round-robin e balanceado por tamanho, conteinerizado com Docker.
role: Autor
period: { start: '2025-08-01', end: '2025-12-15' }
stack: [C++17, MPI, Docker, Bash]
highlights:
  - Linha de base serial e implementação paralela com MPI
  - Comparação de particionamento round-robin vs. balanceado por tamanho
  - Fluxo conteinerizado para execuções reproduzíveis
  - Testes de fumaça automatizados
featured: true
visibility: course
order: 20
---

Feito para a disciplina de Computação Paralela do ITAM. Balancear as partições por tamanho de documento supera
o round-robin assim que as entradas ficam desbalanceadas, e as medições dizem por quanto.

---
title: Bag-of-Words paralelo
key: parallel-bag-of-words
locale: es
nebula: academic
summary: Bag-of-Words serial y paralelo con MPI en C++17, con particionado round-robin y balanceado por tamaño, contenerizado con Docker.
role: Autor
period: { start: '2025-08-01', end: '2025-12-15' }
stack: [C++17, MPI, Docker, Bash]
highlights:
  - Línea base serial e implementación paralela con MPI
  - Comparación de particionado round-robin vs. balanceado por tamaño
  - Flujo contenerizado para corridas reproducibles
  - Pruebas de humo automatizadas
featured: true
visibility: course
order: 20
---

Hecho para la materia de Cómputo Paralelo del ITAM. Balancear las particiones por tamaño de documento le gana
al round-robin en cuanto las entradas se sesgan, y las mediciones dicen por cuánto.

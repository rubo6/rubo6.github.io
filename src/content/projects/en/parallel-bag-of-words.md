---
title: Parallel Bag-of-Words
key: parallel-bag-of-words
locale: en
nebula: academic
summary: Serial and MPI-parallel Bag-of-Words in C++17 with round-robin and size-balanced partitioning, containerized with Docker.
role: Author
period: { start: '2025-08-01', end: '2025-12-15' }
stack: [C++17, MPI, Docker, Bash]
highlights:
  - Serial baseline and MPI-parallel implementation
  - Round-robin vs. size-balanced document partitioning compared
  - Containerized workflow for reproducible runs
  - Automated smoke tests
featured: true
visibility: course
order: 20
---

Built for the Parallel Computing course at ITAM. Balancing partitions by document size beats round-robin as
soon as inputs are skewed, and the measurements say by how much.

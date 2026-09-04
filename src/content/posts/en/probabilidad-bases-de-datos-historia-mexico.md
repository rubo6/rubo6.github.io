---
title: 'Fourth term: sigma-algebras, SQL and the Porfiriato'
key: probabilidad-bases-de-datos-historia-mexico
locale: en
date: '2024-12-06'
summary: 'The term where real statistics began, with Probability I, and where databases stopped being tables and became a formal model. Also the term of Mexican history, from the viceroyalty to the Porfiriato.'
area: stats
semester: 'Fall 2024'
courses:
  [
    'Probability I',
    'Databases',
    'Advanced Data Structures',
    'Economics IV',
    'Socio-Political History of Mexico',
  ]
tags: ['probability', 'Bayes', 'SQL', 'normalization', 'ACID', 'Mexican history']
featured: true
---

Fourth term, and for the first time a course with the word "probability" in its name. Everything before was preparation for this.

## Probability I

Kolmogorov's axioms, sigma-algebras, conditional probability and **Bayes' theorem**, random variables, expectation, variance, moments, the moment-generating function, and the Markov, Chebyshev and Jensen inequalities. Then the catalogue of parametric families: binomial, Poisson, geometric, normal, gamma, beta, Pareto. All of it with simulation in R.

Two things rewired my head. First, that conditional probability is the fundamental operation of reasoning with data: every time you learn something, you update. Second, that Chebyshev's inequality gives you a bound without knowing anything about the distribution; it is the kind of result that makes statistics possible in the real world, where you never know the distribution.

The texts were Blitzstein and Hwang, Ross, and Casella and Berger, which reappears in every statistics course until the end of the degree.

## Databases

Relational algebra, functional dependencies and **normalization**, advanced SQL, stored procedures, transactions and the **ACID** properties, concurrency control, replication, and an introduction to OLAP, data warehouses and ETL. It is the course I use most directly at work: designing a table, deciding to denormalize for reads, the idea that a warehouse has layers a transactional database does not. When I write SQL in BigQuery today I am applying this term.

## Advanced Data Structures

Balanced trees, hash tables, heaps, graph algorithms (breadth- and depth-first search, shortest paths), amortized analysis. The lesson was that the right structure turns a hard problem into a trivial one, and the wrong one does the opposite.

## Economics IV

Economic growth, growth accounting, total factor productivity, and financial crises. Seeing Mexico's economic history through productivity prepared me, without my knowing it, for the history course of the same term.

## Socio-Political History of Mexico

From Europe and America in the fifteenth and sixteenth centuries to the Habsburg imperial order, independence, foreign interventions and the Porfiriato. The course aims to understand "the cohesion and the conflicts" of Mexican society and to make well-founded judgements. Studying the Porfiriato after Economics IV was reading two versions of the same period, one with figures and one with people.

## What I take with me

That Bayes and history are alike: both are about updating what you believe when new evidence arrives, and both fail when the evidence is chosen to confirm what you already believed.

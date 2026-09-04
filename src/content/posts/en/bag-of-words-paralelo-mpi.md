---
title: 'Lab log: a parallel Bag-of-Words with MPI and what measuring teaches'
key: bag-of-words-paralelo-mpi
locale: en
date: '2025-12-15'
summary: 'The Parallel Computing project: implement Bag-of-Words serially and in parallel with MPI in C++17, compare two ways of splitting documents across processes, and discover that intuition loses to the stopwatch.'
area: computing
semester: 'Fall 2025'
courses: ['Parallel and Cloud Computing']
tags: ['MPI', 'C++17', 'parallelism', 'partitioning', 'Docker', 'benchmark', 'projects']
featured: true
---

Bag-of-Words is the simplest text model there is: you count how many times each word appears in each document and get a huge, sparse matrix. It is trivial serially and, for that very reason, a good testbed for parallelism: the problem is easy to understand and all the difficulty lies in dividing the work.

## The design

Two implementations over the same counting code. The **serial** one processes documents one after another and serves as the baseline. The **MPI-parallel** one distributes documents across processes, each process builds its vocabulary and partial counts, and a final reduction unifies the global vocabulary and the matrices.

The interesting question was not "how do I parallelize" but **"how do I split"**. I tried two strategies:

- **Round-robin**: document _i_ goes to process _i mod p_. The simplest assignment and the first anyone thinks of.
- **Size-balanced**: documents are sorted by length and each goes to the process with the fewest accumulated bytes. Slightly more code, and it requires reading sizes before distributing.

## What the stopwatch measured

With similar documents the two strategies tie. As soon as the collection is skewed, with a few very long documents and many short ones, round-robin collapses: one process ends up carrying the giants while the others wait at the barrier, and total time is the slowest process's time. Balanced partitioning keeps processes busy almost to the end. The difference was not marginal; it was the one that separates "parallel" from "parallel in name only".

The lesson is not about MPI. It is that **load imbalance** is the silent enemy of every distributed system, and the only way to detect it is to measure per process, not just the total.

## Engineering around it

- **C++17** with the standard MPI API, no external dependencies.
- **Docker** so anyone can reproduce the experiment with the same compiler and MPI version; parallelism "on my machine" does not count.
- **Automated smoke tests** verifying that the parallel version produces exactly the same matrix as the serial one. Without that, a speedup may be a bug.
- Benchmark scripts that record per-process times, not just totals.

## What I take with me

That before optimizing you must instrument. That the obvious splitting strategy is the worst as soon as data stops being uniform, and real data is never uniform. And that this same problem, under another name, is the one I face when a partitioned warehouse table has one partition ten times larger than the rest.

---
title: 'Causal inference, MPI and the ethics of deciding with data'
key: inferencia-causal-mpi-etica
locale: en
date: '2026-06-05'
summary: 'Linear Methods and Causal Inference gave rigour to the question of whether X causes Y; Parallel Computing had me write an MPI Bag-of-Words in C++; Artificial Intelligence opened the box of agents; and the ethics seminar reminded me that data belongs to people.'
area: stats
semester: 'Spring 2026'
courses:
  [
    'Linear Methods',
    'Causal Inference',
    'Artificial Intelligence',
    'Parallel and Cloud Computing',
    'Seminar on Legality and Ethics in Data Science',
    'Topics in Business II',
  ]
tags:
  [
    'regression',
    'generalized linear models',
    'causal inference',
    'difference in differences',
    'instrumental variables',
    'MPI',
    'C++',
    'data ethics',
    'privacy',
  ]
featured: true
---

Seventh term, already working part-time in data. It was the densest term and the one that most connected school with work.

## Linear Methods

Simple and multiple regression by least squares and by maximum likelihood, the general linear hypothesis, multicollinearity, heteroscedasticity and autocorrelation, generalized least squares, variable selection and **generalized linear models**: logistic, Poisson, deviance. All in R. The regression that in the second term was a projection now came with assumptions, diagnostics and everything that can go wrong.

## Causal Inference

The course that most changed how I read an analysis. "Correlation is not causation" is easy to say; the question is what _is_ causation and how it is estimated. Potential outcomes, randomization, **difference in differences**, **instrumental variables**, regression discontinuity, matching. Every method has an unverifiable assumption that must be defended with arguments, not with data. Since then, when someone shows me a dashboard with a drop and a cause, my first question is what the counterfactual would be.

## Parallel and Cloud Computing

Shared and distributed memory, MPI, partitioning patterns, containers. The project was implementing a **serial and MPI-parallel Bag-of-Words in C++17**, comparing round-robin partitioning against size-balanced partitioning. The practical lesson: balancing by size wins as soon as documents are skewed, and measuring always beats assuming. The code is on my GitHub.

## Artificial Intelligence

Informed search, agents, probabilistic reasoning, and an introduction to deep learning. The course repository is public too. It was interesting to take it while using coding assistants at work: the course gives you the vocabulary to understand what they do and what they do not.

## Seminar on Legality and Ethics in Data Science

Privacy, personal data and Mexican law, algorithmic bias and fairness, accountability. After three years of optimizing, a whole course devoted to asking whether one should. It connects directly with General Studies: Plato's question about justice returns, now with a dataset in front of you.

## Business II

A business case from start to finish with data: define the question, obtain the data, model, communicate. Training for what comes next.

## What I take with me

That causality is defended with arguments, that parallelism is defended with measurements, and that ethics is not a module at the end of the course but the reason the course exists.

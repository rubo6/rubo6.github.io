---
title: 'Maximum likelihood, bias-variance and the first job'
key: estadistica-matematica-aprendizaje-de-maquina
locale: en
date: '2025-12-05'
summary: 'Mathematical Statistics and Machine Learning in the same term are the best pairing in the curriculum: one tells you why an estimator works and the other what happens when you let it loose on data. In November I started working in data at Mercado Pago Point.'
area: datascience
semester: 'Fall 2025'
courses:
  [
    'Mathematical Statistics',
    'Machine Learning',
    'Information Visualization',
    'Topics in Public Policy I',
    'Topics in Business I',
  ]
tags:
  [
    'maximum likelihood',
    'Cramér-Rao',
    'Neyman-Pearson',
    'bias-variance',
    'trees',
    'regularization',
    'visualization',
    'BigQuery',
  ]
featured: true
---

The sixth term had two courses that, together, define the degree, and one life change: on 3 November I started as a Data Engineer at Mercado Pago Point.

## Mathematical Statistics

Likelihood, sufficiency and the factorization theorem, the exponential family, method-of-moments and **maximum likelihood** estimators with the invariance property, bias, mean squared error, consistency, the **Cramér-Rao** bound, Rao-Blackwell and Lehmann-Scheffé, confidence intervals via pivotal quantities, Bonferroni, the **Neyman-Pearson** lemma, the generalized likelihood ratio, p-values and chi-square goodness of fit.

It is the course that answers the question Probability I and II left open: given data, how do I decide which model generated it and how sure can I be? Cramér-Rao impressed me in particular: there is a mathematical limit to how well something can be estimated from a given amount of data, and no algorithm will break it.

## Machine Learning

Training, validation and test sets; the **bias-variance trade-off**; k-nearest neighbours, logistic regression, cross-validation, **ridge and lasso regularization**, decision trees, bagging, random forests, boosting, support vector machines, and an introduction to neural networks and backpropagation. The references were ISLR and The Elements of Statistical Learning.

The value of taking this alongside Mathematical Statistics is that every technique came with an explanation. Lasso is not a trick: it is maximum likelihood with a penalty equivalent to a prior. Random forests are not magic: they are variance reduction by averaging, the same law of large numbers from the previous term.

## Information Visualization

Principles of perception, visual encodings, choosing the chart for the question, and the responsibility of not lying with an axis. Since 2024 the course is tied to the written-communication seminar, so every chart came with text explaining it. It was the term I understood that a visualization is an argument.

## Public Policy I and Business I

The "topics" courses are applied courses with data: in one, evaluating a public intervention; in the other, a business problem with real data. They are the dress rehearsal for Applied Data Science.

## Starting work

In November I joined the data team at Mercado Pago Point. In the first week I understood what the database courses were for: modelling tables in BigQuery, thinking in layers, validating consistency across sources. In the second I understood what Mathematical Statistics was for: at work, nobody hands you the distribution.

## What I take with me

That a model you cannot explain is a liability, not an asset. And that school and work, when they align, accelerate each other.

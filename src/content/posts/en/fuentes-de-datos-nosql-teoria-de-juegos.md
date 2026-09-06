---
title: 'APIs, JSON, the central limit theorem and auctions'
key: fuentes-de-datos-nosql-teoria-de-juegos
locale: en
date: '2025-06-06'
summary: 'Data Sources and Non-Relational Databases had me extracting and structuring real-world data; Probability II closed with the law of large numbers and the central limit theorem; Market Design taught me to think in incentives.'
area: computing
semester: 'Spring 2025'
courses:
  [
    'Data Sources',
    'Non-Relational Databases',
    'Probability II',
    'Market Design',
    'Problems of Contemporary Mexico',
  ]
tags:
  [
    'APIs',
    'web scraping',
    'JSON',
    'NoSQL',
    'MongoDB',
    'central limit theorem',
    'game theory',
    'auctions',
  ]
---

Fifth term: the point where the degree stops being only theory and starts touching real, dirty data that belongs to someone.

## Data Sources

APIs, web scraping, formats (CSV, JSON, XML, Parquet), data quality and the questions nobody asks you in a mathematics course: where does this datum come from, who generated it, how much can I trust it, do I have permission to use it? The course repository is still public on my GitHub. It was the first course in which the work resembled a job.

## Non-Relational Databases

Documents, graphs, flexible schemas, JSON as a data model, eventual consistency, and the underlying question: when to leave the relational model and when not to. We worked with MongoDB and with Cassandra's logic. Months later, building on Firestore at work, this course was the difference between seeing a document as "a JSON" and seeing it as a design decision with consequences for reads, writes and cost.

## Probability II

Random vectors, marginal and conditional distributions, covariance and correlation, the characteristic function, the multivariate normal, transformations, the t, chi-square and F distributions, order statistics, and the theorems that hold all inference together: convergence in probability and in distribution, the weak and strong **laws of large numbers**, and the **central limit theorem**.

The CLT is the most important result I have learned in the degree. It says the average of many independent things is normally distributed no matter how the things themselves are distributed. It is why statistics works on real-world data, and it is why a confidence interval means anything.

## Market Design

Expected utility and risk aversion, games in strategic and extensive form, Nash equilibrium, signalling, adverse selection, moral hazard, and **auctions**: the four classic formats and the revenue equivalence theorem. It is economics, but it feels like engineering: you design the rules so the outcome is the one you want even though every participant acts on their own. Working in payments later gave the word "incentive" a very concrete context.

## Problems of Contemporary Mexico

From the Revolution to stabilizing development, Mexico in the bipolar world, social transformations, proposals and horizons. It is the natural continuation of Socio-Political History, but about the century that still defines us. The dialogue format works better here than anywhere else, because everyone arrives with an opinion and leaves with a better-founded one.

## What I take with me

That a datum has an origin, a format, a permission and a bias before it has value. And that the central limit theorem is the closest thing to a miracle I know.

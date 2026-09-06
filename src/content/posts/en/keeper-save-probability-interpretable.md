---
title: '577 World Cup shots and a model you can explain'
key: keeper-save-probability-interpretable
locale: en
date: '2025-05-30'
summary: 'Keeper Save Probability: a prototype to estimate the chance a goalkeeper makes the save, built with logistic regression, Monte Carlo uncertainty and a grid search over positions. Why I chose the simplest model on purpose.'
area: datascience
semester: 'Spring 2025'
courses: ['Probability II', 'Market Design']
tags:
  [
    'logistic regression',
    'Monte Carlo',
    'entropy',
    'interpretability',
    'football',
    'scikit-learn',
    'projects',
  ]
featured: true
---

The 2022 World Cup left a public dataset of shots on target with coordinates, body part, type of play and whether the keeper saved. I wanted to answer a question that sounds simple: given a shot, what is the probability the keeper stops it, and where should the keeper be waiting?

## Why logistic regression

With 577 labelled shots, a complex model learns the noise. But the main reason was another: I wanted a model whose coefficients I could read. Logistic regression tells you, for each variable, how much it changes the log-odds of a save: distance, angle, foot or head, set piece. A coach can argue with that; with a neural network, they cannot.

That decision connects with what I was learning in Probability II: logistic regression is not a machine-learning recipe but a generalized linear model with a link function, and its coefficients are estimators with variance.

## Honest uncertainty with Monte Carlo

A point probability misleads. With small samples, the difference between 62 % and 68 % may be noise. I used **Monte Carlo** over the model parameters to obtain, for each shot, not a number but a distribution of save probabilities, and reported bands instead of single values. Watching the bands widen in the areas of the pitch with few shots was the project's best statistics lesson.

## Entropy and the grid search

The second question was positioning. I defined a grid of possible keeper positions and, for each shot, evaluated the save probability depending on where the keeper stood. Then I used the **entropy** of the outcome distribution to identify the zones where the keeper's decision changes the result most, that is, where positioning genuinely matters, versus zones where the shot is almost a goal or almost a save whatever the keeper does.

The result is a map: for each shooting zone, a recommended position and a confidence level. It is not a system for a professional league; it is a prototype that turns a model into an actionable recommendation, which was the goal.

## What I take with me

That choosing the simplest model that answers the question is an engineering decision, not a lack of ambition. That reporting uncertainty is more honest and more useful than reporting a number. And that an analysis is finished when it produces a decision, not when it produces a metric.

---
title: Keeper Save Probability
key: keeper-save-probability
locale: en
nebula: research
summary: Interpretable goalkeeper save-probability prototype on 577 labeled World Cup 2022 shots.
role: Author
period: { start: '2025-01-15', end: '2025-05-30' }
stack: [Python, scikit-learn, NumPy, Matplotlib]
highlights:
  - 577 labeled shots from the 2022 World Cup
  - Logistic regression chosen for interpretability
  - Monte Carlo uncertainty on predictions
  - Entropy and grid-search positioning analysis
featured: true
order: 30
---

A small sports-analytics study that favours explanation over accuracy: a logistic model whose coefficients can
be read, Monte Carlo bands around every probability, and a grid search over keeper positioning that turns the
model into an actual recommendation.

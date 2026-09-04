---
title: Probabilidade de defesa do goleiro
key: keeper-save-probability
locale: pt-br
nebula: research
summary: Protótipo interpretável de probabilidade de defesa sobre 577 chutes rotulados da Copa do Mundo 2022.
role: Autor
period: { start: '2025-01-15', end: '2025-05-30' }
stack: [Python, scikit-learn, NumPy, Matplotlib]
highlights:
  - 577 chutes rotulados da Copa do Mundo 2022
  - Regressão logística escolhida pela interpretabilidade
  - Incerteza Monte Carlo nas previsões
  - Análise de posicionamento com entropia e busca em grade
featured: true
order: 30
---

Um pequeno estudo de analytics esportivo que privilegia a explicação sobre a acurácia: um modelo logístico cujos
coeficientes podem ser lidos, faixas Monte Carlo em torno de cada probabilidade e uma busca em grade sobre o
posicionamento do goleiro que transforma o modelo em uma recomendação concreta.

---
title: Probabilidad de atajada del portero
key: keeper-save-probability
locale: es
nebula: research
summary: Prototipo interpretable de probabilidad de atajada sobre 577 tiros etiquetados del Mundial 2022.
role: Autor
period: { start: '2025-01-15', end: '2025-05-30' }
stack: [Python, scikit-learn, NumPy, Matplotlib]
highlights:
  - 577 tiros etiquetados del Mundial 2022
  - Regresión logística elegida por interpretabilidad
  - Incertidumbre Monte Carlo sobre las predicciones
  - Análisis de posicionamiento con entropía y búsqueda en malla
featured: true
order: 30
---

Un estudio pequeño de analítica deportiva que privilegia la explicación sobre la exactitud: un modelo logístico
cuyos coeficientes se pueden leer, bandas Monte Carlo alrededor de cada probabilidad y una búsqueda en malla
sobre el posicionamiento del portero que convierte el modelo en una recomendación concreta.

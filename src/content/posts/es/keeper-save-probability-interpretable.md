---
title: '577 tiros del Mundial y un modelo que se puede explicar'
key: keeper-save-probability-interpretable
locale: es
date: '2025-05-30'
summary: 'Keeper Save Probability: un prototipo para estimar la probabilidad de que un portero ataje, hecho con regresión logística, incertidumbre Monte Carlo y una búsqueda en malla de posiciones. Por qué elegí el modelo más simple a propósito.'
area: datascience
semester: 'Primavera 2025'
courses: ['Cálculo de Probabilidades II', 'Diseño de Mercados']
tags:
  [
    'regresión logística',
    'Monte Carlo',
    'entropía',
    'interpretabilidad',
    'fútbol',
    'scikit-learn',
    'proyectos',
  ]
featured: true
---

El Mundial de 2022 dejó un dataset público de tiros a puerta con coordenadas, cuerpo con el que se pateó, tipo de jugada y si el portero atajó. Yo quería responder una pregunta que suena simple: dado un tiro, ¿cuál es la probabilidad de que el portero lo detenga, y desde dónde le conviene esperar?

## Por qué regresión logística

Con 577 tiros etiquetados, un modelo complejo se aprende el ruido. Pero la razón principal fue otra: quería un modelo cuyos coeficientes pudiera leer. La regresión logística te dice, para cada variable, cuánto cambia el logaritmo de las probabilidades de atajar: distancia, ángulo, pie o cabeza, jugada a balón parado. Un entrenador puede discutir con eso; con una red neuronal, no.

Esa decisión conecta con lo que estaba aprendiendo en Probabilidad II: la logística no es una receta de aprendizaje de máquina sino un modelo lineal generalizado con una función de enlace, y sus coeficientes son estimadores con varianza.

## Incertidumbre honesta con Monte Carlo

Una probabilidad puntual engaña. Con muestras pequeñas, la diferencia entre 62 % y 68 % puede ser ruido. Usé **Monte Carlo** sobre los parámetros del modelo para obtener, para cada tiro, no un número sino una distribución de probabilidades de atajada, y reporté bandas en lugar de valores únicos. Ver las bandas ensancharse en las zonas del campo con pocos tiros fue la mejor lección de estadística del proyecto.

## Entropía y la búsqueda en malla

La segunda pregunta era la del posicionamiento. Definí una malla de posiciones posibles del portero y, para cada tiro, evalué la probabilidad de atajada según dónde estuviera. Después usé la **entropía** de la distribución de resultados para identificar las zonas donde la decisión del portero cambia más el resultado, es decir, donde posicionarse bien importa de verdad, frente a las zonas donde el tiro es casi gol o casi atajada sin importar qué haga.

El resultado es un mapa: para cada zona de tiro, una posición recomendada y un grado de confianza. No es un sistema para la Liga MX; es un prototipo que convierte un modelo en una recomendación accionable, que era el objetivo.

## Lo que me llevo

Que elegir el modelo más simple que responde la pregunta es una decisión de ingeniería, no una falta de ambición. Que reportar incertidumbre es más honesto y más útil que reportar un número. Y que un análisis termina cuando produce una decisión, no cuando produce una métrica.

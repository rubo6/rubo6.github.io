---
title: 'Máxima verosimilitud, sesgo-varianza y el primer trabajo'
key: estadistica-matematica-aprendizaje-de-maquina
locale: es
date: '2025-12-05'
summary: 'Estadística Matemática y Aprendizaje de Máquina en el mismo semestre son la mejor combinación del plan: una te dice por qué funciona un estimador y la otra qué pasa cuando lo sueltas sobre datos. En noviembre empecé a trabajar en datos en Mercado Pago Point.'
area: datascience
semester: 'Otoño 2025'
courses:
  [
    'Estadística Matemática',
    'Aprendizaje de Máquina',
    'Visualización de Información',
    'Tópicos de Políticas Públicas I',
    'Tópicos de Negocios I',
  ]
tags:
  [
    'máxima verosimilitud',
    'Cramér-Rao',
    'Neyman-Pearson',
    'sesgo-varianza',
    'árboles',
    'regularización',
    'visualización',
    'BigQuery',
  ]
featured: true
---

El sexto semestre tuvo dos materias que, juntas, son la definición de la carrera, y un cambio de vida: el 3 de noviembre empecé como Data Engineer en Mercado Pago Point.

## Estadística Matemática

Verosimilitud, suficiencia y el teorema de factorización, familia exponencial, estimadores por momentos y por **máxima verosimilitud** con su propiedad de invarianza, sesgo, error cuadrático medio, consistencia, la cota de **Cramér-Rao**, Rao-Blackwell y Lehmann-Scheffé, intervalos de confianza por cantidad pivotal, corrección de Bonferroni, el lema de **Neyman-Pearson**, cociente de verosimilitudes generalizado, valor p y bondad de ajuste con chi cuadrada.

Es la materia que responde la pregunta que Probabilidad I y II dejaron abierta: si tengo datos, ¿cómo decido qué modelo los generó y qué tan seguro puedo estar? Cramér-Rao me impresionó especialmente: hay un límite matemático a qué tan bien se puede estimar algo con una cantidad de datos, y ningún algoritmo lo va a romper.

## Aprendizaje de Máquina

Entrenamiento, validación y prueba; el **dilema sesgo-varianza**; k vecinos más cercanos, regresión logística, validación cruzada, **regularización ridge y lasso**, árboles de decisión, bagging, bosques aleatorios, boosting, máquinas de soporte vectorial, y una introducción a redes neuronales y retropropagación. Los textos de referencia fueron ISLR y Elements of Statistical Learning.

Lo valioso de llevar esta materia junto con Estadística Matemática es que cada técnica tenía una explicación. Lasso no es un truco: es máxima verosimilitud con una penalización que equivale a una distribución a priori. Los bosques aleatorios no son magia: son reducción de varianza por promediado, la misma ley de los grandes números del semestre anterior.

## Visualización de Información

Principios de percepción, codificaciones visuales, elegir la gráfica según la pregunta, y la responsabilidad de no engañar con un eje. Desde 2024 la materia está ligada al seminario de comunicación escrita, así que cada gráfica venía con texto que la explicara. Fue el semestre en que entendí que una visualización es un argumento.

## Políticas Públicas I y Negocios I

Los "tópicos" son materias de aplicación con datos: en una, evaluar una intervención pública; en la otra, un problema de negocio con datos reales. Son el ensayo general de lo que después es Ciencia de Datos Aplicada.

## Empezar a trabajar

En noviembre empecé en el equipo de datos de Mercado Pago Point. La primera semana entendí para qué eran las materias de bases de datos: modelar tablas en BigQuery, pensar en capas, validar consistencia entre fuentes. Y la segunda entendí para qué era Estadística Matemática: en el trabajo nadie te da la distribución.

## Lo que me llevo

Que un modelo que no puedes explicar es una deuda, no un activo. Y que la escuela y el trabajo, cuando se alinean, se aceleran mutuamente.

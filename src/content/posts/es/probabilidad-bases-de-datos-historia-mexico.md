---
title: 'Cuarto semestre: sigma-álgebras, SQL y el Porfiriato'
key: probabilidad-bases-de-datos-historia-mexico
locale: es
date: '2024-12-06'
summary: 'El semestre en que empezó la estadística de verdad, con Cálculo de Probabilidades I, y en que las bases de datos dejaron de ser tablas para volverse un modelo formal. También el semestre de la historia de México, del virreinato al Porfiriato.'
area: stats
semester: 'Otoño 2024'
courses:
  [
    'Cálculo de Probabilidades I',
    'Bases de Datos',
    'Estructuras de Datos Avanzadas',
    'Economía IV',
    'Historia Socio-Política de México',
  ]
tags: ['probabilidad', 'Bayes', 'SQL', 'normalización', 'ACID', 'historia de México']
featured: true
---

Cuarto semestre, y por primera vez una materia con la palabra "probabilidad" en el nombre. Todo lo anterior fue preparación para esto.

## Cálculo de Probabilidades I

Axiomas de Kolmogorov, sigma-álgebras, probabilidad condicional y el **teorema de Bayes**, variables aleatorias, esperanza, varianza, momentos, función generadora de momentos, y las desigualdades de Markov, Chebyshev y Jensen. Después el catálogo de familias paramétricas: binomial, Poisson, geométrica, normal, gamma, beta, Pareto. Todo con simulación en R.

Dos cosas me cambiaron la cabeza. La primera, que la probabilidad condicional es la operación fundamental del razonamiento con datos: cada vez que aprendes algo, actualizas. La segunda, que la desigualdad de Chebyshev te da una cota sin saber nada de la distribución; es el tipo de resultado que hace que la estadística sea posible en el mundo real, donde nunca sabes la distribución.

Los textos eran Blitzstein y Hwang, Ross, y Casella y Berger, que reaparece en cada materia de estadística hasta el final de la carrera.

## Bases de Datos

Álgebra relacional, dependencias funcionales y **normalización**, SQL avanzado, procedimientos almacenados, transacciones y las propiedades **ACID**, control de concurrencia, replicación, y una introducción a OLAP, data warehouse y ETL. Es la materia que más directamente uso en el trabajo: el diseño de una tabla, la decisión de desnormalizar para lectura, la idea de que un warehouse tiene capas distintas a una base transaccional. Cuando hoy escribo SQL en BigQuery estoy aplicando este semestre.

## Estructuras de Datos Avanzadas

Árboles balanceados, tablas hash, montículos, algoritmos sobre grafos (búsqueda en anchura y profundidad, caminos mínimos), y análisis amortizado. La lección fue que la estructura correcta convierte un problema difícil en uno trivial, y la incorrecta hace lo contrario.

## Economía IV

Crecimiento económico, contabilidad del crecimiento, productividad total de los factores, y crisis financieras. Ver la historia económica de México a través de la productividad me preparó, sin saberlo, para la materia de historia del mismo semestre.

## Historia Socio-Política de México

De Europa y América en los siglos XV y XVI a la construcción del imperio de los Habsburgo, la independencia, las intervenciones extranjeras y el Porfiriato. El objetivo de la materia es entender "la cohesión y los conflictos" de la sociedad mexicana y poder emitir juicios fundados. Estudiar el Porfiriato después de Economía IV fue leer dos versiones del mismo periodo, una con cifras y otra con personas.

## Lo que me llevo

Que Bayes y la historia se parecen: los dos tratan de actualizar lo que crees cuando llega evidencia nueva, y los dos fallan cuando la evidencia se elige para confirmar lo que ya creías.

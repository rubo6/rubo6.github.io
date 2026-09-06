---
title: 'Inferencia causal, MPI y la ética de decidir con datos'
key: inferencia-causal-mpi-etica
locale: es
date: '2026-06-05'
summary: 'Métodos Lineales e Inferencia Causal dieron rigor a la pregunta de si X causa Y; Cómputo Paralelo me hizo escribir un Bag-of-Words con MPI en C++; Inteligencia Artificial abrió la caja de los agentes; y el seminario de ética recordó que los datos son de personas.'
area: stats
semester: 'Primavera 2026'
courses:
  [
    'Métodos Lineales',
    'Inferencia Causal',
    'Inteligencia Artificial',
    'Cómputo Paralelo y en la Nube',
    'Seminario de Legalidad y Ética en Ciencia de Datos',
    'Tópicos de Negocios II',
  ]
tags:
  [
    'regresión',
    'modelos lineales generalizados',
    'inferencia causal',
    'diferencias en diferencias',
    'variables instrumentales',
    'MPI',
    'C++',
    'ética de datos',
    'privacidad',
  ]
featured: true
---

Séptimo semestre, ya trabajando de tiempo parcial en datos. Fue el semestre más denso y el que más me conectó la escuela con el trabajo.

## Métodos Lineales

Regresión simple y múltiple por mínimos cuadrados y por máxima verosimilitud, la hipótesis lineal general, multicolinealidad, heterocedasticidad y autocorrelación, mínimos cuadrados generalizados, selección de variables y **modelos lineales generalizados**: logística, Poisson, devianza. Todo en R. La regresión que en segundo semestre era una proyección ahora venía con supuestos, diagnósticos y todo lo que puede salir mal.

## Inferencia Causal

La materia que más cambió cómo leo un análisis. Correlación no es causalidad se dice fácil; la pregunta es qué sí es causalidad y cómo se estima. Resultados potenciales, aleatorización, **diferencias en diferencias**, **variables instrumentales**, regresión discontinua, emparejamiento. Cada método tiene un supuesto no verificable que hay que defender con argumentos, no con datos. Desde entonces, cuando alguien me muestra un dashboard con una caída y una causa, mi primera pregunta es cuál sería el contrafactual.

## Cómputo Paralelo y en la Nube

Memoria compartida y distribuida, MPI, patrones de partición, contenedores. El proyecto fue implementar un **Bag-of-Words serial y paralelo con MPI en C++17**, comparando partición round-robin contra partición balanceada por tamaño de documento. La lección práctica: balancear por tamaño gana en cuanto los documentos se sesgan, y medir siempre le gana a suponer. El código está en mi GitHub.

## Inteligencia Artificial

Búsqueda informada, agentes, razonamiento probabilístico, y una introducción a aprendizaje profundo. El repositorio del curso también es público. Fue interesante llevarla mientras en el trabajo usaba asistentes de código: la materia da el vocabulario para entender qué hacen y qué no.

## Seminario de Legalidad y Ética en Ciencia de Datos

Privacidad, datos personales y la ley mexicana, sesgo y equidad algorítmica, responsabilidad. Después de tres años de optimizar, una materia entera dedicada a preguntar si se debería. Conecta directamente con Estudios Generales: la pregunta de Platón sobre lo justo vuelve, ahora con un dataset enfrente.

## Negocios II

Un caso de negocio de principio a fin con datos: definir la pregunta, conseguir los datos, modelar, comunicar. El entrenamiento para lo que sigue.

## Lo que me llevo

Que la causalidad se defiende con argumentos, que el paralelismo se defiende con mediciones, y que la ética no es un módulo al final del curso sino la razón por la que el curso existe.

---
title: 'Bitácora de laboratorio: un Bag-of-Words paralelo con MPI y lo que enseña medir'
key: bag-of-words-paralelo-mpi
locale: es
date: '2025-12-15'
summary: 'El proyecto de Cómputo Paralelo: implementar Bag-of-Words en serie y en paralelo con MPI en C++17, comparar dos formas de repartir documentos entre procesos y descubrir que la intuición pierde contra el cronómetro.'
area: computing
semester: 'Otoño 2025'
courses: ['Cómputo Paralelo y en la Nube']
tags: ['MPI', 'C++17', 'paralelismo', 'particionado', 'Docker', 'benchmark', 'proyectos']
featured: true
---

Bag-of-Words es el modelo más simple de texto que existe: cuentas cuántas veces aparece cada palabra en cada documento y obtienes una matriz enorme y dispersa. Es trivial en serie y, por eso mismo, un buen banco de pruebas para paralelismo: el problema es fácil de entender y toda la dificultad está en repartir el trabajo.

## El diseño

Dos implementaciones sobre el mismo código de conteo. La **serial** procesa los documentos uno tras otro y sirve de línea base. La **paralela con MPI** reparte los documentos entre procesos, cada proceso construye su vocabulario y sus conteos parciales, y al final se hace una reducción para unificar el vocabulario global y las matrices.

La pregunta interesante no era "cómo paralelizo" sino **"cómo reparto"**. Probé dos estrategias:

- **Round-robin**: el documento _i_ va al proceso _i mod p_. Es la asignación más simple y la primera que se le ocurre a cualquiera.
- **Balanceada por tamaño**: se ordenan los documentos por longitud y cada uno se asigna al proceso que lleva menos bytes acumulados. Es un poco más de código y requiere leer los tamaños antes de repartir.

## Lo que midió el cronómetro

Con documentos parecidos entre sí, las dos estrategias empatan. En cuanto la colección se sesga, con unos cuantos documentos muy largos y muchos cortos, round-robin se derrumba: un proceso termina cargando con los gigantes mientras los demás esperan en la barrera, y el tiempo total es el del más lento. La partición balanceada mantiene los procesos ocupados casi hasta el final. La diferencia no era marginal; era la que separa "paralelo" de "paralelo en el nombre".

La lección no es sobre MPI. Es que el **desbalance de carga** es el enemigo silencioso de todo sistema distribuido, y que la única forma de detectarlo es medir por proceso, no solo el total.

## Ingeniería alrededor

- **C++17** con la API estándar de MPI, sin dependencias externas.
- **Docker** para que cualquiera reproduzca el experimento con el mismo compilador y la misma versión de MPI; correr paralelismo "en mi máquina" no cuenta.
- **Pruebas de humo automatizadas** que verifican que la versión paralela produce exactamente la misma matriz que la serial. Sin eso, un speedup puede ser un bug.
- Scripts de benchmark que escriben tiempos por proceso, no solo el total.

## Lo que me llevo

Que antes de optimizar hay que instrumentar. Que la estrategia obvia de reparto es la peor en cuanto los datos dejan de ser uniformes, y los datos reales nunca son uniformes. Y que este mismo problema, con otro nombre, es el que enfrento cuando una tabla particionada en el warehouse tiene una partición diez veces más grande que las demás.

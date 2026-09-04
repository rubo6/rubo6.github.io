---
title: 'Por qué este sitio calcula el cielo real sobre la Ciudad de México'
key: por-que-mi-sitio-calcula-el-cielo
locale: es
date: '2026-09-03'
summary: 'El cielo del inicio no es una animación decorativa: es el cielo que hay sobre la Ciudad de México en el momento en que abres la página, calculado con tiempo sidéreo y un cambio de coordenadas. Aquí está la matemática, y por qué la carrera la hizo fácil.'
area: astronomy
tags:
  ['astronomía', 'tiempo sidéreo', 'coordenadas', 'trigonometría esférica', 'TypeScript', 'pruebas']
featured: true
---

La astronomía es mi afición principal, y cuando rediseñé este sitio quise que el cielo del inicio fuera verdadero. No una textura de estrellas al azar, sino las estrellas que están arriba de la Ciudad de México ahora mismo. Resultó ser un ejercicio de segundo semestre disfrazado de proyecto.

## El problema

Un catálogo de estrellas te da cada estrella en coordenadas ecuatoriales: ascensión recta y declinación, que son como la longitud y la latitud pero pegadas al cielo, no a la Tierra. Para dibujarlas en pantalla necesito coordenadas horizontales: altura sobre el horizonte y acimut, que dependen de dónde estás y de qué hora es. La Tierra gira, así que la conversión cambia cada segundo.

## Paso uno: la hora del cielo

La hora que importa no es la civil sino el **tiempo sidéreo**: el ángulo que ha girado la Tierra respecto a las estrellas. Se calcula a partir de la fecha juliana con un polinomio en siglos julianos desde el año 2000 y se corrige con la longitud del observador. La fórmula es de Jean Meeus, _Astronomical Algorithms_, y la programé en TypeScript en menos de veinte líneas.

## Paso dos: el cambio de coordenadas

Con el tiempo sidéreo local y la ascensión recta se obtiene el ángulo horario de cada estrella. Después es trigonometría esférica: el seno de la altura es una suma de productos de senos y cosenos de declinación, latitud y ángulo horario. El acimut sale de una arcotangente de dos argumentos. Es literalmente Geometría Vectorial y Cálculo III: rotaciones y cambios de base.

## Paso tres: proyectar a la pantalla

Uso una **proyección estereográfica centrada en el cenit**: el cielo es un domo y lo aplano como un mapa polar, con el norte arriba y el este a la izquierda, que es como se ve cuando miras hacia arriba. El radio de cada estrella depende de su magnitud, en escala logarítmica, y el titileo se genera con una función hash determinista del nombre, no con números aleatorios, para que la misma estrella titile siempre igual.

## Paso cuatro: demostrar que está bien

Aquí es donde la carrera pesó. No quería "se ve bien"; quería pruebas. La librería tiene diecisiete pruebas unitarias que comparan contra ejemplos resueltos del libro de Meeus, contra la posición de Venus desde Washington una tarde de 1987, y contra lunas nuevas y llenas conocidas. Si cambio una fórmula y me equivoco, el build falla antes de llegar al sitio.

## Por qué importa

Porque es la misma disciplina que aplico a un pipeline de datos: una fórmula, un supuesto explícito, una prueba que lo verifique. El cielo del inicio es mi manera de decir que la astronomía no es solo lo que miro por el telescopio; es también cómo me gusta trabajar.

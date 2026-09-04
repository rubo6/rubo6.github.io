---
title: 'WhisperFlow: por qué construí un dictado por voz que no sale de mi máquina'
key: whisperflow-dictado-sin-nube
locale: es
date: '2026-09-04'
summary: 'Quería la comodidad del dictado en la nube sin regalar mi voz. WhisperFlow es el resultado: push-to-talk offline para Windows con dos motores de reconocimiento intercambiables, un orbe nativo y un modelo de amenazas escrito antes que el código.'
area: computing
semester: 'Verano 2026'
courses: ['Proyecto personal']
tags: ['WhisperFlow', 'reconocimiento de voz', 'ONNX', 'privacidad', 'Win32', 'Python', 'proyectos']
featured: true
---

Dicto mucho. Mensajes, notas, las respuestas con las que se construyó esta página. Las herramientas comerciales de dictado son excelentes y tienen un precio que no está en la suscripción: tu voz viaja a un servidor. Quise lo mismo sin ese viaje, y como no existía como yo lo quería, lo construí.

## Qué es

Mantienes una tecla, hablas, sueltas, y el texto aparece en la aplicación que tenías enfrente. Todo ocurre en la laptop: captura de audio a 16 kHz, reconocimiento de voz en el dispositivo, un postproceso pequeño (diccionario personal, snippets, espacios y mayúsculas) e inyección del texto por portapapeles o teclas sintéticas. Cero red en tiempo de ejecución, sin cuenta, sin telemetría. El audio y el texto viven en memoria y desaparecen al terminar.

## Las decisiones técnicas

**Dos motores intercambiables.** El default es Parakeet TDT 0.6B de NVIDIA en formato ONNX cuantizado, que en el CPU de una laptop corre a unas dos veces la velocidad del tiempo real; el respaldo automático es faster-whisper. Los medí con mi propia voz antes de decidir; el benchmark, no la fama del modelo, eligió.

**Un orbe nativo.** El indicador visual es una ventana Win32 por capas con transparencia por píxel, renderizada con NumPy, que reacciona al nivel de voz y nunca roba el foco. Descarté un WebView porque no da transparencia real y añade superficie de ataque.

**Un intérprete congelado.** El paquete lleva su propio Python 3.12 verificado por hash, para no depender del Python que tenga el equipo. Modelos y binarios se verifican por SHA-256 al arrancar.

**Modelo de amenazas primero.** Antes de la primera línea escribí qué no debía pasar nunca: que el audio se persista, que el texto dictado se registre en logs, que el texto dictado se ejecute como comando. Esos invariantes viven en el esquema de configuración y los vigila el lint. La materia de Ingeniería de Pruebas del Bátiz y el seminario de ética del ITAM están, los dos, en esa lista.

## Lo que me llevo

Que la privacidad es una decisión de arquitectura, no una casilla de configuración. Que medir vence a suponer, también para elegir un modelo de voz. Y que construir tu propia herramienta te enseña más sobre el problema que usar la mejor del mercado. El código, la documentación y los modelos están publicados en mi GitHub.

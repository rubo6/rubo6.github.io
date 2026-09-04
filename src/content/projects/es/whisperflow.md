---
title: WhisperFlow — dictado por voz offline para Windows
key: whisperflow
locale: es
nebula: personal
summary: 'Dictado push-to-talk local, offline y privado para Windows 11 (ES/EN): atajo global, reconocimiento de voz en el dispositivo y texto insertado en la app con foco.'
role: Autor
period: { start: '2026-07-15', end: null }
stack: [Python 3.12, ONNX Runtime, Parakeet TDT, faster-whisper, Win32 API (ctypes), pytest, ruff]
highlights:
  - 'Cero red en runtime: sin cuenta, sin telemetría; audio y texto viven solo en RAM'
  - 'Dos motores de voz intercambiables con respaldo automático; el default corre ~2× más rápido que tiempo real en el CPU de una laptop'
  - 'Overlay nativo Win32 por capas ("orbe") con transparencia por píxel renderizado con NumPy'
  - 'Atajo push-to-talk y toggle, modo manos libres con detección local de actividad de voz'
  - 'Diccionario personal, snippets, auto-espaciado y mayúsculas que leen el texto antes del cursor'
  - 'Paquete portable con intérprete congelado, SBOM, inventario de licencias y verificación SHA-256 al arrancar'
  - 'Threat model documentado; el texto dictado jamás se ejecuta como comando, y el lint lo garantiza'
repo: rubo6/whisperflow
featured: true
order: 5
---

Quería la sensación de las herramientas de dictado en la nube sin enviar un solo byte de mi voz a ningún lado.
WhisperFlow es el resultado: mantienes una tecla, hablas, sueltas, y el texto aparece en la app que estabas usando.
Todo ocurre en la máquina: captura a 16 kHz, reconocimiento de voz local, un pipeline pequeño de postproceso e
inyección vía portapapeles o teclas sintéticas con una vista previa segura como respaldo.

La ingeniería de la que más me orgullezco es la parte aburrida: un threat model escrito, invariantes forzadas por
el esquema de configuración (el audio nunca se persiste, el texto dictado nunca se loguea), un runtime de Python
congelado para no depender del Python del equipo, verificación de integridad de modelos y binarios, y una suite de
pruebas alrededor de la máquina de estados que coordina el hilo del atajo, el callback de audio y el worker por
dictado.

Con esta herramienta dicté las respuestas que dieron forma a este sitio.

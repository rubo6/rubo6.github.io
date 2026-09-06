# Pendientes y roadmap

Única lista viva de lo que falta. Al cerrar un punto, bórralo de aquí (el historial queda en git). Última revisión: 2026-09-06.

## Lo que debe Rubo

- **Keeper Save Probability**: URL del repo (o hacerlo público) para enlazarlo en el proyecto. Es el único de los proyectos públicos sin repo; Parallel Bag-of-Words es de curso (`visibility: course`) y no se publica.
- **Proyecto final de IA** (modelo de probabilidad de gol con interfaz tipo juego, primavera 2026, distinto de Keeper): repos por enviar; entrará como proyecto `academic`.
- **Certificaciones**: nombre oficial, fecha y enlace de verificación de cada una al terminarla (DataCamp Data Engineer, AWS Academy, Anthropic; diploma Ibero en diciembre de 2026).
- **ECOBOX AI**: enlace público al paper (hoy solo se menciona "linked from my LinkedIn").
- **Steam**: URL del perfil público para el enlace personal (hoy solo aparece el usuario en texto).
- **Historial académico del ITAM**: para verificar materias y semestres antes de afinar `skills.via` y la bitácora. No se publica; solo sirve de fuente.
- **Foto real**: opcional. Si algún día quieres foto en vez de ilustración, se añade como medio en `Portrait.astro`; la foto de LinkedIn no se publica.

## Contenido

- Traducciones de la bitácora a PT-BR (hoy PT-BR cae a inglés) y locales tier-2 (UI + resúmenes). Se dejó para el final a petición de Rubo.
- Refrescar `now/*.json` cada pocas semanas (`updated`).
- Cuando todas las certificaciones estén ganadas, renombrar la nebulosa `upcoming` a "Certifications".

## Producto (ideas aprobadas o razonables, sin fecha)

- CV en PDF generado en CI con Playwright (`/cv` → `public/cv-<locale>.pdf`) para que el enlace de descarga sea estable.
- NASA APOD del día en build time (API key como secreto, cron diario ya existe).
- Página `/log` con navegación por semestre en la trayectoria (enlazar cada semestre a sus entradas).
- Auditoría de accesibilidad manual con lector de pantalla (NVDA) en el observatorio y el selector de nebulosas.

## Portafolio comprobable: proyectos que suman de verdad

Criterio: cada uno debe ser verificable por un tercero en cinco minutos (repo público con CI en verde, README con resultados, demo o datos reproducibles) y cubrir una palabra clave que el CV hoy no puede reclamar sin mentir.

1. **Pipeline analítico con datos abiertos de la CDMX** (Ecobici, afluencia del Metro, o datos de movilidad de SEMOVI): ingesta programada con GitHub Actions, modelado dimensional con **dbt Core** sobre **DuckDB** (gratis) o BigQuery sandbox, pruebas de datos, documentación de dbt publicada en Pages y un dashboard público en Looker Studio. Reproduce lo que haces en Rangers sin tocar datos confidenciales y añade dbt, orquestación y data quality al CV con evidencia.
2. **Keeper Save Probability publicado como paquete**: repo con `pyproject`, tests, modelo serializado, notebook de resultados y una demo en Streamlit Community Cloud. Convierte un trabajo de clase en algo que un entrevistador puede abrir.
3. **Clasificador de residuos con dataset público** (TrashNet o TACO), en la línea de ECOBOX pero reproducible: entrenamiento con PyTorch, model card, métricas por clase, export a ONNX y una demo web mínima. Da evidencia de computer vision y MLOps básico.
4. **Orquestación real**: el mismo pipeline de (1) o uno pequeño con **Airflow** o **Dagster** en Docker Compose, con DAG, sensores y alertas. Airflow es la palabra clave más pedida en vacantes de data engineering que hoy no aparece en tu CV.
5. **Análisis con BigQuery public datasets** (GitHub Archive, Stack Overflow, Wikipedia pageviews): consultas optimizadas con costo documentado (bytes procesados antes y después), particiones y clustering, resultados en un artículo en la bitácora. Enseña optimización de costos, algo que ya haces en MeLi y no puedes mostrar.
6. **WhisperFlow con benchmarks**: tabla de latencia y WER por motor y por CPU, publicada en el README con el script que la genera. Ya es tu mejor repo; los números lo hacen defendible.
7. **Contribuciones a open source** (Astro, sharp, faster-whisper, GoatCounter docs): dos o tres PRs aceptados pequeños. Son la prueba más barata y más creíble de trabajo en equipo con código ajeno.
8. **Certificación verificable de Google Cloud** (Associate Data Practitioner o Professional Data Engineer): badge en Credly enlazado desde `certifications.json`. Complementa BigQuery con un tercero que lo avala.
9. **Proyecto terminal del ITAM** planeado desde ahora como repo público con paper corto: elige un tema con datos abiertos para poder publicarlo entero.

Orden sugerido por retorno: 1, 4 (juntos), 2, 6, 5, 3, 7, 8, 9.

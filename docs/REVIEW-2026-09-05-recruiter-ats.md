# Revisión del sitio: reclutador global + ATS + redacción

Fecha: 2026-09-05. Alcance: todo el contenido público de rubo6.dev (hero, observatorio, trayectoria, habilidades, contacto, CV imprimible, bitácora, "Ahora") en inglés, con notas sobre el español. Nada de lo que sigue está aplicado: es la evaluación que pediste, con propuestas concretas para que decidas.

Resumen en una línea: el fondo es sólido y honesto, pero el sitio **sobre-titula el puesto**, **sobre-argumenta las escuelas** y **repite muletillas de redacción** que un lector experimentado asocia con texto generado. Las tres cosas se arreglan con recortes, no con más texto.

---

## A. Lente 1: reclutador de una empresa top global (criterios estrictos)

Lo que un recruiter de Google, Stripe, Spotify o McKinsey mira en 40 segundos: título actual, empresa, fechas, impacto cuantificado, señales de honestidad, y si algo "no cuadra". Después revisa consistencia entre CV, LinkedIn y sitio.

### A1. Inconsistencia de título (grave)

El mismo puesto aparece con cinco nombres:

| Dónde                        | Texto                                                             |
| ---------------------------- | ----------------------------------------------------------------- |
| Hero / CV headline           | "Data & Analytics Engineer · Data Science student at ITAM"        |
| Trayectoria (el puesto real) | "Junior Data Analyst · data & analytics engineering (contractor)" |
| JSON-LD `jobTitle`           | "Data Engineer / Analytics Engineer"                              |
| Proyecto pipelines           | "Data Engineer"                                                   |
| Proyecto plataforma interna  | "Data / Analytics Engineer"                                       |

Un recruiter estricto lo lee como inflación de título y lo verifica con un background check, donde la empresa responderá "Junior Data Analyst, contractor". Es la única cosa del sitio que puede costar una oferta. **Propuesta**: un solo string en todas partes, con el título real primero y el trabajo real después:

- EN: "Junior Data Analyst at Mercado Libre (analytics engineering for Mercado Pago Point) · B.S. Data Science, ITAM 2028"
- ES: "Analista de Datos Jr. en Mercado Libre (ingeniería analítica para Mercado Pago Point) · Lic. en Ciencia de Datos, ITAM 2028"
- `jobTitle` del JSON-LD: "Junior Data Analyst". Roles en los dos proyectos de MeLi: "Junior Data Analyst (data layer owner)".

El trabajo de ingeniería queda descrito en las viñetas, que es donde convence.

### A2. Fechas que no cuadran (grave, fácil)

Trayectoria: MeLi empieza el **3 de noviembre de 2025**. Los dos proyectos de MeLi dicen `start: 2025-10-01`. Cualquier verificación cruzada lo detecta. Corregir a `2025-11-03`.

### A3. Sobre-argumentación de las escuelas (medio)

ITAM tiene tres viñetas de rankings y el Bátiz cuatro (QS, COMIPEMS de cinco años, ENLACE 2012, el mejor puntaje del examen 2024 eligió el Bátiz…). A un lector de una empresa global le dice: "no confía en que su experiencia hable por sí sola". Además nadie fuera de México sabe qué es COMIPEMS, y los rankings de preparatoria no cuentan para un puesto de datos.

**Propuesta**: una sola línea por institución en el sitio, con las fuentes plegadas en `sources[]`; **cero rankings en el CV**. Conservar sólo lo que te describe a ti, no a la escuela: "Admitido con 118/128 en el examen de ingreso (corte ~105)" es un dato tuyo y se queda; "el mejor puntaje del país eligió el Bátiz" no es tuyo y se va.

### A4. Listas de temario como viñetas (medio)

La viñeta "Plan B coursework (official syllabi): Calculus I–III, Vector Geometry, …" tiene ~90 palabras y 35 materias. Lo mismo la del Bátiz con UML, SOAP/WSDL/UDDI, Kerberos, IPsec, PSP, CMMI, COCOMO, MoProSoft. Un recruiter no lo lee; un hiring manager sospecha relleno. Para ATS sí sirve (ver B), así que la solución es de formato: una línea "Relevant coursework:" con 8–10 materias elegidas para el puesto objetivo, y el resto en la constelación de habilidades (que ya tiene el `via`).

### A5. Afirmaciones sin número o difíciles de verificar (medio)

- "Agent productivity rose markedly" → o hay número o no hay adverbio. Como la métrica es confidencial: "adopted by the whole Mexico field team within its first month" (si es cierto) o simplemente "in daily use by the Mexico field team".
- "the only tool of its kind in the area" → es una afirmación sobre terceros. Cambiar a "the first self-service view agents had of their own portfolio".
- "millions of rows a day" → si puedes dar el orden de magnitud ("~N M rows/day") mejor; si no, "multi-million-row daily loads" es igual de vago pero suena menos a exageración.
- "earned formal recognition from leadership" → nombra el formato si es publicable ("a shout-out in the quarterly business review"); si no, quita "formal".

### A6. Habilidades: demasiadas y con autoevaluación visible (medio)

60+ estrellas con nivel 1–4. Las de nivel 1 (Neo4j) y varias de nivel 2 que sólo viste en un curso (OpenMP, MPI, Cassandra, Kerberos-adjacent, COCOMO) diluyen las de nivel 4. Los equipos top prefieren 15–25 habilidades que puedas defender en entrevista técnica. **Propuesta**: en el sitio conservar la constelación completa (es parte del concepto y tiene `via`), pero en el CV imprimir sólo nivel ≥ 3, y eliminar del sitio todo nivel 1.

### A7. Certificaciones "in progress" sin fecha (bajo)

Tres en curso, ninguna con fecha esperada; "Anthropic certification (in progress)" ni siquiera dice cuál. Un recruiter las descuenta a cero y le restan credibilidad a la que sí tienes (título técnico). **Propuesta**: nombre exacto + mes esperado, o fuera del CV hasta obtenerlas (pueden quedarse en "Ahora").

### A8. Faltan repos donde importa (bajo, depende de ti)

Keeper, Parallel Bag-of-Words y Production-style pipeline no tienen `repo`. Son justo los tres proyectos que un ingeniero senior abriría. Cuando mandes los repos (pendiente del cuestionario) suben mucho.

### A9. Lo que ya está bien

Contratista declarado, sin GPA, sin métricas de negocio, sin nombres de herramientas internas, proyectos internos marcados como confidenciales, ECOBOX contado con honestidad (modelo y paper, sin prototipo), la viñeta de asignación (doce pasos → un job, jornada completa → < 2 h) es exactamente el tipo de dato que quieren ver. Mentoría y rituales de negocio suman para nivel junior.

---

## B. Lente 2: filtro ATS (parser automático de CVs)

Lo que un ATS (Workday, Greenhouse, Lever, Taleo, SmartRecruiters) hace con tu PDF: extrae texto en orden de lectura, detecta secciones por encabezados estándar, parsea "puesto / empresa / fechas" por patrones, y puntúa por coincidencia de palabras clave con la vacante. El CV lo genera el navegador con "Print / save as PDF", así que todo lo que sigue es sobre `src/components/CvPage.astro`.

### B1. Dos columnas en la impresión (alto)

La sección `.two` (habilidades + certificaciones + idiomas) se imprime en dos columnas. Los parsers leen por líneas y mezclan las columnas ("Python · SQL Technical Degree in Programming"). En `@media print` forzar `grid-template-columns: 1fr`.

### B2. Separadores tipográficos dentro de campos clave (alto)

- Puesto: "Junior Data Analyst · data & analytics engineering (contractor)". El `·` no es un separador que el parser reconozca; el título queda como una cadena rara. Formato seguro: "Junior Data Analyst (Data & Analytics Engineering), Contractor".
- Empresa: "Mercado Libre · Mercado Pago Point". Mejor "Mercado Libre (Mercado Pago Point)". Los parsers sí entienden paréntesis.
- Habilidades: "Pandas · NumPy", "Sheets · Excel · Power BI", "TypeScript / JavaScript". La coincidencia de keywords suele ser por subcadena, así que funciona, pero es más seguro separar por comas en el CV impreso: "Pandas, NumPy".

### B3. Fechas (bien)

Verificado en el build: el CV imprime "Nov 2025 – present", mes y año, que es lo que los parsers necesitan para calcular antigüedad. Nada que cambiar.

### B4. Encabezados (bien)

"Summary", "Experience", "Education", "Leadership & activities", "Selected projects", "Technical skills", "Certifications", "Languages" son los nombres canónicos que los parsers buscan. Mantener. En español, "Experiencia", "Educación", "Habilidades" también son reconocidos.

### B5. Palabras clave (bien, con huecos honestos)

Presentes y bien colocadas: SQL, Python, BigQuery, ETL/ELT, data modeling, Looker Studio, pytest, Git, dashboards, data quality, pandas, scikit-learn, machine learning, Docker, Linux. Faltan las que las vacantes de data/analytics engineering piden y tú **no** puedes reclamar todavía: dbt, Airflow, Spark en producción, Kafka, Terraform. No inventarlas. Lo que sí puedes escribir sin mentir: "workflow orchestration (internal scheduler)", "dimensional modeling", "data validation / audits", "CI with GitHub Actions". Y añadir la palabra "ELT" y "data warehouse" tal cual, porque los filtros buscan la cadena exacta.

### B6. Datos de contacto (bien, una nota)

Correo, ciudad, país, GitHub y LinkedIn presentes en la cabecera. Sin teléfono por decisión tuya; algunos ATS lo marcan como campo vacío, pero no descarta. El PDF se llama como el `<title>` de la página ("Curriculum vitae · …"); conviene que el título del CV sea "Eduardo Ruben Bernal Puente - CV" para que el archivo se llame así al guardarlo.

### B7. Longitud (medio)

Con todo lo que hoy hay en trayectoria (rankings + temarios + 7 viñetas de MeLi + 3 de AIESEC × 2), el CV impreso pasa de dos páginas. Para un perfil con un empleo, el estándar es **una página**, dos como máximo. A1–A4 lo dejan en una y media.

---

## C. Redacción: por qué suena "auto-generado" y cómo dejar de sonarlo

No es que esté mal escrito; es que está escrito con las mismas quince herramientas en todas partes, y eso es lo que el ojo detecta. Patrones encontrados en el texto inglés (el español los hereda):

### C1. Muletillas repetidas

| Patrón                                         | Ejemplos                                                                                                                                 |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| "boring" como virtud                           | "A deliberately 'boring' pipeline", "The engineering I am proudest of is the boring part"                                                |
| "honest" como metáfora                         | "The pipelines that keep Point's analytics honest"                                                                                       |
| "The interesting part is not X but Y"          | Parallel Bag-of-Words                                                                                                                    |
| "not just how it works"                        | Production pipeline                                                                                                                      |
| Tríadas por reflejo                            | "pipelines, models and data products", "ingestion, cleaning, modelling", "operations, invoicing, payouts, cashback and measurement"      |
| "Same X, different Y"                          | "Same sky, different lens", "Same telescope, pointed at me"                                                                              |
| "X became Y" / "Y instead of Z" en cada viñeta | "twelve … steps … became one … job", "hand-run queries became five … dashboards", "in under two hours instead of a full working day"     |
| Adverbios de relleno                           | "markedly", "deliberately", "happily", "freshly"                                                                                         |
| Tagline genérico                               | "turn raw signals into decisions" (aparece en cientos de portafolios generados)                                                          |
| Rayas y puntos medios                          | 60+ `—` y `·` en el contenido; el `·` dentro de títulos de puesto y de habilidades                                                       |
| Viñeta-cajón                                   | La sexta viñeta de MeLi junta Python, pytest, Git, optimización de consultas, rituales y stakeholders en una sola frase con punto y coma |
| Títulos de bitácora en plantilla               | "First term: A, B and C", "Third term: …", … "Eighth term: …" (ocho veces la misma estructura)                                           |

### C2. Reglas que propongo adoptar (y dejar en la skill si las apruebas)

1. Una metáfora astronómica por sección, no por frase. El concepto ya está en el diseño; el texto puede ser literal.
2. Cero autoelogios indirectos ("boring", "honest", "the interesting part"). Di qué hiciste y qué cambió.
3. Máximo una tríada por párrafo. Dos elementos o cuatro rompen el ritmo de máquina.
4. Sin adverbios de grado. Si hay número, número; si no, frase sin adverbio.
5. Cada viñeta, una idea. Si necesitas punto y coma, son dos viñetas.
6. `·` sólo en UI (etiquetas, pies). En texto corrido, comas y paréntesis.
7. Variar el arranque de las viñetas: no todas con verbo en pasado ni todas con "Own".
8. Bitácora: títulos con un solo gancho concreto ("Sigma-algebras and the Porfiriato" en vez de "Fourth term: sigma-algebras, SQL and the Porfiriato").

### C3. Reescrituras propuestas (EN / ES), listas para aplicar si las apruebas

**Headline (hero y CV)**
EN: "Junior Data Analyst at Mercado Libre, doing analytics engineering for Mercado Pago Point. Data Science at ITAM, class of 2028."
ES: "Analista de Datos Jr. en Mercado Libre, con trabajo de ingeniería analítica para Mercado Pago Point. Ciencia de Datos en el ITAM, generación 2028."

**Tagline**
Actual: "I build the pipelines, models and data products that turn raw signals into decisions."
EN: "I keep a field sales channel's data correct, on time and usable by the people who run it."
ES: "Mantengo los datos de un canal de ventas en campo correctos, a tiempo y útiles para quien lo opera."

**Summary (CV)**
EN: "Data Science student at ITAM (graduating May 2028) working as a Junior Data Analyst at Mercado Libre since November 2025. I own the BigQuery data layer of Rangers, Mercado Pago Point's field-agent channel in Mexico: pipelines, data quality and the dashboards and internal tools built on top. Comfortable in SQL and Python in production, with tests and code review. Side work in machine learning and parallel computing at university."
ES: "Estudiante de Ciencia de Datos en el ITAM (titulación en mayo de 2028) y Analista de Datos Jr. en Mercado Libre desde noviembre de 2025. Soy responsable de la capa de datos en BigQuery de Rangers, el canal de agentes en campo de Mercado Pago Point en México: pipelines, calidad de datos, y los dashboards y herramientas internas que se construyen encima. Trabajo con SQL y Python en producción, con pruebas y revisión de código. En la universidad, proyectos de machine learning y cómputo paralelo."

**MeLi, resumen del puesto**
EN: "Acquisition team, Longtail area of Mercado Pago Point (small and mid-size merchants). Since January 2026 I am the data owner for Rangers in Mexico, the field-agent channel that launched here in September 2025. Remote, Spanish-speaking regional team."

**MeLi, viñeta 3 (plataforma)**
EN: "Built the internal web platform (Next.js, Firebase, BigQuery, Sheets) where field agents see their own portfolio for the first time. Live since June 2026 and in daily use by the Mexico team; presented at the quarterly business review." (ajusta la última frase a lo que sea publicable)

**MeLi, viñeta 6 (cajón) → dividir en dos**
EN: "Production Python (pandas, pyarrow, google-cloud-bigquery) with pytest, and Git with code review."
EN: "Weekly planning and one-to-ones with operations, invoicing, payouts, cashback and measurement stakeholders."

**Contact lead**
Actual: "Open to data engineering, analytics engineering and ML roles. The fastest channel is email."
EN: "Open to data and analytics engineering roles. Email gets the fastest reply."

**Production-style pipeline (cuerpo)**
Actual: "A deliberately 'boring' pipeline built the way production systems are built: every job can be re-run safely, every step is tested, and the documentation explains how to operate it, not just how it works."
EN: "A CSV ingestion pipeline built like the ones I would want to inherit: re-runnable jobs, a test per step, and a runbook that says what to do when something fails."

**Pipelines de Point (cuerpo)**
Actual: "The pipelines that keep Point's analytics honest: …"
EN: "Ingestion, modelling and validation in BigQuery, scheduled by an internal orchestrator. Idempotent daily snapshots partitioned in America/Mexico_City, audits before every load, and documentation that lets a teammate rerun any step."

**Observatory lead (personal)**
Actual: "Same telescope, pointed at me. Each nebula here is something I care about outside work. Pick one."
EN: "The informal half. Each nebula is something I do when I am not working. Pick one."

**Trayectoria, viñeta de ITAM sobre cursos**
EN: "Relevant coursework: Machine Learning, Artificial Intelligence, Databases and NoSQL, Parallel and Cloud Computing, Big Data Architecture, Data Mining, Bayesian Statistics, Causal Inference." (el resto queda en la constelación)

---

## D. Decisiones que necesito de ti

1. ¿Adoptamos el título único de A1 en hero, CV, JSON-LD y proyectos? Es el cambio con más impacto y el que menos te va a gustar.
2. Rankings de ITAM y Bátiz: ¿una línea por institución con fuentes plegadas (mi propuesta) o los conservas en el sitio y sólo los quito del CV?
3. Habilidades de nivel 1 y 2 sólo vistas en un curso: ¿las retiro del sitio, o sólo del CV?
4. Certificaciones en curso: nombre exacto y mes esperado de cada una, o las paso a "Ahora" hasta que existan.
5. Frase publicable sobre el reconocimiento de la plataforma (o la dejamos en "in daily use by the Mexico team").
6. Si apruebas las reglas de C2, las dejo en la skill como "voice rules" y aplico las reescrituras de C3 en los tres idiomas.

---

## E. Estado (2026-09-06): decisiones de Rubo y lo aplicado

Decisiones: título único (sí); rankings plegados sin perder texto (sí); todas las habilidades en el sitio, en el CV sólo nivel 3+ (sí); certificaciones se quedan genéricas hasta tener los certificados; la plataforma no puede enlazarse, pero sí publicar el promedio de suscripciones por agente (4 en enero 2026, 18 en junio, 27 en septiembre); reglas de voz aprobadas. Sobre las fechas de los proyectos de MeLi: el proyecto arrancó en octubre de 2025 y Rubo lo retomó al entrar en noviembre; los proyectos llevan ahora su fecha de entrada y el texto explica el origen.

Aplicado en EN/ES/PT-BR:

- A1 título único "Junior Data Analyst (Data & Analytics Engineering), Contractor" en trayectoria, JSON-LD (`jobTitle`, `worksFor`) y roles de los dos proyectos de MeLi; headline, tagline y summary del perfil reescritos (C3).
- A2 fechas de proyectos → 2025-11-03 con la aclaración del origen en octubre.
- A3/A4 nuevo campo `trajectory[].background`: rankings, selectividad, temarios completos y tronco científico plegados bajo "About the institution and full coursework"; en el CV no se imprimen. Viñetas cortas nuevas de "Relevant coursework" (ITAM) y "Programming track" (Bátiz).
- A5 números reales en la viñeta de la plataforma; sin "markedly", sin "the only tool of its kind", sin "formal recognition".
- A6 CV con habilidades de nivel ≥ 3; el sitio conserva todas.
- B1 impresión a una columna; B2 separadores: puesto y empresa con paréntesis, stack y habilidades con comas; B6 título de página "Eduardo Rubén Bernal Puente – CV". Keywords "data warehouse" y "ETL/ELT" en el summary.
- C2 reglas de voz en la skill (sección "Voice rules"); C3 reescrituras aplicadas; viñeta-cajón de MeLi dividida en dos; títulos de bitácora sin prefijo "Nth term:" / "Lab log:"; "boring", "honest", "the interesting part" y "happily" eliminados en los tres idiomas.

Pendiente de Rubo: URLs de los repos de Keeper Save Probability, Parallel Bag-of-Words y Production-style data pipeline (son proyectos tuyos de ITAM y personales, no de MeLi; si están privados en GitHub, con hacerlos públicos basta). Fechas de certificaciones cuando existan.

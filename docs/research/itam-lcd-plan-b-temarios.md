# Investigación — Temarios oficiales de la Licenciatura en Ciencia de Datos (ITAM), Plan B

Briefing producido por un agente de investigación el 2026-09-05. Sirve para derivar las hard skills de la carrera de Rubo (ingreso primavera 2023). Todo dato lleva su fuente; lo inferido se marca como "no confirmado".

## 0. Hallazgos previos importantes

1. El PDF de `carreras.itam.mx/.../plan-de-estudios-licenciatura-ciencia-de-datos.pdf` es la malla **nueva** de 8 semestres, sin claves; **no** es el Plan B.
2. La fuente oficial del Plan B es el boletín de Dirección Escolar: `https://escolar.itam.mx/licenciaturas/boletines/CDA-B.pdf` — "Licenciatura en Ciencia de Datos, Plan B, para alumnos que ingresan de primavera 2021 a primavera 2024". Trae claves, prerrequisitos, créditos, 9 semestres y optativas. Espejo: `horariositam.com/assets/boletines/CDA-B.pdf`.
3. Dónde viven los temarios oficiales por departamento (no hay catálogo central):
   - Computación (COM): `https://dac.itam.mx/sites/default/files/u438/<clave>_<nombre>.pdf` ("Formato 4 – Programas de Estudios"). Varios datan de 2009 (Java, LISP, Visual Basic .NET).
   - Estadística (EST): `https://estadistica.itam.mx/es/cursos-de-licenciatura` → PDFs `est-<clave><nombre>.pdf`, versión 2026, todos con R.
   - Matemáticas (MAT): `https://departamentodematematicas.itam.mx/es/temarios` (sección "Ciencia de Datos").
   - Estudios Generales (EGN): `https://generales.itam.mx/es/1/paginas/materias-0`.
   - Economía, Lenguas, Administración, Ciencia Política y Derecho: no publican temarios; solo fuentes secundarias (páginas de profesores, GitHub).
4. Calendario inferido de Rubo (no confirmado): 5.º sem = primavera 2025 (Fuentes de Datos `fdd_p25`, NoSQL), 6.º = otoño 2025 (Aprendizaje de Máquina, Estadística Matemática), 7.º = primavera 2026 (IA `ia_p26`, Cómputo Paralelo, Inferencia Causal), 8.º = otoño 2026 (en curso).

## 1. Materias del Plan B con fuente del temario

| Sem | Materia (clave)                                                | Depto.             | Fuente del temario                                                                                 | Confianza                                  |
| --- | -------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| 1   | Algoritmos y Programas (COM-11101)                             | Computación        | dac.itam.mx …/com-11101_algoritmos_y_programas_20090427.pdf                                        | oficial (2009)                             |
| 1   | Geometría Vectorial (MAT-14250)                                | Matemáticas        | departamentodematematicas.itam.mx …/temario_geometria_vectorial_uao25.pdf                          | oficial                                    |
| 1   | Cálculo Diferencial e Integral I (MAT-14100)                   | Matemáticas        | …/temariocalculodifint1primavera2022.pdf                                                           | oficial                                    |
| 1   | Estrategias de Comunicación Escrita (LEN-12701)                | Lenguas            | —                                                                                                  | no encontrada                              |
| 1   | Economía I (ECO-11101)                                         | Economía           | —                                                                                                  | no encontrada                              |
| 1   | Ideas e Instituciones Políticas y Sociales I (EGN-17121)       | Estudios Generales | generales.itam.mx/es/49/paginas/ideas-e-instituciones-politicas-y-sociales-i                       | oficial                                    |
| 2   | Pensamiento Matemático (MAT-14280)                             | Matemáticas        | …/temariopensamientomatematicomayo2019.pdf                                                         | oficial                                    |
| 2   | Álgebra Lineal I (MAT-14201)                                   | Matemáticas        | …/temario_algebra_lineal_1.pdf                                                                     | oficial                                    |
| 2   | Cálculo Diferencial e Integral II (MAT-14101)                  | Matemáticas        | …/temario_calculodifint2_otono2022.pdf                                                             | oficial                                    |
| 2   | Economía II (ECO-12102)                                        | Economía           | —                                                                                                  | no encontrada                              |
| 2   | Ideas e Instituciones Políticas y Sociales II (EGN-17122)      | Estudios Generales | generales.itam.mx …/ideas-e-instituciones-politicas-y-sociales-ii                                  | oficial                                    |
| 2   | Problemas de la Civilización Contemporánea I (EGN-17141)       | Estudios Generales | generales.itam.mx …/problemas-de-la-civilizacion-contemporanea-i                                   | oficial                                    |
| 3   | Estructuras de Datos (COM-11102)                               | Computación        | dac.itam.mx …/com-11102_estructuras_de_datos_para_ingenieria_20090925_04pm33.pdf                   | oficial (2009, Java)                       |
| 3   | Matemáticas Discretas (MAT-14281)                              | Matemáticas        | …/temariomatematicasdiscretas2019.pdf                                                              | oficial                                    |
| 3   | Cálculo Diferencial e Integral III (MAT-14102)                 | Matemáticas        | …/temariocalculodifint3primavera2022.pdf                                                           | oficial                                    |
| 3   | Economía III (ECO-11103)                                       | Economía           | —                                                                                                  | no encontrada                              |
| 3   | Ideas e Instituciones Políticas y Sociales III (EGN-17123)     | Estudios Generales | generales.itam.mx …/ideas-e-instituciones-politicas-y-sociales-iii                                 | oficial                                    |
| 3   | Seminario de Comunicación Escrita (LEN-12702)                  | Lenguas            | —                                                                                                  | no encontrada                              |
| 3   | Problemas de la Civilización Contemporánea II (EGN-17142)      | Estudios Generales | generales.itam.mx …/problemas-de-la-civilizacion-contemporanea-ii                                  | oficial                                    |
| 4   | Estructuras de Datos Avanzadas (COM-11112)                     | Computación        | dac.itam.mx …/com-11103_estructuras_de_datos_avanzadas_20090925_03pm56.pdf                         | oficial-equivalente                        |
| 4   | Bases de Datos (COM-12101)                                     | Computación        | dac.itam.mx …/com-12101_bases_de_datos.pdf                                                         | oficial (antiguo)                          |
| 4   | Cálculo de Probabilidades I (EST-24126)                        | Estadística        | estadistica.itam.mx …/est-24126calcprob1.pdf                                                       | oficial (2026)                             |
| 4   | Economía IV (ECO-11104)                                        | Economía           | mauricio-romero.com/courses/ecoiv.html                                                             | secundaria                                 |
| 4   | Historia Socio-Política de México (EGN-17161)                  | Estudios Generales | generales.itam.mx …/historia-socio-politica-de-mexico                                              | oficial                                    |
| 5   | Bases de Datos No Relacionales (COM-22102)                     | Computación        | dac.itam.mx …/com-22102_bases_de_datos_no_relacionales.pdf + github.com/Skalas/NoSQLClass          | oficial + secundaria                       |
| 5   | Fuentes de Datos (COM-12103)                                   | Computación        | github.com/sonder-art/fdd_p25 ; rayalucaria.org/fdd_o26/                                           | secundaria                                 |
| 5   | Cálculo de Probabilidades II (EST-24127)                       | Estadística        | estadistica.itam.mx …/est-24127calcprob2.pdf                                                       | oficial                                    |
| 5   | Diseño de Mercados (ECO-11227)                                 | Economía           | —                                                                                                  | no encontrada                              |
| 5   | Problemas de la Realidad Mexicana Contemporánea (EGN-17162)    | Estudios Generales | generales.itam.mx …/problemas-de-la-realidad-mexicana-contemporanea                                | oficial                                    |
| 6   | Visualización de Información (COM-12104)                       | Computación        | github.com/pptrrns/infoViz (R/Shiny); institucional: Tableau/Power BI                              | secundaria                                 |
| 6   | Estadística Matemática (EST-14103)                             | Estadística        | estadistica.itam.mx …/est-14103estmat.pdf                                                          | oficial                                    |
| 6   | Tópicos de Políticas Públicas I (CSO-16048)                    | Ciencia Política   | —                                                                                                  | no encontrada                              |
| 6   | Tópicos de Negocios I (ADM-12301)                              | Administración     | —                                                                                                  | no encontrada                              |
| 6   | Comunicación Escrita para Ciencia de Datos (LEN-12722)         | Lenguas            | —                                                                                                  | no encontrada                              |
| 6   | Aprendizaje de Máquina (COM-23701)                             | Computación        | dac.itam.mx …/com-23701_aprendizaje_de_maquina.pdf                                                 | oficial                                    |
| 7   | Inteligencia Artificial (COM-23101)                            | Computación        | dac.itam.mx …/com-23101_inteligencia_artificial_20090925_03pm56.pdf + github.com/sonder-art/ia_p26 | oficial (2009) + secundaria                |
| 7   | Métodos Lineales (EST-24124)                                   | Estadística        | estadistica.itam.mx …/est-24124metlineales.pdf                                                     | oficial                                    |
| 7   | Inferencia Causal (ECO-10521)                                  | Economía           | mauricio-romero.com/courses/microeconometria.html                                                  | secundaria (correspondencia no confirmada) |
| 7   | Tópicos de Negocios II (ADM-12302)                             | Administración     | —                                                                                                  | no encontrada                              |
| 7   | Seminario de Legalidad y Ética en Ciencia de Datos (DER-10114) | Derecho            | —                                                                                                  | no encontrada                              |
| 7   | Cómputo Paralelo y en la Nube (COM-15112)                      | Computación        | github.com/Palazrak/parallel_clustering, github.com/Palazrak/mpi_bag_of_words (primavera 2025)     | secundaria                                 |
| 8   | Arquitectura para Grandes Volúmenes de Datos (COM-23114)       | Computación        | github.com/sanchez-castro/arquitectura-producto-datos (2021)                                       | secundaria (equivalencia inferida)         |
| 8   | Minería y Análisis de Datos (COM-22108)                        | Computación        | dac.itam.mx …/com-23106_mineria_de_datos.pdf + nasaul.github.io/mineria_datos/ (2026)              | oficial-relacionada + secundaria           |
| 8   | Ciencia de Datos Aplicada I (COM-23115)                        | Computación        | —                                                                                                  | no encontrada                              |
| 8   | Métodos Multivariados (EST-24125)                              | Estadística        | estadistica.itam.mx …/est-24125metmultivariados.pdf                                                | oficial                                    |
| 8   | Tópicos de Políticas Públicas II (CSO-16049)                   | Ciencia Política   | —                                                                                                  | no encontrada                              |
| 9   | Ciencia de Datos Aplicada II (COM-23116)                       | Computación        | —                                                                                                  | no encontrada                              |
| 9   | Comunicación Profesional para Ciencia de Datos (LEN-12762)     | Lenguas            | —                                                                                                  | no encontrada                              |
| 9   | Estadística Bayesiana (EST-24112)                              | Estadística        | estadistica.itam.mx …/est-24112estbay.pdf                                                          | oficial                                    |
| 9   | Optativas I–III                                                | varios             | Boletín CDA-B                                                                                      | oficial (lista)                            |

## 2. Por materia: temas, herramientas, libro de texto

### Computación

- **Algoritmos y Programas (COM-11101)**, oficial 2009: resolución metódica de problemas; POO básica; selectivas/repetitivas; arreglos, `ArrayList`, genéricos, excepciones; archivos; búsqueda secuencial/binaria, ordenación; eventos y GUI. Herramientas: Alice + Java (repos de alumnos: Java 2019/2024, Python 2021; lenguaje actual no confirmado). Texto: Deitel, _Java How to Program_.
- **Estructuras de Datos (COM-11102)**, oficial 2009: TADs y UML; herencia y polimorfismo; serialización; pilas, colas, colas circulares; recursividad; listas ligadas; iteradores; `java.util`. Java. Texto: Weiss.
- **Estructuras de Datos Avanzadas (COM-11112 ≈ 11103)**: árboles binarios/BST/AVL, recorridos; archivos e índices, árboles B/B+/B*; gráficas, Dijkstra, Floyd, coloración, euleriano; tablas hash; análisis big-O (inserción, selección, quicksort). Repos añaden skip lists y heaps. Java. Texto: Cormen.
- **Bases de Datos (COM-12101)**: álgebra relacional; normalización; SQL avanzado, procedimientos almacenados, cursores, triggers; multicapa y ORM; transacciones, concurrencia, ACID; distribuidas y replicación; federadas y control de acceso; OLAP/Data Warehouse, ETL, datamarts. Texto: Elmasri & Navathe.
- **Bases de Datos No Relacionales (COM-22102)**: oficial: XML/XPath/XQuery; NoSQL; distribuidas; Big Data y Hadoop (HDFS, MapReduce); nube; en memoria. Actual (prof. Escalante): MongoDB, Cassandra, Neo4j, data lakes, Spark; Docker, Python, Git/GitHub; proyecto en equipo. Textos: _Seven Databases in Seven Weeks_; White, _Hadoop_; _Learning Spark_.
- **Fuentes de Datos (COM-12103)**, secundaria (prof. Mario Vázquez Corte): pipelines ETL/ELT, EDA; arquitectura de cómputo; open source y Linux; terminal y Bash; expresiones regulares (grep, awk); Git y GitHub; web scraping (Selenium), APIs, Kaggle, linting. Python/Jupyter, Bash, Docker.
- **Visualización de Información (COM-12104)**, secundaria: R/RMarkdown/Shiny (proyecto de alumno); institucional: Tableau y Power BI.
- **Aprendizaje de Máquina (COM-23701)**, oficial: supervisado (regresión lineal y logística, LOWESS, perceptrón y multicapa/backpropagation, gradiente conjugado, regularización y GLM, Bayes, EM, redes neuronales, SVM/kernels/SMO, k-NN, CART); teoría del aprendizaje (sesgo-varianza, VC, PAC, Chernoff); no supervisado (a-priori, SOM, k-means, jerárquico); reducción (PCA, ICA, factores). Proyecto final 30 %. Textos: Hastie/Tibshirani/Friedman; Bishop.
- **Inteligencia Artificial (COM-23101)**: oficial 2009: agentes, LISP, búsqueda (DFS, BFS, A*), MINIMAX/alfa-beta, representación del conocimiento, sistemas basados en conocimiento; repos: Prolog. Actual (ia_p26): Python/Jupyter, simulador sobre grafos, torneos de Hex, Wordle y Axelrod; filosofía de la IA, computabilidad, complejidad. Texto: Russell & Norvig.
- **Cómputo Paralelo y en la Nube (COM-15112)**, secundaria: k-means paralelo con OpenMP, bag-of-words con MPI, speed-up ≥ 1.5×; C++ con OpenMP; WSL2/Ubuntu. Componente nube no documentado.
- **Arquitectura para Grandes Volúmenes de Datos (COM-23114)**, secundaria: infraestructura moderna y nube; APIs; object storage y data lakes; ETL, data warehousing y ELT (BigQuery); ML en la nube; orquestación/MLOps/CI-CD (Airflow, Kubeflow); Looker; estrategia de datos. GCP, Vertex AI, Docker, SageMaker.
- **Minería y Análisis de Datos (COM-22108)**: oficial relacionada: KDD, limpieza, DWH/OLAP; ID3/C4.5, redes, Bayes, EM, k-NN, clustering. Actual (2026, Saúl Caballero): CRISP-DM, EDA, ingeniería de variables; métricas y evaluación financiera; árboles, bagging, boosting, redes; elasticidades; detección de anomalías. Python (_ISLP_).
- **Ciencia de Datos Aplicada I/II**: sin temario (proyecto integrador según prerrequisitos; inferido).

### Estadística (oficiales 2026, todas con R)

- **Cálculo de Probabilidades I (EST-24126)**: axiomas, condicional, Bayes; v.a. discretas/continuas; momentos, fgm, Markov/Chebyshev/Jensen; familias paramétricas. Simulación en R. Texto: Blitzstein & Hwang.
- **Cálculo de Probabilidades II (EST-24127)**: vectores aleatorios, covarianza, normal multivariada, mezclas; transformaciones, t/χ²/F, estadísticas de orden; convergencias, LGN y TLC. Texto: Casella & Berger.
- **Estadística Matemática (EST-14103)**: verosimilitud, suficiencia, familia exponencial; momentos/MCO/máxima verosimilitud, Cramér-Rao, Rao-Blackwell; intervalos; pruebas de hipótesis, Neyman-Pearson, cociente de verosimilitudes, bondad de ajuste. Textos: Casella & Berger; Rice.
- **Métodos Lineales (EST-24124)**: regresión simple y múltiple (MCO/MV, diagnóstico, multicolinealidad, heterocedasticidad, autocorrelación, MCG, selección); GLM: devianza, logística y Poisson. Texto: Agresti.
- **Métodos Multivariados (EST-24125)**: EDA multivariado; normal multivariada; PCA, factores, correlación canónica; discriminante, MDS, correspondencias; tablas de contingencia, GLM. Texto: Johnson & Wichern.
- **Estadística Bayesiana (EST-24112)**: teoría de la decisión, utilidad esperada; probabilidad subjetiva, a prioris no informativas, Jeffreys; familias conjugadas. Textos: Gelman; Bernardo & Smith.

### Matemáticas (oficiales)

- **Geometría Vectorial**: vectores, productos, rectas y planos, matrices y determinantes, transformaciones, cónicas, paramétricas, polares.
- **Cálculo I–III**: límites, derivadas, optimización, Riemann; técnicas de integración, sucesiones y series (Taylor); varias variables, Hessiano, Lagrange, integrales múltiples (Marsden & Tromba).
- **Pensamiento Matemático**: lógica, demostraciones, conjuntos, inducción, relaciones y funciones, cardinalidad, aritmética modular (Euclides, Fermat, teorema chino, criptografía), complejos.
- **Álgebra Lineal I**: Gauss-Jordan, independencia lineal, transformaciones, LU, determinantes, subespacios, eigenvalores y diagonalización (Markov), Gram-Schmidt, mínimos cuadrados. Textos: Lay; Strang.
- **Matemáticas Discretas**: combinatoria, funciones generadoras y recurrencias, teoría de gráficas. Textos: Rosen; Grimaldi.

### Economía

- Economía I–III: sin temario público (secuencia micro/macro introductoria, no confirmado).
- **Economía IV**: equilibrio general; monopolio y discriminación de precios (página del prof. Mauricio Romero).
- Diseño de Mercados: sin temario (matching, subastas, juegos aplicados; no confirmado).
- **Inferencia Causal** (Romero, "Microeconometría Aplicada / Inferencia Causal"; correspondencia con la clave no confirmada): resultados potenciales, MCO y causalidad; panel; diferencias en diferencias; variables instrumentales/2SLS; regresión discontinua; matching; control sintético; ML e inferencia causal; identificación parcial. Software: R.

### Estudios Generales (oficiales)

- IIPS I: Grecia (Sófocles, Platón, Aristóteles), Roma (Cicerón, Séneca, San Agustín), Edad Media (Tomás de Aquino, Dante). IIPS II: Descartes, Spinoza, Hobbes, Locke, Hume; Rousseau, Kant; Hegel. IIPS III: Comte, Mill, Marx; Nietzsche, Freud, Bergson; Wittgenstein, Heidegger.
- Problemas de la Civilización Contemporánea I y II: educación, civilización y cultura, individuo y sociedad; población y hábitat, cultura, educación y desarrollo.
- Historia Socio-Política de México; Problemas de la Realidad Mexicana Contemporánea.

### Optativas del boletín

Simulación, Procesos Estocásticos I, Estadística Aplicada I, Modelado y Optimización I/II, Introducción al Desarrollo Web (git, GitHub, React, APIs, pruebas unitarias), Inteligencia Artificial Agéntica y Desarrollo Asistido (LLMs, RAG, agentes), Estrategia y Marketing Deportivo basado en Datos, Desarrollo Empresarial, Mercadotecnia Digital, Energía y Medio Ambiente, Señales y Sistemas.

## 3. Perfil de egreso oficial

Fuente: https://carreras.itam.mx/licenciatura-ciencia-de-datos/que-hace-un-cientifico-de-datos/ — "Al graduarte de la Licenciatura en Ciencia de Datos, estarás preparado para diseñar bases de datos y optimizar su uso, dominar técnicas avanzadas de inteligencia artificial y estadística, utilizar lenguajes de programación para desarrollar software y modelos predictivos, analizar el funcionamiento de mercados, proponer soluciones eficientes e integrar teoría económica y datos para desarrollar estrategias efectivas en diferentes áreas." Habilidades: análisis y modelado predictivo; IA y machine learning; decisiones basadas en datos; "lenguajes de programación como Python y R"; Big Data con "Hadoop y Spark". Complementos: SQL, Tableau y Power BI, aspectos éticos y legales. Titulación: tesis o tesina.

## 4. Hard skills derivables

**Lenguajes**: Python (Fuentes de Datos, NoSQL, IA 2026, Minería 2026, Arquitectura, perfil de egreso; AM inferido) · R (Probabilidad I-II, Estadística Matemática, Métodos Lineales, Multivariados, Inferencia Causal, perfil) · SQL (Bases de Datos; SQL avanzado, procedimientos, triggers) · Java (Algoritmos, Estructuras de Datos y Avanzadas) · C/C++ (Cómputo Paralelo) · Bash/Linux/regex (Fuentes de Datos) · LISP/Prolog (IA histórica; no confirmado para 2026).

**Cómputo paralelo, distribuido y nube**: OpenMP, MPI, speed-up · Hadoop (HDFS, MapReduce), Spark, BD distribuidas y en la nube · GCP/BigQuery, Airflow, Kubeflow, Docker, MLOps/CI-CD, data lakes, ETL/ELT.

**Datos e ingeniería**: modelado relacional, normalización, ACID, OLAP/DWH, ETL · MongoDB, Cassandra, Neo4j, data lakes · pipelines ETL/ELT, EDA, git/GitHub, scraping/APIs · estructuras de datos y algoritmos (AVL, B, hash, Dijkstra/Floyd, big-O).

**Matemáticas**: cálculo uni/multivariable, Lagrange, Taylor · álgebra lineal (LU, eigenvalores, Gram-Schmidt, mínimos cuadrados, Markov) · lógica, demostraciones, inducción, aritmética modular, combinatoria, recurrencias, gráficas.

**Probabilidad y estadística**: probabilidad, familias paramétricas, normal multivariada, LGN/TLC, Monte Carlo · máxima verosimilitud, Cramér-Rao, intervalos, pruebas de hipótesis, bondad de ajuste · regresión y GLM (logística, Poisson) · PCA, factores, correlación canónica, discriminante, clustering, MDS · estadística bayesiana y teoría de la decisión.

**Machine learning e IA**: SVM, redes neuronales/backprop, CART, k-NN, EM, regularización, teoría del aprendizaje (VC, PAC), k-means, jerárquico, asociación, PCA/ICA · CRISP-DM, métricas y evaluación financiera, bagging/boosting, anomalías · búsqueda heurística (A*), minimax/alfa-beta, agentes.

**Inferencia causal y economía**: resultados potenciales, RCT, DiD, IV/2SLS, RD, matching, control sintético, panel, ML causal · equilibrio general, monopolio, discriminación de precios · diseño de mercados (inferido).

**Visualización y comunicación**: R/RMarkdown/Shiny; Tableau/Power BI (institucional); escritura técnica (LEN-12722/12762).

**Ética y regulación de datos**: Seminario de Legalidad y Ética en Ciencia de Datos (DER-10114).

## 5. URLs consultadas

- Planes: carreras.itam.mx (malla nueva, no Plan B); **escolar.itam.mx/licenciaturas/boletines/CDA-B.pdf** (Plan B oficial; espejo horariositam.com); licenciaturas.itam.mx/licenciatura-en-ciencia-de-datos-2/; carreras.itam.mx/licenciatura-ciencia-de-datos/ (+ /que-estudia-un-cientifico-de-datos/, /que-hace-un-cientifico-de-datos/).
- Computación: dac.itam.mx/sites/default/files/u438/ → com-11101, com-11102, com-11103, com-12101, com-22102, com-23701, com-23101, com-23106 (PDF oficiales). No publicados: COM-12103/12104/15112/23114/22108/23115/23116/11112.
- Estadística: estadistica.itam.mx/es/cursos-de-licenciatura → est-24126, est-24127, est-14103, est-24124, est-24125, est-24112.
- Matemáticas: departamentodematematicas.itam.mx/es/temarios → Pensamiento Matemático, Matemáticas Discretas, Álgebra Lineal I, Cálculo I–III, Geometría Vectorial.
- Estudios Generales: generales.itam.mx/es/1/paginas/materias-0 y las siete páginas de materia.
- Economía: mauricio-romero.com/teaching.html → courses/ecoiv.html, courses/microeconometria.html.
- GitHub: Skalas/NoSQLClass; sonder-art/fdd_p24, fdd_p25, fdd_p26, ia_p25, ia_p26; rayalucaria.org/fdd_o26/, /ia_o26/; Palazrak/parallel_clustering, Palazrak/mpi_bag_of_words; elcachorrohumano/ComputoParalelo; nasaul/mineria_datos; pptrrns/infoViz; lpenaf/EstructurasDatosAvanzadas; sanchez-castro/arquitectura-producto-datos; DiegoAdabache/trabajos-estadistica.

**Cobertura**: 28 de 46 materias con temario oficial o equivalente; 7 con fuente secundaria sólida; 11 sin temario público (Economía I-III, Diseño de Mercados, las 4 de Lenguas, Tópicos de Negocios I-II, Tópicos de Políticas Públicas I-II, Seminario de Legalidad y Ética, Ciencia de Datos Aplicada I-II).

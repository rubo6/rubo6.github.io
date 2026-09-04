# Investigación — Temarios del Técnico en Programación (IPN · CECyT 9 "Juan de Dios Bátiz"), Plan 2008

Briefing producido por un agente de investigación el 2026-09-05 a partir de los programas de estudio oficiales (PDF formato DEMS) publicados por el CECyT 9. Sirve para derivar las hard skills de la formación técnica de Rubo (ago 2018 – jul 2021). Todo dato lleva su fuente; lo inferido se marca como tal.

## Hallazgo clave sobre las fuentes

- El plan cursado es el **Plan 2008** (programa académico RICFMPA14, "Modelo Educativo Centrado en el Aprendizaje con Enfoque por Competencias"), aprobado el 19/jun/2009 con vigencia desde agosto de 2009 y vigente hasta al menos 2022. El CECyT 9 exhibe hoy un plan nuevo (Algoritmia, Programación Básica, Laboratorio de Desarrollo de Software I–IV, Ciberseguridad, IA…) que **no** es el de Rubo.
- Los **programas oficiales de las 21 unidades de aprendizaje del área profesional** están en `coatl.cecyt9.ipn.mx`, todos con cabecera "Carrera: TÉCNICO EN PROGRAMACIÓN – Plan 2008" (competencia general, unidades didácticas, RAPs con horas, contenidos, bibliografía). El mismo servidor tiene copias idénticas etiquetadas "Técnico en Desarrollo de Software" (versión a distancia).
- El área científica/básica (Plan 2008, "Carrera: Todas las del NMS") también está en PDF oficial (excepto Álgebra y Computación Básica I, tomadas de cecyt5.ipn.mx porque coatl ya solo publica la versión 2026).
- Los programas del IPN casi nunca nombran lenguajes: nombran **estándares y conceptos** (HTML, JavaScript, XML/SOAP/WSDL/UDDI, UML, JUnit, XP/Scrum/Crystal, CMMI, COCOMO, PSP, SSL/TLS, Kerberos, IPsec…). Los lenguajes concretos (Java, ASP.NET, MySQL, SQL Server) aparecen solo en bibliografía; se marcan como "inferido por bibliografía".

## 1. Mapa curricular (Plan 2008, presencial)

HT = horas teoría/semana, HP = horas práctica/semana, CR = créditos SATCA. Total carrera 245.25 CR. Fuente del mapa: `https://coatl.cecyt9.ipn.mx/ofertaEducativa/planes/programacion/planProgramacion.pdf` (pp. 43-44). Prefijo `C9 = https://coatl.cecyt9.ipn.mx/ofertaEducativa/planes/`.

| Sem | Unidad de aprendizaje                                                                                                             | Área          | HT/HP/CR | Programa consultado                                                                                                                                    |
| --- | --------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Álgebra                                                                                                                           | Básica        | 5/0/5.62 | cecyt5.ipn.mx …/1semestre/algebra.pdf                                                                                                                  |
| 1   | Filosofía I                                                                                                                       | Humanística   | 3/0/3.37 | no consultado                                                                                                                                          |
| 1   | Computación Básica I                                                                                                              | Básica        | 1/3/4.50 | cecyt5.ipn.mx …/1semestre/compu-basica-1.pdf                                                                                                           |
| 1   | Inglés I                                                                                                                          | Humanística   | 4/1/5.62 | no consultado                                                                                                                                          |
| 1   | Expresión Oral y Escrita I                                                                                                        | Humanística   | 4/0/4.50 | no consultado                                                                                                                                          |
| 1   | Desarrollo de Habilidades del Pensamiento                                                                                         | Humanística   | 3/0/3.37 | no consultado                                                                                                                                          |
| 1   | Historia de México Contemporáneo I                                                                                                | Humanística   | 3/0/3.37 | no consultado                                                                                                                                          |
| 1   | Desarrollo Personal                                                                                                               | Institucional | 4/0/4.50 | no consultado                                                                                                                                          |
| 1   | Orientación Juvenil y Profesional I                                                                                               | Institucional | 2/0/0    | no consultado                                                                                                                                          |
| 2   | Geometría y Trigonometría                                                                                                         | Básica        | 5/0/5.62 | C9 basica/Geometria_y_Trigonometria.pdf                                                                                                                |
| 2   | Filosofía II                                                                                                                      | Humanística   | 3/0/3.37 | C9 humanistica/Filosofia_II.pdf (no consultado)                                                                                                        |
| 2   | Computación Básica II                                                                                                             | Básica        | 1/3/4.50 | C9 basica/Computacion_Basica_II.pdf                                                                                                                    |
| 2   | Inglés II                                                                                                                         | Humanística   | 4/1/5.62 | no consultado                                                                                                                                          |
| 2   | Expresión Oral y Escrita II                                                                                                       | Humanística   | 4/0/4.50 | no consultado                                                                                                                                          |
| 2   | Biología Básica                                                                                                                   | Básica        | 3/2/5.62 | C9 basica/Biologia_Basica.pdf                                                                                                                          |
| 2   | Historia de México Contemporáneo II                                                                                               | Humanística   | 3/0/3.37 | no consultado                                                                                                                                          |
| 2   | Orientación Juvenil y Profesional II                                                                                              | Institucional | 2/0/0    | no consultado                                                                                                                                          |
| 2   | Optativa 1 (Comunicación y Liderazgo / Apreciación Artística / Técnicas de Investigación de Campo)                                | Humanística   | 3/0/3.37 | no consultado                                                                                                                                          |
| 3   | Geometría Analítica                                                                                                               | Básica        | 5/0/5.62 | C9 basica/Geometria_Analitica.pdf                                                                                                                      |
| 3   | Física I                                                                                                                          | Básica        | 3/2/5.62 | C9 basica/Fisica_I.pdf                                                                                                                                 |
| 3   | Química I                                                                                                                         | Básica        | 2/2/4.50 | C9 basica/Quimica_I.pdf                                                                                                                                |
| 3   | Inglés III                                                                                                                        | Humanística   | 5/1/6.75 | no consultado                                                                                                                                          |
| 3   | Comunicación Científica                                                                                                           | Humanística   | 3/0/3.37 | no consultado                                                                                                                                          |
| 3   | Dibujo Técnico I                                                                                                                  | Básica        | 1/4/5.62 | C9 basica/Dibujo_Tecnico_I.pdf                                                                                                                         |
| 3   | Entorno Socioeconómico de México                                                                                                  | Humanística   | 3/0/3.37 | no consultado                                                                                                                                          |
| 3   | **Programación Orientada a Objetos**                                                                                              | Profesional   | 4/0/4.50 | C9 programacion/Programacion_Orientada_a_Objetos.pdf                                                                                                   |
| 3   | **Laboratorio de Proyectos de TI I**                                                                                              | Profesional   | 0/4/4.50 | C9 programacion/Laboratorio_de_Proyectos_de_Tecnologias_de_la_Informacion_I.pdf                                                                        |
| 3   | **Administración de Proyectos de TI I**                                                                                           | Profesional   | 3/0/3.37 | C9 programacion/Administracion_de_Proyectos_de_Tecnologias_de_la_Informacion.pdf                                                                       |
| 4   | Cálculo Diferencial                                                                                                               | Básica        | 5/0/5.62 | C9 basica/Calculo_Diferencial.pdf                                                                                                                      |
| 4   | Física II                                                                                                                         | Básica        | 3/2/5.62 | C9 basica/Fisica_II.pdf                                                                                                                                |
| 4   | Química II                                                                                                                        | Básica        | 2/2/4.50 | C9 basica/Quimica_II.pdf                                                                                                                               |
| 4   | Inglés IV                                                                                                                         | Humanística   | 4/2/6.75 | no consultado                                                                                                                                          |
| 4   | Dibujo Técnico II                                                                                                                 | Básica        | 1/4/5.62 | C9 basica/Dibujo_Tecnico_II.pdf                                                                                                                        |
| 4   | **Programación y Servicios Web**                                                                                                  | Profesional   | 3/3/6.75 | C9 programacion/Programacion_y_Servicios_Web.pdf                                                                                                       |
| 4   | **Bases de Datos**                                                                                                                | Profesional   | 1/2/3.37 | C9 programacion/Bases_de_Datos.pdf                                                                                                                     |
| 4   | **Laboratorio de Proyectos de TI II**                                                                                             | Profesional   | 0/3/3.37 | C9 programacion/Laboratorio_de_Proyectos_de_Tecnologias_de_la_Informacion_II.pdf                                                                       |
| 4   | Optativa 2: Administración de Proyectos de TI II / Técnicas de Programación Personal con Calidad / Software de Diseño Electrónico | Profesional   | 3.37     | C9 programacion/Administracion_de_Proyectos_de_Tecnologias_de_la_Informacion_II.pdf; C9 programacion/Tecnicas_de_Programacion_Personal_con_Calidad.pdf |
| 5   | Cálculo Integral                                                                                                                  | Básica        | 5/0/5.62 | C9 basica/Calculo_Integral.pdf                                                                                                                         |
| 5   | Física III                                                                                                                        | Básica        | 3/2/5.62 | C9 basica/Fisica_III.pdf                                                                                                                               |
| 5   | Química III                                                                                                                       | Básica        | 2/2/4.50 | C9 basica/Quimica_III.pdf                                                                                                                              |
| 5   | Inglés V                                                                                                                          | Humanística   | 4/2/6.75 | no consultado                                                                                                                                          |
| 5   | Orientación Juvenil y Profesional III                                                                                             | Institucional | 2/0/0    | no consultado                                                                                                                                          |
| 5   | **Introducción a los Sistemas Distribuidos**                                                                                      | Profesional   | 1/2/3.37 | C9 programacion/Introduccion_a_los_Sistemas_Distribuidos.pdf                                                                                           |
| 5   | **Introducción a la Ingeniería de Pruebas**                                                                                       | Profesional   | 2/1/3.37 | C9 programacion/Introduccion_a_la_Ingenieria_de_Pruebas.pdf                                                                                            |
| 5   | **Seguridad Web y Aplicaciones**                                                                                                  | Profesional   | 3/0/3.37 | C9 programacion/Seguridad_Web_y_Aplicaciones.pdf                                                                                                       |
| 5   | **Laboratorio de Proyectos de TI III**                                                                                            | Profesional   | 0/4/4.50 | C9 programacion/Laboratorio_de_Proyectos_de_Tecnologias_de_la_Informacion_III.pdf                                                                      |
| 5   | Optativa 3: Automatización de Pruebas / Desarrollo Humano y Personal / Programación Visual                                        | Profesional   | 3.37     | C9 programacion/Automatizacion_de_Pruebas.pdf; C9 programacion/Desarrollo_Humano_y_Personal.pdf                                                        |
| 6   | Probabilidad y Estadística                                                                                                        | Básica        | 5/0/5.62 | C9 basica/Probabilidad_y_Estadistica.pdf                                                                                                               |
| 6   | Física IV                                                                                                                         | Básica        | 3/2/5.62 | C9 basica/Fisica_IV.pdf                                                                                                                                |
| 6   | Química IV                                                                                                                        | Básica        | 2/2/4.50 | C9 basica/Quimica_IV.pdf                                                                                                                               |
| 6   | Inglés VI                                                                                                                         | Humanística   | 4/2/6.75 | no consultado                                                                                                                                          |
| 6   | Orientación Juvenil y Profesional IV                                                                                              | Institucional | 2/0/0    | no consultado                                                                                                                                          |
| 6   | **Métodos Ágiles de Programación**                                                                                                | Profesional   | 4/0/4.50 | C9 programacion/Metodos_Agiles_de_Programacion.pdf                                                                                                     |
| 6   | **Soporte de Software**                                                                                                           | Profesional   | 3/0/3.37 | C9 programacion/Soporte_de_Software.pdf                                                                                                                |
| 6   | **Ingeniería de Software Básica**                                                                                                 | Profesional   | 2/0/2.25 | C9 programacion/Ingenieria_de_Software_Basica.pdf                                                                                                      |
| 6   | **Laboratorio de Proyectos de TI IV**                                                                                             | Profesional   | 0/3/3.37 | C9 programacion/Laboratorio_de_Proyectos_de_Tecnologias_de_la_Informacion_IV.pdf                                                                       |
| 6   | Optativa 4: Plan de Negocios / Proyecto Integrador (opción de titulación) / Desarrollo de Aplicaciones de Internet                | Profesional   | 5.62     | C9 programacion/Plan_de_Negocios.pdf; C9 programacion/Proyecto_Integrador.pdf                                                                          |

Salidas laterales oficiales: al acreditar 4.º nivel, constancia de **"Desarrollador de Software"**; al acreditar 5.º nivel, constancia de **"Verificador de calidad de software"**.

Perfil de egreso oficial (planProgramacion.pdf, p. 29): desarrollar aplicaciones con POO; aplicar metodologías de desarrollo con calidad; desarrollar páginas web dinámicas; diseñar bases de datos normalizadas; explotar BD con lenguajes de manipulación de datos; automatizar pruebas sobre el código; analizar y diseñar soluciones de cómputo distribuido; desarrollar algoritmos de seguridad; diseñar planes estratégicos de negocio en la industria del software; seleccionar plataformas; mantener y soportar software.

## 2. Formación profesional: unidades temáticas y tecnologías

### 3.º — Programación Orientada a Objetos (72 h)

1. Fundamentos de programación (23 h): programa, algoritmos, diagramas de flujo; paradigmas (funcional, estructurada, POO); lenguajes, traductores, intérpretes, compiladores, depurador; tipos primitivos, variables, constantes, expresiones, operadores; control de flujo; manejo de memoria y arreglos.
2. Orientación a objetos (22 h): clase, objeto, identidad; abstracción, encapsulamiento, herencia, polimorfismo; atributo, método; persistencia.
3. Estructuras de datos, interfaces, errores y GUI (23 h): estructuras de datos, interfaces, excepciones, archivos, hilos, interfaces gráficas y eventos.
4. UML (4 h): casos de uso, clases, objetos, componentes, despliegue, secuencia, colaboración, estado, actividad.

- Tecnologías: UML (explícito). Java — inferido por bibliografía (Schildt, Deitel, Ceballos). IDE no confirmado.

### 3.º — Administración de Proyectos de TI I (54 h)

Planeación estratégica e industria del software (FODA, PROSOFT); planeación de proyectos (gestión de riesgos, Gantt, ruta crítica/CPM, evaluación financiera); etapas de desarrollo (modelos de proceso, ingeniería de requisitos, casos de uso, diagramas de actividades, diseño de datos/arquitectura/componentes/interfaz, tipos de pruebas, mapa de navegación, bosquejo de GUI); presentación de resultados (informe ejecutivo y extenso, mejora continua). Bibliografía: Pressman, McConnell, Schmuller, Sommerville.

### 3.º — Laboratorio de Proyectos de TI I (72 h, práctica)

Proyecto real por equipos que integra APTI I + POO: plan estratégico, viabilidad, Gantt, CPM; requisitos; UML; mapa de navegación; GUI; programación POO (persistencia, estructuras de datos, excepciones, archivos, GUI y eventos); ciclo de Deming; informes y presentación.

### 4.º — Programación y Servicios Web (108 h)

1. Arquitectura de Internet (18 h): cliente-servidor, tipos de servidores, proceso distribuido, FTP/HTTP/DNS/Telnet/NFS/IRC/IMAP, modelo OSI.
2. Diseño de páginas web (58 h): HTML (texto, listas, imágenes, tablas, marcos, mapas, multimedia, formularios); JavaScript (funciones, eventos); lenguajes del lado del servidor para páginas dinámicas y acceso a BD; arquitectura de tres capas.
3. Servicios web (16 h): XML, SOAP, WSDL, UDDI.
4. Seguridad en servicios web (16 h): integridad, confidencialidad, autorización, autenticación.

- Tecnologías explícitas: HTML, JavaScript, XML, SOAP, WSDL, UDDI, TCP/IP. Lado servidor: ASP.NET en bibliografía; lenguaje de aula no confirmado. CSS no se menciona.

### 4.º — Bases de Datos (54 h)

1. Diseño (21 h): modelos de datos (red, jerárquico, relacional, entidad/relación); transformación conceptual → relacional; normalización; diccionario de datos; vistas.
2. Gestores y lenguajes (22 h): SGBD (funciones, arquitectura), triggers, secuencias, procedimientos almacenados, funciones; álgebra relacional; DML (inserciones, eliminaciones, actualizaciones, consultas); aplicaciones distribuidas.
3. Protección (11 h): privilegios y autorizaciones; integridad; transacciones (propiedades, bloqueos, recuperación).

- Tecnologías: SQL (implícito), MySQL 5.1 y SQL Server 2005/2008 (bibliografía). Teoría: Silberschatz/Korth, Piattini.

### 4.º — Laboratorio de Proyectos de TI II (54 h)

Integra PSW + BD: plan, Gantt, camino crítico; requerimientos; modelado E/R + UML; programación web con servicios web y acceso a BD; Deming; informes. Bibliografía añade Humphrey (PSP).

### 5.º — Introducción a los Sistemas Distribuidos (54 h)

Conceptos de SD y cliente-servidor; redes (LAN/WAN, OSI, IP/IPv6, enrutamiento, TCP/UDP, DNS, cortafuegos, Ethernet); comunicación entre procesos (sockets, datagramas UDP, streams TCP, marshalling, petición-respuesta, multidifusión); programación distribuida (objetos distribuidos, invocación remota/RPC, servicios web, HTTP). Tecnologías: sockets TCP/UDP, Java RMI (recursos), servicios web XML. Bibliografía: Coulouris, Tanenbaum.

### 5.º — Introducción a la Ingeniería de Pruebas (54 h)

Fundamentos; verificación y validación, error/defecto/falla, depuración; diseño de casos de prueba, caja blanca (camino básico, condiciones, bucles), caja negra (partición equivalente, valores límite); pruebas de unidad, integración, sistema, validación y regresión; **JUnit** (clase de prueba, test suite, assertions); ciclo de vida de pruebas.

### 5.º — Seguridad Web y Aplicaciones (54 h)

Amenazas y ataques; **criptografía** (cifrado simétrico y modos de operación, distribución de claves; clave pública, funciones hash, firmas digitales, gestión de claves) con práctica de cifrado simétrico en un lenguaje; protocolos (Kerberos, certificados, S/MIME, IPsec, SSL/TLS, SET, SNMP); herramientas (detección de intrusos, contraseñas, malware, cortafuegos, sistemas de confianza). Algoritmos concretos no nombrados (siguen Stallings).

### 5.º — Laboratorio de Proyectos de TI III (72 h)

Integra ISD + Pruebas + Seguridad: administración de riesgo, ruta crítica, Gantt; requerimientos, Look & Feel, mapa de navegación, UML, contrato con el cliente; programación (40 h): BD, servicios web, algoritmo de criptografía, autenticación web, objetos distribuidos/IPC, pruebas; MoProSoft; informes.

### 5.º — Optativa 3: Automatización de Pruebas (54 h)

Fundamentos de pruebas automatizadas; artefactos (plan de pruebas, scripts, registro de incidencias, manual de pruebas); ciclo de vida y métricas de calidad; pruebas unitarias, integración, sistema, regresión, estrés, desempeño, volumen; monitoreo. Herramientas concretas no nombradas.

### 6.º — Métodos Ágiles de Programación (72 h)

Paradigma ágil y Manifiesto Ágil; **XP** (roles, artefactos, prácticas, ciclo de vida), **Scrum** (roles, artefactos, proceso), familia **Crystal**; desarrollo de aplicaciones aplicando metodologías ágiles (17 h); ventajas/limitaciones, escalamiento, DSDM (bibliografía). Bibliografía: Beck, Schwaber & Beedle, Cockburn, Stapleton.

### 6.º — Soporte de Software (54 h)

Evolución y mantenimiento del software, sistemas heredados; reingeniería e ingeniería inversa; **gestión de configuraciones** (gestión de cambio, versiones y entregas, herramientas CASE); soporte técnico (help desk, instalación, migración, respaldo/recuperación, gestión del conocimiento).

### 6.º — Ingeniería de Software Básica (36 h)

Disciplina y ética profesional; **ingeniería web** (Pressman): atributos de WebApps, modelado de análisis y diseño (contenido, interacción, navegación, patrones hipermedia, OOHDM), pruebas de WebApps; gestión: P-CMM, estimación de costes y **COCOMO**, mejora de procesos, **CMMI**.

### 6.º — Laboratorio de Proyectos de TI IV (54 h)

Proyecto final: plan de negocios, modelo financiero y de mercado, riesgo; ruta crítica, Gantt; registro **PSP** (tiempos, tareas, defectos); requerimientos, UML, contrato; desarrollo con técnicas ágiles o de ISB, servicios web, BD; soporte/mantenimiento; manuales y ayudas; informes.

### Optativas restantes

- Administración de Proyectos de TI II: trabajo colaborativo, control de proyectos, comercialización, estimación de costos, marketing del software.
- Técnicas de Programación Personal con Calidad: PSP (Humphrey): registro de tiempos, planes, medida de tamaño, registro de defectos, densidad de defectos, medidas de calidad.
- Plan de Negocios: constitución de empresas, investigación de mercados, costos, balance y estado de resultados.
- Proyecto Integrador (titulación): planeación, análisis y diseño, desarrollo integrando POO, PSW, BD, SD, pruebas, seguridad, ágiles, soporte; MoProSoft, PSP, UML, E/R, cliente-servidor.
- Sin PDF localizado: Software de Diseño Electrónico, Programación Visual, Desarrollo de Aplicaciones de Internet.

## 3. Área científica y básica (contenidos principales)

- Álgebra: números reales, polinomios, factorización, fracciones algebraicas, función lineal, sistemas de 2 y 3 incógnitas (determinantes), cuadráticas.
- Geometría y Trigonometría: exponenciales y logaritmos, geometría euclidiana axiomática, funciones e identidades trigonométricas.
- Geometría Analítica: recta, cónicas, traslación y rotación de ejes, coordenadas polares; graficación con TIC.
- Cálculo Diferencial: funciones, límites y continuidad, derivadas, interpretación geométrica y física, optimización, trascendentes.
- Cálculo Integral: antiderivadas, métodos de integración, integral definida y teorema fundamental, áreas, volúmenes, longitud de arco.
- Probabilidad y Estadística: descriptiva, conteo, probabilidad clásica y axiomática, condicional, independencia, Bayes, variables aleatorias, esperanza y varianza, binomial, Poisson, normal.
- Computación Básica I y II: sistema operativo, archivos, edición de imágenes, Internet; hoja de cálculo (fórmulas, funciones, gráficas, datos); páginas web con HTML.
- Biología Básica; Física I–IV (medición y teoría de errores, vectores, estática, cinemática, dinámica, energía, electrostática y electricidad, magnetismo, ondas, física moderna, prácticas de laboratorio); Química I–IV (estequiometría, nomenclatura IUPAC, gases, termoquímica, cinética y equilibrio); Dibujo Técnico I–II (normas ISO/DGN, proyecciones, isométricos, cortes, CAD).

## 4. Hard skills derivables

**Lenguajes y marcado**: Java (inferido por bibliografía) · HTML · JavaScript · XML · SQL/DML y álgebra relacional · lenguaje de servidor para páginas dinámicas (no confirmado) · implementación de cifrado simétrico en un lenguaje.

**Paradigmas y fundamentos**: algoritmia y diagramas de flujo · programación estructurada · POO (clases, encapsulamiento, herencia, polimorfismo, interfaces) · estructuras de datos, excepciones, archivos, hilos, GUI orientada a eventos · persistencia · programación distribuida (sockets TCP/UDP, marshalling, RPC/objetos remotos, servicios web) · cliente-servidor y tres capas.

**Web y redes**: HTTP, FTP, DNS, TCP/IP, UDP, IPv6, enrutamiento, OSI · SOAP/WSDL/UDDI · formularios y multimedia · ingeniería web (modelado, patrones hipermedia, OOHDM, pruebas de WebApps).

**Bases de datos**: modelado E/R y relacional, normalización, diccionario de datos, vistas · SGBD (MySQL/SQL Server por bibliografía), triggers, procedimientos almacenados, funciones · transacciones, bloqueos, recuperación, privilegios.

**Calidad y pruebas**: V&V, depuración, casos de prueba, caja blanca/negra, partición equivalente, valores límite · pruebas unitarias, integración, sistema, regresión, estrés, desempeño · JUnit · planes, scripts y manuales de pruebas, métricas · PSP · CMMI, P-CMM, COCOMO · MoProSoft.

**Seguridad**: cifrado simétrico y de clave pública, hash, firmas digitales, gestión de claves · Kerberos, certificados, S/MIME, IPsec, SSL/TLS, SNMP · detección de intrusos, contraseñas, malware, cortafuegos · seguridad de servicios web y de BD.

**Metodologías e ingeniería de software**: UML completo · ingeniería de requisitos, modelos de proceso, diseño arquitectónico · Gantt, CPM, riesgos, viabilidad financiera · planeación estratégica y FODA · XP, Scrum, Crystal, DSDM · mantenimiento, reingeniería, ingeniería inversa · gestión de configuraciones y versiones · help desk, migración, respaldo · ciclo de Deming, informes ejecutivos · plan de negocios y estados financieros.

**Matemáticas y ciencias**: álgebra, trigonometría, geometría analítica, cálculo diferencial e integral, probabilidad y estadística (Bayes, distribuciones), física experimental, química, dibujo técnico y CAD.

## 5. URLs consultadas

Oficiales primarias (PDF DEMS, Plan 2008):

- https://coatl.cecyt9.ipn.mx/ofertaEducativa/ — índice de planes del CECyT 9.
- https://coatl.cecyt9.ipn.mx/ofertaEducativa/planes/programacion/planProgramacion.pdf — programa académico completo (perfiles, mapa curricular pp. 43-44).
- https://coatl.cecyt9.ipn.mx/ofertaEducativa/planes/programacion/ + los 21 PDF del área profesional listados en la tabla.
- https://coatl.cecyt9.ipn.mx/ofertaEducativa/planes/desarrollosoftware/ — copias idénticas (modalidad a distancia).
- https://coatl.cecyt9.ipn.mx/ofertaEducativa/planes/basica/ — programas del área básica (Geometría y Trigonometría, Geometría Analítica, Cálculo Diferencial e Integral, Probabilidad y Estadística, Computación Básica II, Biología, Física I–IV, Química I–IV, Dibujo Técnico I–II).
- https://www.cecyt5.ipn.mx/assets/files/cecyt5/docs/Aspirantes/comercio_internancional/1semestre/algebra.pdf y compu-basica-1.pdf — Álgebra y Computación Básica I, Plan 2008.
- https://www.cecyt9.ipn.mx/assets/files/ofertaEducativa/mapa-curricular/media-superior/escolarizado/tec-programacion.pdf — mapa curricular escaneado.

Oficiales secundarias:

- https://www.cecyt9.ipn.mx/oferta-educativa/ver-carrera.html?lg=es&id=14&nombre=Técnico-en-Programación — objetivo, perfiles y competencias.
- https://www.ipn.mx/oferta-educativa/educación-medio-superior/ver-carrera.html?lg=es&id=14&nombre=Técnico-en-Programación — misma ficha institucional.

No oficiales: https://mextudia.com/universidades/ipn/carrera-para-tecnico-en-programacion/ (lista de materias); Studocu "mapa curricular 2022" (solo título); MOOC IPN APTI en archivo.mexicox.gob.mx.

No localizados (404): Administracion_de_Proyectos_de_TI_I.pdf, Programacion_Visual.pdf, Software_de_Diseno_Electronico.pdf, Desarrollo_de_Aplicaciones_de_Internet.pdf.

# Cuestionario para Rubo

> Responde en el chat cuando quieras, en cualquier orden, con el número. Todo lo que no respondas tiene un default marcado con ⭐ y se puede cambiar después editando `src/content/`.

## A. Datos duros para los cronómetros y timelines

1. **Fecha exacta de inicio en Mercado Libre / Mercado Pago Point** (día/mes/año). ⭐ default: 2025-10-01.
2. **Fecha de inicio en ITAM** (para "años estudiando Ciencia de Datos"). ⭐ default: 2023-08-01.
3. **Fecha esperada de graduación** exacta o mes. ⭐ default: 2027-12-01.
4. **Fecha de inicio en DataLab ITAM** como Research Manager. ⭐ default: sin fecha, se muestra como "actual".
5. ¿Quieres un cronómetro de **edad** o **cumpleaños**? Es dato personal; ⭐ default: no.

## B. Proyectos (las "nebulosas")

6. Los tres proyectos del CV (pipeline production-style, Parallel Bag-of-Words, Keeper Save Probability) **no están públicos en GitHub** (solo hay 5 repos: 2 forks de clase, el sitio y 2 de GitHub Skills). ¿Los vas a publicar? Si sí, dime los nombres de repo y los hago aparecer con datos reales del API. ⭐ default: se muestran como fichas estáticas sin enlace hasta que existan.
7. ¿Mostrar los forks `ia_p26` y `fdd_p25` como proyectos académicos? ⭐ default: sí, en la nebulosa "Académico", marcados como material de curso.
8. ¿Qué se puede contar públicamente del trabajo en MeLi? ⭐ default: solo lo que ya dice el CV (BigQuery, ETL/ELT, plataforma interna Next.js + Firebase), sin nombres de proyectos internos ni métricas.
9. Categorías propuestas de nebulosas: **Profesional** (MeLi), **Académico** (ITAM, Ibero, DataLab), **Personal** (side projects), **Investigación** (ECOBOX AI, Keeper). ¿Agregas o quitas alguna?
10. ¿Alguna certificación, curso o hackathon que quieras como estrella? (Coursera, Kaggle, DataCamp, Google Cloud, etc.)

## C. Tu universo personal

11. **Música**: géneros, artistas o álbumes favoritos que quieras mostrar. ¿Tienes cuenta de Spotify o Last.fm pública para un "escuchando ahora" en el futuro?
12. **Gaming**: juegos o sagas favoritas. ¿Cuenta de Steam pública?
13. **Astronomía**: ¿tienes telescopio? ¿objetos favoritos del cielo? ¿alguna foto tuya de astrofotografía? ¿nebulosa favorita? (yo propongo Orión, Carina, Águila/Pilares de la Creación, Hélice, Cangrejo, Laguna, Roseta, Cabeza de Caballo).
14. **Soft skills** que quieres destacar (⭐ default desde el CV: liderazgo de equipos, comunicación con stakeholders internacionales, documentación, coordinación de investigación, ejecución cross-funcional).
15. Otros hobbies, libros, deportes, voluntariado que quieras en el modo personal.
16. ¿Cómo quieres que te llamen en el sitio? ⭐ default: "Rubo" en modo personal y "Eduardo Rubén Bernal Puente" en modo profesional.

## D. Imagen y voz

17. ¿Vas a usar una **foto de perfil**? Pásame el archivo o dime si prefieres un avatar ilustrado (te doy el prompt). ⭐ default: sin foto, monograma tipográfico.
18. ¿Tono del modo personal? ⭐ default: cercano, con humor ligero, tuteo. Modo profesional: formal, tercera persona no, primera persona sobria.
19. Idiomas prioritarios. ⭐ default: **EN** (raíz), **ES**, **PT-BR** completos; **FR, DE, IT, JA, ZH** con interfaz y resúmenes traducidos, contenido largo cae a EN.

## E. Infraestructura

20. ¿Quieres comprar un **dominio** (ej. `rubo.dev`, `rubenbernal.dev`)? ⭐ default: seguimos en `rubo6.github.io`; el sitio queda listo para CNAME.
21. ¿Autorizas un **token de GitHub de solo lectura** (fine-grained, scope traffic) como secret del repo para mostrar _views_ y _clones_ de tus repos? ⭐ default: sin token, solo datos públicos (stars, forks, lenguajes, commits, última actualización).
22. ¿Quieres **analítica de visitas**? ⭐ default: no (cero terceros, cero cookies). Alternativa privada: GoatCounter o Plausible.
23. ¿Tienes activado **2FA** en GitHub? Es requisito de la fase de ciberseguridad; no lo puedo verificar desde aquí.

## F. LinkedIn

24. Para leer tu LinkedIn necesito que inicies sesión en tu Chrome (el de la extensión de Claude) o que me pases el PDF de "Guardar como PDF" del perfil. ¿Cuál prefieres? ⭐ default: sigo solo con el CV.

# Plan de ejecución — Rediseño de rubo6.github.io

> Fecha: 2026-09-03 · Autor del plan: Claude (Fable 5.1) con Rubo · Estado: **aprobado y en ejecución** (fases 0–5 y 7 completas; 6, 8b y 9 en curso). Ver Addendum v2 al final.
> Este documento es la fuente de verdad del rediseño. Cualquier agente (Claude, Codex, humano) debe leerlo antes de tocar el repo.

---

## 0. Diagnóstico del sitio actual

| Área       | Estado actual                                                                                                                       | Problema                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Stack      | HTML + CSS + JS vanilla, 3 archivos, sin build, sin tooling                                                                         | No demuestra ingeniería; nada que un recruiter técnico valore                |
| Estética   | "Tron": grid neón cian sobre negro, Orbitron + Inter                                                                                | Genérica, el usuario la rechaza, fuentes vetadas por la skill `ui-ux-master` |
| Contenido  | "Analista jr", Java, inglés intermedio, 2 proyectos con `href="#"`, form falso, `mailto:tu.correo@ejemplo.com`, GitHub `tu-usuario` | Desactualizado vs CV 2026 y con placeholders rotos                           |
| Repo       | README de una línea, sin CI, sin docs, 10 commits "Update index.html"                                                               | El repo no comunica nada                                                     |
| Deploy     | GitHub Pages desde rama `main` (legacy)                                                                                             | Sin pipeline, sin checks                                                     |
| A11y / SEO | Sin skip link, sin OG image, sin sitemap, sin `theme-color`                                                                         | Lighthouse mediocre                                                          |

Fuentes de verdad para el contenido nuevo: CV `Eduardo_Ruben_Bernal_Puente_Resume_TikTok_2026_Updated.pdf` (ya extraído). LinkedIn no fue accesible (authwall) — se usa el CV.

---

## 1. Concepto de diseño: **"Observatorio"**

Idea central: la página es un observatorio personal. No es "espacio neón", es **astronomía de verdad**: atlas celeste, catálogo de estrellas, mecánica orbital. El diferenciador que hace decir "este tipo le sabe": **el hero renderiza el cielo real sobre Ciudad de México a la hora exacta del visitante**, calculado en TypeScript (tiempo sidéreo local, conversión ecuatorial → horizontal) a partir de un catálogo real de estrellas brillantes. Cero aleatoriedad, cero librerías de terceros para eso: matemáticas propias con tests unitarios.

### Dirección visual

- **Dos temas, ambos intencionales** (la skill exige variar, no default a oscuro):
  - **Noche** (default según `prefers-color-scheme`): índigo profundo `#0B1026` → `#141B3D`, nunca negro puro. Acentos: dorado starlight `#F2C46D` (estrellas, CTAs), coral nebulosa `#F07A6E` (énfasis), cian pálido `#9AD9E8` (datos/mono). Texto marfil `#F4EFE6`.
  - **Atlas** (claro): inspirado en atlas estelares del s. XIX: papel marfil `#F6F1E7`, tinta azul-noche `#1B2240`, líneas de constelación en dorado oscuro `#A67C2E`. Estilo grabado.
- **Tipografía** (self-hosted vía `@fontsource`, sin Google Fonts → cero requests a terceros):
  - Display: **Fraunces** (variable, ejes opsz/SOFT; carácter editorial-científico).
  - Cuerpo: **Instrument Sans**.
  - Mono/datos: **JetBrains Mono** (coordenadas, etiquetas técnicas, código).
  - Escala fluida con `clamp()`, jerarquía dramática (h1 ≈ 4–6rem).
- **Motivos**: líneas de constelación uniendo skills; timeline como órbitas concéntricas; tarjetas de proyectos como "observaciones" con ficha técnica (fecha, instrumentos = stack, resultado); fase lunar real en el footer; grano sutil + gradiente radial, sin grids neón.
- **Composición**: asimetría, hero a dos columnas rotas (texto sobre el canvas del cielo), secciones con ritmo de espacio negativo generoso.
- **Motion**: una sola carga orquestada (reveal escalonado), parallax mínimo en estrellas, todo `transform/opacity`, respetando `prefers-reduced-motion` (el cielo se vuelve estático).

### Secciones (una sola página + páginas de detalle)

1. **Hero / Cielo** — nombre, rol ("Data & Analytics Engineer · Data Science @ ITAM"), CTA a proyectos y CV, canvas del cielo real de CDMX con hora/tiempo sidéreo visibles.
2. **Bitácora (Sobre mí)** — resumen del CV en primera persona, corto.
3. **Trayectoria (órbitas)** — Mercado Libre / Mercado Pago Point, DataLab ITAM, AIESEC, ITAM, Ibero.
4. **Observaciones (Proyectos)** — Pipeline production-style, Parallel Bag-of-Words (C++17/MPI/Docker), Keeper Save Probability, ECOBOX AI, plataforma interna (descrita sin datos confidenciales). Cada uno con página propia `/projects/<slug>`.
5. **Constelación (Skills)** — grafo SVG agrupado: Datos & Cloud, Lenguajes, Ingeniería, ML.
6. **Contacto** — email, LinkedIn, GitHub. **Sin formulario** (sin backend no hay forma segura; un form a terceros enviaría datos de visitantes a un endpoint externo). **Sin teléfono** en la web.
7. **Footer** — fase lunar, "construido con Astro", enlace al repo.

Idiomas: **inglés por default en `/`** (el CV apunta a un mercado internacional) y **español en `/es/`**, con i18n nativo de Astro y `hreflang`. _Decisión reversible; ver §7._

---

## 2. Stack técnico (lo más actual, justificado)

| Capa         | Elección                                                                                                                 | Versión (npm, 2026-09-03)     | Por qué                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Framework    | **Astro**                                                                                                                | 7.3.1 (requiere Node ≥ 22.12) | Estándar 2026 para sitios de contenido: cero JS por default, islands, content collections, i18n y View Transitions nativos |
| Estilos      | **Tailwind CSS v4** vía `@tailwindcss/vite`                                                                              | 4.3.3                         | Config CSS-first con `@theme`, tokens como variables CSS reales                                                            |
| Lenguaje     | **TypeScript strict**                                                                                                    | 7.x                           | Todo el código de dominio (astronomía) tipado y testeado                                                                   |
| Contenido    | Astro Content Collections + **zod**                                                                                      | —                             | Proyectos, experiencia, skills en `src/content/*.md                                                                        | json` con schema; es lo que hace el repo editable por IA sin romper la UI |
| Fuentes      | `@fontsource-variable/*`                                                                                                 | —                             | Self-hosted, `font-display: swap`, preload                                                                                 |
| Tests        | **Vitest** (unit, lib de astronomía) + **Playwright** smoke (opcional fase 6)                                            | —                             | Demuestra disciplina; el cálculo del cielo se valida contra efemérides conocidas                                           |
| Calidad      | Prettier + `prettier-plugin-astro`, ESLint + `eslint-plugin-astro`, `astro check`                                        | —                             | Formato y tipos en CI                                                                                                      |
| CI/CD        | GitHub Actions: `withastro/action@v6` + `actions/deploy-pages@v5`; job de CI (lint, typecheck, test, build, `npm audit`) | —                             | Deploy reproducible; Pages source = GitHub Actions                                                                         |
| Dependencias | Dependabot semanal, lockfile committeado, actions fijadas a versión mayor                                                | —                             | Higiene de supply chain                                                                                                    |
| Node local   | Node **24 LTS** (Krypton 24.20.0) portable en `Desktop\dev\tools\` + `.node-version`                                     | —                             | El Node 20.18 actual no cumple el mínimo de Astro 7                                                                        |

No se usa React/Vue: el único código interactivo (cielo, theme toggle, nav) es TS vanilla en `<script>` de Astro; más ligero y más impresionante que meter un framework para un canvas.

### Seguridad integrada (reglas aplicadas desde el diseño)

- **Sin secretos en el repo.** Si en fase 2 se añade NASA APOD (imagen astronómica del día), la key vive en GitHub Secrets y se consume en build time con un cron diario; nunca en el cliente.
- **Sin `Math.random()`**: el cielo sale de un catálogo determinista; cualquier "ruido" visual se genera con una función hash determinista o `crypto.getRandomValues`.
- **Sin `innerHTML`** con datos externos: Astro escapa por default; el canvas usa `textContent`/Canvas API.
- **Cero terceros en runtime**: fuentes e íconos self-hosted → no hace falta SRI ni CSP permisiva. Se declara una CSP estricta vía `<meta http-equiv>` (GitHub Pages no permite headers) y `referrer-policy`.
- Links externos con `rel="noopener noreferrer"`; sin formularios; sin teléfono; PDF del CV publicado **sin teléfono** (se genera desde una página `/cv` imprimible, misma fuente de datos).
- Workflows con `permissions` mínimos (`contents: read`, `pages: write`, `id-token: write`), `npm audit --audit-level=high` como gate, Dependabot activo.

---

## 3. Arquitectura del repositorio

```
rubo6.github.io/
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml            # main → build (withastro/action) → deploy-pages
│   │   └── ci.yml                # PRs: lint · typecheck · test · build · audit
│   ├── ISSUE_TEMPLATE/           # "Nuevo proyecto", "Actualizar experiencia", "Bug visual"
│   ├── dependabot.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── AGENTS.md                     # Instrucciones canónicas para agentes IA (Claude, Codex, Cursor…)
├── CLAUDE.md                     # Una línea: "Lee AGENTS.md" + notas específicas de Claude Code
├── README.md                     # "Vivo": banner SVG animado, badges, diagrama Mermaid, cómo editar, cómo corre CI
├── LICENSE                       # MIT para el código; contenido © Rubo
├── docs/
│   ├── PLAN.md                   # este archivo
│   ├── ARCHITECTURE.md           # flujo build, collections, i18n, islas
│   ├── DESIGN-SYSTEM.md          # tokens, tipografía, motion, ambos temas, do/don't
│   ├── CONTENT-GUIDE.md          # cómo añadir un proyecto / experiencia (para humanos e IA)
│   └── decisions/                # ADR-0001-astro.md, ADR-0002-observatorio.md, ADR-0003-i18n.md, ADR-0004-sin-form.md
├── public/
│   ├── favicon.svg · icons/ · og/  · robots.txt · llms.txt · site.webmanifest
│   └── .nojekyll
├── src/
│   ├── content.config.ts         # schemas zod: projects, experience, education, skills, profile
│   ├── content/
│   │   ├── profile/{en,es}.json
│   │   ├── projects/{en,es}/*.md
│   │   ├── experience/{en,es}/*.md
│   │   ├── education/*.json
│   │   └── skills.json
│   ├── i18n/ (ui strings en/es, helper t())
│   ├── layouts/Base.astro
│   ├── components/
│   │   ├── sky/  SkyCanvas.astro · sky.ts (render)
│   │   ├── Hero.astro · Orbits.astro · ProjectCard.astro · Constellation.astro
│   │   ├── ThemeToggle.astro · LangSwitch.astro · Nav.astro · Footer.astro · MoonPhase.astro
│   ├── lib/astro/                # dominio puro, testeado
│   │   ├── time.ts (JD, GMST, LST) · coords.ts (RA/Dec → Alt/Az) · moon.ts · catalog.ts
│   ├── data/bright-stars.json    # ~300 estrellas (Yale BSC subset, magnitud < 3.5) + líneas de constelaciones
│   ├── pages/  index.astro · es/index.astro · projects/[slug].astro · es/projects/[slug].astro · cv.astro · 404.astro
│   └── styles/global.css         # @theme tokens, ambos temas, motion
├── tests/  unit/*.test.ts (vitest)  · e2e/ (playwright smoke, opcional)
├── scripts/  generate-og.ts (OG images por página) · validate-content.ts
├── astro.config.ts · tsconfig.json · package.json · .node-version · .editorconfig · .prettierrc · eslint.config.js
```

Principio: **contenido separado de presentación**. Para actualizar el CV en la web, un agente edita un `.md`/`.json`, el schema zod valida, CI construye. Nunca hay que tocar componentes.

### README "con vida propia"

- Banner SVG animado (cielo con estrellas titilando en CSS-in-SVG, se ve en GitHub).
- Badges reales: deploy status, CI, Lighthouse (vía `lighthouse-badges` en CI o shields estáticos actualizados por workflow), Astro/TS/Tailwind.
- Diagrama Mermaid del pipeline contenido → build → Pages.
- Sección "Para agentes IA" que apunta a `AGENTS.md`.
- "Cómo añadir un proyecto en 60 segundos".
- Fase lunar y "última observación" (fecha de último deploy) actualizadas por el workflow — el README cambia solo.

---

## 4. Fases de ejecución (misma sesión, con commits por fase)

Método git: rama `redesign/observatory` desde `main`; commits convencionales (`feat:`, `chore:`, `docs:`); un push por fase; al final PR a `main` (se crea desde la web de GitHub porque no hay `gh` CLI) o merge directo si Rubo lo prefiere. Los archivos legacy (`index.html`, `styles.css`, `script.js`) se eliminan en la fase 1 (quedan en el historial).

| #   | Fase                       | Entregable verificable                                                                                                                                            | Skills aplicadas                                                                                            |
| --- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 0   | **Entorno**                | Node 24 LTS portable instalado y en PATH de la sesión; `git config` local con nombre/email acordados; rama creada                                                 | —                                                                                                           |
| 1   | **Scaffold**               | `npm create astro@latest` (minimal, TS strict), Tailwind v4, Prettier/ESLint, Vitest, `.node-version`, `.editorconfig`; legacy borrado; `npm run build` verde     | meli-security (deps auditadas)                                                                              |
| 2   | **Design system**          | `global.css` con tokens de ambos temas, fuentes self-hosted, `Base.astro` (meta, `color-scheme`, `theme-color`, skip link, View Transitions), `ThemeToggle`       | ui-ux-master, web-accessibility                                                                             |
| 3   | **Contenido**              | Collections + schemas; todo el CV cargado en EN y ES; `CONTENT-GUIDE.md`                                                                                          | —                                                                                                           |
| 4   | **Lib astronomía + tests** | `lib/astro` (JD, GMST/LST, alt/az, fase lunar) con tests contra valores conocidos; catálogo de estrellas                                                          | —                                                                                                           |
| 5   | **Secciones UI**           | Hero con `SkyCanvas`, Orbits, Projects (+ páginas detalle), Constellation, Contact, Footer/MoonPhase, 404, `/cv` imprimible                                       | ui-ux-master, pwa-native-feel (safe areas, touch, contain, GPU)                                             |
| 6   | **Calidad**                | Revisión con `web-design-guidelines` (Vercel) y checklist WCAG AA; Lighthouse ≥ 95 en las 4 métricas en móvil; OG images, sitemap, robots, llms.txt, manifest     | web-design-guidelines, web-accessibility                                                                    |
| 7   | **Repo & docs**            | README vivo, AGENTS.md, CLAUDE.md, ADRs, ARCHITECTURE, DESIGN-SYSTEM, issue/PR templates, Dependabot, LICENSE                                                     | —                                                                                                           |
| 8   | **CI/CD**                  | `ci.yml` + `deploy.yml`; push; **Rubo cambia Pages → "GitHub Actions" en Settings** (no se puede desde aquí); deploy verde; sitio vivo verificado en el navegador | cybersecurity-master (headers/permissions), firebase-hosting-basics (solo como referencia de headers/caché) |
| 9   | **QA final + reporte**     | Recorrido móvil y desktop en el Browser pane, ambos temas, ambos idiomas; Security Review Report (Build mode); handoff con próximos pasos                         | meli-security (audit)                                                                                       |

Opcionales post-sesión: NASA APOD diario (build con secret + cron), README de perfil `rubo6/rubo6`, blog con `content/posts`, Playwright e2e en CI, dominio propio.

---

## 5. Criterios de "hecho al 100"

- [ ] Lighthouse móvil: Performance, A11y, Best Practices, SEO ≥ 95.
- [ ] Cero requests a terceros en runtime (verificado en Network).
- [ ] `astro check`, ESLint, Prettier, Vitest y `npm audit` verdes en CI.
- [ ] El cielo del hero coincide con una app de planetario para CDMX a la misma hora (prueba manual).
- [ ] Todo el contenido del CV está en el sitio, en EN y ES, sin teléfono.
- [ ] Un agente nuevo puede añadir un proyecto siguiendo solo `AGENTS.md` + `CONTENT-GUIDE.md`.
- [ ] README se ve completo en GitHub (banner, badges, mermaid renderizado).

---

## 6. Riesgos y mitigaciones

| Riesgo                                              | Mitigación                                                                                                        |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Node 20 local no soporta Astro 7                    | Instalar Node 24 portable junto al actual, sin admin; `.node-version` en el repo                                  |
| GitHub Pages sigue en modo "rama" tras el push      | Instrucción explícita a Rubo para cambiar source a Actions; el workflow lo detecta y falla claro si no            |
| Astro 7 compilador estricto (HTML inválido = error) | Se escribe HTML válido desde el inicio; `astro check` en cada fase                                                |
| Sätteri (nuevo pipeline Markdown de Astro 7)        | Contenido Markdown simple, sin plugins remark                                                                     |
| Canvas del cielo pesado en móvil                    | Solo ~300 estrellas, `requestAnimationFrame` throttled, pausa cuando no está visible, estático con reduced-motion |
| Sin `gh` CLI                                        | Push de rama + PR desde la web; o merge directo si Rubo lo autoriza                                               |

---

## 7. Decisiones que necesita tomar Rubo (defaults propuestos)

1. **Idioma default**: EN en `/`, ES en `/es/` _(default propuesto)_. Alternativa: ES default.
2. **Identidad git para los commits**: nombre "Eduardo Rubén Bernal Puente"; email → `eruben15@hotmail.com` (público en el CV) **o** el noreply de GitHub _(recomendado; se obtiene de Settings → Emails)_.
3. **Node 24 portable** en `Desktop\dev\tools\node24` _(default)_; alternativa: instalar con winget (requiere permisos).
4. **Merge**: PR revisado por Rubo en GitHub _(default)_ o push directo a `main` por fase.
5. **Teléfono fuera del sitio y del PDF web** _(default: fuera)_.

---

## Addendum v2 — decisiones de Rubo (2026-09-03, tarde)

| Tema                                                  | Decisión final                                                                                                                                                                                 |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Idiomas                                               | **EN** raíz, **ES** y **PT-BR** completos; FR, DE, IT, JA, ZH con UI + resúmenes (contenido largo cae a EN). Tono **formal** en secciones profesionales, **cercano** en personales, por idioma |
| Git                                                   | Identidad local: `Eduardo Rubén Bernal Puente <229856718+rubo6@users.noreply.github.com>`. **Push directo a `main`** por fase; validación en vivo en el Browser pane. Sin PRs                  |
| Node                                                  | Node 24.20.0 portable en `Desktop\dev ools                                                                                                                                                     |
| ode24`(SHA-256 verificado).`.node-version` en el repo |
| Contacto                                              | `eruben.bernal@gmail.com` (profesional), LinkedIn, GitHub. **Sin teléfono** en web ni PDF                                                                                                      |
| Assets                                                | Rubo genera imágenes en meliGPT (Nano Banana / GPT Image 2) con los prompts de `docs/ASSET-PROMPTS.md`. Sin video de fondo por ahora                                                           |
| GitHub connector                                      | Habilitado por Rubo, pero **no expone herramientas en esta sesión**; se usa `git` sobre HTTPS con Credential Manager (push probado OK) y la API pública de GitHub                              |
| LinkedIn                                              | Bloqueado por authwall; Chrome sin sesión. Se sigue con el CV; ver pregunta 24 del cuestionario                                                                                                |

### Nuevas piezas de producto

1. **Observatorio profesional** (`#observatory`): escena inmersiva. Cada **nebulosa** = una categoría de proyectos (Profesional/MeLi → Orión; Académico/ITAM → Carina; Investigación → Águila; Personal → Hélice; Comunidad/liderazgo → Laguna; Próximos → Cabeza de Caballo). Cada **estrella** dentro de la nebulosa = un dato del proyecto (stack, stars, forks, commits, lenguaje, fecha, rol, impacto). Click en nebulosa → zoom y ficha; click en estrella → tooltip accesible. Datos de GitHub se cargan **en build time** vía un _content loader_ de Astro (API pública, sin token); rebuild diario por cron en Actions para mantenerlos frescos sin requests del cliente.
2. **Universo personal** (`data-mode="personal"`): misma escena, otra física y otra paleta (plum‑ámbar). Nebulosas = música, gaming, astronomía, soft skills, comunidad. El **toggle Pro ⇄ Personal** dispara la animación "el universo se mueve": interpolación de tokens `@property` (colores y ángulo del cielo), warp de estrellas en canvas, cambio de copy y tono.
3. **Cronómetros en tiempo real** (`<LiveCounter>`): tiempo en Mercado Libre, tiempo en ITAM, cuenta regresiva a graduación, tiempo sidéreo local, fase lunar, "días desde el último commit". Fechas en `src/content/profile/*.json`.
4. **Fase de ciberseguridad dedicada** (nueva fase 8b): ver §Fases.

### Fases actualizadas

| #   | Fase               | Añadido respecto a v1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0   | Entorno            | ✅ hecho: Node 24, identidad git, push probado                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 1   | Scaffold           | en curso                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 2   | Design system      | ejes `data-theme` × `data-mode`, tokens animables                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 3   | Contenido          | EN/ES/PT-BR + esquema de tono por sección                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 4   | Lib astronomía     | + loader de GitHub (build time) + utilidades de tiempo para cronómetros                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 5   | UI                 | + Observatorio (nebulosas/estrellas), Universo personal, toggle con warp, LiveCounters                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 6   | Calidad            | igual                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 7   | Repo & docs        | + `SECURITY.md`, `docs/SECURITY-BASELINE.md`, `docs/ASSET-PROMPTS.md`, `docs/QUESTIONNAIRE.md`                                                                                                                                                                                                                                                                                                                                                                                                                |
| 8   | CI/CD              | + cron diario de rebuild para datos de GitHub                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 8b  | **Ciberseguridad** | CSP estricta vía meta (GitHub Pages no da headers), `security.txt`, `SECURITY.md`, CodeQL + Dependabot + `npm audit` gate, lint de seguridad (sin `Math.random`, sin `innerHTML`, sin `eval`), actions fijadas por SHA, permisos mínimos, secret scanning, política de dependencias (lockfile, `--ignore-scripts` en CI), revisión de enlaces externos (`rel`, dominios allowlist), verificación de que no hay PII más allá del correo profesional, recordatorio 2FA y branch protection (los configura Rubo) |
| 9   | QA + reporte       | igual                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

### Ideas a futuro (backlog público en el README)

- Bitácora/blog con MDX y RSS; página "Now".
- Heatmap de contribuciones de GitHub y gráfica de lenguajes.
- "Escuchando ahora" (Spotify/Last.fm) y "Jugando" (Steam) — requieren un worker mínimo (Cloudflare) para no exponer tokens; el sitio queda preparado.
- Views/clones de repos con token fine‑grained (pregunta 21).
- Imagen astronómica del día (NASA APOD) en build diario con secret.
- Generación automática del CV en PDF en CI (Playwright print) a partir del mismo contenido.
- Testimonios, certificaciones verificables, charlas.
- Dominio propio + `CNAME`.
- Asistente "pregúntale a Rubo" sobre `llms.txt` (necesita backend; fuera del alcance de GitHub Pages).

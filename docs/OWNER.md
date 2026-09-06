# Guía para Rubo: lo que solo tú puedes hacer

Todo lo de aquí requiere tu cuenta, tu tarjeta o una decisión tuya; ningún agente puede hacerlo. Cada punto trae el enlace exacto. Lo ya hecho se marca con ✅ y se deja como referencia.

## Estado de las cuentas

- ✅ GitHub: 2FA, push protection, Dependabot, CodeQL, private vulnerability reporting (2026-09-03).
- ✅ Dominio `rubo6.dev` en Cloudflare Registrar (vence 2027-09-03), registros A/AAAA/CNAME en modo DNS-only, HTTPS forzado en GitHub Pages, DNSSEC y CAA (2026-09-06).
- ✅ GoatCounter `rubo6.goatcounter.com` con el contador público activado (2026-09-05). Panel: https://rubo6.goatcounter.com.
- ✅ Secreto `GH_TRAFFIC_TOKEN` en el repo (views/clones y calendario de contribuciones). Caduca al año de crearlo: cuando GitHub te avise, repite el paso de "Rotar el token".

## Cloudflare

Estado verificado el 2026-09-06 por DNS: **DNSSEC activo** (registro DS y firmas RRSIG), **CAA presentes** (`issue` e `issuewild` para `letsencrypt.org`; Cloudflare anade ademas los de sus propias autoridades mientras Universal SSL este encendido, por eso el aviso naranja en la tabla), registros A/AAAA/CNAME correctos. **Pendiente**: SPF, DMARC y Null MX (no existen todavia).

### Pendiente inmediato (5 minutos)

1. **Anti-suplantacion de correo** en `DNS -> Records -> Add record`:
   - `TXT`, nombre `@`, contenido `v=spf1 -all`
   - `TXT`, nombre `_dmarc`, contenido `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;`
   - `MX`, nombre `@`, servidor de correo `.`, prioridad `0` (Null MX: "este dominio no recibe correo")
     Si prefieres el asistente: `Email -> DMARC Management -> Get started` crea los tres.
2. **Registrar**: `Domain Registration -> Manage -> rubo6.dev`: auto-renew activado y transfer lock activado.
3. **Cuenta**: `Manage account -> Authentication`: 2FA con app autenticadora y codigos de recuperacion en el gestor de contrasenas.

### Notificaciones

En el plan Free no hay alerta de "dominio por vencer": Cloudflare Registrar avisa por correo automaticamente 30 y 7 dias antes, y con auto-renew activado no hace falta mas. Lo que si puedes crear en `Notifications -> Add`: **Billing (payment failure)** y, si activas el proxy, **HTTP DDoS Attack Alerter** y **Security Events Alert**. Si el formulario falla, comprueba que el correo de la cuenta este verificado (`Manage account -> Members`).

### Decision: proxy de Cloudflare, si o no

Hoy las nubes estan grises (DNS-only): el visitante habla directo con GitHub Pages y GitHub emite el certificado. Es correcto y suficiente para un portafolio, pero **no permite limitar peticiones**: GitHub Pages no tiene WAF ni rate limiting, y Cloudflare solo actua sobre el trafico que pasa por su proxy.

Si quieres el limite "humano" de peticiones y proteccion maxima, activa el proxy con esta configuracion exacta:

1. `DNS -> Records`: cambia los 4 `A`, los 4 `AAAA` y el `CNAME www` a **Proxied** (nube naranja).
2. `SSL/TLS -> Overview`: modo **Full (strict)**. Si algun dia GitHub deja de renovar su certificado (error 526), baja a **Full**.
3. `SSL/TLS -> Edge Certificates`: **Always Use HTTPS** on, **Minimum TLS 1.2**, **TLS 1.3** on, **HSTS** on (max-age 6 meses, includeSubDomains, preload; `.dev` ya esta precargado), **Automatic HTTPS Rewrites** on.
4. `Security -> WAF -> Managed rules`: activa el **Cloudflare Managed Ruleset** gratuito.
5. `Security -> WAF -> Rate limiting rules -> Create`: nombre `humano`, expresion `(http.request.uri.path ne "/robots.txt")`, caracteristica `IP`, umbral **60 peticiones por 10 segundos**, accion **Block** durante **10 segundos**. Un humano navegando no pasa de 20-30 peticiones en 10 s ni recargando; un script si. Es la unica regla gratuita del plan.
6. `Security -> Bots`: **Bot Fight Mode** on. `Security -> Settings`: nivel de seguridad **Medium**, **Browser Integrity Check** on.
7. `Rules -> Transform Rules -> Modify Response Header -> Create`: cabeceras estaticas que GitHub Pages no puede enviar: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`, `Cross-Origin-Opener-Policy: same-origin`.
8. `Caching -> Configuration`: Browser Cache TTL "Respect existing headers". `Speed`: todo apagado (minificar o Rocket Loader romperian la CSP).
9. En `https://github.com/rubo6/rubo6.github.io/settings/pages` aparecera un aviso de DNS porque ahora ve las IP de Cloudflare; es esperado. HTTPS sigue forzado por Cloudflare.
10. Pide al agente un ADR-0010 registrando la decision y crea las alertas de la seccion anterior.

Si decides **quedarte en DNS-only**, desactiva `SSL/TLS -> Edge Certificates -> Universal SSL` para que los CAA queden solo con Let's Encrypt, y da el tema por cerrado: la proteccion volumetrica la da la CDN de GitHub (Fastly).

### Mantenimiento

- `public/js/count.js` es una copia del script de GoatCounter (ADR-0009). Dos veces al ano pide al agente que lo actualice desde `https://gc.zgo.at/count.js`.
- Comprobacion externa: https://dnsviz.net/d/rubo6.dev/ (DNSSEC), https://securityheaders.com/?q=rubo6.dev (cabeceras; solo mejora con el proxy), https://observatory.mozilla.org/ (vision general).

## Rotar el token de GitHub (cuando caduque)

1. https://github.com/settings/personal-access-tokens/new → Fine-grained token, Resource owner `rubo6`, "Only select repositories" → los repos que quieres medir, permiso **Administration: Read-only** únicamente, 1 año.
2. https://github.com/rubo6/rubo6.github.io/settings/secrets/actions → edita `GH_TRAFFIC_TOKEN`.
3. Lanza "Deploy to GitHub Pages" a mano en Actions o espera al cron diario.

## Certificaciones

Cuando termines una (DataCamp, AWS Academy, Anthropic, diploma de la Ibero en diciembre de 2026), pasa a quien edite el sitio el **nombre oficial exacto**, la **fecha** y el **enlace de verificación** (Credly, badge o PDF público). Se actualiza `src/content/certifications.json` (`status: earned`, `date`, `url`). Mientras no exista el certificado, los nombres se quedan genéricos.

## Repositorios

Un proyecto solo muestra enlace y estadísticas si su repo es público y aparece como `repo: owner/nombre` en `src/content/projects/*/<key>.md`. Pendiente: Keeper Save Probability. Los proyectos de curso cuyo código no puede publicarse llevan `visibility: course`; los de Mercado Libre, `visibility: confidential`.

## Archivos grandes (Git LFS)

Los JPEG originales de ESA/Webb y ESA/Hubble están en `src/assets/nebulae/raw/` con Git LFS (~91 MB; cuota gratuita 1 GB). Al clonar solo bajan punteros; el sitio se construye sin ellos. Para regenerar imágenes: `git lfs pull` y luego `node scripts/optimize-nebulae.mjs` o `optimize-scenes.mjs`.

## Lighthouse

`docs/lighthouse/latest.json` lo escribe un runner de GitHub después de cada deploy (mediana de tres corridas móviles). Referencia al 2026-09-05: móvil 81/100/100/100, escritorio 100/100/100/100. Un número medido en tu laptop con WhisperFlow abierto no vale; compara `benchmarkIndex`.

## Cada año

- Antes del 2027-09-01: actualizar `Expires` en `public/.well-known/security.txt`.
- Antes del 2027-09-03: comprobar la renovación del dominio.
- Revisar los PR de Dependabot cuando lleguen (semanal) y las alertas de CodeQL (mensual).

## Trabajar con modelos pequeños

El repo está preparado para que Sonnet, GPT o cualquier modelo modesto edite el sitio leyendo solo `AGENTS.md` y un archivo de `docs/`. Pide cambios pequeños y concretos ("añade la certificación X con este enlace", "nuevo puesto: estos datos"), pídele que use `npm run new` para proyectos y bitácora, y que corra `npm run validate` una sola vez al final. Si el modelo propone leer componentes para cambiar texto, recuérdale `docs/CONTENT.md`.

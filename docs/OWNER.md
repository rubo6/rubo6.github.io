# Guía para Rubo: lo que solo tú puedes hacer

Todo lo de aquí requiere tu cuenta, tu tarjeta o una decisión tuya; ningún agente puede hacerlo. Cada punto trae el enlace exacto. Lo ya hecho se marca con ✅ y se deja como referencia.

## Estado de las cuentas

- ✅ GitHub: 2FA, push protection, Dependabot, CodeQL, private vulnerability reporting (2026-09-03).
- ✅ Dominio `rubo6.dev` en Cloudflare Registrar (vence 2027-09-03), registros A/AAAA/CNAME en proxy de Cloudflare desde 2026-09-06 (ADR-0010), DNSSEC, CAA, SPF/DMARC/Null MX.
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

### Proxy de Cloudflare: activado el 2026-09-06 (ADR-0010)

Hecho por Rubo: registros en proxy, SSL Full (strict), Always Use HTTPS, TLS minimo 1.2, HSTS con preload, reglas gestionadas gratuitas, regla de limite `humano` (60 peticiones por 10 s por IP, bloqueo 10 s), Bot Fight Mode, Browser Integrity Check, regla `security-headers` con cinco cabeceras mas la CSP con `frame-ancestors 'none'`, cache "Respect Existing Headers", optimizaciones de Speed apagadas. securityheaders.com: todas las cabeceras en verde.

Reglas para no romperlo:

- Si alguien cambia la CSP en `src/layouts/Base.astro`, debe copiar el mismo valor a la regla `security-headers` en `Rules -> Overview` (mas `frame-ancestors 'none'`). Si no, el navegador aplica la mas estricta de las dos y algo deja de cargar.
- Nunca encender Rocket Loader, Auto Minify, Mirage, Polish ni Email Address Obfuscation: inyectan scripts o reescriben assets y la CSP los bloquea.
- Si el sitio muestra error 526, baja SSL/TLS a **Full** y pide al agente que investigue el certificado de GitHub.
- El aviso de DNS en la configuracion de GitHub Pages es esperado.
- Desde la red corporativa de Mercado Libre (VPN GlobalProtect) el sitio da `ERR_CONNECTION_RESET`: el filtro corta el TLS hacia `rubo6.dev`. No es un fallo del sitio; apaga la VPN o usa otra red. Si quieres verlo desde la oficina, pide a IT que categoricen el dominio.
- Alertas recomendadas en `Notifications -> Add`: HTTP DDoS Attack Alerter, Security Events Alert, Billing.

### Mantenimiento

- `public/js/count.js` es una copia del script de GoatCounter (ADR-0009). Dos veces al ano pide al agente que lo actualice desde `https://gc.zgo.at/count.js`.
- Comprobacion externa: https://dnsviz.net/d/rubo6.dev/ (DNSSEC), https://securityheaders.com/?q=https://rubo6.dev (cabeceras), https://observatory.mozilla.org/ (vision general). En `Security -> Analytics` se ven las peticiones bloqueadas por la regla `humano`.

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

# Guía para Rubo: lo que solo tú puedes hacer

Todo lo de aquí requiere tu cuenta, tu tarjeta o una decisión tuya; ningún agente puede hacerlo. Cada punto trae el enlace exacto. Lo ya hecho se marca con ✅ y se deja como referencia.

## Estado de las cuentas

- ✅ GitHub: 2FA, push protection, Dependabot, CodeQL, private vulnerability reporting (2026-09-03).
- ✅ Dominio `rubo6.dev` en Cloudflare Registrar (vence 2027-09-03), registros A/AAAA/CNAME en modo DNS-only, HTTPS forzado en GitHub Pages.
- ✅ GoatCounter `rubo6.goatcounter.com` con el contador público activado (2026-09-05). Panel: https://rubo6.goatcounter.com.
- ✅ Secreto `GH_TRAFFIC_TOKEN` en el repo (views/clones y calendario de contribuciones). Caduca al año de crearlo: cuando GitHub te avise, repite el paso de "Rotar el token".

## Cloudflare: lo que falta (15 minutos, todo gratis)

El sitio lo sirve GitHub Pages; Cloudflare solo es registrador y DNS. Por eso el tablero muestra 0 visitantes y sugiere "Proxy DNS records": **no lo actives**. Con el proxy naranja, GitHub no puede renovar el certificado del dominio y las herramientas de Cloudflare (WAF, caché, analítica, Bot Fight Mode, AI Crawl Control, robots.txt gestionado) no aportan nada a un sitio estático sin backend. Lo que sí conviene:

1. **DNSSEC**: `DNS → Settings → DNSSEC → Enable`. Como el registrador también es Cloudflare, el registro DS se publica solo. Evita que alguien suplante tus DNS.
2. **Anti-suplantación de correo**: nadie envía correo desde `@rubo6.dev`, así que hay que declararlo para que no puedan falsificar remitentes con tu dominio. `Email → DMARC Management` te lo hace en un clic, o añade en `DNS → Records`:
   - `TXT` `@` → `v=spf1 -all`
   - `TXT` `_dmarc` → `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;`
   - `MX` `@` → `.` con prioridad `0` (Null MX: "este dominio no recibe correo")
3. **CAA**: `DNS → Records → Add → CAA`, nombre `@`, flag `0`, tag `issue`, valor `letsencrypt.org`. GitHub Pages emite sus certificados con Let's Encrypt; así ninguna otra autoridad puede emitir uno para tu dominio. Repite con tag `issuewild` y el mismo valor.
4. **Registrar**: `Domain Registration → Manage → rubo6.dev`: auto-renew activado, transfer lock activado, redacción de WHOIS activada (viene por defecto).
5. **Cuenta**: `Manage account → Authentication → 2FA` con app autenticadora; guarda los códigos de recuperación en tu gestor de contraseñas.
6. **Avisos**: `Notifications → Add` → "Domain expiration" y "Billing"; el correo de la cuenta debe ser uno que leas.

Comprobación: https://dnsviz.net/d/rubo6.dev/ (DNSSEC) y https://mxtoolbox.com/SuperTool.aspx?action=dmarc%3arubo6.dev (DMARC). Si algún día quieres correo `hola@rubo6.dev`, `Email → Email Routing` lo redirige gratis a tu Gmail; entonces se quitan el Null MX y se ajusta el SPF.

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

# Guía para Rubo — cosas que solo tú puedes hacer

Todo lo de esta guía requiere tu cuenta o tu tarjeta; no lo puede hacer un agente. Cada punto trae el enlace exacto.

## 1. Activar 2FA en GitHub (10 minutos)

1. Entra a https://github.com/settings/security → "Two-factor authentication" → **Enable two-factor authentication**.
2. Elige **Authenticator app** (Google Authenticator, Microsoft Authenticator, 1Password, Bitwarden…). Escanea el QR y escribe el código de 6 dígitos.
3. **Descarga los recovery codes** y guárdalos en tu gestor de contraseñas. Sin ellos, perder el teléfono = perder la cuenta.
4. Opcional pero recomendado: añade una **passkey** o llave de seguridad en la misma página ("Passkeys" / "Security keys") como segundo factor de respaldo.
5. Referencia oficial: https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication

Después de activarlo, Windows Credential Manager seguirá funcionando para `git push` (usa un token OAuth, no tu contraseña).

## 2. Endurecer el repo (5 minutos)

- **Secret scanning y push protection** no aparecen en la página del repo porque en repos públicos GitHub ya escanea secretos por default. La protección al hacer push se activa a nivel de cuenta: https://github.com/settings/security_analysis → "Push protection for yourself" → **Enable**. Con eso GitHub bloquea cualquier push tuyo que contenga un token, en todos tus repos.
- ✅ Hecho el 2026-09-03: Dependabot alerts/security updates, Private vulnerability reporting, CodeQL.
- Misma página: confirma **Dependabot alerts** y **Dependabot security updates** activados.
- https://github.com/rubo6/rubo6.github.io/settings/branches → (opcional) regla para `main`: "Require status checks to pass" con `Validate` y `CodeQL`. Como haces push directo, puedes dejarlo para cuando haya colaboradores.

## 3. Token para estadísticas de repos (views y clones)

La API pública ya da stars, forks, lenguajes y commits sin token. Para **views/clones** (traffic) GitHub exige un token con acceso al repo:

1. https://github.com/settings/personal-access-tokens/new → **Fine-grained token**.
2. Resource owner: `rubo6`. Repository access: **Only select repositories** → elige los repos que quieres medir.
3. Permissions → Repository permissions → **Administration: Read-only** (traffic vive ahí). Nada más.
4. Expiration: 1 año. Genera y copia el token **una sola vez**.
5. https://github.com/rubo6/rubo6.github.io/settings/secrets/actions → **New repository secret** → nombre `GH_TRAFFIC_TOKEN`, pega el token.
6. Avísame: el workflow de deploy lo leerá en build time (nunca llega al navegador) y el loader de GitHub lo usará para pintar views en las estrellas.

Rotación: cuando expire, repite 1–5. Si el token se filtra, revócalo en https://github.com/settings/tokens.

## 4. Analítica de visitas sin cookies

Opciones que respetan la privacidad y no requieren banner de cookies:

| Opción                        | Costo                    | Cómo                                                                                                                                                                                                      |
| ----------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GoatCounter** (recomendada) | Gratis para uso personal | Crea cuenta en https://www.goatcounter.com/signup → código `rubo6` → te da un script `//rubo6.goatcounter.com/count.js`. Me pasas el nombre del sitio y yo integro el script y ajusto la CSP (ADR nuevo). |
| Cloudflare Web Analytics      | Gratis                   | Requiere cuenta Cloudflare; te da un token de sitio. Mismo procedimiento.                                                                                                                                 |
| Plausible / Umami cloud       | ~9 USD/mes               | Más completo; probablemente innecesario.                                                                                                                                                                  |

Lo que verás: visitas, páginas, país, referrer, dispositivo. Nada personal, sin cookies, sin consentimiento requerido.

## 5. Dominio propio

> ✅ **Hecho el 2026-09-03**: `rubo6.dev` comprado en Cloudflare, 4 registros A + CNAME `www`, dominio configurado en GitHub Pages (apex, `www` redirige solo). Pendiente: marcar **Enforce HTTPS** cuando GitHub emita el certificado (minutos a una hora) y, opcional, añadir los 4 registros `AAAA` (IPv6) `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`, tipo AAAA, nombre `@`, proxy desactivado.

### ¿Qué cambia entre terminaciones?

| TLD             | Precio/año aprox. (Cloudflare, sept. 2026) | Quién lo administra                                                  | Para quién es                         | Notas                                                                                                                                                                                                        |
| --------------- | ------------------------------------------ | -------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`.dev`** ⭐   | 12–13 USD                                  | Google Registry                                                      | Desarrolladores, portafolios técnicos | Toda la zona está en la lista **HSTS preload**: los navegadores solo la abren por HTTPS. Señal clara de "persona técnica". Recomendado para ti.                                                              |
| `.io`           | 35–45 USD                                  | Identity Digital (cesión del Territorio Británico del Océano Índico) | Startups, SaaS                        | De moda, pero 3× más caro y con incertidumbre a largo plazo: el territorio pasó a Mauricio en 2025 y la IANA podría retirar el ccTLD en unos años. No lo recomiendo para algo que quieres conservar décadas. |
| `.com`          | 10–12 USD                                  | Verisign                                                             | Todo el mundo                         | El más universal y barato; casi ningún nombre corto queda libre. Buen segundo dominio para redirigir.                                                                                                        |
| `.me`           | 15–20 USD                                  | Montenegro                                                           | Páginas personales                    | Se lee bien ("rubo.me") pero es un ccTLD extranjero.                                                                                                                                                         |
| `.mx`           | 25–35 USD                                  | NIC México                                                           | Presencia en México                   | Caro para lo que ofrece; útil solo si tu público es local.                                                                                                                                                   |
| `.ai` / `.tech` | 60+ / 40+ USD                              | Anguila / Radix                                                      | Marketing                             | Caros y con sabor a startup, no a persona.                                                                                                                                                                   |

**Recomendación**: `rubo.dev` si está libre; si no, `rubobernal.dev` o `eduardobernal.dev`. Compra en **Cloudflare Registrar** (cobra el precio de costo del registro, sin recargo, renovación al mismo precio y DNS incluido).

### Cómo comprarlo en Cloudflare, paso a paso (15 minutos)

1. **Cuenta**: https://dash.cloudflare.com/sign-up → correo + contraseña (usa tu gestor de contraseñas) → verifica el correo. Plan **Free**.
2. **Método de pago**: menú de la cuenta (arriba a la derecha) → _Billing_ → _Payment info_ → añade tarjeta.
3. **Buscar**: menú izquierdo → _Domain Registration_ → _Register Domains_ → escribe `rubo` → verás disponibilidad y precio por terminación. Elige `.dev`.
4. **Comprar**: _Purchase_ → selecciona 1 año (o varios, no hay descuento pero te olvidas de renovar) → activa **Auto-renew** → llena los datos de contacto WHOIS (Cloudflare los oculta gratis con redacción de WHOIS, así que no se publican) → paga.
5. **DNS** (el dominio queda automáticamente en tu cuenta de Cloudflare): menú izquierdo → _Websites_ → tu dominio → _DNS_ → _Records_ → _Add record_ cuatro veces:
   - Tipo `A`, nombre `@`, contenido `185.199.108.153`, proxy **desactivado** (nube gris)
   - Tipo `A`, nombre `@`, `185.199.109.153`, proxy desactivado
   - Tipo `A`, nombre `@`, `185.199.110.153`, proxy desactivado
   - Tipo `A`, nombre `@`, `185.199.111.153`, proxy desactivado
   - Tipo `CNAME`, nombre `www`, contenido `rubo6.github.io`, proxy desactivado
     El proxy naranja de Cloudflare se deja apagado para que GitHub pueda emitir el certificado HTTPS.
6. **GitHub**: https://github.com/rubo6/rubo6.github.io/settings/pages → _Custom domain_ → escribe `rubo.dev` → _Save_ → espera el check de DNS (minutos) → activa **Enforce HTTPS** cuando aparezca disponible (puede tardar hasta una hora).
7. **Avísame**: yo añado `public/CNAME`, cambio `site` en `astro.config.ts`, actualizo sitemap, `security.txt`, README y las URLs canónicas, y verifico redirecciones `www` → raíz y `rubo6.github.io` → dominio nuevo.
8. Opcional después: verifica el dominio en https://github.com/settings/pages (_Add a domain_) para que nadie más pueda apuntar Pages a él.

Cuando lo compres: 1) en el registrador crea registros DNS `A` a `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` y `CNAME www → rubo6.github.io`; 2) en https://github.com/rubo6/rubo6.github.io/settings/pages pon el dominio en "Custom domain" y activa **Enforce HTTPS**; 3) avísame y yo añado `public/CNAME`, actualizo `site` en la config, el sitemap, `security.txt` y el README. Guía oficial: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

## 6. Publicar WhisperFlow

1. Crea el repo vacío en https://github.com/new → nombre `whisperflow`, público, **sin** README/licencia/.gitignore (ya los tiene).
2. Avísame y yo hago el push de la copia saneada que preparé (sin `runtime/`, `models/`, config personal ni menciones a controles de seguridad corporativos).

## 7. Certificaciones

Cuando termines DataCamp, AWS Academy o Anthropic, o recibas el diploma de la Ibero en diciembre 2026, pásame el **enlace de verificación** (Credly, badge URL o PDF público) y la fecha; se actualizan en `src/content/certifications.json` (`status: earned`, `date`, `url`) y aparecen como estrellas en la nebulosa "En curso".

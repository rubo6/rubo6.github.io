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

- https://github.com/rubo6/rubo6.github.io/settings/security_analysis → activa **Secret scanning** y **Push protection** (gratis en repos públicos).
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

Precios aproximados anuales (septiembre 2026): `.dev` 12–15 USD, `.com` 10–15 USD, `.mx` 25–35 USD, `.io` 35–50 USD. Registradores serios: **Cloudflare Registrar** (precio de costo, sin markup, el más barato), Porkbun, Namecheap. Evita GoDaddy (renovaciones caras).

Sugerencias disponibles a verificar: `rubo.dev`, `rubobernal.dev`, `eduardobernal.dev`, `eruben.dev`.

Cuando lo compres: 1) en el registrador crea registros DNS `A` a `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` y `CNAME www → rubo6.github.io`; 2) en https://github.com/rubo6/rubo6.github.io/settings/pages pon el dominio en "Custom domain" y activa **Enforce HTTPS**; 3) avísame y yo añado `public/CNAME`, actualizo `site` en la config, el sitemap, `security.txt` y el README. Guía oficial: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

## 6. Publicar WhisperFlow

1. Crea el repo vacío en https://github.com/new → nombre `whisperflow`, público, **sin** README/licencia/.gitignore (ya los tiene).
2. Avísame y yo hago el push de la copia saneada que preparé (sin `runtime/`, `models/`, config personal ni menciones a controles de seguridad corporativos).

## 7. Certificaciones

Cuando termines DataCamp, AWS Academy o Anthropic, o recibas el diploma de la Ibero en diciembre 2026, pásame el **enlace de verificación** (Credly, badge URL o PDF público) y la fecha; se actualizan en `src/content/certifications.json` (`status: earned`, `date`, `url`) y aparecen como estrellas en la nebulosa "En curso".

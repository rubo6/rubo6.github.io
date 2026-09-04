# Prompts para assets visuales (meliGPT)

> Genera estos assets con los modelos indicados y pásame los archivos. Yo los convierto a AVIF/WebP, genero variantes responsive y los meto en `src/assets/`. Todo lo generado se acredita en `docs/DESIGN-SYSTEM.md` como "ilustración generada, inspirada en <objeto real>". No uses fotos con personas ni texto dentro de la imagen.

## Reglas generales para todos los prompts

- Paleta obligatoria: fondo índigo profundo `#0B1026` a `#141B3D`; acentos dorado `#F2C46D`, coral `#F07A6E`, cian pálido `#9AD9E8`. Nada de morado saturado ni neón.
- Sin texto, sin letras, sin marcas de agua, sin planetas caricaturescos, sin naves.
- Estilo: fotografía astronómica de largo tiempo de exposición, tipo Hubble/JWST, con grano fino y estrellas puntuales, **no** render 3D ni ilustración plana.
- Formato: el más grande que permita el modelo. Relación de aspecto indicada por asset.

## Modelo recomendado por asset

| Asset                         | Modelo                                                                | Por qué                                                |
| ----------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------ |
| Nebulosas (6)                 | **Nano Banana** (Google) primero; si falla la paleta, **GPT Image 2** | Mejor control de color y textura fotográfica en stills |
| Fondo hero                    | **GPT Image 2**                                                       | Composición amplia y limpia, buena para recorte        |
| Universo personal             | **Nano Banana**                                                       | Colores cálidos y orgánicos                            |
| Video (opcional, fase futura) | **Veo 3.1 Generate**                                                  | Solo si decidimos loop de fondo; hoy no, por peso      |

## 1. Nebulosas profesionales (una por categoría)

Aspect ratio 1:1 para todas. Cada una será una "nebulosa" clicable en el observatorio.

### 1.1 Orión (M42) — Profesional / Mercado Libre

```
Deep-space astrophotography of the Orion Nebula M42, wide field, seen through a large telescope. Glowing gas clouds in warm gold (#F2C46D) and soft coral (#F07A6E) over a deep indigo background (#0B1026), with pale cyan (#9AD9E8) highlights at the core. Sharp pinpoint stars, fine film grain, long exposure look, Hubble-style processing. Square composition, nebula centered with dark empty space around it. No text, no watermark, no planets, no spacecraft.
```

### 1.2 Carina (NGC 3372) — Académico / ITAM

```
Deep-space astrophotography of the Carina Nebula, JWST-style cliffs of gas and dust. Towering dust structures rendered in muted gold and amber (#F2C46D), backlit by pale cyan (#9AD9E8) ionized gas, on a deep indigo sky (#0B1026). Dense field of sharp pinpoint stars, subtle film grain, long exposure. Square composition, cliffs rising from the lower-left, dark space upper-right. No text, no watermark.
```

### 1.3 Águila / Pilares de la Creación (M16) — Investigación

```
Deep-space astrophotography of the Pillars of Creation in the Eagle Nebula M16. Three columns of dark dust rendered in deep indigo and charcoal (#141B3D), edges glowing in gold (#F2C46D) and coral (#F07A6E), against a faint pale cyan (#9AD9E8) background haze. Sharp stars, fine grain, Hubble-style. Square composition, pillars slightly off-center. No text, no watermark.
```

### 1.4 Hélice (NGC 7293) — Personal / side projects

```
Deep-space astrophotography of the Helix Nebula, a planetary nebula seen face-on like a giant eye. Concentric rings of gas in pale cyan (#9AD9E8) fading to gold (#F2C46D) at the outer edge, dark indigo center (#0B1026), a single bright white dwarf at the middle. Deep indigo background with sharp stars, subtle grain. Perfectly centered square composition. No text, no watermark.
```

### 1.5 Laguna (M8) — Comunidad / liderazgo (DataLab, AIESEC)

```
Deep-space astrophotography of the Lagoon Nebula M8, a wide bright emission nebula. Flowing warm coral (#F07A6E) and gold (#F2C46D) gas with a dark lane crossing the center, a scattered open star cluster embedded in it, on a deep indigo sky (#0B1026). Sharp stars, fine grain, long exposure. Square composition. No text, no watermark.
```

### 1.6 Cabeza de Caballo (Barnard 33) — Aprendizaje en curso / próximos proyectos

```
Deep-space astrophotography of the Horsehead Nebula, a dark silhouette of dust shaped like a horse's head rising against a glowing backdrop. Backdrop in soft coral (#F07A6E) blending to gold (#F2C46D), silhouette in deep indigo (#0B1026) with pale cyan (#9AD9E8) rim light. Sparse sharp stars, fine grain, Hubble-style. Square composition, silhouette in lower-center. No text, no watermark.
```

## 2. Fondo del hero (cielo profundo, se combina con el canvas de estrellas reales)

Aspect ratio 16:9 (o el más ancho disponible). Debe ser oscuro y limpio: las estrellas reales las dibujo yo encima.

```
Ultra-wide deep-space background, almost empty sky, very dark indigo (#0B1026 to #141B3D) with an extremely faint band of the Milky Way crossing diagonally from lower-left to upper-right in muted gold (#F2C46D at 10% opacity) and pale cyan haze (#9AD9E8 at 5% opacity). No bright stars, no nebulae, no planets, no horizon. Subtle film grain. Smooth gradients suitable as a website background. No text, no watermark.
```

## 3. Universo personal (fondo del modo "Rubo")

Aspect ratio 16:9. Mismo universo, otra temperatura: más cálido y orgánico, para el cambio de modo.

```
Ultra-wide deep-space background for a warm, personal mood. Deep indigo sky (#141B3D) with soft flowing clouds of amber and gold (#F2C46D) and gentle coral (#F07A6E), like a distant reflection nebula seen through thin dust, plus a faint pale cyan (#9AD9E8) glow on one side. No bright stars, no planets, no horizon, no text. Smooth, low-contrast gradients suitable as a website background. Subtle film grain. No watermark.
```

## 4. Avatar ilustrado (elegido por Rubo, basado en la foto de LinkedIn)

Aspect ratio 1:1, 1024×1024 o más. Modelo **GPT Image 2** primero; alternativa **Nano Banana**. Genera 3 variantes y elige.

Descripción base tomada de la foto de perfil: hombre joven de rasgos latinos, cabello oscuro corto y peinado hacia arriba, lentes de armazón oscuro, sonrisa ligera, saco oscuro y camisa blanca.

### 4.1 Versión "carta celeste" (para el hero y el README)

```
Minimal constellation-style portrait of a young Latino man in his early twenties: short dark hair styled upward, dark-rimmed glasses, light smile, dark blazer over a white shirt, facing slightly left. The face and shoulders are drawn as thin gold (#F2C46D) lines connecting small bright star points at the key features (eyes, glasses corners, jaw, collar), like a constellation chart, with a very subtle soft coral (#F07A6E) glow around the head. Deep indigo background (#0B1026) with a few faint scattered stars. Elegant, precise, editorial. No text, no letters, no watermark, no photorealism.
```

### 4.2 Versión "retrato editorial" (para Open Graph y LinkedIn)

```
Editorial illustrated portrait of a young Latino man in his early twenties: short dark hair styled upward, dark-rimmed rectangular glasses, calm confident half-smile, dark navy blazer and white shirt, three-quarter view. Flat vector style with soft shading, limited palette: deep indigo (#0B1026) background, ivory (#F4EFE6) highlights, warm gold (#F2C46D) rim light on one side and a faint coral (#F07A6E) nebula glow behind the shoulders. Clean shapes, no outlines heavier than 2 px, no text, no watermark.
```

### 4.3 Versión "atlas" (tema claro)

```
Same portrait as above rendered as a 19th-century star-atlas engraving: fine cross-hatched night-blue ink (#1B2240) lines on ivory paper (#F6F1E7), small gold (#A67C2E) star marks at the facial landmarks connected by thin lines, subtle paper grain. No text, no watermark.
```

## 5. Video del retrato (opcional, Veo 3.1 Generate)

Se muestra como pestaña del "ocular" del hero solo si existe `public/media/portrait.mp4` (y opcionalmente `portrait.webm`). Nunca autoplay: el visitante lo reproduce; con `prefers-reduced-motion` no hace loop. Objetivo: 6–8 s, vertical 4:5, sin audio, menos de 3 MB. Usa como imagen de entrada `rubo6-avatar-editorial.png` para que sea la misma persona.

```
Cinematic 6-second seamless loop of an illustrated portrait of a young Latino man in his early twenties with short dark curly hair, dark-rimmed glasses, navy blazer and white shirt, looking calmly at the camera with a slight smile. Flat-vector editorial illustration style with soft shading. Behind him a deep indigo (#0B1026) night sky with a faint coral (#F07A6E) nebula drifting very slowly and tiny gold (#F2C46D) stars gently twinkling; a warm rim light on his right side breathes slowly. Only a subtle head movement and one blink; static camera. No text, no logos, no fast motion.
```

Al recibirlo lo recorto a 4:5, genero `.mp4` (H.264) y `.webm` (VP9) con póster del retrato editorial y documento el crédito.

## 6. Estado de los assets generados (2026-09-04)

| Prompt                          | Archivo en Descargas (renombrado)                       | Uso en el sitio                                                                     |
| ------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 1.1–1.5 nebulosas               | `rubo6-nebula-{orion,carina,eagle,helix,lagoon}-ai.png` | Sustituidas por imágenes oficiales JWST/Hubble; quedan como respaldo fuera del repo |
| 2 fondo hero                    | `rubo6-hero-milkyway-bg-wide.png`                       | `src/assets/generated/hero-bg.*` detrás del canvas del cielo                        |
| 3 universo personal             | `rubo6-universe-personal-bg-square.png`                 | `src/assets/generated/personal-bg.*` fondo de la escena personal                    |
| 4.1 carta celeste (Nano Banana) | `rubo6-avatar-constellation.png`                        | Retrato en modo personal                                                            |
| 4.2 editorial (GPT Image 2)     | `rubo6-avatar-editorial.png`                            | Retrato por default, póster del video, Open Graph                                   |
| 4.3 atlas                       | `rubo6-avatar-atlas-engraving.png`                      | Retrato en tema atlas (claro)                                                       |
| Foto real de LinkedIn           | `rubo6-linkedin-photo-PRIVATE-do-not-publish.png`       | **Privada**: solo referencia para los prompts; no se sube al repo                   |

## Qué NO vamos a generar

- Video de fondo en loop: pesa mucho y baja Lighthouse; se reserva para una fase futura con Veo 3.1 si el sitio ya vuela.
- Imágenes con texto: todo el texto va en HTML por accesibilidad y traducción.

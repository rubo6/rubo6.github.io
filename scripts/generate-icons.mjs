// Generates PNG icons and the default Open Graph image from public/favicon.svg using sharp.
// Run: node scripts/generate-icons.mjs  (committed outputs live in public/icons and public/og)
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const svg = await readFile(new URL('../public/favicon.svg', import.meta.url));
await mkdir(new URL('../public/icons/', import.meta.url), { recursive: true });
await mkdir(new URL('../public/og/', import.meta.url), { recursive: true });

const out = (p) => fileURLToPath(new URL(`../public/${p}`, import.meta.url));

await sharp(svg).resize(192, 192).png().toFile(out('icons/icon-192.png'));
await sharp(svg).resize(512, 512).png().toFile(out('icons/icon-512.png'));
await sharp(svg).resize(180, 180).png().toFile(out('icons/apple-touch-icon.png'));

// Maskable: icon centred in a safe zone on the brand background.
const bg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#060814"/></svg>`,
);
const inner = await sharp(svg).resize(400, 400).png().toBuffer();
await sharp(bg)
  .composite([{ input: inner, gravity: 'centre' }])
  .png()
  .toFile(out('icons/icon-maskable-512.png'));

// Open Graph 1200×630: dark sky, constellation mark, name and role. Text is drawn as SVG (self-contained).
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#141b3d"/><stop offset="1" stop-color="#060814"/>
    </linearGradient>
    <radialGradient id="n" cx="0.8" cy="0.3" r="0.6">
      <stop offset="0" stop-color="#f07a6e" stop-opacity="0.35"/><stop offset="1" stop-color="#f07a6e" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect width="1200" height="630" fill="url(#n)"/>
  ${Array.from({ length: 70 }, (_, i) => {
    // deterministic pseudo-positions (no randomness): golden-angle spiral
    const a = i * 2.399963;
    const r = 30 + Math.sqrt(i) * 80;
    const x = 600 + Math.cos(a) * r * 1.6;
    const y = 315 + Math.sin(a) * r;
    const s = 1 + (i % 3);
    return x > 0 && x < 1200 && y > 0 && y < 630
      ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${s}" fill="#f4efe6" opacity="${(0.35 + (i % 5) * 0.12).toFixed(2)}"/>`
      : '';
  }).join('')}
  <g transform="translate(96 96)">
    <circle cx="40" cy="40" r="36" fill="none" stroke="#f2c46d" stroke-opacity=".5" stroke-width="2"/>
    <circle cx="40" cy="40" r="7" fill="#f2c46d"/>
    <circle cx="66" cy="20" r="3.5" fill="#f4efe6"/><circle cx="16" cy="56" r="3" fill="#9ad9e8"/>
    <path d="M40 40 L66 20 M40 40 L16 56" stroke="#f2c46d" stroke-width="1.6" stroke-opacity=".8"/>
  </g>
  <text x="96" y="330" font-family="Georgia, 'Iowan Old Style', serif" font-size="72" fill="#f4efe6">Eduardo Rubén Bernal Puente</text>
  <text x="96" y="392" font-family="Georgia, serif" font-size="34" fill="#f2c46d">Junior Data Analyst · Data Science @ ITAM</text>
  <text x="96" y="470" font-family="Consolas, 'Courier New', monospace" font-size="22" fill="#9ad9e8" letter-spacing="4">RUBO6.GITHUB.IO · PERSONAL OBSERVATORY · MEXICO CITY</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile(out('og/default.png'));

await writeFile(out('icons/.gitkeep'), '');
console.log('icons + og generated');

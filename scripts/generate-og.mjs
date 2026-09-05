// Generates one Open Graph image (1200×630 PNG) per study-log entry into public/og/log/<key>.png.
// Runs before `astro build` (see package.json). Deterministic, no network, text drawn as SVG.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const OUT = root('public/og/log/');
await mkdir(OUT, { recursive: true });

const AREA_COLORS = {
  math: '#f2c46d',
  stats: '#9ad9e8',
  computing: '#a8e6cf',
  datascience: '#f07a6e',
  economics: '#d9a45b',
  humanities: '#c9b8ff',
  astronomy: '#f4efe6',
  work: '#ffd6a5',
  leadership: '#f07a6e',
};
const AREA_LABEL = {
  math: 'Mathematics',
  stats: 'Probability & statistics',
  computing: 'Computing',
  datascience: 'Data science & AI',
  economics: 'Economics',
  humanities: 'Humanities',
  astronomy: 'Astronomy',
  work: 'Work',
  leadership: 'Leadership',
};

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Greedy word wrap for a monospace-ish estimate (chars per line). */
function wrap(text, max) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max) {
      lines.push(line.trim());
      line = w;
    } else line = (line + ' ' + w).trim();
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

function frontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  const fm = {};
  if (!m) return fm;
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^['"]|['"]$/g, '');
  }
  return fm;
}

// English titles are the canonical ones for the social card (one image per key).
const dir = root('src/content/posts/en/');
let count = 0;
for (const file of await readdir(dir)) {
  if (!file.endsWith('.md')) continue;
  const fm = frontmatter(await readFile(dir + file, 'utf8'));
  if (!fm.key || !fm.title) continue;
  const color = AREA_COLORS[fm.area] ?? '#f2c46d';
  const lines = wrap(fm.title, 34);
  const fontSize = lines.length > 3 ? 46 : 54;
  const startY = 250;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#141b3d"/><stop offset="1" stop-color="#060814"/></linearGradient>
    <radialGradient id="n" cx="0.85" cy="0.2" r="0.6"><stop offset="0" stop-color="${color}" stop-opacity="0.28"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect width="1200" height="630" fill="url(#n)"/>
  ${Array.from({ length: 60 }, (_, i) => {
    const a = i * 2.399963;
    const r = 40 + Math.sqrt(i) * 90;
    const x = 600 + Math.cos(a) * r * 1.7;
    const y = 315 + Math.sin(a) * r;
    return x > 0 && x < 1200 && y > 0 && y < 630
      ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${1 + (i % 3)}" fill="#f4efe6" opacity="${(0.25 + (i % 5) * 0.1).toFixed(2)}"/>`
      : '';
  }).join('')}
  <rect x="96" y="120" width="8" height="${lines.length * fontSize * 1.15 + 20}" rx="4" fill="${color}"/>
  <text x="128" y="110" font-family="Consolas, 'Courier New', monospace" font-size="22" fill="${color}" letter-spacing="4">OBSERVATION LOG · ${esc((AREA_LABEL[fm.area] ?? '').toUpperCase())}${fm.semester ? ' · ' + esc(fm.semester.toUpperCase()) : ''}</text>
  ${lines.map((l, i) => `<text x="128" y="${startY + i * fontSize * 1.15 - (lines.length - 1) * 20}" font-family="Georgia, 'Iowan Old Style', serif" font-size="${fontSize}" fill="#f4efe6">${esc(l)}</text>`).join('')}
  <text x="128" y="540" font-family="Georgia, serif" font-size="28" fill="#f2c46d">Eduardo Rubén Bernal Puente</text>
  <text x="128" y="578" font-family="Consolas, 'Courier New', monospace" font-size="20" fill="#9ad9e8" letter-spacing="3">RUBO6.DEV/LOG · ${esc(fm.date ?? '')}</text>
</svg>`;
  await writeFile(
    `${OUT}${fm.key}.png`,
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer(),
  );
  count += 1;
}
console.log(`og: ${count} log images generated`);

// Turns official ESA/Webb / ESA/Hubble releases in src/assets/nebulae/raw/<release-id>.jpg into the
// wide 1600×900 AVIF/WebP "scene" backdrops used by section and page headers (log entries, 404,
// Now, log index, contact). Mapping, crop hints and credit lines live in src/assets/scenes/credits.json.
// Run: node scripts/optimize-scenes.mjs [id ...]   (raw/ is stored in Git LFS; outputs are committed as normal files)
// Without ids every scene is re-encoded; pass ids to touch only those files.
// `shape: "portrait"` in credits.json renders 900×1200 instead of 1600×900 (contact-form panel).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const raw = (f) => fileURLToPath(new URL(`../src/assets/nebulae/raw/${f}`, import.meta.url));
const out = (f) => fileURLToPath(new URL(`../src/assets/scenes/${f}`, import.meta.url));

const SHAPES = { wide: [1600, 900], portrait: [900, 1200] };
const only = process.argv.slice(2);
const AVIF_MAX = 200 * 1024;
const WEBP_MAX = 300 * 1024;

async function encodeUnder(pipeline, format, max) {
  for (let q = 80; q >= 28; q -= 4) {
    const buf = await pipeline.clone()[format]({ quality: q, effort: 6 }).toBuffer();
    if (buf.length <= max) return { buf, q };
  }
  throw new Error(`could not fit ${format} under ${max} bytes`);
}

await mkdir(out(''), { recursive: true });
const credits = JSON.parse(await readFile(out('credits.json'), 'utf8'));

for (const c of credits) {
  if (only.length && !only.includes(c.id)) continue;
  const [W, H] = SHAPES[c.shape ?? 'wide'];
  const src = sharp(raw(`${c.release}.jpg`), { limitInputPixels: false }).rotate();
  const meta = await src.metadata();
  const wide = src
    .clone()
    .resize(W, H, { fit: 'cover', position: c.crop ?? 'attention' })
    .withMetadata({})
    .toColourspace('srgb');
  const avif = await encodeUnder(wide, 'avif', AVIF_MAX);
  const webp = await encodeUnder(wide, 'webp', WEBP_MAX);
  await writeFile(out(`${c.id}.avif`), avif.buf);
  await writeFile(out(`${c.id}.webp`), webp.buf);
  console.log(
    `${c.id} ← ${c.release} ${meta.width}×${meta.height} → avif ${(avif.buf.length / 1024).toFixed(0)} KB (q${avif.q}), webp ${(webp.buf.length / 1024).toFixed(0)} KB (q${webp.q})`,
  );
}

// Turns the official nebula releases in src/assets/nebulae/raw/<id>.{jpg,png} into the
// square 1200×1200 AVIF/WebP pairs (+ 240×240 WebP thumb) consumed by the observatory UI.
// Run: node scripts/optimize-nebulae.mjs   (raw/ is stored in Git LFS; outputs are committed as normal files)
// Sources and credit lines live in src/assets/nebulae/credits.json.
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const dir = (p) => fileURLToPath(new URL(`../src/assets/nebulae/${p}`, import.meta.url));

const SIZE = 1200;
const THUMB = 240;
const AVIF_MAX = 180 * 1024;
const WEBP_MAX = 260 * 1024;

// Crop strategy per id. `attention` = sharp's saliency crop, `entropy` = busiest region,
// `centre` = plain centre crop. Chosen by eye against the 4000 px publication JPEGs.
const CROP = {
  professional: 'attention', // Orion Bar (weic2315b): bright stars + orange bar sit lower-right
  academic: 'attention', // Cosmic Cliffs (weic2205a): the cliff edge runs along the lower half
  research: 'centre', // Pillars full view (weic2216b): portrait, pillars are centred
  personal: 'centre', // Helix (weic2601a): NIRCam close-up of the knots; detail is spread evenly
  community: 'centre', // Lagoon (heic1808a): portrait, Herschel 36 region is centred
  upcoming: 'attention',
  music: 'centre', // Butterfly (heic2011b): the wings fill the frame
  gaming: 'centre', // Cat's Eye (heic0414a): centred planetary nebula // Horsehead (weic2411a): near-square source; mane along the bottom, bright star top
};

async function encodeUnder(pipeline, format, max) {
  // Step quality down until the encoded buffer fits the budget.
  for (let q = 82; q >= 30; q -= 4) {
    const opts = format === 'avif' ? { quality: q, effort: 6 } : { quality: q, effort: 6 };
    const buf = await pipeline.clone()[format](opts).toBuffer();
    if (buf.length <= max) return { buf, q };
  }
  throw new Error(`could not fit ${format} under ${max} bytes`);
}

// Only ids registered in credits.json are processed: raw/ also holds originals for src/assets/scenes.
const knownIds = new Set(JSON.parse(await readFile(dir('credits.json'), 'utf8')).map((c) => c.id));
const files = (await readdir(dir('raw'))).filter(
  (f) => /\.(jpe?g|png|tiff?)$/i.test(f) && knownIds.has(f.replace(/\.[^.]+$/, '')),
);
if (files.length === 0) throw new Error('no raw images found in src/assets/nebulae/raw');

for (const file of files) {
  const id = file.replace(/\.[^.]+$/, '');
  const position = CROP[id] ?? 'attention';
  const src = sharp(dir(`raw/${file}`)).rotate();
  const meta = await src.metadata();

  const square = src
    .clone()
    .resize(SIZE, SIZE, { fit: 'cover', position })
    .withMetadata({})
    .toColourspace('srgb');
  const avif = await encodeUnder(square, 'avif', AVIF_MAX);
  const webp = await encodeUnder(square, 'webp', WEBP_MAX);
  await writeFile(dir(`${id}.avif`), avif.buf);
  await writeFile(dir(`${id}.webp`), webp.buf);

  await sharp(webp.buf)
    .resize(THUMB, THUMB)
    .webp({ quality: 78, effort: 6 })
    .toFile(dir(`${id}-thumb.webp`));

  const kb = async (p) => `${((await stat(dir(p))).size / 1024).toFixed(0)} KB`;
  console.log(
    `${id.padEnd(13)} ${meta.width}x${meta.height} crop=${position.padEnd(9)} ` +
      `avif q${avif.q} ${await kb(`${id}.avif`)}  webp q${webp.q} ${await kb(`${id}.webp`)}  thumb ${await kb(`${id}-thumb.webp`)}`,
  );
}

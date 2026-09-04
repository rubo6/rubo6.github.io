// Optimizes the owner-generated artwork (avatars, backgrounds) from src/assets/generated/raw
// into AVIF + WebP variants used by the site. Raw PNGs are git-ignored; run this after adding new art.
//   node scripts/optimize-generated.mjs
import { mkdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const RAW = 'src/assets/generated/raw/';
const OUT = 'src/assets/generated/';
await mkdir(root(OUT), { recursive: true });

/** @type {Array<{src:string,out:string,width:number,height?:number,fit?:'cover'|'inside',position?:string,avif:number,webp:number}>} */
const jobs = [
  // Portrait avatars — 4:5 frame used by the hero "eyepiece"
  {
    src: 'rubo6-avatar-editorial.png',
    out: 'avatar-editorial',
    width: 880,
    height: 1100,
    fit: 'cover',
    position: 'attention',
    avif: 58,
    webp: 82,
  },
  {
    src: 'rubo6-avatar-constellation.png',
    out: 'avatar-constellation',
    width: 880,
    height: 1100,
    fit: 'cover',
    position: 'attention',
    avif: 58,
    webp: 82,
  },
  {
    src: 'rubo6-avatar-atlas-engraving.png',
    out: 'avatar-atlas',
    width: 880,
    height: 1100,
    fit: 'cover',
    position: 'attention',
    avif: 60,
    webp: 84,
  },
  // Square thumbnails (README, OG, favicon-sized uses)
  {
    src: 'rubo6-avatar-editorial.png',
    out: 'avatar-editorial-square',
    width: 640,
    height: 640,
    fit: 'cover',
    position: 'attention',
    avif: 58,
    webp: 82,
  },
  // Backgrounds — low quality is fine, they sit behind blur/canvas
  {
    src: 'rubo6-hero-milkyway-bg-wide.png',
    out: 'hero-bg',
    width: 1920,
    fit: 'inside',
    avif: 40,
    webp: 62,
  },
  {
    src: 'rubo6-universe-personal-bg-square.png',
    out: 'personal-bg',
    width: 1400,
    fit: 'inside',
    avif: 40,
    webp: 62,
  },
];

for (const j of jobs) {
  const input = root(RAW + j.src);
  await stat(input); // throws if missing
  const base = sharp(input).resize({
    width: j.width,
    height: j.height,
    fit: j.fit ?? 'cover',
    position: j.position ?? 'centre',
    withoutEnlargement: true,
  });
  await base
    .clone()
    .avif({ quality: j.avif, effort: 6 })
    .toFile(root(`${OUT}${j.out}.avif`));
  await base
    .clone()
    .webp({ quality: j.webp, effort: 6 })
    .toFile(root(`${OUT}${j.out}.webp`));
  const a = await stat(root(`${OUT}${j.out}.avif`));
  const w = await stat(root(`${OUT}${j.out}.webp`));
  console.log(
    `${j.out.padEnd(26)} avif ${(a.size / 1024).toFixed(0).padStart(4)} KB   webp ${(w.size / 1024).toFixed(0).padStart(4)} KB`,
  );
}

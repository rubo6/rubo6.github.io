// Real end-to-end probe of the contact dialog against the dev server (:4321) + local Worker (:8787, dry-run).
// Usage: node scripts/probe-contact.mjs <outdir> [base]   (needs `npm run dev` on :4321 and `npm run worker:dev`)
import { chromium, webkit, devices } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const OUT = process.argv[2] ?? 'test-results/signal';
const BASE = process.argv[3] ?? 'http://127.0.0.1:4321';
mkdirSync(OUT, { recursive: true });

const targets = [
  ['desktop', chromium, { viewport: { width: 1380, height: 900 }, colorScheme: 'dark' }],
  ['pixel7', chromium, { ...devices['Pixel 7'], colorScheme: 'dark' }],
  ['iphone14', webkit, devices['iPhone 14']],
  ['safari', webkit, { ...devices['Desktop Safari'], viewport: { width: 1380, height: 900 } }],
];

for (const [name, engine, opts] of targets) {
  const browser = await engine.launch();
  const ctx = await browser.newContext({ ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push('console: ' + m.text()));
  const api = [];
  page.on(
    'response',
    (r) =>
      r.url().includes('/api/contact') &&
      api.push(`${r.request().method()} ${new URL(r.url()).pathname} → ${r.status()}`),
  );

  await page.goto(BASE + '/es/', { waitUntil: 'networkidle' });
  const open = page.locator('[data-signal-open]').first();
  await open.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/${name}-1-card.png` });
  await open.click();
  const dialog = page.locator('dialog[data-signal]');
  await dialog.waitFor({ state: 'visible' });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${name}-2-open.png` });

  const styles = await page.evaluate(() => {
    const g = document.querySelector('dialog[data-signal] .glass');
    const cs = getComputedStyle(g);
    const before = getComputedStyle(g, '::before');
    return {
      backdrop: cs.backdropFilter || cs.webkitBackdropFilter,
      radius: cs.borderTopLeftRadius,
      cols: cs.gridTemplateColumns,
      rimMask: before.maskImage || before.webkitMaskImage,
      rimComposite: before.maskComposite || before.webkitMaskComposite,
      openAttr: document.querySelector('dialog[data-signal]').open,
    };
  });

  await dialog.locator('input[name="name"]').fill('Ada Lovelace');
  await dialog.locator('input[name="email"]').fill('ada@example.org');
  await dialog.locator('input[name="subject"]').fill('Prueba real desde ' + name);
  await dialog
    .locator('textarea[name="message"]')
    .fill(
      'Hola Rubo,\n\nEsto es una prueba del formulario con el Worker local en modo dry-run.\n\nSaludos',
    );
  await dialog.locator('input[type="file"]').setInputFiles([
    {
      name: 'cv-prueba.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\n%fake\n'),
    },
    { name: 'nota.txt', mimeType: 'text/plain', buffer: Buffer.from('texto plano') },
  ]);
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/${name}-3-filled.png` });
  // A person needs a few seconds to type; the Worker refuses solutions younger than 3 s (too_fast).
  await page.waitForTimeout(3500);
  await dialog.locator('[data-signal-submit]').click();
  try {
    await dialog.locator('[data-signal-done]').waitFor({ state: 'visible', timeout: 30_000 });
  } catch {
    const status = await dialog.locator('[data-signal-status]').textContent();
    await page.screenshot({ path: `${OUT}/${name}-3b-failed.png` });
    console.log(JSON.stringify({ name, failedStatus: status, api, errors }));
    await browser.close();
    continue;
  }
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/${name}-4-done.png` });

  // Theme switch while open (atlas), then close with Escape.
  if (name === 'desktop') {
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'atlas'));
    await page.waitForTimeout(500);
    await dialog.locator('[data-signal-done] [data-signal-close]').click();
    await page.waitForTimeout(500);
    await open.click();
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/${name}-5-atlas.png` });
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  const closed = await page.evaluate(() => !document.querySelector('dialog[data-signal]').open);

  console.log(JSON.stringify({ name, styles, api, closed, errors }, null, 1));
  await browser.close();
}

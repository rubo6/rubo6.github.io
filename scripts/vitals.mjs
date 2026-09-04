// Measures Core Web Vitals (LCP, CLS, INP-proxy via long tasks / TBT, FCP, transfer weight, request count)
// on the production build served by `astro preview`, using the same Chromium Playwright uses for e2e.
// Run: npm run build && node scripts/vitals.mjs [baseURL]   (defaults to http://127.0.0.1:4173)
// It is a sanity check, not a substitute for Lighthouse; mobile uses a 4x CPU throttle + Pixel 7 profile.
import { chromium, devices } from '@playwright/test';

const base = process.argv[2] ?? 'http://127.0.0.1:4173';
const pages = ['/', '/es/', '/es/log/', '/es/log/pulsares-faros-que-marcan-el-tiempo/', '/cv/'];

const collector = () => {
  const s = { lcp: 0, cls: 0, fcp: 0, longTasks: 0, tbt: 0 };
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) s.lcp = e.startTime;
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) if (!e.hadRecentInput) s.cls += e.value;
  }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') s.fcp = e.startTime;
  }).observe({ type: 'paint', buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) {
      s.longTasks++;
      s.tbt += Math.max(0, e.duration - 50);
    }
  }).observe({ type: 'longtask', buffered: true });
  window.__vitals = s;
};

async function run(profile) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext(profile === 'mobile' ? { ...devices['Pixel 7'] } : {});
  const rows = [];
  for (const path of pages) {
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    if (profile === 'mobile') {
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await cdp.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 150,
        downloadThroughput: (1.6 * 1024 * 1024) / 8,
        uploadThroughput: (750 * 1024) / 8,
      });
    }
    let bytes = 0;
    let requests = 0;
    page.on('response', async (r) => {
      requests++;
      const h = r.headers()['content-length'];
      if (h) bytes += Number(h);
    });
    await page.addInitScript(collector);
    const t0 = Date.now();
    await page.goto(base + path, { waitUntil: 'load' });
    await page.waitForTimeout(2500);
    // Scroll to the bottom to trigger lazy images / layout shifts, then settle.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(800);
    const v = await page.evaluate(() => window.__vitals);
    const scripts = await page.evaluate(
      () => [...document.scripts].filter((s) => s.src && !/json/.test(s.type)).length,
    );
    rows.push({
      path,
      lcp: Math.round(v.lcp),
      fcp: Math.round(v.fcp),
      cls: Number(v.cls.toFixed(3)),
      tbt: Math.round(v.tbt),
      longTasks: v.longTasks,
      requests,
      kb: Math.round(bytes / 1024),
      scripts,
      loadMs: Date.now() - t0,
    });
    await page.close();
  }
  await browser.close();
  console.log(`\n${profile.toUpperCase()}`);
  console.table(rows);
}

await run('desktop');
await run('mobile');

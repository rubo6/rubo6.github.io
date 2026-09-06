import { expect, test, type Page } from '@playwright/test';

/** Console errors we do not own: the analytics beacon is blocked in headless/offline runs. */
function ownConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (/goatcounter|gc\.zgo\.at|ERR_INTERNET_DISCONNECTED|net::ERR/i.test(text)) return;
    errors.push(text);
  });
  return errors;
}

// Keep the suite hermetic: only the preview server may be contacted (the GoatCounter beacon
// would otherwise depend on network access and can hold the `load` event on locked-down runners).
test.beforeEach(async ({ page, baseURL }) => {
  const origin = new URL(baseURL ?? 'http://127.0.0.1').origin;
  await page.route('**/*', (route) =>
    route.request().url().startsWith(origin) ? route.continue() : route.abort(),
  );
});

test.describe('home', () => {
  for (const [path, lang, log] of [
    ['/', 'en', 'Log'],
    ['/es/', 'es-MX', 'Bitácora'],
    ['/pt-br/', 'pt-BR', 'Diário'],
  ] as const) {
    test(`renders ${path} in ${lang}`, async ({ page }) => {
      const errors = ownConsoleErrors(page);
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('#hero-title')).toContainText('Eduardo');
      await expect(page.getByRole('link', { name: log, exact: true }).first()).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  test('universe switch flips data-mode and persists across reload', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-mode', 'pro');
    const sw = page.getByRole('switch').first();
    await sw.click();
    await expect(html).toHaveAttribute('data-mode', 'personal');
    await expect(sw).toHaveAttribute('aria-checked', 'true');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(html).toHaveAttribute('data-mode', 'personal');
  });

  test('theme button toggles night ⇄ atlas', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const before = await html.getAttribute('data-theme');
    await page.locator('[data-theme-toggle]').first().click();
    const after = await html.getAttribute('data-theme');
    expect(after).not.toBe(before);
    expect(['night', 'atlas']).toContain(after);
  });

  test('ships a CSP meta and no inline JavaScript', async ({ page }) => {
    await page.goto('/');
    const csp = await page
      .locator('meta[http-equiv="Content-Security-Policy"]')
      .getAttribute('content');
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("object-src 'none'");
    // Every <script> must either load from our origin or be data (JSON / JSON-LD).
    const offenders = await page.$$eval('script', (nodes) =>
      nodes
        .filter((s) => {
          const type = s.getAttribute('type') ?? '';
          if (/json/.test(type)) return false;
          const src = s.getAttribute('src') ?? '';
          return !src || !(src.startsWith('/') || src.startsWith(location.origin));
        })
        .map((s) => (s.getAttribute('src') ?? s.textContent ?? '').slice(0, 80)),
    );
    expect(offenders).toEqual([]);
  });
});

test.describe('log', () => {
  test('area filter narrows the list and syncs the URL', async ({ page }) => {
    await page.goto('/es/log/');
    const cards = page.locator('ol.grid > li');
    const all = await cards.count();
    expect(all).toBeGreaterThan(5);
    await page
      .getByRole('button', { name: /astronom/i })
      .first()
      .click();
    await expect(page).toHaveURL(/area=astronomy/);
    const visible = page.locator('ol.grid > li:visible');
    const n = await visible.count();
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThan(all);
    for (const area of await visible.evaluateAll((els) =>
      els.map((e) => e.getAttribute('data-area')),
    )) {
      expect(area).toBe('astronomy');
    }
  });

  test('deep link restores the filter state', async ({ page }) => {
    await page.goto('/es/log/?area=astronomy');
    await expect(page.getByRole('button', { name: /astronom/i }).first()).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  test('an entry exposes its own Open Graph image', async ({ page, request }) => {
    await page.goto('/log/pulsares-faros-que-marcan-el-tiempo/');
    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(og).toMatch(/\/og\/log\/pulsares-faros-que-marcan-el-tiempo\.png$/);
    const res = await request.get(new URL(og!).pathname);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('image/png');
  });
});

test.describe('pages', () => {
  for (const path of [
    '/cv/',
    '/now/',
    '/es/now/',
    '/log/rss.xml',
    '/sitemap-index.xml',
    '/.well-known/security.txt',
  ]) {
    test(`${path} responds 200`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
    });
  }
});

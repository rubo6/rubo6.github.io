import { expect, test } from '@playwright/test';

/**
 * Contact form ("Send a signal", ADR-0012). The Worker is not part of the static preview, so the two
 * endpoints are mocked; the test exercises the dialog, the proof-of-work in the browser (low difficulty)
 * and the multipart request the page sends.
 */
test.beforeEach(async ({ page, baseURL }) => {
  const origin = new URL(baseURL ?? 'http://127.0.0.1').origin;
  await page.route('**/*', (route) =>
    route.request().url().startsWith(origin) ? route.continue() : route.abort(),
  );
});

test.describe('contact form', () => {
  test('opens as a modal, solves the challenge, posts the message and shows the received state', async ({
    page,
  }) => {
    const challenge = { v: 1, salt: 'a'.repeat(32), iat: 1, bits: 6, sig: 'b'.repeat(64) };
    await page.route('**/api/contact/challenge', (route) =>
      route.fulfill({ json: { ok: true, challenge } }),
    );
    let posted: { headers: Record<string, string>; body: string } | null = null;
    await page.route('**/api/contact', (route) => {
      posted = { headers: route.request().headers(), body: route.request().postData() ?? '' };
      return route.fulfill({ json: { ok: true } });
    });

    await page.goto('/es/');
    const open = page.locator('[data-signal-open]').first();
    await open.scrollIntoViewIfNeeded();
    await open.click();

    const dialog = page.locator('dialog[data-signal]');
    await expect(dialog).toHaveAttribute('open', '');
    await expect(dialog.getByRole('heading', { level: 2 })).toContainText('señal');

    await dialog.locator('input[name="name"]').fill('Ada Lovelace');
    await dialog.locator('input[name="email"]').fill('ada@example.org');
    await dialog.locator('input[name="subject"]').fill('Vacante de datos');
    await dialog
      .locator('textarea[name="message"]')
      .fill('Hola Rubo, ¿tienes tiempo para una llamada?');
    await dialog.locator('input[type="file"]').setInputFiles({
      name: 'nota.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hola'),
    });
    await expect(dialog.locator('[data-signal-files] li')).toHaveCount(1);

    await dialog.locator('[data-signal-submit]').click();
    await expect(dialog.locator('[data-signal-done]')).toBeVisible({ timeout: 20_000 });
    await expect(dialog.locator('[data-signal-done]')).toContainText('ada@example.org');

    expect(posted).not.toBeNull();
    const { headers, body } = posted!;
    expect(headers['content-type']).toMatch(/^multipart\/form-data; boundary=/);
    expect(body).toContain('name="name"');
    expect(body).toContain('Ada Lovelace');
    expect(body).toContain('name="pow"');
    expect(body).toContain('"nonce":');
    expect(body).toContain('filename="nota.txt"');
    expect(body).toMatch(/name="website"\r\n\r\n\r\n/); // honeypot stays empty

    // Closing mirrors opening: the dialog animates out and returns focus to the opener.
    await dialog.locator('[data-signal-done] [data-signal-close]').click();
    await expect(dialog).not.toHaveAttribute('open', '', { timeout: 3_000 });
    await expect(open).toBeFocused();
  });

  test('Escape closes the dialog and the form is not sent while a field is missing', async ({
    page,
  }) => {
    let requests = 0;
    await page.route('**/api/contact', (route) => {
      requests++;
      return route.fulfill({ json: { ok: true } });
    });
    await page.route('**/api/contact/challenge', (route) =>
      route.fulfill({
        json: {
          ok: true,
          challenge: { v: 1, salt: 'c'.repeat(32), iat: 1, bits: 4, sig: 'd'.repeat(64) },
        },
      }),
    );
    await page.goto('/');
    const open = page.locator('[data-signal-open]').first();
    await open.scrollIntoViewIfNeeded();
    await open.click();
    const dialog = page.locator('dialog[data-signal]');
    await expect(dialog).toHaveAttribute('open', '');
    await dialog.locator('input[name="name"]').fill('Only a name');
    await dialog.locator('[data-signal-submit]').click();
    await expect(dialog.locator('[data-signal-status]')).toContainText(/fields|campos|campos/i);
    expect(requests).toBe(0);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toHaveAttribute('open', '', { timeout: 3_000 });
  });
});

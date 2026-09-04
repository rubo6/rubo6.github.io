import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end smoke tests run against the production build (`dist/`) served by `astro preview`,
 * so they exercise exactly what GitHub Pages ships (CSP meta, hashed assets, no dev toolbar).
 * Run `npm run build` first; CI does it in the same job.
 */
const PORT = 4173;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  // One browser at a time: the animated home page saturates a software-rendered headless Chromium,
  // and two parallel pages push `load` past the timeout on small machines and CI runners.
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
    navigationTimeout: 45_000,
  },
  webServer: {
    command: `node node_modules/astro/bin/astro.mjs preview --ignore-lock --host 127.0.0.1 --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    // Astro 7 daemonises `preview` when it detects an AI-agent shell; this flag keeps it in the foreground.
    env: { ...process.env, ASTRO_PREVIEW_BACKGROUND: '1' },
    timeout: 60_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});

// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Site configuration for https://rubo6.dev (GitHub Pages, custom domain; rubo6.github.io redirects here)
 *
 * - Static output (GitHub Pages). No server, no runtime secrets. The only dynamic endpoint,
 *   /api/contact, is a separate Cloudflare Worker (worker/, ADR-0012).
 * - i18n: English is the root locale; other locales live under /<locale>/.
 * - Tailwind CSS v4 runs as a Vite plugin (no @astrojs/tailwind integration).
 */
export default defineConfig({
  site: 'https://rubo6.dev',
  output: 'static',
  trailingSlash: 'ignore',

  // The dev toolbar injects inline scripts that the strict CSP (script-src 'self') blocks.
  devToolbar: { enabled: false },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'pt-br'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  build: {
    // 'always': one HTML request instead of ~12 render-blocking CSS files (CSP allows inline styles).
    inlineStylesheets: 'always',
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          es: 'es-MX',
          'pt-br': 'pt-BR',
        },
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    server: {
      // Local development of the contact form: `npm run worker:dev` serves the Worker on :8787 and
      // the dev server forwards /api to it, so the browser talks to one origin like in production.
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8787',
          // Host must be the Worker's own (wrangler dev drops the Origin header when Host differs);
          // the browser's Origin header itself is forwarded untouched.
          changeOrigin: true,
        },
      },
    },
    build: {
      // Never inline JS or fonts as inline <script> / data: URLs: the strict CSP
      // (script-src 'self', font-src 'self') would block them in production.
      assetsInlineLimit: 0,
    },
  },
});

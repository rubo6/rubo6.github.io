// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Site configuration for https://rubo6.github.io
 *
 * - Static output (GitHub Pages). No server, no runtime secrets.
 * - i18n: English is the root locale; other locales live under /<locale>/.
 * - Tailwind CSS v4 runs as a Vite plugin (no @astrojs/tailwind integration).
 */
export default defineConfig({
  site: 'https://rubo6.github.io',
  output: 'static',
  trailingSlash: 'ignore',

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
    inlineStylesheets: 'auto',
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
  },
});

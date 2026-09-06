// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', 'src/data/**', 'public/js/**'], // public/js = vendored third-party (GoatCounter count.js, ADR-0009)
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // Security baseline (mirrors docs/SECURITY-BASELINE.md)
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-restricted-properties': [
        'error',
        {
          object: 'Math',
          property: 'random',
          message: 'Use a deterministic hash or crypto.getRandomValues(); never Math.random().',
        },
        {
          property: 'innerHTML',
          message: 'Never assign innerHTML. Use textContent or DOM APIs.',
        },
        {
          property: 'outerHTML',
          message: 'Never assign outerHTML. Use DOM APIs.',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.property.name='insertAdjacentHTML']",
          message: 'Never use insertAdjacentHTML. Build nodes with DOM APIs.',
        },
        {
          selector: "MemberExpression[property.name='write'][object.name='document']",
          message: 'Never use document.write.',
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },
);

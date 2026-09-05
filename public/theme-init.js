/*
 * Theme/mode bootstrap. Runs before first paint to avoid a flash of the wrong theme.
 * Loaded as an external, blocking script so the Content-Security-Policy can stay
 * `script-src 'self'` (no inline scripts anywhere on the site).
 *
 * Storage keys are read-only allowlisted values; anything unexpected falls back to defaults.
 */
(function () {
  var root = document.documentElement;
  var THEMES = ['night', 'atlas'];
  var MODES = ['pro', 'personal'];

  function read(key, allowed, fallback) {
    try {
      var v = window.localStorage.getItem(key);
      return allowed.indexOf(v) !== -1 ? v : fallback;
    } catch (_e) {
      return fallback;
    }
  }

  var prefersLight =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  var theme = read('observatory:theme', THEMES, prefersLight ? 'atlas' : 'night');
  var mode = read('observatory:mode', MODES, 'pro');

  root.setAttribute('data-theme', theme);
  root.setAttribute('data-mode', mode);
  root.classList.add('js');

  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute(
      'content',
      theme === 'atlas' ? '#f6f1e7' : mode === 'personal' ? '#0a0616' : '#060814',
    );
  }
})();

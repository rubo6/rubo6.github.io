/**
 * Page-lifecycle helpers for client modules under Astro's ClientRouter (view transitions).
 *
 * Every interactive module must run once on first load and again after each client-side
 * navigation (`astro:after-swap`), because the DOM is replaced but the module is not re-executed.
 * Instead of repeating that wiring in every component, use one of these two helpers.
 */

/** Run `init` now and after every client-side navigation. `init` must be idempotent. */
export function onReady(init: () => void): void {
  init();
  document.addEventListener('astro:after-swap', init);
}

/**
 * For modules that hold resources (observers, timers, rAF loops): `mount` returns a dispose
 * function; it is called before every re-mount so nothing leaks across navigations.
 */
export function remountOnSwap(mount: () => () => void): void {
  let dispose = mount();
  document.addEventListener('astro:after-swap', () => {
    dispose();
    dispose = mount();
  });
}

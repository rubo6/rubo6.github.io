/**
 * "Alive" layer — small, cheap behaviours that make the page react to the visitor:
 *
 *  - Spotlight: elements with `.glow` get a radial highlight that follows the pointer
 *    (CSS reads --mx/--my; see global.css). One delegated listener, no per-card handlers.
 *  - Dome shutter: on client-side navigation (Astro ClientRouter) two panels close over the page
 *    like an observatory dome slit and open again on the new page. Skipped when the visitor prefers
 *    reduced motion; the browser's view transition still runs.
 *
 * No external requests, no innerHTML, no randomness.
 */

const reduced = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let spotlightBound = false;
function bindSpotlight(): void {
  if (spotlightBound) return;
  spotlightBound = true;
  let frame = 0;
  let last: PointerEvent | null = null;
  const apply = () => {
    frame = 0;
    if (!last) return;
    const target = (last.target as Element | null)?.closest<HTMLElement>('.glow');
    if (!target) return;
    const r = target.getBoundingClientRect();
    target.style.setProperty('--mx', `${(((last.clientX - r.left) / r.width) * 100).toFixed(2)}%`);
    target.style.setProperty('--my', `${(((last.clientY - r.top) / r.height) * 100).toFixed(2)}%`);
  };
  document.addEventListener(
    'pointermove',
    (e) => {
      last = e;
      if (!frame) frame = window.requestAnimationFrame(apply);
    },
    { passive: true },
  );
}

const SHUTTER_MS = 420;
function shutter(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-dome]');
}
const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

let domeBound = false;
function bindDome(): void {
  if (domeBound) return;
  domeBound = true;
  document.addEventListener('astro:before-preparation', (ev) => {
    const el = shutter();
    if (!el || reduced()) return;
    const e = ev as Event & { loader: () => Promise<void> };
    const original = e.loader;
    e.loader = async () => {
      el.classList.remove('is-open');
      el.classList.add('is-closing');
      await Promise.all([original(), wait(SHUTTER_MS)]);
    };
  });
  document.addEventListener('astro:after-swap', () => {
    const el = shutter();
    if (!el) return;
    // Let the new page paint one frame behind the closed shutter, then open.
    window.requestAnimationFrame(() => {
      el.classList.remove('is-closing');
      el.classList.add('is-open');
      window.setTimeout(() => el.classList.remove('is-open'), SHUTTER_MS + 100);
    });
  });
}

export function initAlive(): void {
  bindSpotlight();
  bindDome();
}

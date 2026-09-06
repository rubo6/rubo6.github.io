/**
 * Theme / mode / language / menu controls. One module, idempotent init (View Transitions re-run it).
 *
 * State lives on <html data-theme data-mode>. Changing `data-mode` is what makes "the universe move":
 * every design token is an animatable @property, so CSS interpolates colours over --dur-universe,
 * and canvas scenes listen to the `universe:mode` event to run their warp.
 */
export type Theme = 'night' | 'atlas';
export type Mode = 'pro' | 'personal';

const THEMES: Theme[] = ['night', 'atlas'];
const MODES: Mode[] = ['pro', 'personal'];
const KEY_THEME = 'observatory:theme';
const KEY_MODE = 'observatory:mode';

function root(): HTMLElement {
  return document.documentElement;
}

export function currentTheme(): Theme {
  const v = root().getAttribute('data-theme');
  return THEMES.includes(v as Theme) ? (v as Theme) : 'night';
}

export function currentMode(): Mode {
  const v = root().getAttribute('data-mode');
  return MODES.includes(v as Mode) ? (v as Mode) : 'pro';
}

function persist(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode): state still lives on <html> */
  }
}

function syncThemeColor(): void {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) return;
  const theme = currentTheme();
  const mode = currentMode();
  meta.content =
    theme === 'atlas'
      ? mode === 'personal'
        ? '#f8efe4'
        : '#f6f1e7'
      : mode === 'personal'
        ? '#160f2e'
        : '#0b1026';
}

let themeSwitchTimer = 0;
export function setTheme(theme: Theme): void {
  // Theme (night/atlas) is a quick crossfade; only the mode switch gets the long "universe moves"
  // interpolation. The attribute shortens --dur-universe for the frames in which the tokens change.
  root().setAttribute('data-switching', 'theme');
  window.clearTimeout(themeSwitchTimer);
  themeSwitchTimer = window.setTimeout(() => root().removeAttribute('data-switching'), 450);
  root().setAttribute('data-theme', theme);
  persist(KEY_THEME, theme);
  syncThemeColor();
  document.dispatchEvent(new CustomEvent<Theme>('universe:theme', { detail: theme }));
}

export function setMode(mode: Mode): void {
  const previous = currentMode();
  root().setAttribute('data-mode', mode);
  persist(KEY_MODE, mode);
  syncThemeColor();
  document.dispatchEvent(
    new CustomEvent<{ mode: Mode; previous: Mode }>('universe:mode', {
      detail: { mode, previous },
    }),
  );
}

function bindThemeToggle(btn: HTMLButtonElement): void {
  const refresh = () => {
    const theme = currentTheme();
    btn.setAttribute(
      'aria-label',
      btn.dataset[theme === 'night' ? 'labelNight' : 'labelAtlas'] ?? '',
    );
  };
  btn.addEventListener('click', () => {
    setTheme(currentTheme() === 'night' ? 'atlas' : 'night');
    refresh();
  });
  refresh();
}

function bindModeToggle(btn: HTMLButtonElement): void {
  const refresh = () => btn.setAttribute('aria-checked', String(currentMode() === 'personal'));
  btn.addEventListener('click', () => {
    setMode(currentMode() === 'pro' ? 'personal' : 'pro');
    refresh();
  });
  document.addEventListener('universe:mode', refresh);
  refresh();
}

function bindLang(container: HTMLElement): void {
  const btn = container.querySelector<HTMLButtonElement>('button');
  const menu = container.querySelector<HTMLUListElement>('ul');
  if (!btn || !menu) return;
  const close = () => {
    menu.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  };
  btn.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    if (open) menu.querySelector<HTMLAnchorElement>('a')?.focus();
  });
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target as Node)) close();
  });
  container.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close();
      btn.focus();
    }
  });
}

function bindMenu(btn: HTMLButtonElement): void {
  const list = document.getElementById(btn.getAttribute('aria-controls') ?? '');
  if (!list) return;
  const set = (open: boolean) => {
    list.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', () => set(!list.classList.contains('is-open')));
  list.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) set(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') set(false);
  });
}

function bindActiveAnchor(): void {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('#nav-anchors a[href*="#"]')];
  const sections = links
    .map((a) => document.getElementById(a.hash.slice(1)))
    .filter((s): s is HTMLElement => Boolean(s));
  if (!sections.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const a of links) a.toggleAttribute('aria-current', a.hash === `#${entry.target.id}`);
      }
    },
    { rootMargin: '-40% 0px -55% 0px' },
  );
  sections.forEach((s) => io.observe(s));
}

function bindReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)');
  if (!items.length) return;
  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
  );
  items.forEach((el) => io.observe(el));
  // Safety net: whatever the observer missed becomes visible anyway.
  window.setTimeout(() => items.forEach((el) => el.classList.add('is-visible')), 2500);
}

export function initUniverseControls(): void {
  document
    .querySelectorAll<HTMLButtonElement>('[data-theme-toggle]:not([data-bound])')
    .forEach((b) => {
      b.dataset.bound = '1';
      bindThemeToggle(b);
    });
  document
    .querySelectorAll<HTMLButtonElement>('[data-mode-toggle]:not([data-bound])')
    .forEach((b) => {
      b.dataset.bound = '1';
      bindModeToggle(b);
    });
  document.querySelectorAll<HTMLElement>('[data-lang]:not([data-bound])').forEach((c) => {
    c.dataset.bound = '1';
    bindLang(c);
  });
  document
    .querySelectorAll<HTMLButtonElement>('[data-menu-toggle]:not([data-bound])')
    .forEach((b) => {
      b.dataset.bound = '1';
      bindMenu(b);
    });
  bindActiveAnchor();
  bindReveal();
  syncThemeColor();
}

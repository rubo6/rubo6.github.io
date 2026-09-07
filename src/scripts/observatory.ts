/**
 * Observatory interaction: focus a nebula (zoom the scene, reveal its stars and its log),
 * return to the wide field, keep the URL hash in sync, and stay keyboard-accessible.
 * Works for both scenes (professional / personal); each scene is an independent instance.
 */

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function mountObservatory(scene: HTMLElement): () => void {
  const nebulae = [...scene.querySelectorAll<HTMLButtonElement>('[data-nebula]')];
  const panels = [...scene.parentElement!.querySelectorAll<HTMLElement>('[data-nebula-panel]')];
  const backButtons = [
    ...scene.parentElement!.querySelectorAll<HTMLButtonElement>('[data-nebula-back]'),
  ];
  const hint = scene.parentElement!.querySelector<HTMLElement>('[data-observatory-hint]');
  const prefix = scene.dataset.hashPrefix ?? 'observatory';
  let focused: string | null = null;

  function focus(id: string | null, { updateHash = true, scroll = false } = {}): void {
    focused = id;
    scene.classList.toggle('is-focused', Boolean(id));
    scene.dataset.focused = id ?? '';

    for (const n of nebulae) {
      const active = n.dataset.nebula === id;
      n.setAttribute('aria-pressed', String(active));
      n.classList.toggle('is-active', active);
      n.classList.toggle('is-dimmed', Boolean(id) && !active);
      if (active) {
        // Zoom the whole field towards this nebula: CSS reads --fx/--fy/--fs.
        scene.style.setProperty('--fx', n.dataset.x ?? '50');
        scene.style.setProperty('--fy', n.dataset.y ?? '50');
        scene.style.setProperty('--fs', n.dataset.zoom ?? '1.9');
      }
    }
    for (const p of panels) {
      const show = p.dataset.nebulaPanel === id;
      if (show) {
        p.classList.remove('is-leaving');
        p.hidden = false;
        if (scroll)
          p.scrollIntoView({
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
            block: 'nearest',
          });
      } else if (!p.hidden) {
        // Closing gets the mirror of the opening animation instead of vanishing (see .panel.is-leaving).
        if (prefersReducedMotion()) p.hidden = true;
        else {
          p.classList.add('is-leaving');
          const done = () => {
            if (p.classList.contains('is-leaving')) {
              p.hidden = true;
              p.classList.remove('is-leaving');
            }
          };
          p.addEventListener('animationend', done, { once: true });
          window.setTimeout(done, 420);
        }
      }
    }
    if (hint) hint.hidden = Boolean(id);

    if (updateHash) {
      const url = new URL(window.location.href);
      url.hash = id ? `${prefix}:${id}` : prefix;
      history.replaceState(null, '', url);
    }
  }

  const onNebula = (e: Event) => {
    const btn = (e.currentTarget as HTMLButtonElement) ?? null;
    const id = btn?.dataset.nebula ?? null;
    focus(focused === id ? null : id, { scroll: true });
  };
  nebulae.forEach((n) => n.addEventListener('click', onNebula));

  const onBack = () => {
    const previous = focused;
    focus(null);
    nebulae.find((n) => n.dataset.nebula === previous)?.focus();
  };
  backButtons.forEach((b) => b.addEventListener('click', onBack));

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && focused) focus(null);
    // Arrow keys move between nebulae like a telescope mount.
    if (
      ['ArrowRight', 'ArrowLeft'].includes(e.key) &&
      document.activeElement &&
      nebulae.includes(document.activeElement as HTMLButtonElement)
    ) {
      const i = nebulae.indexOf(document.activeElement as HTMLButtonElement);
      const next =
        nebulae[(i + (e.key === 'ArrowRight' ? 1 : nebulae.length - 1)) % nebulae.length];
      next?.focus();
      e.preventDefault();
    }
  };
  scene.parentElement!.addEventListener('keydown', onKey);

  // Deep link: #observatory:professional
  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (hash.startsWith(`${prefix}:`)) {
    const id = hash.slice(prefix.length + 1);
    if (nebulae.some((n) => n.dataset.nebula === id)) {
      focus(id, { updateHash: false });
      // The hash is not an element id, so the browser will not scroll on its own.
      scene.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }

  return () => {
    nebulae.forEach((n) => n.removeEventListener('click', onNebula));
    backButtons.forEach((b) => b.removeEventListener('click', onBack));
    scene.parentElement!.removeEventListener('keydown', onKey);
  };
}

export function mountAllObservatories(): () => void {
  const disposers = [...document.querySelectorAll<HTMLElement>('[data-observatory-scene]')].map(
    mountObservatory,
  );
  return () => disposers.forEach((d) => d());
}

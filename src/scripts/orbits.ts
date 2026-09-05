/**
 * Trajectory orbits: JS-driven planets plus a camera that follows the entry you are reading.
 *
 * Every role/study is a planet on its own orbit. As the reader scrolls through the entries, the
 * matching entry becomes "active" (IntersectionObserver band around the viewport centre), the
 * camera glides (viewBox lerp) to that planet and zooms in, and the planet brightens. With no
 * active entry (top/bottom of the section) the camera returns to the whole system.
 *
 * Cheap on purpose: one requestAnimationFrame loop at ≤ 30 fps only while the figure is on
 * screen, transforms and a viewBox attribute only. Reduced motion → planets stay still and the
 * camera jumps instead of gliding.
 */

interface Planet {
  el: SVGGElement;
  r: number;
  a0: number; // start angle, degrees
  dur: number; // seconds per revolution
  index: number;
}

const FRAME_MS = 1000 / 30;

function mount(fig: HTMLElement): void {
  const svg = fig.querySelector<SVGSVGElement>('svg');
  if (!svg) return;
  const size = Number(fig.dataset.size ?? 520);
  const c = size / 2;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const planets: Planet[] = [...fig.querySelectorAll<SVGGElement>('.planet')].map((el) => ({
    el,
    r: Number(el.dataset.r),
    a0: Number(el.dataset.a),
    dur: Number(el.dataset.dur),
    index: Number(el.dataset.index),
  }));
  const entries = [...document.querySelectorAll<HTMLElement>('[data-entry-index]')];

  let active = -1;
  // Camera state (viewBox): x, y, size. Target is recomputed every frame from the planet position.
  const cam = { x: 0, y: 0, s: size };
  const t0 = performance.now();
  let lastFrame = 0;
  let raf = 0;
  let visible = false;

  const angleOf = (p: Planet, now: number): number => {
    const t = reduced ? 0 : (now - t0) / 1000;
    return ((p.a0 + (t / p.dur) * 360) * Math.PI) / 180;
  };

  function frame(now: number): void {
    if (!visible) return;
    raf = requestAnimationFrame(frame);
    if (now - lastFrame < FRAME_MS) return;
    lastFrame = now;

    for (const p of planets) {
      const deg = (angleOf(p, now) * 180) / Math.PI;
      p.el.style.transform = `rotate(${deg.toFixed(2)}deg)`;
    }

    let tx = 0;
    let ty = 0;
    let ts = size;
    const target = planets.find((p) => p.index === active);
    if (target) {
      const a = angleOf(target, now);
      const px = c + target.r * Math.cos(a);
      const py = c + target.r * Math.sin(a);
      // Inner (recent) orbits get a closer camera; outer ones a wider one so the sun stays in frame.
      const zoom = Math.min(2.6, Math.max(1.5, (size / (target.r * 2 + 90)) * 0.9));
      ts = size / zoom;
      tx = px - ts / 2;
      ty = py - ts / 2;
    }
    const k = reduced ? 1 : 0.08;
    cam.x += (tx - cam.x) * k;
    cam.y += (ty - cam.y) * k;
    cam.s += (ts - cam.s) * k;
    svg.setAttribute(
      'viewBox',
      `${cam.x.toFixed(2)} ${cam.y.toFixed(2)} ${cam.s.toFixed(2)} ${cam.s.toFixed(2)}`,
    );
  }

  function start(): void {
    if (visible) return;
    visible = true;
    raf = requestAnimationFrame(frame);
  }
  function stop(): void {
    visible = false;
    cancelAnimationFrame(raf);
  }

  // Which entry is being read: the one crossing a band around the middle of the viewport.
  const io = new IntersectionObserver(
    (list) => {
      for (const e of list) {
        const idx = Number((e.target as HTMLElement).dataset.entryIndex);
        if (e.isIntersecting) active = idx;
        else if (active === idx) active = -1;
      }
      planets.forEach((p) => p.el.classList.toggle('is-active', p.index === active));
      entries.forEach((el) =>
        el.classList.toggle('is-active', Number(el.dataset.entryIndex) === active),
      );
      fig.dataset.active = active >= 0 ? String(active) : '';
    },
    { rootMargin: '-40% 0px -45% 0px', threshold: 0 },
  );
  entries.forEach((el) => io.observe(el));

  // Run only while the figure (or the entry list on mobile) is on screen.
  const vis = new IntersectionObserver((list) => {
    for (const e of list)
      if (e.isIntersecting) start();
      else stop();
  });
  vis.observe(fig.closest('section') ?? fig);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
}

export function initOrbits(): void {
  document.querySelectorAll<HTMLElement>('[data-orbits]:not([data-bound])').forEach((fig) => {
    fig.dataset.bound = '1';
    mount(fig);
  });
}

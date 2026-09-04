/**
 * Live sky renderer. Draws the real sky above an observer on a <canvas>, using the bright-star
 * catalogue and the astronomy lib. No randomness anywhere: twinkle phases derive from a hash of
 * the star name, so the same star always twinkles the same way.
 */
import {
  equatorialToHorizontal,
  formatHours,
  horizontalToScreen,
  julianDate,
  lstHours,
  magnitudeToRadius,
} from '@/lib/astro';

interface Star {
  n: string;
  c: string;
  ra: number;
  dec: number;
  m: number;
}
interface Constellation {
  id: string;
  name: string;
  lines: [string, string][];
}
interface Catalog {
  stars: Star[];
  constellations: Constellation[];
}
interface SkyOptions {
  canvas: HTMLCanvasElement;
  catalog: Catalog;
  lat: number;
  lon: number;
  clock?: HTMLElement | null;
  labels?: boolean;
}

/** Deterministic 32-bit FNV-1a hash → [0, 1). Replaces Math.random on purpose. */
export function unitHash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) / 4294967296;
}

function cssVar(name: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export function mountSky(opts: SkyOptions): () => void {
  const { canvas, catalog, lat, lon, clock } = opts;
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const phases = new Map(catalog.stars.map((s) => [s.n, unitHash(s.n) * Math.PI * 2]));

  let width = 0;
  let height = 0;
  let dpr = 1;
  let raf = 0;
  let visible = true;
  let warpUntil = 0;
  let warpDir = 1;
  let lastClock = '';

  function resize(): void {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(now: number): void {
    const date = new Date();
    const jd = julianDate(date);
    const lst = lstHours(jd, lon);

    const accent = cssVar('--accent', '#f2c46d');
    const ink = cssVar('--ink', '#f4efe6');
    const line = cssVar('--accent-3', '#9ad9e8');
    const isAtlas = document.documentElement.getAttribute('data-theme') === 'atlas';

    ctx!.clearRect(0, 0, width, height);

    // Projection: zenith slightly below the vertical centre so the southern sky (rich from CDMX) shows.
    const cx = width * 0.5;
    const cy = height * 0.58;
    const R = Math.max(width, height) * 0.62; // horizon radius in px
    const warp = now < warpUntil ? (warpUntil - now) / 900 : 0; // 1 → 0 during the warp

    const positions = new Map<string, { x: number; y: number; alt: number }>();
    for (const s of catalog.stars) {
      const h = equatorialToHorizontal(s.ra, s.dec, lst, lat);
      if (h.alt < -2) continue;
      const p = horizontalToScreen(h);
      const stretch = 1 + warp * warp * 0.9 * warpDir;
      positions.set(s.n, { x: cx + p.x * R * stretch, y: cy + p.y * R * stretch, alt: h.alt });
    }

    // Horizon ring + cardinal marks
    ctx!.save();
    ctx!.globalAlpha = isAtlas ? 0.35 : 0.22;
    ctx!.strokeStyle = ink;
    ctx!.lineWidth = 1;
    ctx!.setLineDash([2, 6]);
    ctx!.beginPath();
    ctx!.arc(cx, cy, R, 0, Math.PI * 2);
    ctx!.stroke();
    ctx!.setLineDash([]);
    ctx!.font = `500 11px ${cssVar('--font-mono', 'monospace')}`;
    ctx!.fillStyle = ink;
    ctx!.textAlign = 'center';
    ctx!.textBaseline = 'middle';
    const cardinals: [string, number, number][] = [
      ['N', 0, -1],
      ['S', 0, 1],
      ['E', -1, 0],
      ['W', 1, 0],
    ];
    for (const [label, dx, dy] of cardinals) {
      ctx!.fillText(label, cx + dx * (R + 14), cy + dy * (R + 14));
    }
    ctx!.restore();

    // Constellation figures
    ctx!.save();
    ctx!.strokeStyle = line;
    ctx!.globalAlpha = isAtlas ? 0.45 : 0.28;
    ctx!.lineWidth = 0.8;
    ctx!.beginPath();
    for (const c of catalog.constellations) {
      for (const [a, b] of c.lines) {
        const pa = positions.get(a);
        const pb = positions.get(b);
        if (!pa || !pb) continue;
        ctx!.moveTo(pa.x, pa.y);
        ctx!.lineTo(pb.x, pb.y);
      }
    }
    ctx!.stroke();
    ctx!.restore();

    // Stars
    const t = now / 1000;
    const twinkleOn = !reduced.matches;
    for (const s of catalog.stars) {
      const p = positions.get(s.n);
      if (!p) continue;
      const horizonFade = Math.min(1, Math.max(0, (p.alt + 2) / 10));
      const base = magnitudeToRadius(s.m);
      const tw = twinkleOn
        ? 0.82 + 0.18 * Math.sin(t * (1.3 + unitHash(s.c) * 0.9) + (phases.get(s.n) ?? 0))
        : 1;
      const r = base * tw;
      const alpha = horizonFade * (isAtlas ? 0.9 : 0.75 + 0.25 * tw);

      if (warp > 0) {
        // Warp streaks: radial motion blur from the zenith.
        const dx = p.x - cx;
        const dy = p.y - cy;
        ctx!.save();
        ctx!.globalAlpha = alpha * 0.6 * warp;
        ctx!.strokeStyle = accent;
        ctx!.lineWidth = Math.max(0.6, r * 0.6);
        ctx!.beginPath();
        ctx!.moveTo(p.x, p.y);
        ctx!.lineTo(p.x + dx * 0.25 * warp * warpDir, p.y + dy * 0.25 * warp * warpDir);
        ctx!.stroke();
        ctx!.restore();
      }

      ctx!.save();
      ctx!.globalAlpha = alpha;
      if (!isAtlas && r > 1.8) {
        const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3.2);
        g.addColorStop(0, accent);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx!.fillStyle = g;
        ctx!.globalAlpha = alpha * 0.35;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, r * 3.2, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.globalAlpha = alpha;
      }
      ctx!.fillStyle = s.m < 1 ? accent : isAtlas ? ink : '#fff7e6';
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    // Labels for the brightest visible stars
    if (opts.labels !== false) {
      ctx!.save();
      ctx!.font = `400 10.5px ${cssVar('--font-mono', 'monospace')}`;
      ctx!.fillStyle = ink;
      ctx!.globalAlpha = isAtlas ? 0.75 : 0.55;
      ctx!.textAlign = 'left';
      ctx!.textBaseline = 'middle';
      let labelled = 0;
      for (const s of catalog.stars) {
        if (labelled >= 14) break;
        const p = positions.get(s.n);
        if (!p || p.alt < 8) continue;
        ctx!.fillText(s.n, p.x + magnitudeToRadius(s.m) + 5, p.y);
        labelled += 1;
      }
      ctx!.restore();
    }

    // Sidereal clock (only touch the DOM when the second changes)
    if (clock) {
      const text = formatHours(lst);
      if (text !== lastClock) {
        clock.textContent = text;
        lastClock = text;
      }
    }
  }

  function loop(now: number): void {
    if (!visible) return;
    draw(now);
    if (reduced.matches && now >= warpUntil) {
      // Reduced motion: no twinkle; refresh once a minute so the sky still moves.
      raf = window.setTimeout(() => requestAnimationFrame(loop), 60_000) as unknown as number;
      return;
    }
    raf = requestAnimationFrame(loop);
  }

  function start(): void {
    stop();
    visible = true;
    raf = requestAnimationFrame(loop);
  }
  function stop(): void {
    visible = false;
    cancelAnimationFrame(raf);
    clearTimeout(raf);
  }

  const ro = new ResizeObserver(() => {
    resize();
    draw(performance.now());
  });
  ro.observe(canvas);
  resize();

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) start();
      else stop();
    }
  });
  io.observe(canvas);

  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVisibility);

  const onMode = (e: Event) => {
    const detail = (e as CustomEvent<{ mode: string }>).detail;
    warpDir = detail?.mode === 'personal' ? 1 : -1;
    warpUntil = performance.now() + 900;
    if (reduced.matches) draw(performance.now());
    else start();
  };
  document.addEventListener('universe:mode', onMode);
  document.addEventListener('universe:theme', () => draw(performance.now()));

  return () => {
    stop();
    ro.disconnect();
    io.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    document.removeEventListener('universe:mode', onMode);
  };
}

/** Reads a JSON <script type="application/json"> safely (no eval, no innerHTML). */
export function readJson<T>(id: string): T | null {
  const el = document.getElementById(id);
  if (!el) return null;
  try {
    return JSON.parse(el.textContent ?? 'null') as T;
  } catch {
    return null;
  }
}

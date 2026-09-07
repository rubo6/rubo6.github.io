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

  // Performance: star positions move ~15″ per second, invisibly slow, so they (and every layer that
  // depends only on them — horizon, constellation lines, labels) are recomputed once per second into
  // an offscreen canvas. Each animation frame only clears, blits that layer and draws the twinkling
  // stars. Glows come from one pre-rendered sprite instead of a radial gradient per star per frame.
  // Twinkle is capped at 30 fps on desktop and 12 fps on touch/narrow devices (a frozen sky read
  // as broken on phones; 12 fps of blitting a cached layer is cheap). Devices asking to save data
  // or with little memory fall back to one redraw per second (the sky still rotates).
  // "Coarse" = touch device or narrow viewport (Lighthouse's mobile emulation may not report a
  // coarse pointer, so the viewport width is the second signal).
  const coarse =
    window.matchMedia('(pointer: coarse)').matches ||
    window.matchMedia('(max-width: 900px)').matches;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  const lowPower = Boolean(nav.connection?.saveData) || (nav.deviceMemory ?? 8) < 3;
  const frameMs = lowPower ? 1000 : coarse ? 1000 / 12 : 1000 / 30;
  let lastDraw = -Infinity;
  let positions = new Map<string, { x: number; y: number; alt: number }>();
  let positionsAt = -Infinity;
  let positionsKey = '';
  const staticLayer = document.createElement('canvas');
  const staticCtx = staticLayer.getContext('2d');
  const glow = document.createElement('canvas');
  let glowAccent = '';
  function buildGlow(accent: string): void {
    const size = 64;
    glow.width = size;
    glow.height = size;
    const g = glow.getContext('2d');
    if (!g) return;
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, accent);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.clearRect(0, 0, size, size);
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    glowAccent = accent;
  }

  // Theme colours are read once and refreshed on theme/mode events: reading computed styles
  // inside the animation loop forces a style recalculation on every frame.
  let palette = readPalette();
  function readPalette() {
    return {
      accent: cssVar('--accent', '#f2c46d'),
      ink: cssVar('--ink', '#f4efe6'),
      line: cssVar('--accent-3', '#9ad9e8'),
      mono: cssVar('--font-mono', 'monospace'),
      isAtlas: document.documentElement.getAttribute('data-theme') === 'atlas',
    };
  }
  /** Re-read tokens now and again once the --dur-universe transition has settled. */
  function refreshPalette(redraw = false) {
    palette = readPalette();
    if (redraw) draw(performance.now());
    window.setTimeout(() => {
      palette = readPalette();
      if (redraw) draw(performance.now());
    }, 1500);
  }

  function resize(): void {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(coarse ? 1.5 : 2, window.devicePixelRatio || 1);
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    staticLayer.width = canvas.width;
    staticLayer.height = canvas.height;
    staticCtx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    positionsAt = -Infinity;
  }

  function drawStaticLayer(sc: CanvasRenderingContext2D, cx: number, cy: number, R: number): void {
    const { ink, line, mono, isAtlas } = palette;
    sc.clearRect(0, 0, width, height);

    // Horizon ring + cardinal marks
    sc.save();
    sc.globalAlpha = isAtlas ? 0.35 : 0.22;
    sc.strokeStyle = ink;
    sc.lineWidth = 1;
    sc.setLineDash([2, 6]);
    sc.beginPath();
    sc.arc(cx, cy, R, 0, Math.PI * 2);
    sc.stroke();
    sc.setLineDash([]);
    sc.font = `500 11px ${mono}`;
    sc.fillStyle = ink;
    sc.textAlign = 'center';
    sc.textBaseline = 'middle';
    const cardinals: [string, number, number][] = [
      ['N', 0, -1],
      ['S', 0, 1],
      ['E', -1, 0],
      ['W', 1, 0],
    ];
    for (const [label, dx, dy] of cardinals) {
      sc.fillText(label, cx + dx * (R + 14), cy + dy * (R + 14));
    }
    sc.restore();

    // Constellation figures
    sc.save();
    sc.strokeStyle = line;
    sc.globalAlpha = isAtlas ? 0.45 : 0.28;
    sc.lineWidth = 0.8;
    sc.beginPath();
    for (const c of catalog.constellations) {
      for (const [a, b] of c.lines) {
        const pa = positions.get(a);
        const pb = positions.get(b);
        if (!pa || !pb) continue;
        sc.moveTo(pa.x, pa.y);
        sc.lineTo(pb.x, pb.y);
      }
    }
    sc.stroke();
    sc.restore();

    // Labels for the brightest visible stars
    if (opts.labels !== false) {
      sc.save();
      sc.font = `400 10.5px ${mono}`;
      sc.fillStyle = ink;
      sc.globalAlpha = isAtlas ? 0.75 : 0.55;
      sc.textAlign = 'left';
      sc.textBaseline = 'middle';
      let labelled = 0;
      for (const s of catalog.stars) {
        if (labelled >= 14) break;
        const p = positions.get(s.n);
        if (!p || p.alt < 8) continue;
        sc.fillText(s.n, p.x + magnitudeToRadius(s.m) + 5, p.y);
        labelled += 1;
      }
      sc.restore();
    }
  }

  function draw(now: number): void {
    const date = new Date();
    const jd = julianDate(date);
    const lst = lstHours(jd, lon);

    const { accent, ink, line, isAtlas } = palette;

    ctx!.clearRect(0, 0, width, height);

    // Projection: zenith slightly below the vertical centre so the southern sky (rich from CDMX) shows.
    const cx = width * 0.5;
    const cy = height * 0.58;
    const R = Math.max(width, height) * 0.62; // horizon radius in px
    const warp = now < warpUntil ? (warpUntil - now) / 900 : 0; // 1 → 0 during the warp

    const paletteKey = `${accent}|${ink}|${line}|${isAtlas}`;
    const stale =
      warp > 0 || now - positionsAt > 1000 || positionsKey !== paletteKey || positions.size === 0;
    if (stale) {
      positions = new Map();
      for (const s of catalog.stars) {
        const h = equatorialToHorizontal(s.ra, s.dec, lst, lat);
        if (h.alt < -2) continue;
        const p = horizontalToScreen(h);
        const stretch = 1 + warp * warp * 0.9 * warpDir;
        positions.set(s.n, { x: cx + p.x * R * stretch, y: cy + p.y * R * stretch, alt: h.alt });
      }
      positionsAt = now;
      positionsKey = paletteKey;
      if (staticCtx) drawStaticLayer(staticCtx, cx, cy, R);
    }
    if (glowAccent !== accent) buildGlow(accent);

    ctx!.drawImage(staticLayer, 0, 0, width, height);

    // Stars
    const t = now / 1000;
    const twinkleOn = !reduced.matches && !lowPower;
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

      if (!isAtlas && r > 1.8) {
        const gr = r * 3.2;
        ctx!.globalAlpha = alpha * 0.35;
        ctx!.drawImage(glow, p.x - gr, p.y - gr, gr * 2, gr * 2);
      }
      ctx!.globalAlpha = alpha;
      ctx!.fillStyle = s.m < 1 ? accent : isAtlas ? ink : '#fff7e6';
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx!.fill();
    }
    ctx!.globalAlpha = 1;

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
    if (now < warpUntil || now - lastDraw >= frameMs) {
      draw(now);
      lastDraw = now;
    }
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
    refreshPalette();
    if (reduced.matches) draw(performance.now());
    else start();
  };
  document.addEventListener('universe:mode', onMode);
  const onTheme = () => refreshPalette(true);
  document.addEventListener('universe:theme', onTheme);

  return () => {
    stop();
    ro.disconnect();
    io.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    document.removeEventListener('universe:mode', onMode);
    document.removeEventListener('universe:theme', onTheme);
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

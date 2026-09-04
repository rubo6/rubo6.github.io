/**
 * Live mission clocks. Each element carries data-start (ISO) and optional data-end (ISO).
 * Without data-end the clock counts up to now; with a future data-end it counts down.
 */
import { duration, parseContentDate } from '@/lib/astro';
import { readJson } from './sky';

interface Units {
  y: string;
  mo: string;
  d: string;
  h: string;
  m: string;
  s: string;
}

const pad = (n: number) => n.toString().padStart(2, '0');

function render(el: HTMLElement, units: Units, now: Date): void {
  const start = parseContentDate(el.dataset.start ?? '2000-01-01');
  const end = el.dataset.end ? parseContentDate(el.dataset.end) : null;
  const d = end ? duration(now, end) : duration(start, now);

  const parts: [number, string, string][] = [
    [d.years, units.y, 'y'],
    [d.months, units.mo, 'mo'],
    [d.days, units.d, 'd'],
    [d.hours, units.h, 'h'],
    [d.minutes, units.m, 'm'],
    [d.seconds, units.s, 's'],
  ];

  for (const [value, label, key] of parts) {
    const slot = el.querySelector<HTMLElement>(`[data-part="${key}"]`);
    if (!slot) continue;
    const num = slot.querySelector<HTMLElement>('[data-num]');
    const unit = slot.querySelector<HTMLElement>('[data-unit]');
    const text = key === 'y' || key === 'mo' || key === 'd' ? String(value) : pad(value);
    if (num && num.textContent !== text) num.textContent = text;
    if (unit && unit.textContent !== label) unit.textContent = label;
    slot.hidden = (key === 'y' && value === 0) || (key === 'mo' && value === 0 && d.years === 0);
  }
  el.setAttribute(
    'aria-label',
    `${d.years} ${units.y} ${d.months} ${units.mo} ${d.days} ${units.d} ${pad(d.hours)}:${pad(d.minutes)}:${pad(d.seconds)}`,
  );
}

export function mountCounters(): () => void {
  const els = [...document.querySelectorAll<HTMLElement>('[data-counter]')];
  if (!els.length) return () => {};
  const strings = readJson<{ units: Units }>('client-strings');
  const units = strings?.units ?? { y: 'y', mo: 'mo', d: 'd', h: 'h', m: 'm', s: 's' };

  let timer = 0;
  const tick = () => {
    const now = new Date();
    for (const el of els) render(el, units, now);
  };
  tick();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  timer = window.setInterval(tick, reduced ? 60_000 : 1000);
  return () => clearInterval(timer);
}

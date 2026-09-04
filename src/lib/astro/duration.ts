/**
 * Calendar-aware elapsed time, used by the live counters ("time at Mercado Libre", etc.).
 * Pure and deterministic: pass `now` explicitly so tests never depend on the wall clock.
 */

export interface DurationParts {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Total whole days between the two instants. */
  totalDays: number;
  /** True when `end` is before `start` (a countdown). */
  negative: boolean;
}

function addMonths(d: Date, months: number): Date {
  const r = new Date(d.getTime());
  const day = r.getUTCDate();
  r.setUTCDate(1);
  r.setUTCMonth(r.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(r.getUTCFullYear(), r.getUTCMonth() + 1, 0)).getUTCDate();
  r.setUTCDate(Math.min(day, lastDay));
  return r;
}

/** Elapsed time from `start` to `end`, broken into calendar years/months and clock parts. */
export function duration(start: Date, end: Date): DurationParts {
  let a = start;
  let b = end;
  const negative = end.getTime() < start.getTime();
  if (negative) [a, b] = [end, start];

  // Whole months via binary-free stepping (bounded: at most a few hundred iterations).
  let months = 0;
  while (addMonths(a, months + 1).getTime() <= b.getTime()) months += 1;
  const afterMonths = addMonths(a, months);

  let rest = Math.floor((b.getTime() - afterMonths.getTime()) / 1000);
  const days = Math.floor(rest / 86_400);
  rest -= days * 86_400;
  const hours = Math.floor(rest / 3600);
  rest -= hours * 3600;
  const minutes = Math.floor(rest / 60);
  const seconds = rest - minutes * 60;

  return {
    years: Math.floor(months / 12),
    months: months % 12,
    days,
    hours,
    minutes,
    seconds,
    totalDays: Math.floor((b.getTime() - a.getTime()) / 86_400_000),
    negative,
  };
}

/** Parses a YYYY-MM-DD content date as midnight in a fixed UTC offset (default -06:00, Mexico City). */
export function parseContentDate(iso: string, utcOffsetHours = -6): Date {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d, -utcOffsetHours, 0, 0));
}

/**
 * Astronomical time utilities. Pure functions, no dependencies.
 * Formulas follow Jean Meeus, "Astronomical Algorithms" (2nd ed.), chapters 7 and 12.
 */

/** Julian Date of the J2000.0 epoch (2000-01-01T12:00:00 TT ≈ UTC for our purposes). */
export const J2000 = 2451545.0;

/** Julian Date for a JavaScript Date (UTC). Valid for all dates of interest here. */
export function julianDate(date: Date): number {
  return date.getTime() / 86_400_000 + 2_440_587.5;
}

/** Julian centuries since J2000.0. */
function julianCenturies(jd: number): number {
  return (jd - J2000) / 36_525;
}

/** Normalizes an angle in degrees to [0, 360). */
function normalizeDegrees(deg: number): number {
  const d = deg % 360;
  return d < 0 ? d + 360 : d;
}

/** Normalizes hours to [0, 24). */
function normalizeHours(h: number): number {
  const x = h % 24;
  return x < 0 ? x + 24 : x;
}

/**
 * Greenwich Mean Sidereal Time in hours (Meeus 12.4).
 * Accuracy ~0.1 s over the 20th–21st centuries, far more than a canvas needs.
 */
export function gmstHours(jd: number): number {
  const T = julianCenturies(jd);
  const gmstDeg =
    280.46061837 + 360.98564736629 * (jd - J2000) + 0.000387933 * T * T - (T * T * T) / 38_710_000;
  return normalizeDegrees(gmstDeg) / 15;
}

/** Local Mean Sidereal Time in hours for an east-positive longitude in degrees. */
export function lstHours(jd: number, longitudeDeg: number): number {
  return normalizeHours(gmstHours(jd) + longitudeDeg / 15);
}

/** Formats decimal hours as HHh MMm SSs (used for the live sidereal clock). */
export function formatHours(hours: number): string {
  const total = Math.round(normalizeHours(hours) * 3600);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
}

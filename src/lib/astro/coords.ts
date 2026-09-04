/**
 * Coordinate transforms: equatorial (RA/Dec) → horizontal (Alt/Az) → screen.
 * Pure functions, degrees in / degrees out unless stated.
 */

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

export interface Horizontal {
  /** Altitude above the horizon, degrees (-90..90). */
  alt: number;
  /** Azimuth measured from North through East, degrees [0, 360). */
  az: number;
}

/**
 * Converts equatorial coordinates to horizontal ones for an observer.
 * @param raHours   Right ascension in hours (J2000).
 * @param decDeg    Declination in degrees (J2000).
 * @param lstHours  Local sidereal time in hours.
 * @param latDeg    Observer latitude in degrees (north positive).
 */
export function equatorialToHorizontal(
  raHours: number,
  decDeg: number,
  lstHours: number,
  latDeg: number,
): Horizontal {
  const ha = (lstHours - raHours) * 15 * DEG; // hour angle, radians
  const dec = decDeg * DEG;
  const lat = latDeg * DEG;

  const sinAlt = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(ha);
  const alt = Math.asin(Math.min(1, Math.max(-1, sinAlt)));

  const y = -Math.sin(ha) * Math.cos(dec);
  const x = Math.sin(dec) * Math.cos(lat) - Math.cos(dec) * Math.sin(lat) * Math.cos(ha);
  let az = Math.atan2(y, x) * RAD;
  if (az < 0) az += 360;

  return { alt: alt * RAD, az };
}

export interface ScreenPoint {
  /** Normalized x in [-1, 1]; 0 = zenith, +1 = horizon towards the right edge. */
  x: number;
  /** Normalized y in [-1, 1]; north is up. */
  y: number;
  /** Distance from zenith normalized so that the horizon is 1. */
  r: number;
}

/**
 * Stereographic "fish-eye" projection centred on the zenith.
 * North at the top, East on the LEFT (as seen when looking up at the sky).
 */
export function horizontalToScreen({ alt, az }: Horizontal): ScreenPoint {
  const z = (90 - alt) * DEG; // zenith distance
  // Stereographic: r = 2 tan(z/2); horizon (z=90°) → r = 2. Normalize by 2.
  const r = Math.tan(z / 2);
  const a = az * DEG;
  return { x: -Math.sin(a) * r, y: -Math.cos(a) * r, r };
}

/** Apparent radius for a star of given visual magnitude (brighter = larger). */
export function magnitudeToRadius(mag: number, base = 1.1): number {
  // Magnitude scale is logarithmic; clamp so the faintest catalogue stars stay visible.
  const r = base * Math.pow(1.35, 2.2 - mag);
  return Math.min(4.2, Math.max(0.45, r));
}

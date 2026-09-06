/**
 * Moon phase. Good to ~0.3 days, which is what a footer widget needs.
 * Based on the mean synodic month measured from a reference new moon (Meeus 49).
 */
import { julianDate } from './time';

/** Mean length of the synodic month in days. */
const SYNODIC_MONTH = 29.530588853;

/** Reference new moon: 2000-01-06 18:14 UTC (JD 2451550.2597). */
const REFERENCE_NEW_MOON_JD = 2_451_550.2597;

export type MoonPhaseName =
  | 'new'
  | 'waxing-crescent'
  | 'first-quarter'
  | 'waxing-gibbous'
  | 'full'
  | 'waning-gibbous'
  | 'last-quarter'
  | 'waning-crescent';

export interface MoonPhase {
  /** Days since the last new moon, [0, SYNODIC_MONTH). */
  age: number;
  /** Fraction of the cycle, [0, 1). 0 = new, 0.5 = full. */
  phase: number;
  /** Illuminated fraction of the disc, [0, 1]. */
  illumination: number;
  name: MoonPhaseName;
  /** True while the Moon is waxing (between new and full). */
  waxing: boolean;
}

export function moonPhase(date: Date): MoonPhase {
  const days = julianDate(date) - REFERENCE_NEW_MOON_JD;
  let phase = (days / SYNODIC_MONTH) % 1;
  if (phase < 0) phase += 1;
  const age = phase * SYNODIC_MONTH;
  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  const waxing = phase < 0.5;

  const bucket = Math.floor(((phase + 1 / 16) % 1) * 8);
  const names: MoonPhaseName[] = [
    'new',
    'waxing-crescent',
    'first-quarter',
    'waxing-gibbous',
    'full',
    'waning-gibbous',
    'last-quarter',
    'waning-crescent',
  ];

  return { age, phase, illumination, name: names[bucket] ?? 'new', waxing };
}

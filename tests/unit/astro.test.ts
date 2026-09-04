import { describe, expect, it } from 'vitest';
import {
  J2000,
  duration,
  equatorialToHorizontal,
  formatHours,
  gmstHours,
  horizontalToScreen,
  julianDate,
  lstHours,
  magnitudeToRadius,
  moonPhase,
  parseContentDate,
} from '@/lib/astro';

describe('time', () => {
  it('J2000 epoch is JD 2451545.0', () => {
    expect(julianDate(new Date('2000-01-01T12:00:00Z'))).toBeCloseTo(J2000, 6);
  });

  it('GMST at J2000 epoch is 18.697374558 h (Meeus)', () => {
    expect(gmstHours(J2000)).toBeCloseTo(18.697374558, 4);
  });

  it('GMST for 1987-04-10 00:00 UT is 13h 10m 46.3668s (Meeus example 12.a)', () => {
    const jd = julianDate(new Date('1987-04-10T00:00:00Z'));
    expect(gmstHours(jd)).toBeCloseTo(13 + 10 / 60 + 46.3668 / 3600, 3);
  });

  it('LST shifts by longitude / 15', () => {
    const jd = J2000;
    expect(lstHours(jd, -99.1332)).toBeCloseTo((gmstHours(jd) - 99.1332 / 15 + 24) % 24, 6);
  });

  it('formats hours with zero padding', () => {
    expect(formatHours(5.5)).toBe('05h 30m 00s');
    expect(formatHours(-0.5)).toBe('23h 30m 00s');
  });
});

describe('coords', () => {
  it('a star on the meridian has altitude 90 - |lat - dec|', () => {
    const { alt, az } = equatorialToHorizontal(6.75, -16.72, 6.75, 19.43);
    expect(alt).toBeCloseTo(90 - (19.43 + 16.72), 5);
    expect(az).toBeCloseTo(180, 5); // south of zenith for a southern star seen from CDMX
  });

  it('the celestial pole sits at altitude = latitude, azimuth 0', () => {
    const { alt, az } = equatorialToHorizontal(2.53, 90, 4, 19.43);
    expect(alt).toBeCloseTo(19.43, 3);
    expect(az % 360).toBeCloseTo(0, 3);
  });

  it('Meeus example 13.b: Venus from Washington on 1987-04-10 19:21 UT', () => {
    // RA 23h 09m 16.641s, Dec -6° 43' 11.61", Greenwich apparent sidereal time 8h 34m 56.853s,
    // observer at 77° 03' 56" W, 38° 55' 17" N.
    const ra = 23 + 9 / 60 + 16.641 / 3600;
    const dec = -(6 + 43 / 60 + 11.61 / 3600);
    const lst = 8 + 34 / 60 + 56.853 / 3600 - (77 + 3 / 60 + 56 / 3600) / 15;
    const { alt, az } = equatorialToHorizontal(ra, dec, lst, 38 + 55 / 60 + 17 / 3600);
    expect(alt).toBeCloseTo(15.1249, 2);
    // Meeus measures azimuth from South (68.0337°); ours is from North → 248.0337°.
    expect(az).toBeCloseTo(248.0337, 2);
  });

  it('projects the zenith to the centre and the horizon to r = 1', () => {
    expect(horizontalToScreen({ alt: 90, az: 0 }).r).toBeCloseTo(0, 6);
    expect(horizontalToScreen({ alt: 0, az: 90 }).r).toBeCloseTo(1, 6);
  });

  it('puts north up and east on the left (looking up)', () => {
    expect(horizontalToScreen({ alt: 45, az: 0 }).y).toBeLessThan(0);
    expect(horizontalToScreen({ alt: 45, az: 90 }).x).toBeLessThan(0);
  });

  it('brighter stars get bigger radii, within bounds', () => {
    expect(magnitudeToRadius(-1.46)).toBeGreaterThan(magnitudeToRadius(2.0));
    expect(magnitudeToRadius(-1.46)).toBeLessThanOrEqual(4.2);
    expect(magnitudeToRadius(6)).toBeGreaterThanOrEqual(0.45);
  });
});

describe('moon', () => {
  it('reference new moon 2000-01-06 18:14 UTC has age ≈ 0', () => {
    const m = moonPhase(new Date('2000-01-06T18:14:00Z'));
    expect(m.age).toBeLessThan(0.05);
    expect(m.name).toBe('new');
  });

  it('full moon 2000-01-21 04:40 UTC has illumination ≈ 1', () => {
    const m = moonPhase(new Date('2000-01-21T04:40:00Z'));
    expect(m.illumination).toBeGreaterThan(0.98);
    expect(m.name).toBe('full');
  });

  it('full moon 2026-01-03 10:03 UTC is still recognised two decades later', () => {
    const m = moonPhase(new Date('2026-01-03T10:03:00Z'));
    expect(m.illumination).toBeGreaterThan(0.97);
    expect(m.name).toBe('full');
  });
});

describe('duration', () => {
  it('splits calendar months and clock parts', () => {
    const start = parseContentDate('2025-10-01');
    const now = new Date('2026-09-03T18:00:00-06:00');
    const d = duration(start, now);
    expect(d.years).toBe(0);
    expect(d.months).toBe(11);
    expect(d.days).toBe(2);
    expect(d.hours).toBe(18);
    expect(d.negative).toBe(false);
  });

  it('handles countdowns', () => {
    const d = duration(new Date('2026-09-03T00:00:00Z'), new Date('2026-09-01T00:00:00Z'));
    expect(d.negative).toBe(true);
    expect(d.totalDays).toBe(2);
  });

  it('clamps month-end overflow (Jan 31 + 1 month → Feb 28)', () => {
    const d = duration(new Date('2025-01-31T00:00:00Z'), new Date('2025-03-01T00:00:00Z'));
    expect(d.months).toBe(1);
    expect(d.days).toBe(1);
  });
});

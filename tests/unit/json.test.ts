import { describe, expect, it } from 'vitest';
import { safeJson } from '@/lib/json';

// safeJson feeds <script type="application/json"> islands; a payload must never be able to
// close the script element or break a JS string literal, and must round-trip through JSON.parse.
describe('safeJson', () => {
  it('escapes the characters that could break out of a <script> element', () => {
    const out = safeJson({ x: '</script><img src=x onerror=alert(1)>&' });
    expect(out).not.toContain('<');
    expect(out).not.toContain('>');
    expect(out).not.toContain('&');
    expect(out).toContain('\\u003c/script\\u003e');
  });

  it('escapes U+2028 and U+2029 line separators', () => {
    const out = safeJson(String.fromCharCode(0x2028) + String.fromCharCode(0x2029));
    expect(out).toBe('"\\u2028\\u2029"');
  });

  it('round-trips through JSON.parse unchanged', () => {
    const value = {
      a: '<b>&</b>',
      n: 1,
      list: ['x', { y: null }],
      sep: String.fromCharCode(0x2028),
    };
    expect(JSON.parse(safeJson(value))).toEqual(value);
  });
});

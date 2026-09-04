/**
 * Serializes data for a <script type="application/json"> island.
 * Escapes `<`, `>` and `&` so no payload can break out of the script element (XSS hardening),
 * and the U+2028 / U+2029 line separators, which are invalid inside JS string literals in older parsers.
 * Character codes are spelled out numerically so no invisible characters live in this source file.
 */
const LT = /</g;
const GT = />/g;
const AMP = /&/g;
const LINE_SEP = new RegExp(String.fromCharCode(0x2028), 'g');
const PARA_SEP = new RegExp(String.fromCharCode(0x2029), 'g');
const BACKSLASH = String.fromCharCode(0x5c);

export function safeJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(LT, `${BACKSLASH}u003c`)
    .replace(GT, `${BACKSLASH}u003e`)
    .replace(AMP, `${BACKSLASH}u0026`)
    .replace(LINE_SEP, `${BACKSLASH}u2028`)
    .replace(PARA_SEP, `${BACKSLASH}u2029`);
}

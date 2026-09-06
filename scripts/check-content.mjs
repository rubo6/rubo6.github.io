// Content sanity checks that zod cannot express. Runs inside `npm run validate` before the build.
//   - no TODO markers left by scripts/new-content.mjs
//   - every project key in en/ has the same key inside the file (typo guard)
//   - no middle dot in trajectory org/role strings (CV parsers) — see AGENTS.md voice rule 6
//   - every English UI key in src/i18n/ui.ts is referenced somewhere (literal or `prefix.${…}`)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const problems = [];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

for (const file of walk('src/content').filter((f) => /\.(md|json)$/.test(f))) {
  const text = readFileSync(file, 'utf8');
  const line = text.split('\n').findIndex((l) => l.includes('TODO'));
  if (line >= 0) problems.push(`${file}:${line + 1} contains a TODO marker`);
  if (/[/\\]projects[/\\]/.test(file)) {
    const key = file.replace(/\\/g, '/').split('/').pop().replace(/\.md$/, '');
    const m = text.match(/^key:\s*(\S+)/m);
    if (m && m[1] !== key)
      problems.push(`${file}: frontmatter key "${m[1]}" differs from file name "${key}"`);
  }
  if (/[/\\]trajectory[/\\]/.test(file)) {
    const data = JSON.parse(text);
    for (const e of data.entries ?? []) {
      for (const field of ['org', 'role']) {
        if (e[field]?.includes('·'))
          problems.push(
            `${file}: entry "${e.id}" ${field} uses "·"; use commas/parentheses (CV parsers)`,
          );
      }
    }
  }
}

// UI keys: parse the English table, look for each key (or a dynamic prefix of it) in src/ and ui.ts itself.
{
  const ui = readFileSync('src/i18n/ui.ts', 'utf8');
  const en = ui.match(/\nconst en = \{([\s\S]*?)\n\};/)?.[1] ?? '';
  const keys = [...en.matchAll(/^\s+'([a-zA-Z0-9.-]+)':/gm)].map((m) => m[1]);
  const files = walk('src').filter((f) => /\.(astro|ts)$/.test(f) && !f.endsWith('ui.ts'));
  const src =
    files.map((f) => readFileSync(f, 'utf8')).join('\n') + ui.slice(ui.indexOf('export function'));
  for (const k of keys) {
    if (src.includes(`'${k}'`) || src.includes(`"${k}"`)) continue;
    const parts = k.split('.');
    const dynamic = parts.some(
      (_, i) => i > 0 && src.includes('`' + parts.slice(0, i).join('.') + '.'),
    );
    if (!dynamic)
      problems.push(`src/i18n/ui.ts: UI key "${k}" is not used anywhere (remove it or use it)`);
  }
}

if (problems.length) {
  console.error('Content check failed:\n' + problems.map((p) => '  - ' + p).join('\n'));
  process.exit(1);
}
console.log('Content check passed.');

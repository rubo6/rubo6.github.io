// Content sanity checks that zod cannot express. Runs inside `npm run validate` before the build.
//   - no TODO markers left by scripts/new-content.mjs
//   - every project key in en/ has the same key inside the file (typo guard)
//   - no middle dot in trajectory org/role strings (CV parsers) — see AGENTS.md voice rule 6
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const problems = [];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(md|json)$/.test(name)) out.push(p);
  }
  return out;
}

for (const file of walk('src/content')) {
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

if (problems.length) {
  console.error('Content check failed:\n' + problems.map((p) => '  - ' + p).join('\n'));
  process.exit(1);
}
console.log('Content check passed.');

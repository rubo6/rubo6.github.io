// Scaffold content files with TODO markers so an editor (human or model) only fills in facts.
//   node scripts/new-content.mjs project <key>   → src/content/projects/{en,es,pt-br}/<key>.md
//   node scripts/new-content.mjs post <key>      → src/content/posts/{en,es}/<key>.md
// `npm run validate` refuses to build while any TODO remains in src/content (scripts/check-content.mjs).
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [kind, key] = process.argv.slice(2);
const usage =
  'usage: node scripts/new-content.mjs <project|post> <key>   (key: lowercase, digits, hyphens)';
if (!kind || !key || !/^[a-z0-9-]+$/.test(key) || !['project', 'post'].includes(kind)) {
  console.error(usage);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);

const project = (locale) => `---
title: TODO title
key: ${key}
locale: ${locale}
nebula: TODO # professional | academic | research | personal | community | upcoming
summary: 'TODO one sentence, max 240 characters, no colon unless quoted'
role: TODO # e.g. Author
period: { start: '${today}', end: null }
stack: [TODO]
highlights:
  - TODO fact one (each highlight is a star; 1–8)
featured: false
order: 50
visibility: public # public | confidential (employer, no repo) | course (code cannot be published)
---

TODO one to three short first-person paragraphs. Follow the voice rules in AGENTS.md.
`;

const post = (locale) => `---
title: 'TODO one concrete hook, no "Nth term:" prefix'
key: ${key}
locale: ${locale}
date: '${today}'
summary: 'TODO max 280 characters'
area: TODO # math | stats | computing | datascience | economics | humanities | astronomy | work | leadership
semester: 'TODO e.g. Otoño 2025 (optional, delete if not academic)'
courses: []
tags: []
featured: false
---

TODO 350–600 words, first person, \`##\` sections, end with a "What I take with me" section.
No invented grades, names or anecdotes.
`;

const targets =
  kind === 'project'
    ? ['en', 'es', 'pt-br'].map((l) => [join('src/content/projects', l, `${key}.md`), project(l)])
    : ['en', 'es'].map((l) => [join('src/content/posts', l, `${key}.md`), post(l)]);

for (const [path] of targets) {
  if (existsSync(path)) {
    console.error(`refusing to overwrite ${path}`);
    process.exit(1);
  }
}
for (const [path, body] of targets) {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, body);
  console.log('created', path);
}
console.log(
  `\nNext: fill every TODO (English first, then translate), run "npm run format", then "npm run validate".` +
    (kind === 'project'
      ? ' Add "repo: owner/name" only if the repository is public.'
      : ' Posts need EN and ES; PT-BR falls back to English.'),
);

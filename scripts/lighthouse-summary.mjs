// Summarises Lighthouse JSON reports (mobile + desktop) into docs/lighthouse/latest.json, appends a
// line to docs/lighthouse/history.jsonl and prints a Markdown table (used as the GitHub job summary).
// Usage: node scripts/lighthouse-summary.mjs <mobile.json> <desktop.json>
import { readFileSync, writeFileSync, mkdirSync, appendFileSync } from 'node:fs';

const [mobilePath, desktopPath] = process.argv.slice(2);
if (!mobilePath || !desktopPath) {
  console.error('usage: node scripts/lighthouse-summary.mjs <mobile.json> <desktop.json>');
  process.exit(1);
}

function pick(path) {
  const d = JSON.parse(readFileSync(path, 'utf8'));
  const c = d.categories;
  const a = d.audits;
  const score = (k) => Math.round((c[k]?.score ?? 0) * 100);
  const ms = (k) => Math.round(a[k]?.numericValue ?? 0);
  return {
    performance: score('performance'),
    accessibility: score('accessibility'),
    bestPractices: score('best-practices'),
    seo: score('seo'),
    lcpMs: ms('largest-contentful-paint'),
    fcpMs: ms('first-contentful-paint'),
    speedIndexMs: ms('speed-index'),
    tbtMs: ms('total-blocking-time'),
    cls: Number((a['cumulative-layout-shift']?.numericValue ?? 0).toFixed(3)),
    benchmarkIndex: Math.round(d.environment?.benchmarkIndex ?? 0),
    lighthouseVersion: d.lighthouseVersion,
    fetchTime: d.fetchTime,
    // Diagnostics so a run can be understood without downloading the artifact.
    failedAudits: Object.entries(a)
      .filter(([, v]) => v.scoreDisplayMode === 'binary' && v.score === 0)
      .map(([k, v]) => ({ id: k, sample: v.details?.items?.[0]?.node?.selector ?? null })),
    lcp: lcpBreakdown(a),
  };
}

function lcpBreakdown(a) {
  const items = a['lcp-breakdown-insight']?.details?.items ?? [];
  const table = items.find((i) => i.type === 'table');
  const node = items.find((i) => i.type === 'node');
  const phases = Object.fromEntries(
    (table?.items ?? []).map((r) => [r.subpart, Math.round(r.duration)]),
  );
  return { element: node?.selector ?? null, ...phases };
}

const latest = {
  url: 'https://rubo6.dev/',
  measuredAt: new Date().toISOString(),
  runner: process.env.GITHUB_RUN_ID ? `github-actions#${process.env.GITHUB_RUN_ID}` : 'local',
  mobile: pick(mobilePath),
  desktop: pick(desktopPath),
};

mkdirSync('docs/lighthouse', { recursive: true });
writeFileSync('docs/lighthouse/latest.json', JSON.stringify(latest, null, 2) + '\n');
appendFileSync(
  'docs/lighthouse/history.jsonl',
  JSON.stringify({
    measuredAt: latest.measuredAt,
    runner: latest.runner,
    mobile: [
      latest.mobile.performance,
      latest.mobile.accessibility,
      latest.mobile.bestPractices,
      latest.mobile.seo,
    ],
    desktop: [
      latest.desktop.performance,
      latest.desktop.accessibility,
      latest.desktop.bestPractices,
      latest.desktop.seo,
    ],
    lcpMs: { mobile: latest.mobile.lcpMs, desktop: latest.desktop.lcpMs },
  }) + '\n',
);

const row = (name, r) =>
  `| ${name} | ${r.performance} | ${r.accessibility} | ${r.bestPractices} | ${r.seo} | ${(r.lcpMs / 1000).toFixed(1)} s | ${(r.speedIndexMs / 1000).toFixed(1)} s | ${r.tbtMs} ms | ${r.cls} |`;
const md = [
  `### Lighthouse — ${latest.url} (${latest.measuredAt.slice(0, 16).replace('T', ' ')} UTC)`,
  '',
  '| Profile | Perf | A11y | Best practices | SEO | LCP | Speed Index | TBT | CLS |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  row('Mobile', latest.mobile),
  row('Desktop', latest.desktop),
  '',
  `Runner benchmark index: mobile ${latest.mobile.benchmarkIndex}, desktop ${latest.desktop.benchmarkIndex} (higher = faster machine; scores are comparable only at similar values).`,
].join('\n');
console.log(md);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n');

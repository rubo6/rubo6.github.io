/**
 * Build-time GitHub loader (Astro Content Layer).
 *
 * Reads public repository facts (stars, forks, language, last push) for every `repo:` referenced
 * in src/content/projects/en/*.md and, when GH_TRAFFIC_TOKEN is present in the build environment
 * (GitHub Actions secret), the 14-day traffic counters (views, unique visitors, clones).
 *
 * Security notes:
 *  - The token is read from the environment only, never logged, never written to the store, and
 *    never shipped to the browser (this code runs at build time only).
 *  - Requests go to a fixed https://api.github.com origin with repository names validated against
 *    a strict owner/name pattern taken from our own content files (no user input).
 *  - Fail-soft: any network or API error leaves the collection empty and the UI hides the stats,
 *    so an offline or rate-limited build still succeeds.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Loader } from 'astro/loaders';

const REPO_RE = /^[\w.-]+\/[\w.-]+$/;
const API = 'https://api.github.com';

export interface RepoStats {
  repo: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  pushedAt: string;
  htmlUrl: string;
  description: string | null;
  /** Present only when the build had a token with traffic access. */
  traffic?: { views: number; uniques: number; clones: number; days: number };
}

async function discoverRepos(projectsDir: string): Promise<string[]> {
  const repos = new Set<string>();
  for (const file of await readdir(projectsDir)) {
    if (!file.endsWith('.md')) continue;
    const text = await readFile(path.join(projectsDir, file), 'utf8');
    const m = text.match(/^repo:\s*["']?([\w.\-/]+)["']?\s*$/m);
    if (m?.[1] && REPO_RE.test(m[1])) repos.add(m[1]);
  }
  return [...repos];
}

async function gh<T>(url: string, token: string | undefined): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'rubo6.github.io-build',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${url}`);
  return (await res.json()) as T;
}

export function githubLoader(opts: { projectsDir?: string } = {}): Loader {
  const projectsDir = opts.projectsDir ?? path.resolve('src/content/projects/en');
  return {
    name: 'github-repos',
    async load({ store, logger, parseData }) {
      const token = process.env.GH_TRAFFIC_TOKEN || undefined;
      const repos = await discoverRepos(projectsDir);
      if (!repos.length) return;
      logger.info(
        `Fetching ${repos.length} repositor${repos.length === 1 ? 'y' : 'ies'} from GitHub${token ? ' (with traffic)' : ''}`,
      );
      store.clear();

      for (const repo of repos) {
        try {
          const r = await gh<{
            stargazers_count: number;
            forks_count: number;
            open_issues_count: number;
            language: string | null;
            pushed_at: string;
            html_url: string;
            description: string | null;
          }>(`${API}/repos/${repo}`, token);

          const data: RepoStats = {
            repo,
            stars: r.stargazers_count,
            forks: r.forks_count,
            openIssues: r.open_issues_count,
            language: r.language,
            pushedAt: r.pushed_at,
            htmlUrl: r.html_url,
            description: r.description,
          };

          if (token) {
            try {
              const [views, clones] = await Promise.all([
                gh<{ count: number; uniques: number }>(`${API}/repos/${repo}/traffic/views`, token),
                gh<{ count: number; uniques: number }>(
                  `${API}/repos/${repo}/traffic/clones`,
                  token,
                ),
              ]);
              data.traffic = {
                views: views.count,
                uniques: views.uniques,
                clones: clones.count,
                days: 14,
              };
            } catch (e) {
              logger.warn(`Traffic unavailable for ${repo}: ${(e as Error).message}`);
            }
          }

          const parsed = await parseData({
            id: repo,
            data: data as unknown as Record<string, unknown>,
          });
          store.set({ id: repo, data: parsed });
        } catch (e) {
          logger.warn(`Skipping ${repo}: ${(e as Error).message}`);
        }
      }
    },
  };
}

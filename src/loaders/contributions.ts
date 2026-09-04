/**
 * Build-time GitHub contributions loader (Astro Content Layer).
 *
 * Produces one entry (id = login) with a per-day contribution count that the personal universe
 * renders as a heatmap. Two data paths, in order of preference:
 *
 *  1. GraphQL `contributionsCollection.contributionCalendar` — the same 12-month calendar GitHub
 *     shows on a profile. Needs a token (we reuse GH_TRAFFIC_TOKEN inside GitHub Actions).
 *  2. REST `GET /users/{login}/events/public` — anonymous, but GitHub only keeps the last ~90 days /
 *     300 events, so the heatmap covers a shorter window. Used when no token is present or GraphQL
 *     is rejected.
 *
 * Security notes:
 *  - The login is taken from our own profile content (validated against GitHub's username rules),
 *    never from user input; requests go to fixed https://api.github.com endpoints only.
 *  - The token is read from the environment at build time, never logged or stored.
 *  - Fail-soft: any error leaves the collection empty and the UI hides the heatmap.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Loader } from 'astro/loaders';

const LOGIN_RE = /^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/;
const API = 'https://api.github.com';

export interface ContributionDay {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface Contributions {
  login: string;
  source: 'graphql' | 'events';
  total: number;
  from: string;
  to: string;
  days: ContributionDay[];
}

async function discoverLogin(profilePath: string): Promise<string | undefined> {
  const text = await readFile(profilePath, 'utf8');
  const m = text.match(/"url":\s*"https:\/\/github\.com\/([A-Za-z\d-]+)"/);
  const login = m?.[1];
  return login && LOGIN_RE.test(login) ? login : undefined;
}

function headers(token: string | undefined): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'rubo6.github.io-build',
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function viaGraphql(login: string, token: string): Promise<Contributions> {
  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}}}`;
  const res = await fetch(`${API}/graphql`, {
    method: 'POST',
    headers: { ...headers(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { login } }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`GraphQL ${res.status}`);
  const json = (await res.json()) as {
    errors?: { message: string }[];
    data?: {
      user: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: number;
            weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
          };
        };
      } | null;
    };
  };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '));
  const cal = json.data?.user?.contributionsCollection.contributionCalendar;
  if (!cal) throw new Error('empty calendar');
  const days = cal.weeks.flatMap((w) =>
    w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount })),
  );
  const first = days[0];
  const last = days[days.length - 1];
  if (!first || !last) throw new Error('empty calendar');
  return {
    login,
    source: 'graphql',
    total: cal.totalContributions,
    from: first.date,
    to: last.date,
    days,
  };
}

interface PublicEvent {
  type: string;
  created_at: string;
  payload?: { size?: number; distinct_size?: number };
}

async function viaEvents(login: string, token: string | undefined): Promise<Contributions> {
  const counts = new Map<string, number>();
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(`${API}/users/${login}/events/public?per_page=100&page=${page}`, {
      headers: headers(token),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`events ${res.status}`);
    const events = (await res.json()) as PublicEvent[];
    for (const ev of events) {
      const day = ev.created_at.slice(0, 10);
      const weight =
        ev.type === 'PushEvent'
          ? Math.max(1, ev.payload?.distinct_size ?? ev.payload?.size ?? 1)
          : 1;
      counts.set(day, (counts.get(day) ?? 0) + weight);
    }
    if (events.length < 100) break;
  }
  // Fill a continuous 13-week window ending today so the grid has no holes.
  const today = new Date();
  const to = today.toISOString().slice(0, 10);
  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - 90);
  const days: ContributionDay[] = [];
  for (const d = new Date(start); d <= today; d.setUTCDate(d.getUTCDate() + 1)) {
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, count: counts.get(key) ?? 0 });
  }
  const first = days[0];
  if (!first) throw new Error('empty window');
  const total = days.reduce((n, d) => n + d.count, 0);
  return { login, source: 'events', total, from: first.date, to, days };
}

export function contributionsLoader(opts: { profilePath?: string; login?: string } = {}): Loader {
  const profilePath = opts.profilePath ?? path.resolve('src/content/profile/en.json');
  return {
    name: 'github-contributions',
    async load({ store, logger, parseData }) {
      const token = process.env.GH_TRAFFIC_TOKEN || undefined;
      const login = opts.login ?? (await discoverLogin(profilePath));
      if (!login) return;
      store.clear();
      let data: Contributions | undefined;
      if (token) {
        try {
          data = await viaGraphql(login, token);
        } catch (e) {
          logger.warn(`Contribution calendar via GraphQL unavailable: ${(e as Error).message}`);
        }
      }
      if (!data) {
        try {
          data = await viaEvents(login, token);
        } catch (e) {
          logger.warn(`Public events unavailable for ${login}: ${(e as Error).message}`);
          return;
        }
      }
      logger.info(
        `Contributions for ${login}: ${data.total} (${data.source}, ${data.from} → ${data.to})`,
      );
      const parsed = await parseData({
        id: login,
        data: data as unknown as Record<string, unknown>,
      });
      store.set({ id: login, data: parsed });
    },
  };
}

/**
 * Content collections — the single place where the shape of every piece of content is defined.
 *
 * Rules for humans and AI agents (see docs/CONTENT-GUIDE.md):
 *  - Content lives in src/content/<collection>/... and is validated by these schemas at build time.
 *  - Locale is encoded in the file name or folder ("en", "es", "pt-br"). English is mandatory;
 *    other locales fall back to English when missing.
 *  - Dates are ISO strings (YYYY-MM-DD). `null` end date means "present" and powers live counters.
 *  - Never put secrets, phone numbers or private data here. Everything is published.
 */
import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { githubLoader } from './loaders/github';
import { contributionsLoader } from './loaders/contributions';

const locale = z.enum(['en', 'es', 'pt-br']);
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
const httpsUrl = z.string().url().startsWith('https://', 'Only https:// links are allowed');

/** Public identity, taglines and the dates that drive the live counters. One file per locale. */
const profile = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/profile' }),
  schema: z.object({
    locale,
    name: z.string(),
    nickname: z.string(),
    pronouns: z.string().optional(),
    headline: z.string(),
    tagline: z.string(),
    summary: z.string(),
    personalIntro: z.string(),
    location: z.object({ city: z.string(), country: z.string(), lat: z.number(), lon: z.number() }),
    email: z.string().email(),
    links: z.array(
      z.object({
        label: z.string(),
        url: httpsUrl,
        kind: z.enum(['github', 'linkedin', 'spotify', 'steam', 'xbox', 'other']),
        /**
         * Who may see the link. `professional` links appear everywhere (contact cards in both
         * modes, printable CV, JSON-LD `sameAs`). `personal` links (gaming, music, any leisure
         * profile) render only while the personal universe is active and never reach the CV or
         * structured data — recruiters and crawlers must not see them.
         */
        audience: z.enum(['professional', 'personal']).default('professional'),
      }),
    ),
    dates: z.object({
      meliStart: isoDate,
      itamStart: isoDate,
      graduation: isoDate,
      dataLabStart: isoDate.optional(),
      /** Drives the age clock in the personal universe. */
      birthday: isoDate.optional(),
    }),
    languages: z.array(z.object({ name: z.string(), level: z.string() })),
    /** Professional soft skills, each backed by a concrete fact. Rendered in the Skills section and the CV. */
    softSkills: z.array(z.object({ name: z.string(), evidence: z.string() })).default([]),
  }),
});

/** Work, leadership and education entries. One JSON array per locale. */
const trajectory = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/trajectory' }),
  schema: z.object({
    locale,
    entries: z.array(
      z.object({
        id: z.string(),
        kind: z.enum(['work', 'leadership', 'education']),
        org: z.string(),
        orgUrl: httpsUrl.optional(),
        role: z.string(),
        location: z.string(),
        start: isoDate,
        end: isoDate.nullable(),
        summary: z.string().optional(),
        bullets: z.array(z.string()),
        stack: z.array(z.string()).default([]),
        /** Public references backing reputation / ranking claims (rendered as small links). */
        sources: z.array(z.object({ label: z.string(), url: httpsUrl })).default([]),
        /**
         * Institution facts and full syllabi that are worth keeping but not worth a bullet:
         * rankings, admission statistics, complete course lists. Rendered folded on the site
         * (details/summary) and never printed in the CV.
         */
        background: z.array(z.string()).default([]),
        /** Orbit radius index in the trajectory scene (0 = innermost / most recent). */
        orbit: z.number().int().min(0),
      }),
    ),
  }),
});

/** Certifications and programs, with verification links when available. Locale-independent. */
const certifications = defineCollection({
  loader: file('./src/content/certifications.json'),
  schema: z.object({
    id: z.string(),
    issuer: z.string(),
    name: z.string(),
    status: z.enum(['earned', 'in-progress', 'expected']),
    date: isoDate.optional(),
    url: httpsUrl.optional(),
    skills: z.array(z.string()).default([]),
  }),
});

/** Nebulae = categories of the professional observatory. Locale-independent metadata + i18n labels. */
const nebulae = defineCollection({
  loader: file('./src/content/nebulae.json'),
  schema: z.object({
    id: z.enum(['professional', 'academic', 'research', 'personal', 'community', 'upcoming']),
    /** Real astronomical object this nebula is modelled after. */
    object: z.object({
      name: z.string(),
      designation: z.string(),
      constellation: z.string(),
      distanceLy: z.number(),
    }),
    labels: z.record(locale, z.string()),
    descriptions: z.record(locale, z.string()),
    /** Position and size in the observatory scene, in percent of the viewport. */
    scene: z.object({ x: z.number(), y: z.number(), scale: z.number() }),
    /** Palette used by the procedural renderer (fallback when no image is provided). */
    palette: z
      .array(z.string().regex(/^#[0-9a-f]{6}$/i))
      .min(2)
      .max(4),
    /** Optional image in src/assets/nebulae (official JWST/Hubble imagery, credited in docs). */
    image: z.string().optional(),
    credit: z.string().optional(),
  }),
});

/** Projects = stars inside a nebula. Markdown per project per locale. */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    /** Stable cross-locale key (same across en/es/pt-br). Used in URLs: /projects/<key>. */
    key: z.string().regex(/^[a-z0-9-]+$/),
    locale,
    nebula: z.enum(['professional', 'academic', 'research', 'personal', 'community', 'upcoming']),
    summary: z.string().max(240),
    role: z.string(),
    period: z.object({ start: isoDate, end: isoDate.nullable() }),
    stack: z.array(z.string()).min(1),
    /** Each highlight becomes a star of the nebula. Keep them factual and short. */
    highlights: z.array(z.string()).min(1).max(8),
    repo: z
      .string()
      .regex(/^[\w.-]+\/[\w.-]+$/, 'owner/name')
      .optional(),
    links: z.array(z.object({ label: z.string(), url: httpsUrl })).default([]),
    featured: z.boolean().default(false),
    order: z.number().int().default(100),
    /** Visibility: "public" renders everything; "confidential" hides metrics and repo. */
    /**
     * public: repo link and stats shown. confidential: employer work, no repo, disclaimer.
     * course: university work whose code cannot be published (course policy), disclaimer, no repo.
     */
    visibility: z.enum(['public', 'confidential', 'course']).default('public'),
  }),
});

/** Skills grouped as constellations. Locale-independent names; group labels are i18n. */
const skills = defineCollection({
  loader: file('./src/content/skills.json'),
  schema: z.object({
    id: z.string(),
    labels: z.record(locale, z.string()),
    /** Real constellation whose shape the group borrows. */
    constellation: z.string(),
    items: z.array(
      z.object({
        name: z.string(),
        /** 1 = familiar, 2 = productive, 3 = strong, 4 = expert. Drives star magnitude. */
        level: z.number().int().min(1).max(4),
        since: z.number().int().optional(),
        /** Where the skill comes from (course · institution, or work). Shown as the star's tooltip. */
        via: z.string().optional(),
      }),
    ),
  }),
});

/** Personal universe content: interests, soft skills, fun facts. One file per locale. */
const personal = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/personal' }),
  schema: z.object({
    locale,
    intro: z.string(),
    clusters: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        object: z.string(),
        blurb: z.string(),
        items: z.array(z.string()),
      }),
    ),
    funFacts: z.array(z.string()),
  }),
});

/** Study log ("bitácora"): Markdown per entry per locale, folder per locale, cross-locale `key`. */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    key: z.string().regex(/^[a-z0-9-]+$/),
    locale,
    date: isoDate,
    /** Optional last-revision date shown on the entry page. */
    updated: isoDate.optional(),
    /** Optional official-imagery backdrop for the entry header (ids in src/assets/scenes/credits.json). */
    scene: z.enum(['crab', 'cartwheel', 'tarantula', 'wr124', 'stephans-quintet']).optional(),
    summary: z.string().max(280),
    /** Knowledge area; drives the colour and the "instrument" label. */
    area: z.enum([
      'math',
      'stats',
      'computing',
      'datascience',
      'economics',
      'humanities',
      'astronomy',
      'work',
      'leadership',
    ]),
    /** Academic term label, e.g. "Otoño 2025". */
    semester: z.string().optional(),
    courses: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/** "Now" page content: what the owner is doing these days. One file per locale, hand-updated. */
const now = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/now' }),
  schema: z.object({
    locale,
    updated: isoDate,
    sections: z.array(
      z.object({ id: z.string(), title: z.string(), items: z.array(z.string()).min(1) }),
    ),
  }),
});

/** Live repository facts fetched at build time (see src/loaders/github.ts). Empty when offline. */
const repoStats = defineCollection({
  loader: githubLoader(),
  schema: z.object({
    repo: z.string(),
    stars: z.number().int(),
    forks: z.number().int(),
    openIssues: z.number().int(),
    language: z.string().nullable(),
    pushedAt: z.string(),
    htmlUrl: httpsUrl,
    description: z.string().nullable(),
    traffic: z
      .object({
        views: z.number().int(),
        uniques: z.number().int(),
        clones: z.number().int(),
        days: z.number().int(),
      })
      .optional(),
  }),
});

/** GitHub contribution calendar fetched at build time (see src/loaders/contributions.ts). */
const contributions = defineCollection({
  loader: contributionsLoader(),
  schema: z.object({
    login: z.string(),
    source: z.enum(['graphql', 'events']),
    total: z.number().int(),
    from: z.string(),
    to: z.string(),
    days: z.array(z.object({ date: z.string(), count: z.number().int() })),
  }),
});

export const collections = {
  profile,
  trajectory,
  certifications,
  nebulae,
  projects,
  skills,
  personal,
  repoStats,
  contributions,
  posts,
  now,
};

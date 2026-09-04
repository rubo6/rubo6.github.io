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
    visibility: z.enum(['public', 'confidential']).default('public'),
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
    softSkills: z.array(z.object({ name: z.string(), evidence: z.string() })),
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

export const collections = {
  profile,
  trajectory,
  certifications,
  nebulae,
  projects,
  skills,
  personal,
  repoStats,
  posts,
};

/**
 * Typed accessors over the content collections with English fallback.
 * Components call these instead of getCollection() directly so the fallback
 * rule lives in exactly one place.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLocale, type Locale } from '@/i18n/ui';

export type Profile = CollectionEntry<'profile'>['data'];
export type TrajectoryEntry = CollectionEntry<'trajectory'>['data']['entries'][number];
export type Project = CollectionEntry<'projects'>;
export type Nebula = CollectionEntry<'nebulae'>['data'];
export type SkillGroup = CollectionEntry<'skills'>['data'];
export type Certification = CollectionEntry<'certifications'>['data'];
export type Personal = CollectionEntry<'personal'>['data'];

async function pickLocale<T extends { data: { locale: Locale } }>(
  entries: T[],
  locale: Locale,
): Promise<T> {
  const hit =
    entries.find((e) => e.data.locale === locale) ??
    entries.find((e) => e.data.locale === defaultLocale);
  if (!hit) throw new Error(`Missing English fallback content (${locale})`);
  return hit;
}

export async function getProfile(locale: Locale): Promise<Profile> {
  return (await pickLocale(await getCollection('profile'), locale)).data;
}

export async function getTrajectory(locale: Locale): Promise<TrajectoryEntry[]> {
  const entry = await pickLocale(await getCollection('trajectory'), locale);
  return [...entry.data.entries].sort((a, b) => a.orbit - b.orbit);
}

export async function getPersonal(locale: Locale): Promise<Personal> {
  return (await pickLocale(await getCollection('personal'), locale)).data;
}

/** Projects for a locale; any project missing in that locale falls back to its English version. */
export async function getProjects(locale: Locale): Promise<Project[]> {
  const all = await getCollection('projects');
  const byKey = new Map<string, Project>();
  for (const p of all) if (p.data.locale === defaultLocale) byKey.set(p.data.key, p);
  for (const p of all) if (p.data.locale === locale) byKey.set(p.data.key, p);
  return [...byKey.values()].sort((a, b) => a.data.order - b.data.order);
}

export async function getProject(locale: Locale, key: string): Promise<Project | undefined> {
  return (await getProjects(locale)).find((p) => p.data.key === key);
}

export async function getNebulae(): Promise<Nebula[]> {
  return (await getCollection('nebulae')).map((n) => n.data);
}

export async function getSkills(): Promise<SkillGroup[]> {
  return (await getCollection('skills')).map((s) => s.data);
}

export async function getCertifications(): Promise<Certification[]> {
  return (await getCollection('certifications')).map((c) => c.data);
}

/** Picks a localized string from a { locale: string } record with English fallback. */
export function pick(record: Partial<Record<Locale, string>>, locale: Locale): string {
  return record[locale] ?? record[defaultLocale] ?? '';
}

/** Formats a YYYY-MM-DD (or null = present) as "Mon YYYY" in the given locale. */
export function formatMonth(iso: string | null, locale: Locale, present: string): string {
  if (!iso) return present;
  const [y, m] = iso.split('-').map(Number) as [number, number];
  const tag = locale === 'pt-br' ? 'pt-BR' : locale === 'es' ? 'es-MX' : 'en-US';
  return new Intl.DateTimeFormat(tag, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, 1)),
  );
}

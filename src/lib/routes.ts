/**
 * Shared getStaticPaths helpers so each locale's page file stays a one-liner.
 */
import type { Locale } from '@/i18n/ui';
import { getNebulae, getProjects, type Nebula, type Project } from './content';

export interface ProjectRouteProps {
  project: Project;
  nebula: Nebula;
}

export async function projectPaths(locale: Locale) {
  const [projects, nebulae] = await Promise.all([getProjects(locale), getNebulae()]);
  return projects.map((project) => ({
    params: { key: project.data.key },
    props: {
      project,
      nebula: nebulae.find((n) => n.id === project.data.nebula)!,
    } satisfies ProjectRouteProps,
  }));
}

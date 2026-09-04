/**
 * Shared RSS endpoint for the study log, one feed per locale.
 * Used by src/pages/log/rss.xml.ts and its locale twins.
 */
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { localePath, useTranslations, type Locale } from '@/i18n/ui';
import { getPosts } from '@/lib/content';

export async function logFeed(context: APIContext, locale: Locale): Promise<Response> {
  const t = useTranslations(locale);
  const posts = await getPosts(locale);
  const site = context.site ?? new URL('https://rubo6.dev');
  return rss({
    title: `${t('site.title')} · ${t('log.title')}`,
    description: t('log.lead'),
    site,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: new Date(`${p.data.date}T12:00:00Z`),
      description: p.data.summary,
      link: localePath(locale, `/log/${p.data.key}`),
      categories: [t(`log.area.${p.data.area}` as 'log.area.math'), ...p.data.tags],
    })),
    customData: `<language>${locale === 'pt-br' ? 'pt-br' : locale === 'es' ? 'es-mx' : 'en-us'}</language>`,
  });
}

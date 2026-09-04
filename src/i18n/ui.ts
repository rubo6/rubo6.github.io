/**
 * UI strings (navigation, buttons, labels). Long-form content lives in src/content.
 *
 * Tone rules (see docs/CONTENT-GUIDE.md):
 *  - Professional surfaces (nav, observatory, experience, CV): formal register.
 *  - Personal surfaces (personal universe, footer quips): warm, informal register.
 *
 * Tier 1 locales (full content): en, es, pt-br.
 * Any missing key falls back to English at runtime via t().
 */
export const locales = ['en', 'es', 'pt-br'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeMeta: Record<Locale, { label: string; htmlLang: string; ogLocale: string }> = {
  en: { label: 'English', htmlLang: 'en', ogLocale: 'en_US' },
  es: { label: 'Español', htmlLang: 'es-MX', ogLocale: 'es_MX' },
  'pt-br': { label: 'Português', htmlLang: 'pt-BR', ogLocale: 'pt_BR' },
};

export const ui = {
  en: {
    'site.title': 'Rubo · Observatory',
    'site.description':
      'Personal observatory of Eduardo Rubén Bernal Puente — Data & Analytics Engineer at Mercado Libre, Data Science student at ITAM.',
    'nav.sky': 'Sky',
    'nav.observatory': 'Observatory',
    'nav.trajectory': 'Trajectory',
    'nav.constellation': 'Skills',
    'nav.contact': 'Contact',
    'nav.cv': 'CV',
    'nav.skip': 'Skip to content',
    'toggle.theme.night': 'Switch to atlas (light) theme',
    'toggle.theme.atlas': 'Switch to night (dark) theme',
    'toggle.mode.pro': 'Enter the personal universe',
    'toggle.mode.personal': 'Back to the professional observatory',
    'mode.pro': 'Professional',
    'mode.personal': 'Personal',
    'lang.switch': 'Language',
    'footer.built': 'Built with Astro, TypeScript and real astronomy.',
    'footer.source': 'Source on GitHub',
  },
  es: {
    'site.title': 'Rubo · Observatorio',
    'site.description':
      'Observatorio personal de Eduardo Rubén Bernal Puente: Data & Analytics Engineer en Mercado Libre y estudiante de Ciencia de Datos en el ITAM.',
    'nav.sky': 'Cielo',
    'nav.observatory': 'Observatorio',
    'nav.trajectory': 'Trayectoria',
    'nav.constellation': 'Habilidades',
    'nav.contact': 'Contacto',
    'nav.cv': 'CV',
    'nav.skip': 'Saltar al contenido',
    'toggle.theme.night': 'Cambiar a tema atlas (claro)',
    'toggle.theme.atlas': 'Cambiar a tema noche (oscuro)',
    'toggle.mode.pro': 'Entrar al universo personal',
    'toggle.mode.personal': 'Volver al observatorio profesional',
    'mode.pro': 'Profesional',
    'mode.personal': 'Personal',
    'lang.switch': 'Idioma',
    'footer.built': 'Hecho con Astro, TypeScript y astronomía de verdad.',
    'footer.source': 'Código en GitHub',
  },
  'pt-br': {
    'site.title': 'Rubo · Observatório',
    'site.description':
      'Observatório pessoal de Eduardo Rubén Bernal Puente: Data & Analytics Engineer no Mercado Livre e estudante de Ciência de Dados no ITAM.',
    'nav.sky': 'Céu',
    'nav.observatory': 'Observatório',
    'nav.trajectory': 'Trajetória',
    'nav.constellation': 'Habilidades',
    'nav.contact': 'Contato',
    'nav.cv': 'CV',
    'nav.skip': 'Pular para o conteúdo',
    'toggle.theme.night': 'Mudar para o tema atlas (claro)',
    'toggle.theme.atlas': 'Mudar para o tema noite (escuro)',
    'toggle.mode.pro': 'Entrar no universo pessoal',
    'toggle.mode.personal': 'Voltar ao observatório profissional',
    'mode.pro': 'Profissional',
    'mode.personal': 'Pessoal',
    'lang.switch': 'Idioma',
    'footer.built': 'Feito com Astro, TypeScript e astronomia de verdade.',
    'footer.source': 'Código no GitHub',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UIKey = keyof (typeof ui)['en'];

export function isLocale(value: string | undefined): value is Locale {
  return (locales as readonly string[]).includes(value ?? '');
}

/** Returns a translator bound to a locale, falling back to English. */
export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    const table = ui[locale] as Partial<Record<UIKey, string>>;
    return table[key] ?? ui[defaultLocale][key];
  };
}

/** Builds a locale-aware path. English (default) is served from the root. */
export function localePath(locale: Locale, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale === defaultLocale ? clean : `/${locale}${clean === '/' ? '' : clean}`;
}

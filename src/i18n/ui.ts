/**
 * UI strings (navigation, buttons, labels). Long-form content lives in src/content.
 *
 * Tone rules (see docs/CONTENT-GUIDE.md):
 *  - Professional surfaces (nav, observatory, trajectory, CV): formal register.
 *  - Personal surfaces (personal universe, footer quips): warm, informal register.
 *
 * Tier 1 locales (full content): en, es, pt-br.
 * Any missing key falls back to English at runtime via t().
 */
export const locales = ['en', 'es', 'pt-br'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeMeta: Record<
  Locale,
  { label: string; short: string; htmlLang: string; ogLocale: string; intl: string }
> = {
  en: { label: 'English', short: 'EN', htmlLang: 'en', ogLocale: 'en_US', intl: 'en-US' },
  es: { label: 'Español', short: 'ES', htmlLang: 'es-MX', ogLocale: 'es_MX', intl: 'es-MX' },
  'pt-br': { label: 'Português', short: 'PT', htmlLang: 'pt-BR', ogLocale: 'pt_BR', intl: 'pt-BR' },
};

const en = {
  'site.title': 'Rubo · Observatory',
  'site.description':
    'Personal observatory of Eduardo Rubén Bernal Puente — Data & Analytics Engineer at Mercado Libre, Data Science student at ITAM.',

  'nav.sky': 'Sky',
  'nav.observatory': 'Observatory',
  'nav.trajectory': 'Trajectory',
  'nav.constellation': 'Skills',
  'nav.contact': 'Contact',
  'nav.cv': 'CV',
  'nav.log': 'Log',
  'log.title': 'Observation log',
  'log.lead':
    'A study log of the B.S. in Data Science at ITAM, one entry per term: the mathematics and statistics underneath, the computing, the economics, and the humanities the programme insists on. Written as I go, in the first person.',
  'log.latest': 'Latest entries',
  'log.all': 'All entries',
  'log.read': 'min read',
  'log.semester': 'Term',
  'log.courses': 'Courses',
  'log.back': 'Back to the log',
  'log.rss': 'RSS feed',
  'log.area.math': 'Mathematics',
  'log.area.stats': 'Probability & statistics',
  'log.area.computing': 'Computing',
  'log.area.datascience': 'Data science & AI',
  'log.area.economics': 'Economics',
  'log.area.humanities': 'Humanities',
  'log.area.astronomy': 'Astronomy',
  'log.area.work': 'Work',
  'log.area.leadership': 'Leadership',
  'log.prev': 'Previous entry',
  'log.updated': 'Updated',
  'log.search': 'Search entries…',
  'log.filter.all': 'All areas',
  'log.filter.area': 'Area',
  'log.filter.semester': 'Term',
  'log.filter.anySemester': 'All terms',
  'log.results': 'entries shown',
  'log.empty': 'Nothing matches. Try another word or clear the filters.',
  'log.clear': 'Clear filters',
  'nav.now': 'Now',
  'now.title': 'Now',
  'now.lead': 'What I am doing these days. Updated by hand, not by an algorithm.',
  'now.updated': 'Last updated',
  'log.next': 'Next entry',
  'nav.skip': 'Skip to content',
  'nav.menu': 'Menu',

  'toggle.theme.night': 'Switch to atlas (light) theme',
  'toggle.theme.atlas': 'Switch to night (dark) theme',
  'toggle.mode.label': 'Universe',
  'toggle.mode.pro': 'Professional',
  'toggle.mode.personal': 'Personal',
  'toggle.mode.hint': 'Switch universe',
  'lang.switch': 'Language',

  'hero.kicker': 'Personal observatory · Mexico City',
  'portrait.illustration': 'Illustration',
  'portrait.video': 'Video',
  'portrait.photo': 'Photo',
  'portrait.switch': 'Portrait medium',
  'portrait.play': 'Play portrait video',
  'portrait.caption': 'Illustrated portraits · generated from a photo of the author',
  'portrait.alt.editorial':
    'Illustrated portrait of Eduardo Rubén Bernal Puente in a navy blazer against a nebula',
  'portrait.alt.constellation':
    'Portrait of Eduardo Rubén drawn as a golden constellation on a night sky',
  'portrait.alt.atlas':
    'Portrait of Eduardo Rubén engraved in the style of a 19th-century star atlas',
  'portrait.alt.photo': 'Photograph of Eduardo Rubén Bernal Puente',
  'hero.cta.observatory': 'Enter the observatory',
  'hero.cta.cv': 'View CV',
  'hero.sky.caption': 'Live sky over Mexico City',
  'hero.sky.lst': 'Local sidereal time',
  'hero.sky.reduced': 'Static rendering (reduced motion)',
  'hero.sky.aria':
    'Star map of the current sky above Mexico City, computed from a bright-star catalogue',

  'counters.title': 'Mission clocks',
  'counters.meli': 'At Mercado Libre',
  'counters.itam': 'Studying Data Science at ITAM',
  'counters.graduation': 'Until graduation',
  'counters.age': 'Orbits around the Sun',
  'counters.units.y': 'y',
  'counters.units.mo': 'mo',
  'counters.units.d': 'd',
  'counters.units.h': 'h',
  'counters.units.m': 'm',
  'counters.units.s': 's',
  'counters.since': 'since',
  'counters.until': 'until',

  'observatory.title': 'Observatory',
  'observatory.lead':
    'Each nebula is a region of my work. Each star inside it is a fact about a project. Select a nebula to focus the telescope.',
  'observatory.lead.personal':
    'Same telescope, pointed at me. Each nebula here is something I care about outside work. Pick one.',
  'observatory.select': 'Select a nebula',
  'observatory.back': 'Back to the wide field',
  'observatory.projects': 'projects',
  'observatory.project': 'project',
  'observatory.stars': 'stars',
  'observatory.modelled': 'Modelled after',
  'observatory.distance': 'light-years away',
  'observatory.role': 'Role',
  'observatory.period': 'Period',
  'observatory.stack': 'Instruments',
  'observatory.highlights': 'Observations',
  'observatory.repo': 'Repository',
  'observatory.imageCredit': 'Image',
  'repo.stars': 'stars',
  'repo.forks': 'forks',
  'repo.views': 'views · 14 d',
  'repo.clones': 'clones · 14 d',
  'repo.updated': 'last push',
  'observatory.details': 'Read the log',
  'observatory.confidential': 'Internal project · details limited to the public CV',
  'observatory.present': 'present',
  'observatory.empty': 'No projects catalogued here yet. Telescope time is booked.',

  'personal.title': 'Personal universe',
  'personal.soft': 'Soft skills, with evidence',
  'personal.facts': 'Fun facts',
  'contrib.title': 'GitHub activity',
  'contrib.total': 'contributions',
  'contrib.year': 'last 12 months',
  'contrib.recent': 'last 90 days, public events',
  'contrib.less': 'less',
  'contrib.more': 'more',
  'contrib.mon': 'Mon',
  'contrib.wed': 'Wed',
  'contrib.fri': 'Fri',

  'trajectory.title': 'Trajectory',
  'trajectory.lead':
    'Roles, leadership and studies as orbits. The innermost orbit is the most recent.',
  'trajectory.kind.work': 'Work',
  'trajectory.kind.leadership': 'Leadership',
  'trajectory.kind.education': 'Education',
  'trajectory.present': 'present',
  'trajectory.sources': 'Sources',

  'certs.title': 'Certifications in progress',
  'certs.status.earned': 'Earned',
  'certs.status.in-progress': 'In progress',
  'certs.status.expected': 'Expected',

  'constellation.title': 'Skills',
  'constellation.lead': 'Grouped as constellations. Brighter stars are stronger skills.',
  'constellation.level.1': 'Familiar',
  'constellation.level.2': 'Productive',
  'constellation.level.3': 'Strong',
  'constellation.level.4': 'Expert',

  'contact.title': 'Contact',
  'contact.lead':
    'Open to data engineering, analytics engineering and ML roles. The fastest channel is email.',
  'contact.email': 'Email',
  'contact.copy': 'Copy email',
  'contact.copied': 'Copied',
  'contact.languages': 'Languages',

  'footer.built':
    'Built with Astro, TypeScript and real astronomy. No cookies, no trackers: only a cookieless page count.',
  'footer.source': 'Source on GitHub',
  'footer.moon': 'Moon tonight',
  'footer.updated': 'Last observation',
  'moon.new': 'New moon',
  'moon.waxing-crescent': 'Waxing crescent',
  'moon.first-quarter': 'First quarter',
  'moon.waxing-gibbous': 'Waxing gibbous',
  'moon.full': 'Full moon',
  'moon.waning-gibbous': 'Waning gibbous',
  'moon.last-quarter': 'Last quarter',
  'moon.waning-crescent': 'Waning crescent',
  'moon.illuminated': 'illuminated',

  'project.back': 'Back to the observatory',
  'project.nebula': 'Nebula',
  'notfound.title': 'Lost in space',
  'notfound.lead': 'This coordinate does not exist in the catalogue.',
  'notfound.cta': 'Return to the observatory',

  'cv.title': 'Curriculum vitae',
  'cv.print': 'Print / save as PDF',
  'cv.summary': 'Summary',
  'cv.experience': 'Experience',
  'cv.education': 'Education',
  'cv.leadership': 'Leadership & activities',
  'cv.projects': 'Selected projects',
  'cv.skills': 'Technical skills',
  'cv.certs': 'Certifications',
  'cv.languages': 'Languages',
} as const;

export type UIKey = keyof typeof en;

const es: Record<UIKey, string> = {
  'site.title': 'Rubo · Observatorio',
  'site.description':
    'Observatorio personal de Eduardo Rubén Bernal Puente: Data & Analytics Engineer en Mercado Libre y estudiante de Ciencia de Datos en el ITAM.',

  'nav.sky': 'Cielo',
  'nav.observatory': 'Observatorio',
  'nav.trajectory': 'Trayectoria',
  'nav.constellation': 'Habilidades',
  'nav.contact': 'Contacto',
  'nav.cv': 'CV',
  'nav.log': 'Bitácora',
  'log.title': 'Bitácora de observación',
  'log.lead':
    'Una bitácora de la Licenciatura en Ciencia de Datos del ITAM, una entrada por semestre: las matemáticas y la estadística de fondo, la computación, la economía y las humanidades en las que la carrera insiste. Escrita sobre la marcha, en primera persona.',
  'log.latest': 'Últimas entradas',
  'log.all': 'Todas las entradas',
  'log.read': 'min de lectura',
  'log.semester': 'Semestre',
  'log.courses': 'Materias',
  'log.back': 'Volver a la bitácora',
  'log.rss': 'Canal RSS',
  'log.area.math': 'Matemáticas',
  'log.area.stats': 'Probabilidad y estadística',
  'log.area.computing': 'Computación',
  'log.area.datascience': 'Ciencia de datos e IA',
  'log.area.economics': 'Economía',
  'log.area.humanities': 'Humanidades',
  'log.area.astronomy': 'Astronomía',
  'log.area.work': 'Trabajo',
  'log.area.leadership': 'Liderazgo',
  'log.prev': 'Entrada anterior',
  'log.updated': 'Actualizada',
  'log.search': 'Buscar entradas…',
  'log.filter.all': 'Todas las áreas',
  'log.filter.area': 'Área',
  'log.filter.semester': 'Semestre',
  'log.filter.anySemester': 'Todos los semestres',
  'log.results': 'entradas mostradas',
  'log.empty': 'Nada coincide. Prueba otra palabra o limpia los filtros.',
  'log.clear': 'Limpiar filtros',
  'nav.now': 'Ahora',
  'now.title': 'Ahora',
  'now.lead': 'Lo que estoy haciendo estos días. Se actualiza a mano, no por un algoritmo.',
  'now.updated': 'Última actualización',
  'log.next': 'Entrada siguiente',
  'nav.skip': 'Saltar al contenido',
  'nav.menu': 'Menú',

  'toggle.theme.night': 'Cambiar a tema atlas (claro)',
  'toggle.theme.atlas': 'Cambiar a tema noche (oscuro)',
  'toggle.mode.label': 'Universo',
  'toggle.mode.pro': 'Profesional',
  'toggle.mode.personal': 'Personal',
  'toggle.mode.hint': 'Cambiar de universo',
  'lang.switch': 'Idioma',

  'hero.kicker': 'Observatorio personal · Ciudad de México',
  'portrait.illustration': 'Ilustración',
  'portrait.video': 'Video',
  'portrait.photo': 'Foto',
  'portrait.switch': 'Medio del retrato',
  'portrait.play': 'Reproducir video del retrato',
  'portrait.caption': 'Retratos ilustrados · generados a partir de una foto del autor',
  'portrait.alt.editorial':
    'Retrato ilustrado de Eduardo Rubén Bernal Puente con saco azul marino frente a una nebulosa',
  'portrait.alt.constellation':
    'Retrato de Eduardo Rubén dibujado como una constelación dorada sobre el cielo nocturno',
  'portrait.alt.atlas':
    'Retrato de Eduardo Rubén grabado al estilo de un atlas estelar del siglo XIX',
  'portrait.alt.photo': 'Fotografía de Eduardo Rubén Bernal Puente',
  'hero.cta.observatory': 'Entrar al observatorio',
  'hero.cta.cv': 'Ver CV',
  'hero.sky.caption': 'Cielo en vivo sobre la Ciudad de México',
  'hero.sky.lst': 'Tiempo sidéreo local',
  'hero.sky.reduced': 'Render estático (movimiento reducido)',
  'hero.sky.aria':
    'Mapa estelar del cielo actual sobre la Ciudad de México, calculado a partir de un catálogo de estrellas brillantes',

  'counters.title': 'Relojes de misión',
  'counters.meli': 'En Mercado Libre',
  'counters.itam': 'Estudiando Ciencia de Datos en el ITAM',
  'counters.graduation': 'Para la graduación',
  'counters.age': 'Vueltas alrededor del Sol',
  'counters.units.y': 'a',
  'counters.units.mo': 'm',
  'counters.units.d': 'd',
  'counters.units.h': 'h',
  'counters.units.m': 'min',
  'counters.units.s': 's',
  'counters.since': 'desde',
  'counters.until': 'hasta',

  'observatory.title': 'Observatorio',
  'observatory.lead':
    'Cada nebulosa es una región de mi trabajo. Cada estrella dentro de ella es un dato de un proyecto. Elige una nebulosa para enfocar el telescopio.',
  'observatory.lead.personal':
    'El mismo telescopio, apuntado hacia mí. Cada nebulosa aquí es algo que me importa fuera del trabajo. Elige una.',
  'observatory.select': 'Elegir una nebulosa',
  'observatory.back': 'Volver al campo amplio',
  'observatory.projects': 'proyectos',
  'observatory.project': 'proyecto',
  'observatory.stars': 'estrellas',
  'observatory.modelled': 'Inspirada en',
  'observatory.distance': 'años luz de distancia',
  'observatory.role': 'Rol',
  'observatory.period': 'Periodo',
  'observatory.stack': 'Instrumentos',
  'observatory.highlights': 'Observaciones',
  'observatory.repo': 'Repositorio',
  'observatory.imageCredit': 'Imagen',
  'repo.stars': 'estrellas',
  'repo.forks': 'forks',
  'repo.views': 'vistas · 14 d',
  'repo.clones': 'clones · 14 d',
  'repo.updated': 'último push',
  'observatory.details': 'Leer la bitácora',
  'observatory.confidential': 'Proyecto interno · detalle limitado al CV público',
  'observatory.present': 'actual',
  'observatory.empty':
    'Aún no hay proyectos catalogados aquí. El tiempo de telescopio ya está reservado.',

  'personal.title': 'Universo personal',
  'personal.soft': 'Soft skills, con evidencia',
  'personal.facts': 'Datos curiosos',
  'contrib.title': 'Actividad en GitHub',
  'contrib.total': 'contribuciones',
  'contrib.year': 'últimos 12 meses',
  'contrib.recent': 'últimos 90 días, eventos públicos',
  'contrib.less': 'menos',
  'contrib.more': 'más',
  'contrib.mon': 'Lun',
  'contrib.wed': 'Mié',
  'contrib.fri': 'Vie',

  'trajectory.title': 'Trayectoria',
  'trajectory.lead':
    'Roles, liderazgo y estudios como órbitas. La órbita más interna es la más reciente.',
  'trajectory.kind.work': 'Trabajo',
  'trajectory.kind.leadership': 'Liderazgo',
  'trajectory.kind.education': 'Formación',
  'trajectory.present': 'actual',
  'trajectory.sources': 'Fuentes',

  'certs.title': 'Certificaciones en curso',
  'certs.status.earned': 'Obtenida',
  'certs.status.in-progress': 'En curso',
  'certs.status.expected': 'Prevista',

  'constellation.title': 'Habilidades',
  'constellation.lead':
    'Agrupadas como constelaciones. Las estrellas más brillantes son las habilidades más fuertes.',
  'constellation.level.1': 'Familiar',
  'constellation.level.2': 'Productivo',
  'constellation.level.3': 'Sólido',
  'constellation.level.4': 'Experto',

  'contact.title': 'Contacto',
  'contact.lead':
    'Abierto a roles de ingeniería de datos, analytics engineering y ML. El canal más rápido es el correo.',
  'contact.email': 'Correo',
  'contact.copy': 'Copiar correo',
  'contact.copied': 'Copiado',
  'contact.languages': 'Idiomas',

  'footer.built':
    'Hecho con Astro, TypeScript y astronomía de verdad. Sin cookies ni rastreadores: solo un conteo de visitas anónimo.',
  'footer.source': 'Código en GitHub',
  'footer.moon': 'La Luna esta noche',
  'footer.updated': 'Última observación',
  'moon.new': 'Luna nueva',
  'moon.waxing-crescent': 'Creciente',
  'moon.first-quarter': 'Cuarto creciente',
  'moon.waxing-gibbous': 'Gibosa creciente',
  'moon.full': 'Luna llena',
  'moon.waning-gibbous': 'Gibosa menguante',
  'moon.last-quarter': 'Cuarto menguante',
  'moon.waning-crescent': 'Menguante',
  'moon.illuminated': 'iluminada',

  'project.back': 'Volver al observatorio',
  'project.nebula': 'Nebulosa',
  'notfound.title': 'Perdido en el espacio',
  'notfound.lead': 'Esta coordenada no existe en el catálogo.',
  'notfound.cta': 'Volver al observatorio',

  'cv.title': 'Currículum',
  'cv.print': 'Imprimir / guardar como PDF',
  'cv.summary': 'Resumen',
  'cv.experience': 'Experiencia',
  'cv.education': 'Formación',
  'cv.leadership': 'Liderazgo y actividades',
  'cv.projects': 'Proyectos seleccionados',
  'cv.skills': 'Habilidades técnicas',
  'cv.certs': 'Certificaciones',
  'cv.languages': 'Idiomas',
};

const ptBr: Record<UIKey, string> = {
  'site.title': 'Rubo · Observatório',
  'site.description':
    'Observatório pessoal de Eduardo Rubén Bernal Puente: Data & Analytics Engineer no Mercado Livre e estudante de Ciência de Dados no ITAM.',

  'nav.sky': 'Céu',
  'nav.observatory': 'Observatório',
  'nav.trajectory': 'Trajetória',
  'nav.constellation': 'Habilidades',
  'nav.contact': 'Contato',
  'nav.cv': 'CV',
  'nav.log': 'Diário',
  'log.title': 'Diário de observação',
  'log.lead':
    'Um diário do bacharelado em Ciência de Dados no ITAM, uma entrada por semestre: a matemática e a estatística por trás, a computação, a economia e as humanidades em que o curso insiste. Escrito ao longo do caminho, em primeira pessoa.',
  'log.latest': 'Últimas entradas',
  'log.all': 'Todas as entradas',
  'log.read': 'min de leitura',
  'log.semester': 'Semestre',
  'log.courses': 'Disciplinas',
  'log.back': 'Voltar ao diário',
  'log.rss': 'Feed RSS',
  'log.area.math': 'Matemática',
  'log.area.stats': 'Probabilidade e estatística',
  'log.area.computing': 'Computação',
  'log.area.datascience': 'Ciência de dados e IA',
  'log.area.economics': 'Economia',
  'log.area.humanities': 'Humanidades',
  'log.area.astronomy': 'Astronomia',
  'log.area.work': 'Trabalho',
  'log.area.leadership': 'Liderança',
  'log.prev': 'Entrada anterior',
  'log.next': 'Próxima entrada',
  'log.updated': 'Atualizada',
  'log.search': 'Buscar entradas…',
  'log.filter.all': 'Todas as áreas',
  'log.filter.area': 'Área',
  'log.filter.semester': 'Semestre',
  'log.filter.anySemester': 'Todos os semestres',
  'log.results': 'entradas exibidas',
  'log.empty': 'Nada corresponde. Tente outra palavra ou limpe os filtros.',
  'log.clear': 'Limpar filtros',
  'nav.now': 'Agora',
  'now.title': 'Agora',
  'now.lead': 'O que estou fazendo nestes dias. Atualizado à mão, não por um algoritmo.',
  'now.updated': 'Última atualização',
  'nav.skip': 'Pular para o conteúdo',
  'nav.menu': 'Menu',

  'toggle.theme.night': 'Mudar para o tema atlas (claro)',
  'toggle.theme.atlas': 'Mudar para o tema noite (escuro)',
  'toggle.mode.label': 'Universo',
  'toggle.mode.pro': 'Profissional',
  'toggle.mode.personal': 'Pessoal',
  'toggle.mode.hint': 'Trocar de universo',
  'lang.switch': 'Idioma',

  'hero.kicker': 'Observatório pessoal · Cidade do México',
  'portrait.illustration': 'Ilustração',
  'portrait.video': 'Vídeo',
  'portrait.photo': 'Foto',
  'portrait.switch': 'Mídia do retrato',
  'portrait.play': 'Reproduzir vídeo do retrato',
  'portrait.caption': 'Retratos ilustrados · gerados a partir de uma foto do autor',
  'portrait.alt.editorial':
    'Retrato ilustrado de Eduardo Rubén Bernal Puente com blazer azul-marinho diante de uma nebulosa',
  'portrait.alt.constellation':
    'Retrato de Eduardo Rubén desenhado como uma constelação dourada no céu noturno',
  'portrait.alt.atlas':
    'Retrato de Eduardo Rubén gravado no estilo de um atlas estelar do século XIX',
  'portrait.alt.photo': 'Fotografia de Eduardo Rubén Bernal Puente',
  'hero.cta.observatory': 'Entrar no observatório',
  'hero.cta.cv': 'Ver CV',
  'hero.sky.caption': 'Céu ao vivo sobre a Cidade do México',
  'hero.sky.lst': 'Tempo sideral local',
  'hero.sky.reduced': 'Renderização estática (movimento reduzido)',
  'hero.sky.aria':
    'Mapa estelar do céu atual sobre a Cidade do México, calculado a partir de um catálogo de estrelas brilhantes',

  'counters.title': 'Relógios de missão',
  'counters.meli': 'No Mercado Livre',
  'counters.itam': 'Estudando Ciência de Dados no ITAM',
  'counters.graduation': 'Até a formatura',
  'counters.age': 'Voltas ao redor do Sol',
  'counters.units.y': 'a',
  'counters.units.mo': 'm',
  'counters.units.d': 'd',
  'counters.units.h': 'h',
  'counters.units.m': 'min',
  'counters.units.s': 's',
  'counters.since': 'desde',
  'counters.until': 'até',

  'observatory.title': 'Observatório',
  'observatory.lead':
    'Cada nebulosa é uma região do meu trabalho. Cada estrela dentro dela é um dado de um projeto. Escolha uma nebulosa para focar o telescópio.',
  'observatory.lead.personal':
    'O mesmo telescópio, apontado para mim. Cada nebulosa aqui é algo de que gosto fora do trabalho. Escolha uma.',
  'observatory.select': 'Escolher uma nebulosa',
  'observatory.back': 'Voltar ao campo amplo',
  'observatory.projects': 'projetos',
  'observatory.project': 'projeto',
  'observatory.stars': 'estrelas',
  'observatory.modelled': 'Inspirada em',
  'observatory.distance': 'anos-luz de distância',
  'observatory.role': 'Papel',
  'observatory.period': 'Período',
  'observatory.stack': 'Instrumentos',
  'observatory.highlights': 'Observações',
  'observatory.repo': 'Repositório',
  'observatory.imageCredit': 'Imagem',
  'repo.stars': 'estrelas',
  'repo.forks': 'forks',
  'repo.views': 'visualizações · 14 d',
  'repo.clones': 'clones · 14 d',
  'repo.updated': 'último push',
  'observatory.details': 'Ler o diário',
  'observatory.confidential': 'Projeto interno · detalhes limitados ao CV público',
  'observatory.present': 'atual',
  'observatory.empty':
    'Ainda não há projetos catalogados aqui. O tempo de telescópio já está reservado.',

  'personal.title': 'Universo pessoal',
  'personal.soft': 'Soft skills, com evidências',
  'personal.facts': 'Curiosidades',
  'contrib.title': 'Atividade no GitHub',
  'contrib.total': 'contribuições',
  'contrib.year': 'últimos 12 meses',
  'contrib.recent': 'últimos 90 dias, eventos públicos',
  'contrib.less': 'menos',
  'contrib.more': 'mais',
  'contrib.mon': 'Seg',
  'contrib.wed': 'Qua',
  'contrib.fri': 'Sex',

  'trajectory.title': 'Trajetória',
  'trajectory.lead':
    'Cargos, liderança e estudos como órbitas. A órbita mais interna é a mais recente.',
  'trajectory.kind.work': 'Trabalho',
  'trajectory.kind.leadership': 'Liderança',
  'trajectory.kind.education': 'Formação',
  'trajectory.present': 'atual',
  'trajectory.sources': 'Fontes',

  'certs.title': 'Certificações em andamento',
  'certs.status.earned': 'Obtida',
  'certs.status.in-progress': 'Em andamento',
  'certs.status.expected': 'Prevista',

  'constellation.title': 'Habilidades',
  'constellation.lead':
    'Agrupadas como constelações. Estrelas mais brilhantes são habilidades mais fortes.',
  'constellation.level.1': 'Familiar',
  'constellation.level.2': 'Produtivo',
  'constellation.level.3': 'Sólido',
  'constellation.level.4': 'Especialista',

  'contact.title': 'Contato',
  'contact.lead':
    'Aberto a vagas de engenharia de dados, analytics engineering e ML. O canal mais rápido é o e-mail.',
  'contact.email': 'E-mail',
  'contact.copy': 'Copiar e-mail',
  'contact.copied': 'Copiado',
  'contact.languages': 'Idiomas',

  'footer.built':
    'Feito com Astro, TypeScript e astronomia de verdade. Sem cookies nem rastreadores: só uma contagem de visitas anônima.',
  'footer.source': 'Código no GitHub',
  'footer.moon': 'A Lua hoje',
  'footer.updated': 'Última observação',
  'moon.new': 'Lua nova',
  'moon.waxing-crescent': 'Crescente',
  'moon.first-quarter': 'Quarto crescente',
  'moon.waxing-gibbous': 'Gibosa crescente',
  'moon.full': 'Lua cheia',
  'moon.waning-gibbous': 'Gibosa minguante',
  'moon.last-quarter': 'Quarto minguante',
  'moon.waning-crescent': 'Minguante',
  'moon.illuminated': 'iluminada',

  'project.back': 'Voltar ao observatório',
  'project.nebula': 'Nebulosa',
  'notfound.title': 'Perdido no espaço',
  'notfound.lead': 'Esta coordenada não existe no catálogo.',
  'notfound.cta': 'Voltar ao observatório',

  'cv.title': 'Currículo',
  'cv.print': 'Imprimir / salvar como PDF',
  'cv.summary': 'Resumo',
  'cv.experience': 'Experiência',
  'cv.education': 'Formação',
  'cv.leadership': 'Liderança e atividades',
  'cv.projects': 'Projetos selecionados',
  'cv.skills': 'Habilidades técnicas',
  'cv.certs': 'Certificações',
  'cv.languages': 'Idiomas',
};

export const ui: Record<Locale, Record<UIKey, string>> = { en, es, 'pt-br': ptBr };

export function isLocale(value: string | undefined): value is Locale {
  return (locales as readonly string[]).includes(value ?? '');
}

/** Returns a translator bound to a locale, falling back to English. */
export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return ui[locale][key] ?? ui[defaultLocale][key];
  };
}

/** Builds a locale-aware path. English (default) is served from the root. */
export function localePath(locale: Locale, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale === defaultLocale ? clean : `/${locale}${clean === '/' ? '' : clean}`;
}

/** Strings a client script needs, serialized once per page as JSON (never inline JS). */
export function clientStrings(locale: Locale) {
  const t = useTranslations(locale);
  return {
    units: {
      y: t('counters.units.y'),
      mo: t('counters.units.mo'),
      d: t('counters.units.d'),
      h: t('counters.units.h'),
      m: t('counters.units.m'),
      s: t('counters.units.s'),
    },
    lst: t('hero.sky.lst'),
    copied: t('contact.copied'),
    copy: t('contact.copy'),
    back: t('observatory.back'),
  };
}

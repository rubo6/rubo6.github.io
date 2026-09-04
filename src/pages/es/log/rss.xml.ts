import type { APIContext } from 'astro';
import { logFeed } from '@/lib/rss';

export const GET = (context: APIContext) => logFeed(context, 'es');

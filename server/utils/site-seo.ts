import type { H3Event } from 'h3'
import type { SiteConfig } from '#shared/site'
import { loadContent } from './content-store'

export interface SitemapEntry {
  path: string
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority: string
  lastmod?: string
}

const STATIC_PAGES: SitemapEntry[] = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/news', changefreq: 'daily', priority: '0.9' },
  { path: '/products', changefreq: 'weekly', priority: '0.9' },
  { path: '/quality', changefreq: 'monthly', priority: '0.8' },
  { path: '/jobs', changefreq: 'weekly', priority: '0.6' },
  { path: '/contact', changefreq: 'yearly', priority: '0.5' },
  { path: '/pharmacovigilance', changefreq: 'yearly', priority: '0.5' },
]

const normalizeDate = (value: string) => value.replace(/[./]/g, '-')

export const readContentForSitemap = async (
  event: H3Event,
): Promise<{ content: SiteConfig; pages: SitemapEntry[] }> => {
  const content = await loadContent(event)

  const articleEntries: SitemapEntry[] = content.news
    .filter((article) => Boolean(article.id))
    .map((article) => ({
      path: `/news/${article.id}`,
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: /^\d{4}-\d{2}-\d{2}$/.test(normalizeDate(article.date)) ? normalizeDate(article.date) : undefined,
    }))

  return { content, pages: [...STATIC_PAGES, ...articleEntries] }
}

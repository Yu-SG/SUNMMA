/**
 * 动态 sitemap：栏目页 + 新闻详情页，域名取自 NUXT_PUBLIC_SITE_URL。
 * `readContentForSitemap` 由 Nitro 从 server/utils 自动导入。
 */
export default defineEventHandler(async (event) => {
  const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://demo2.lcwlzx.site').replace(/\/+$/, '')
  const { pages } = await readContentForSitemap(event)

  const urls = pages
    .map((page) => {
      const loc = `${siteUrl}${page.path === '/' ? '/' : page.path}`
      const lastmod = page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : ''
      return `  <url>\n    <loc>${loc}</loc>${lastmod}\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`
    })
    .join('\n')

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'cache-control', 'public, max-age=3600')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})

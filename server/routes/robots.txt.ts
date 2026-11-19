export default defineEventHandler((event) => {
  const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://demo2.lcwlzx.site').replace(/\/+$/, '')

  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
  setResponseHeader(event, 'cache-control', 'public, max-age=3600')

  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api/',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n')
})

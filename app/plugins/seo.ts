/**
 * 站点级 SEO 兜底：
 * - 每个路由都输出绝对地址的 canonical 与 og:url
 * - 补充 twitter 卡片信息
 * 页面内的 useSeoMeta 只需要关心 title/description/og:image 这类具体内容。
 */
export default defineNuxtPlugin(() => {
  const route = useRoute()
  const config = useRuntimeConfig()

  const siteUrl = computed(() => String(config.public.siteUrl || '').replace(/\/+$/, ''))

  const canonical = computed(() => {
    const path = route.path === '/' ? '/' : route.path.replace(/\/+$/, '')
    return `${siteUrl.value}${path}`
  })

  useHead(() => ({
    link: [{ rel: 'canonical', href: canonical.value }],
    meta: [
      { property: 'og:url', content: canonical.value },
      { name: 'twitter:card', content: 'summary_large_image' },
      // 默认分享图（页面可用 useSeoMeta 的 ogImage 覆盖）
      { property: 'og:image', content: `${siteUrl.value}/images/og-cover.jpg` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
    ],
  }))
})

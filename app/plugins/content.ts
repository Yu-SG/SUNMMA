import { hydrateSiteConfig } from '~/config/site'

export default defineNuxtPlugin(async () => {
  try {
    const content = await $fetch('/api/content')
    hydrateSiteConfig(content)
  } catch (error) {
    console.warn('[content] 无法读取数据库内容，使用内置默认值', error)
  }
})

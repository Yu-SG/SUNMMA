<script setup lang="ts">
import { onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { clearDocumentTheme } from '~/utils/studio-theme'
import { siteConfig } from '~/config/site'

const theme = useTheme()
const abs = useAbsoluteUrl()

onMounted(() => {
  // The public site always uses the light theme; dark mode belongs to /admin.
  if (theme.global.name.value !== 'light') theme.change('light')
  clearDocumentTheme()
})

useJsonLd('organization', () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.brand.name,
  alternateName: siteConfig.brand.nameEn,
  url: abs('/'),
  logo: abs(siteConfig.brand.logo || '/images/hero-1.svg'),
  description: siteConfig.brand.description,
  email: siteConfig.brand.email,
  telephone: siteConfig.brand.phone,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CN',
    streetAddress: siteConfig.brand.address,
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: siteConfig.brand.phone,
      email: siteConfig.brand.email,
      contactType: 'customer service',
      areaServed: 'CN',
      availableLanguage: ['zh-CN'],
    },
  ],
}))

useJsonLd('website', () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: `${siteConfig.brand.name} 制药`,
  alternateName: siteConfig.brand.nameEn,
  url: abs('/'),
  inLanguage: 'zh-CN',
  publisher: { '@type': 'Organization', name: siteConfig.brand.name },
}))
</script>

<template>
  <v-app>
    <SiteHeader />
    <v-main class="site-main">
      <slot />
    </v-main>
    <SiteFooter />
  </v-app>
</template>

<style scoped>
.site-main {
  background: rgb(var(--v-theme-background));
}
</style>

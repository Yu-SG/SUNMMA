<script setup lang="ts">
import { siteConfig } from '~/config/site'

useSeoMeta({
  title: `${siteConfig.brand.name} 制药｜${siteConfig.brand.tagline}`,
  description: siteConfig.brand.description,
  ogTitle: `${siteConfig.brand.name} 制药｜${siteConfig.brand.tagline}`,
  ogDescription: siteConfig.brand.description,
  ogImage: siteConfig.banners[0]?.src,
  ogType: 'website',
  ogSiteName: siteConfig.brand.nameEn,
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

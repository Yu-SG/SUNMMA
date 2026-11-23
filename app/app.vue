<script setup lang="ts">
import { siteConfig } from '~/config/site'

const title = computed(() => `${siteConfig.brand.name}｜${siteConfig.brand.tagline}`)

useSeoMeta({
  title,
  description: siteConfig.brand.description,
  ogTitle: title,
  ogDescription: siteConfig.brand.description,
  ogType: 'website',
  ogSiteName: siteConfig.brand.nameEn,
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

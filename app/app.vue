<script setup lang="ts">
import { siteConfig } from '~/config/site'

const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))

useSeoMeta({
  title: `${siteConfig.brand.name}｜${siteConfig.brand.tagline}`,
  description: siteConfig.brand.description,
  ogTitle: `${siteConfig.brand.name}｜${siteConfig.brand.tagline}`,
  ogDescription: siteConfig.brand.description,
  ogType: 'website',
})
</script>

<template>
  <div class="app" :class="{ 'app--admin': isAdmin }">
    <SiteHeader v-if="!isAdmin" />
    <main>
      <NuxtPage />
    </main>
    <SiteFooter v-if="!isAdmin" />
  </div>
</template>

<style>
.app {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.app main {
  flex: 1;
}

.app--admin {
  background: var(--c-cream);
}
</style>

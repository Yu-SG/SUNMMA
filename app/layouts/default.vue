<script setup lang="ts">
import { onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { clearDocumentTheme } from '~/utils/studio-theme'

const theme = useTheme()

onMounted(() => {
  // The public site always uses the light theme; dark mode belongs to /admin.
  if (theme.global.name.value !== 'light') theme.change('light')
  clearDocumentTheme()
})
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

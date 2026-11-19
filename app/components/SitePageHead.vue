<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    intro?: string[]
    /** Extra breadcrumb levels between 首页 and the current title. */
    parents?: Array<{ title: string; to: string }>
  }>(),
  { subtitle: '', intro: () => [], parents: () => [] },
)

const crumbs = computed(() => {
  const items: Array<{ title: string; to?: string }> = [{ title: '首页', to: '/' }, ...props.parents]
  items.push({ title: props.title })
  return items
})
</script>

<template>
  <v-sheet class="page-head" tag="section">
    <div class="page-head__deco page-head__deco--one" aria-hidden="true" />
    <div class="page-head__deco page-head__deco--two" aria-hidden="true" />

    <v-container class="page-head__inner">
      <v-breadcrumbs :items="crumbs" divider="›" class="page-head__crumbs">
        <template #item="{ item }">
          <NuxtLink v-if="item.to" :to="item.to" class="page-head__crumb-link">{{ item.title }}</NuxtLink>
          <span v-else class="page-head__crumb-current">{{ item.title }}</span>
        </template>
      </v-breadcrumbs>

      <p class="page-head__eyebrow font-en">XXX PHARMACEUTICAL</p>
      <h1 class="page-head__title">{{ title }}</h1>
      <p v-if="subtitle" class="page-head__subtitle">{{ subtitle }}</p>
      <div v-if="intro.length" class="page-head__intro">
        <p v-for="(text, index) in intro" :key="index">{{ text }}</p>
      </div>
    </v-container>
  </v-sheet>
</template>

<style scoped>
.page-head {
  position: relative;
  padding: 34px 0 60px;
  overflow: hidden;
  background: linear-gradient(118deg, #0b2c56 0%, #115293 46%, #1976d2 100%);
  color: #fff;
}

.page-head::after {
  position: absolute;
  right: -80px;
  bottom: -160px;
  width: 520px;
  height: 520px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 50%;
  content: '';
}

.page-head__deco {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.page-head__deco--one {
  top: -120px;
  right: 8%;
  width: 340px;
  height: 340px;
  background: radial-gradient(circle, rgba(79, 195, 247, 0.35) 0%, rgba(79, 195, 247, 0) 70%);
}

.page-head__deco--two {
  bottom: -180px;
  left: -60px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(38, 198, 218, 0.18) 0%, rgba(38, 198, 218, 0) 70%);
}

.page-head__inner {
  position: relative;
  z-index: 1;
  max-width: 1240px;
}

.page-head__crumbs {
  padding: 0;
  margin-bottom: 24px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.page-head__crumbs :deep(.v-breadcrumbs-divider) {
  color: rgba(255, 255, 255, 0.38);
}

.page-head__crumb-link {
  color: rgba(255, 255, 255, 0.72);
  transition: color 0.2s var(--ease);
}

.page-head__crumb-link:hover {
  color: #fff;
}

.page-head__crumb-current {
  color: #fff;
}

.page-head__eyebrow {
  color: rgba(255, 255, 255, 0.58);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3em;
}

.page-head__title {
  margin-top: 12px;
  color: #fff;
  font-size: clamp(34px, 4vw, 48px);
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.25;
}

.page-head__subtitle {
  margin-top: 12px;
  color: #a9d3ff;
  font-size: clamp(16px, 1.6vw, 20px);
  font-weight: 400;
  letter-spacing: 0.12em;
}

.page-head__intro {
  max-width: 760px;
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 14.5px;
  line-height: 1.9;
}

.page-head__intro p + p {
  margin-top: 8px;
}

@media (max-width: 700px) {
  .page-head {
    padding: 22px 0 40px;
  }

  .page-head__crumbs {
    margin-bottom: 18px;
    font-size: 13px;
  }

  .page-head__intro {
    font-size: 13.5px;
  }
}
</style>

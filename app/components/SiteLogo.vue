<script setup lang="ts">
import { siteConfig } from '~/config/site'

withDefaults(
  defineProps<{
    /** White text for the dark footer / drawer headers. */
    light?: boolean
    size?: number
  }>(),
  { light: false, size: 42 },
)

const brand = siteConfig.brand
</script>

<template>
  <NuxtLink to="/" class="site-logo" :class="{ 'site-logo--light': light }" aria-label="返回首页">
    <span v-if="brand.logo" class="site-logo__mark">
      <img :src="brand.logo" :alt="brand.name" />
    </span>
    <span v-else class="site-logo__mark" :style="{ width: `${size}px`, height: `${size}px` }" aria-hidden="true">
      <svg viewBox="0 0 48 48" role="img">
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#1976d2" />
            <stop offset="1" stop-color="#64b5f6" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="13" fill="url(#logo-grad)" />
        <g transform="rotate(-38 24 24)">
          <rect x="9.5" y="18" width="15.5" height="12" rx="6" fill="#fff" />
          <rect x="23" y="18" width="15.5" height="12" rx="6" fill="#fff" opacity="0.62" />
          <path d="M23 18v12" stroke="#1976d2" stroke-width="1.2" />
        </g>
        <circle cx="24" cy="24" r="6.2" stroke="#fff" stroke-opacity="0.55" stroke-width="1.1" fill="none" />
        <circle cx="24" cy="24" r="1.6" fill="#fff" />
      </svg>
    </span>
    <span class="site-logo__text">
      <span class="site-logo__name">{{ brand.name }}</span>
      <span class="site-logo__en">{{ brand.nameEn }}</span>
    </span>
  </NuxtLink>
</template>

<style scoped>
.site-logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  line-height: 1.1;
}

.site-logo__mark {
  display: grid;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  place-items: center;
}

.site-logo__mark svg,
.site-logo__mark img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.site-logo__text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.site-logo__name {
  color: #10233a;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.site-logo__en {
  color: #6b7c8f;
  font-family: var(--font-en);
  font-size: 9.5px;
  font-weight: 500;
  letter-spacing: 0.18em;
}

.site-logo--light .site-logo__name {
  color: #fff;
}

.site-logo--light .site-logo__en {
  color: rgba(255, 255, 255, 0.62);
}
</style>

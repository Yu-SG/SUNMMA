<script setup lang="ts">
withDefaults(
  defineProps<{
    to: string
    label: string
    light?: boolean
  }>(),
  { light: false },
)
</script>

<template>
  <NuxtLink :to="to" class="arrow-link" :class="{ 'arrow-link--light': light }">
    <span class="arrow-link__label">{{ label }}</span>
    <span class="arrow-link__ico" aria-hidden="true">
      <svg viewBox="0 0 24 12">
        <path d="M1 6h20M16 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
    <svg class="arrow-link__squiggle" viewBox="0 0 132 20" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M2 13c22-9 40 5 62 0s34-11 56 1c6 3 10 2 10 2"
        fill="none"
        stroke="currentColor"
        stroke-width="1.2"
        stroke-linecap="round"
      />
    </svg>
  </NuxtLink>
</template>

<style scoped>
.arrow-link {
  position: relative;
  padding-bottom: 12px;
}

.arrow-link__ico svg {
  width: 20px;
  height: 12px;
}

.arrow-link--light {
  color: #fff;
}

.arrow-link--light .arrow-link__ico {
  background: #fff;
  color: var(--c-primary);
}
</style>

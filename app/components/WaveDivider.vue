<script setup lang="ts">
withDefaults(
  defineProps<{
    position?: 'top' | 'bottom'
    fill?: string
    background?: string
  }>(),
  { position: 'top', fill: 'var(--c-primary)', background: 'var(--c-cream)' },
)
</script>

<template>
  <div class="wave" :class="`wave--${position}`" :style="{ background }" aria-hidden="true">
    <svg v-if="position === 'top'" viewBox="0 0 1440 80" preserveAspectRatio="none">
      <path
        d="M0 80h1440V26c-160-22-260 34-420 24-160-10-220-42-380-34-160 8-220 48-380 42C140 54 60 30 0 46z"
        :fill="fill"
      />
    </svg>
    <svg v-else viewBox="0 0 1440 80" preserveAspectRatio="none">
      <path
        d="M0 0h1440v40c-160 24-260-24-420-16-160 8-220 46-380 42-160-4-220-46-380-40C140 32 60 56 0 44z"
        :fill="fill"
      />
    </svg>
  </div>
</template>

<style scoped>
.wave {
  position: relative;
  width: 100%;
  height: clamp(44px, 5.4vw, 80px);
  overflow: hidden;
}

.wave svg {
  width: 100%;
  height: 100%;
}
</style>

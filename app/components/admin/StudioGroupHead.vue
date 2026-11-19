<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    icon?: string
    count?: number | null
    unit?: string
  }>(),
  {
    icon: 'mdi-circle-small',
    count: null,
    unit: '',
  },
)
</script>

<template>
  <div class="d-flex align-center flex-wrap ga-2 mt-6 mb-3">
    <v-icon :icon="icon" color="primary" size="18" />
    <span class="text-subtitle-2 font-weight-medium">{{ title }}</span>
    <v-chip v-if="count !== null" size="x-small" variant="tonal" color="primary">{{ count }} {{ unit }}</v-chip>
    <v-spacer />
    <slot name="tools" />
  </div>
</template>

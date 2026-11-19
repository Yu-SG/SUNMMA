<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    en: string
    note?: string
    icon?: string
    count?: number | null
    unit?: string
  }>(),
  {
    note: '',
    icon: 'mdi-view-dashboard-outline',
    count: null,
    unit: '',
  },
)
</script>

<template>
  <v-card class="studio-card mb-4" elevation="2">
    <v-card-item class="studio-card__head">
      <template #prepend>
        <v-avatar color="primary" variant="tonal" rounded="lg" size="44">
          <v-icon :icon="icon" size="22" />
        </v-avatar>
      </template>

      <v-card-title class="text-subtitle-1 font-weight-medium d-flex align-center flex-wrap ga-2">
        {{ title }}
        <span class="text-caption text-medium-emphasis font-weight-regular">{{ en }}</span>
      </v-card-title>
      <v-card-subtitle v-if="note" class="text-caption text-wrap">{{ note }}</v-card-subtitle>

      <template #append>
        <div class="d-flex align-center ga-2">
          <slot name="tools" />
          <v-chip v-if="count !== null" color="primary" size="small" variant="tonal">
            {{ count }} {{ unit }}
          </v-chip>
        </div>
      </template>
    </v-card-item>

    <v-divider />

    <v-card-text class="pa-4 pa-md-6">
      <slot />
    </v-card-text>
  </v-card>
</template>

<style scoped>
.studio-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}
</style>

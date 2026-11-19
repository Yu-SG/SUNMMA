<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    index: number
    title: string
    subtitle?: string
    image?: string
    canMoveUp: boolean
    canMoveDown: boolean
    defaultOpen?: boolean
  }>(),
  {
    subtitle: '',
    image: '',
    defaultOpen: true,
  },
)

const emit = defineEmits<{
  up: []
  down: []
  remove: []
}>()

const open = ref(props.defaultOpen)
const displayNumber = computed(() => String(props.index + 1).padStart(2, '0'))
</script>

<template>
  <div class="repeater" :class="{ 'repeater--open': open }">
    <div class="repeater__head">
      <button type="button" class="repeater__toggle" :aria-expanded="open" @click="open = !open">
        <span class="repeater__no">{{ displayNumber }}</span>

        <span v-if="image" class="repeater__thumb">
          <img :src="image" alt="" loading="lazy" decoding="async" />
        </span>

        <span class="repeater__titles">
          <span class="repeater__title">{{ title }}</span>
          <span v-if="subtitle" class="repeater__subtitle">{{ subtitle }}</span>
        </span>
      </button>

      <div class="repeater__actions">
        <v-btn
          icon="mdi-arrow-up"
          variant="text"
          size="small"
          density="comfortable"
          :disabled="!canMoveUp"
          aria-label="上移"
          title="上移"
          @click="emit('up')"
        />
        <v-btn
          icon="mdi-arrow-down"
          variant="text"
          size="small"
          density="comfortable"
          :disabled="!canMoveDown"
          aria-label="下移"
          title="下移"
          @click="emit('down')"
        />
        <v-btn
          icon="mdi-trash-can-outline"
          variant="text"
          size="small"
          density="comfortable"
          color="error"
          aria-label="删除"
          title="删除"
          @click="emit('remove')"
        />
        <v-btn
          :icon="open ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          variant="text"
          size="small"
          density="comfortable"
          :aria-label="open ? '收起' : '展开'"
          :title="open ? '收起' : '展开'"
          @click="open = !open"
        />
      </div>
    </div>

    <v-expand-transition>
      <div v-show="open" class="repeater__body">
        <slot />
      </div>
    </v-expand-transition>
  </div>
</template>

<style scoped>
.repeater {
  margin-bottom: 12px;
  border: 1px solid transparent;
  border-radius: 16px;
  background: rgba(var(--v-theme-on-surface), 0.035);
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.repeater--open {
  border-color: rgba(var(--v-theme-on-surface), 0.07);
  background: rgb(var(--v-theme-surface));
}

.repeater__head {
  display: flex;
  padding: 10px 10px 10px 14px;
  align-items: center;
  gap: 10px;
}

.repeater__toggle {
  display: flex;
  min-width: 0;
  padding: 0;
  flex: 1 1 auto;
  align-items: center;
  gap: 10px;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
}

.repeater__no {
  display: grid;
  width: 26px;
  height: 26px;
  flex: 0 0 26px;
  border-radius: 9px;
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  place-items: center;
}

.repeater--open .repeater__no {
  background: rgb(var(--v-theme-primary));
  color: #fff;
}

.repeater__thumb {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  overflow: hidden;
  border-radius: 10px;
  background: rgba(var(--v-theme-on-surface), 0.06);
}

.repeater__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.repeater__titles {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 1px;
}

.repeater__title {
  overflow: hidden;
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.repeater__subtitle {
  overflow: hidden;
  color: rgba(var(--v-theme-on-surface), 0.55);
  font-size: 11.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.repeater__actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 2px;
}

.repeater__body {
  padding: 2px 16px 16px;
}
</style>

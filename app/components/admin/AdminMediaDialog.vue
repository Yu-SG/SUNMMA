<script setup lang="ts">
interface MediaItem {
  url: string
  name: string
  size: number
  updatedAt: string
  source: 'uploads' | 'builtin'
}

const props = defineProps<{ modelValue: boolean; current?: string }>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  select: [url: string]
  error: [message: string]
}>()

const items = ref<MediaItem[]>([])
const loading = ref(false)
const uploading = ref(false)
const removing = ref<string | null>(null)
const query = ref('')
const tab = ref<'all' | 'uploads' | 'builtin'>('all')
const dragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const open = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return items.value.filter((item) => {
    if (tab.value === 'uploads' && item.source !== 'uploads') return false
    if (tab.value === 'builtin' && item.source !== 'builtin') return false
    return !q || item.name.toLowerCase().includes(q)
  })
})

const counters = computed(() => ({
  all: items.value.length,
  uploads: items.value.filter((item) => item.source === 'uploads').length,
  builtin: items.value.filter((item) => item.source === 'builtin').length,
}))

const sizeText = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`

const load = async () => {
  loading.value = true
  try {
    const data = await $fetch<{ items: MediaItem[] }>('/api/admin/media')
    items.value = data.items ?? []
  } catch (error: any) {
    emit('error', error?.data?.statusMessage || '图片库加载失败')
  } finally {
    loading.value = false
  }
}

watch(open, (value) => {
  if (value) void load()
})

const pick = (item: MediaItem) => {
  emit('select', item.url)
  open.value = false
}

const upload = async (file: File) => {
  uploading.value = true
  try {
    const body = new FormData()
    body.append('file', file)
    const result = await $fetch<{ url: string }>('/api/admin/upload', { method: 'POST', body })
    await load()
    emit('select', result.url)
    open.value = false
  } catch (error: any) {
    emit('error', error?.data?.statusMessage || '上传失败')
  } finally {
    uploading.value = false
  }
}

const onPick = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) void upload(file)
  target.value = ''
}

const onDrop = (event: DragEvent) => {
  dragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) void upload(file)
}

const remove = async (item: MediaItem) => {
  if (item.source !== 'uploads') return
  removing.value = item.url
  try {
    await $fetch('/api/admin/upload', { method: 'DELETE', query: { url: item.url } })
    items.value = items.value.filter((entry) => entry.url !== item.url)
  } catch (error: any) {
    emit('error', error?.data?.statusMessage || '删除失败')
  } finally {
    removing.value = null
  }
}
</script>

<template>
  <v-dialog v-model="open" max-width="920" scrollable>
    <v-card rounded="xl">
      <v-card-item class="pb-2">
        <template #prepend>
          <v-avatar color="primary" variant="tonal" rounded="lg" size="40">
            <v-icon icon="mdi-image-multiple-outline" size="20" />
          </v-avatar>
        </template>
        <v-card-title>图片库</v-card-title>
        <v-card-subtitle>选择已有图片，或上传新的图片</v-card-subtitle>
      </v-card-item>

      <v-card-text class="pb-2">
        <div class="d-flex flex-wrap align-center ga-2">
          <v-text-field
            v-model="query"
            density="compact"
            variant="solo"
            flat
            rounded="lg"
            :bg-color="'surface-variant'"
            prepend-inner-icon="mdi-magnify"
            placeholder="搜索文件名"
            hide-details
            single-line
            class="media-search"
          />

          <v-spacer />

          <v-btn
            color="primary"
            variant="tonal"
            size="small"
            prepend-icon="mdi-upload"
            :loading="uploading"
            @click="fileInput?.click()"
          >
            上传图片
          </v-btn>

          <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="onPick" />
        </div>

        <v-tabs v-model="tab" density="compact" class="mt-3">
          <v-tab value="all">全部 {{ counters.all }}</v-tab>
          <v-tab value="uploads">后台上传 {{ counters.uploads }}</v-tab>
          <v-tab value="builtin">内置素材 {{ counters.builtin }}</v-tab>
        </v-tabs>
      </v-card-text>

      <v-divider />

      <v-card-text
        class="media-body"
        :class="{ 'media-body--drag': dragging }"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop.prevent="onDrop"
      >
        <div v-if="loading" class="d-flex justify-center py-10">
          <v-progress-circular indeterminate color="primary" />
        </div>

        <v-row v-else-if="filtered.length" density="compact">
          <v-col v-for="item in filtered" :key="item.url" cols="6" sm="4" md="3">
            <v-card
              variant="outlined"
              rounded="lg"
              class="media-tile"
              :class="{ 'media-tile--active': current === item.url }"
              @click="pick(item)"
            >
              <v-img :src="item.url" height="104" cover class="media-tile__img">
                <template #error>
                  <div class="d-flex align-center justify-center h-100">
                    <v-icon icon="mdi-image-off-outline" />
                  </div>
                </template>
              </v-img>

              <div class="px-2 py-2">
                <div class="text-caption text-truncate" :title="item.name">{{ item.name }}</div>
                <div class="d-flex align-center justify-between mt-1">
                  <span class="text-caption text-medium-emphasis">{{ sizeText(item.size) }}</span>
                  <v-chip v-if="item.source === 'builtin'" size="x-small" variant="tonal">内置</v-chip>
                  <v-btn
                    v-else
                    icon="mdi-trash-can-outline"
                    size="x-small"
                    variant="text"
                    color="error"
                    :loading="removing === item.url"
                    title="删除这张图片"
                    aria-label="删除这张图片"
                    @click.stop="remove(item)"
                  />
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <div v-else class="text-center py-10 text-medium-emphasis">
          <v-icon icon="mdi-image-multiple-outline" size="34" class="mb-2" />
          <p class="text-body-2 mb-1">这里还没有图片</p>
          <p class="text-caption mb-0">点右上角「上传图片」，或把图片拖进来</p>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="px-4 py-3">
        <span class="text-caption text-medium-emphasis">点击任意图片即可选用</span>
        <v-spacer />
        <v-btn variant="text" @click="open = false">关闭</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.media-search {
  max-width: 280px;
}

.media-body {
  min-height: 280px;
  max-height: 60vh;
  transition: box-shadow 0.15s ease;
}

.media-body--drag {
  box-shadow: inset 0 0 0 2px rgb(var(--v-theme-primary));
}

.media-tile {
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.media-tile:hover {
  transform: translateY(-2px);
  border-color: rgba(var(--v-theme-primary), 0.4);
}

.media-tile--active {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 1px rgb(var(--v-theme-primary));
}

.media-tile__img {
  background: rgba(var(--v-theme-on-surface), 0.04);
}
</style>

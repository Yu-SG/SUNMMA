<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    hint?: string
  }>(),
  {
    label: '图片路径',
    placeholder: '',
    hint: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  uploaded: [url: string]
  removed: []
  error: [message: string]
}>()

const MAX_BYTES = 8 * 1024 * 1024
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']

const input = ref<HTMLInputElement | null>(null)
const mediaOpen = ref(false)
const uploading = ref(false)
const removing = ref(false)
const dragging = ref(false)
const status = ref('')
const failed = ref(false)

const isUpload = computed(() => props.modelValue.startsWith('/uploads/'))

const notify = (message: string, isError = false) => {
  status.value = message
  failed.value = isError
  if (isError) emit('error', message)
}

const pick = () => input.value?.click()

const upload = async (file: File) => {
  if (!ACCEPTED.includes(file.type)) {
    notify('只支持 JPG、PNG、WebP、GIF、AVIF 图片', true)
    return
  }

  if (file.size > MAX_BYTES) {
    notify('图片不能超过 8MB', true)
    return
  }

  uploading.value = true
  notify('')

  try {
    const body = new FormData()
    body.append('file', file)

    const result = await $fetch<{ url: string }>('/api/admin/upload', {
      method: 'POST',
      body,
    })

    emit('update:modelValue', result.url)
    emit('uploaded', result.url)
    notify(`已上传 ${Math.round(file.size / 1024)} KB`)
  } catch (error: any) {
    notify(error?.data?.statusMessage || error?.statusMessage || '上传失败，请重试', true)
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

const onSelectFromLibrary = (url: string) => {
  emit('update:modelValue', url)
  notify('已从图片库选用')
}

const remove = async () => {
  if (!props.modelValue) return

  if (isUpload.value) {
    removing.value = true
    try {
      await $fetch('/api/admin/upload', { method: 'DELETE', body: { url: props.modelValue } })
    } catch {
      /* file may already be gone — clearing the field is still the right outcome */
    } finally {
      removing.value = false
    }
  }

  emit('update:modelValue', '')
  emit('removed')
  notify('已移除图片')
}
</script>

<template>
  <div class="image-field">
    <div class="d-flex align-center ga-2 ga-sm-3">
      <div
        class="preview"
        :class="{ 'preview--drag': dragging }"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop.prevent="onDrop"
      >
        <v-img
          v-if="modelValue"
          :src="modelValue"
          width="72"
          height="72"
          rounded="lg"
          cover
          eager
          class="thumb"
        >
          <template #error>
            <v-sheet color="surface-variant" class="d-flex align-center justify-center w-100 h-100">
              <v-icon icon="mdi-image-off-outline" size="20" class="text-medium-emphasis" />
            </v-sheet>
          </template>
        </v-img>

        <v-sheet
          v-else
          width="72"
          height="72"
          rounded="lg"
          color="surface-variant"
          class="d-flex align-center justify-center"
        >
          <v-icon icon="mdi-image-plus-outline" size="22" class="text-medium-emphasis" />
        </v-sheet>

        <div v-if="uploading" class="preview__loading">
          <v-progress-circular indeterminate size="22" width="2" color="primary" />
        </div>
      </div>

      <v-text-field
        :model-value="modelValue"
        :label="label"
        :placeholder="placeholder || undefined"
        hide-details="auto"
        class="media-field flex-grow-1"
        @update:model-value="emit('update:modelValue', $event)"
      />

      <v-btn
        icon="mdi-image-multiple-outline"
        variant="text"
        color="primary"
        size="small"
        title="从图片库选择"
        aria-label="从图片库选择"
        @click="mediaOpen = true"
      />

      <v-btn
        variant="tonal"
        color="primary"
        size="small"
        prepend-icon="mdi-upload"
        :loading="uploading"
        title="上传图片"
        aria-label="上传图片"
        @click="pick"
      >
        <span class="d-none d-sm-inline">上传</span>
      </v-btn>

      <v-btn
        icon="mdi-trash-can-outline"
        variant="text"
        color="error"
        size="small"
        :loading="removing"
        :disabled="!modelValue"
        title="移除图片"
        aria-label="移除图片"
        @click="remove"
      />

      <input ref="input" type="file" accept="image/*" class="d-none" @change="onPick" />

      <AdminMediaDialog
        v-model="mediaOpen"
        :current="modelValue"
        @select="onSelectFromLibrary"
        @error="notify($event, true)"
      />
    </div>

    <p v-if="status || hint" class="text-caption mt-1 mb-0" :class="failed ? 'text-error' : 'text-medium-emphasis'">
      {{ status || hint }}
    </p>
  </div>
</template>

<style scoped>
.preview {
  position: relative;
  flex: 0 0 auto;
  border-radius: 12px;
  outline: 2px dashed transparent;
  outline-offset: 2px;
  transition: outline-color 0.15s ease;
}

.preview--drag {
  outline-color: rgb(var(--v-theme-primary));
}

.preview__loading {
  position: absolute;
  inset: 0;
  display: grid;
  border-radius: 12px;
  background: rgba(var(--v-theme-surface), 0.65);
  place-items: center;
}

.thumb {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.media-field {
  min-width: 0;
}
</style>

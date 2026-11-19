<script setup lang="ts">
import { ref, watch } from 'vue'

/**
 * Text field / textarea bound to a `string[]` value.
 *
 * The array is converted to text for editing and parsed back only when the
 * field loses focus, so pressing Enter inside a textarea is not swallowed by
 * an immediate re-parse on every keystroke.
 */
const props = withDefaults(
  defineProps<{
    modelValue: string[]
    mode?: 'lines' | 'tags'
    label?: string
    hint?: string
    rows?: number
    placeholder?: string
  }>(),
  {
    mode: 'lines',
    label: '',
    hint: '',
    rows: 4,
    placeholder: '',
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const separator = () => (props.mode === 'tags' ? ', ' : '\n')

const parse = (value: string) => {
  const parts = props.mode === 'tags' ? value.split(/[,，]/) : value.split(/\r?\n/)
  return parts.map((part) => part.trim()).filter((part) => part.length > 0)
}

const text = ref(props.modelValue.join(separator()))
const editing = ref(false)

watch(
  () => props.modelValue,
  (next) => {
    if (editing.value) return
    const joined = next.join(separator())
    if (joined !== text.value) text.value = joined
  },
  { deep: true },
)

const onUpdate = (value: string) => {
  text.value = value
}

const onFocusChange = (focused: boolean) => {
  editing.value = focused
  if (focused) return

  const next = parse(text.value)
  const current = props.modelValue
  if (next.length !== current.length || next.some((value, index) => value !== current[index])) {
    emit('update:modelValue', next)
  }
}
</script>

<template>
  <v-textarea
    v-if="mode === 'lines'"
    :model-value="text"
    :label="label || undefined"
    :rows="rows"
    :hint="hint || undefined"
    :persistent-hint="!!hint"
    :placeholder="placeholder || undefined"
    hide-details="auto"
    @update:model-value="onUpdate"
    @update:focused="onFocusChange"
  />
  <v-text-field
    v-else
    :model-value="text"
    :label="label || undefined"
    :hint="hint || undefined"
    :persistent-hint="!!hint"
    :placeholder="placeholder || undefined"
    hide-details="auto"
    @update:model-value="onUpdate"
    @update:focused="onFocusChange"
  />
</template>

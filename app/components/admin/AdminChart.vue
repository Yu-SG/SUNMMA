<script setup lang="ts">
import type { EChartsOption } from 'echarts'

const props = withDefaults(
  defineProps<{
    option: EChartsOption
    height?: number | string
  }>(),
  { height: 260 },
)

const el = ref<HTMLElement | null>(null)
let instance: { setOption: (option: EChartsOption) => void; resize: () => void; dispose: () => void } | null = null
let observer: ResizeObserver | null = null

const heightStyle = computed(() => (typeof props.height === 'number' ? `${props.height}px` : props.height))

const draw = async () => {
  if (!el.value) return
  if (!instance) {
    const echarts = await import('echarts')
    instance = echarts.init(el.value, undefined, { renderer: 'canvas' })
  }
  instance.setOption(props.option, true)
}

watch(
  () => props.option,
  () => {
    void draw()
  },
  { deep: true },
)

onMounted(() => {
  void draw()
  observer = new ResizeObserver(() => instance?.resize())
  if (el.value) observer.observe(el.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
  instance?.dispose()
  instance = null
})
</script>

<template>
  <div ref="el" class="chart" :style="{ height: heightStyle }" />
</template>

<style scoped>
.chart {
  width: 100%;
}
</style>

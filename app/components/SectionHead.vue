<script setup lang="ts">
withDefaults(
  defineProps<{
    en: string
    zh?: string
    light?: boolean
  }>(),
  { zh: '', light: false },
)
</script>

<template>
  <header class="head01" :class="{ 'head01--light': light }">
    <p class="head01__en">{{ en }}</p>
    <p v-if="zh" class="head01__zh">{{ zh }}</p>
  </header>
</template>

<style scoped>
.head01--light .head01__en,
.head01--light .head01__zh {
  color: #fff;
}
</style>

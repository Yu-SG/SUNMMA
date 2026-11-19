<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

useSeoMeta({
  title: () => `${props.error.statusCode}｜${props.error.statusCode === 404 ? '页面不存在' : '服务出错了'}`,
  robots: 'noindex, nofollow',
})
</script>

<template>
  <v-app>
    <v-main class="error-page">
      <v-container class="error-inner">
        <p class="error-code font-en">{{ error.statusCode }}</p>
        <h1 class="error-title">
          {{ error.statusCode === 404 ? '你要找的页面不存在' : '页面暂时无法访问' }}
        </h1>
        <p class="error-text">
          {{ error.statusCode === 404 ? '链接可能已经更新或被移除，可以从下面的入口重新开始。' : '服务出现了一点问题，请稍后再试。' }}
        </p>
        <div class="error-actions">
          <v-btn color="primary" rounded="lg" to="/">返回首页</v-btn>
          <v-btn variant="tonal" rounded="lg" to="/products">产品中心</v-btn>
          <v-btn variant="text" rounded="lg" to="/contact">联系我们</v-btn>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.error-page {
  display: grid;
  min-height: 100vh;
  background: #f5f7fa;
  place-items: center;
}

.error-inner {
  max-width: 620px;
  text-align: center;
}

.error-code {
  color: #1976d2;
  font-size: 64px;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1;
}

.error-title {
  margin-top: 10px;
  color: #10233a;
  font-size: 24px;
  font-weight: 700;
}

.error-text {
  margin-top: 12px;
  color: #5b6472;
  font-size: 14px;
  line-height: 1.9;
}

.error-actions {
  display: flex;
  margin-top: 26px;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}
</style>

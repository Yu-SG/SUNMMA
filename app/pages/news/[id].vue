<script setup lang="ts">
import { computed } from 'vue'
import { siteConfig } from '~/config/site'

const route = useRoute()
const articleId = computed(() => String(route.params.id ?? ''))
const articleIndex = computed(() =>
  siteConfig.news.findIndex((item) => item.id === articleId.value),
)
const article = computed(() => siteConfig.news[articleIndex.value])

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '文章不存在或已下线',
    fatal: true,
  })
}

const previous = computed(() => (articleIndex.value > 0 ? siteConfig.news[articleIndex.value - 1] : null))
const next = computed(() =>
  articleIndex.value >= 0 && articleIndex.value < siteConfig.news.length - 1
    ? siteConfig.news[articleIndex.value + 1]
    : null,
)

useSeoMeta({
  title: () => `${article.value?.title ?? '新闻详情'}｜${siteConfig.brand.name} 制药`,
  description: () => article.value?.excerpt ?? '',
  ogTitle: () => article.value?.title ?? '',
  ogDescription: () => article.value?.excerpt ?? '',
  ogImage: () => article.value?.cover ?? siteConfig.banners[0]?.src ?? '',
  ogType: 'article',
})
</script>

<template>
  <div v-if="article" class="article-page">
    <SitePageHead
      :title="article.title"
      :parents="[{ title: '新闻动态', to: '/news' }]"
    />

    <section class="article-section">
      <v-container>
        <article class="article">
          <div class="article__meta">
            <v-chip size="small" color="primary" variant="tonal">{{ article.category }}</v-chip>
            <time class="article__date font-en">{{ article.date }}</time>
            <span class="article__source">来源：XXX 制药</span>
          </div>

          <v-img
            v-if="article.cover"
            :src="article.cover"
            :alt="article.title"
            :aspect-ratio="16 / 7"
            cover
            eager
            class="article__cover"
          />

          <div class="article__body">
            <p v-for="(paragraph, index) in article.body" :key="index">{{ paragraph }}</p>
          </div>

          <div class="article__foot">
            <v-btn to="/news" variant="outlined" prepend-icon="mdi-arrow-left">返回列表</v-btn>
            <a
              v-if="article.sourceUrl"
              :href="article.sourceUrl"
              class="article__source-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              查看原文
              <v-icon icon="mdi-open-in-new" size="15" />
            </a>
          </div>

          <nav class="article__nav" aria-label="上下篇">
            <NuxtLink
              v-if="previous"
              :to="`/news/${previous.id}`"
              class="article__nav-item"
            >
              <span class="article__nav-label font-en">PREV</span>
              <span class="article__nav-title">{{ previous.title }}</span>
            </NuxtLink>
            <span v-else class="article__nav-item article__nav-item--empty">
              <span class="article__nav-label font-en">PREV</span>
              <span class="article__nav-title">已经是第一篇</span>
            </span>

            <NuxtLink
              v-if="next"
              :to="`/news/${next.id}`"
              class="article__nav-item article__nav-item--right"
            >
              <span class="article__nav-label font-en">NEXT</span>
              <span class="article__nav-title">{{ next.title }}</span>
            </NuxtLink>
            <span v-else class="article__nav-item article__nav-item--right article__nav-item--empty">
              <span class="article__nav-label font-en">NEXT</span>
              <span class="article__nav-title">已经是最后一篇</span>
            </span>
          </nav>
        </article>
      </v-container>
    </section>
  </div>
</template>

<style scoped>
.article-section {
  padding: 48px 0 76px;
  background: #fff;
}

.article {
  max-width: 860px;
  margin-inline: auto;
}

.article__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  color: #7b8794;
  font-size: 13px;
}

.article__date {
  letter-spacing: 0.04em;
}

.article__source {
  color: #9aa6b2;
}

.article__cover {
  margin-top: 24px;
  border-radius: 18px;
}

.article__body {
  margin-top: 30px;
  color: #33414b;
  font-size: 16px;
  line-height: 2.1;
  letter-spacing: 0.02em;
}

.article__body p + p {
  margin-top: 18px;
}

.article__foot {
  display: flex;
  margin-top: 40px;
  padding-top: 22px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border-top: 1px solid rgba(16, 35, 58, 0.1);
}

.article__source-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #1976d2;
  font-size: 13.5px;
}

.article__nav {
  display: grid;
  margin-top: 30px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.article__nav-item {
  display: flex;
  padding: 16px 18px;
  flex-direction: column;
  gap: 6px;
  border: 1px solid rgba(16, 35, 58, 0.09);
  border-radius: 14px;
  transition: border-color 0.2s var(--ease), background-color 0.2s var(--ease);
}

.article__nav-item:hover {
  border-color: rgba(25, 118, 210, 0.45);
  background: #f7fbff;
}

.article__nav-item--right {
  align-items: flex-end;
  text-align: right;
}

.article__nav-item--empty {
  color: #9aa6b2;
  pointer-events: none;
}

.article__nav-label {
  color: #1976d2;
  font-size: 10.5px;
  letter-spacing: 0.2em;
}

.article__nav-item--empty .article__nav-label {
  color: #b6c1cc;
}

.article__nav-title {
  color: #10233a;
  font-size: 14px;
  line-height: 1.6;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

@media (max-width: 640px) {
  .article-section {
    padding: 32px 0 56px;
  }

  .article__body {
    font-size: 15px;
    line-height: 2;
  }

  .article__nav {
    grid-template-columns: 1fr;
  }
}
</style>

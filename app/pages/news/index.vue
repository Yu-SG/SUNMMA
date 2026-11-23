<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { siteConfig } from '~/config/site'

const route = useRoute()
const router = useRouter()

const PAGE_SIZE = 4
const page = siteConfig.pages.news
const categories = computed(() => page.categories)
const allLabel = '全部'

const activeCategory = ref<string>(allLabel)
const currentPage = ref(1)

const filtered = computed(() =>
  activeCategory.value === allLabel
    ? siteConfig.news
    : siteConfig.news.filter((article) => article.category === activeCategory.value),
)

const total = computed(() => filtered.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

const currentArticles = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filtered.value.slice(start, start + PAGE_SIZE)
})

const syncQuery = () => {
  const query: Record<string, string> = {}
  if (activeCategory.value !== allLabel) query.category = activeCategory.value
  if (currentPage.value > 1) query.page = String(currentPage.value)
  router.push({ path: '/news', query })
}

const selectCategory = (category: unknown) => {
  const next = typeof category === 'string' ? category : allLabel
  if (next === activeCategory.value) return
  activeCategory.value = next
  currentPage.value = 1
  syncQuery()
}

const goToPage = (value: number) => {
  if (value === currentPage.value) return
  currentPage.value = value
  syncQuery()
}

// Keep the UI in sync with ?category= / ?page= (footer links, back/forward).
watch(
  () => route.query,
  (query) => {
    const requested =
      typeof query.category === 'string' && categories.value.includes(query.category)
        ? query.category
        : allLabel
    if (requested !== activeCategory.value) activeCategory.value = requested

    const requestedPage = Math.min(
      Math.max(1, Number.parseInt(String(query.page ?? '1'), 10) || 1),
      totalPages.value,
    )
    if (requestedPage !== currentPage.value) currentPage.value = requestedPage
  },
  { immediate: true },
)

useSeoMeta({
  title: `新闻动态｜${siteConfig.brand.name}`,
  description: page.intro[0] || `${siteConfig.brand.name}新闻动态`,
  ogTitle: `新闻动态｜${siteConfig.brand.name}`,
  ogDescription: page.intro[0] || '',
})
</script>

<template>
  <div class="news-page">
    <SitePageHead :title="page.title" :subtitle="page.subtitle" :intro="page.intro" />

    <section class="section">
      <v-container>
        <v-row>
          <v-col cols="12" md="3" lg="2" class="d-none d-md-block">
            <aside class="side">
              <p class="side__label font-en">CATEGORY</p>
              <h2 class="side__title">新闻分类</h2>
              <v-list nav density="comfortable" class="side__list">
                <v-list-item
                  :active="activeCategory === allLabel"
                  color="primary"
                  :title="allLabel"
                  @click="selectCategory(allLabel)"
                />
                <v-list-item
                  v-for="category in categories"
                  :key="category"
                  :active="activeCategory === category"
                  color="primary"
                  :title="category"
                  @click="selectCategory(category)"
                />
              </v-list>

              <v-card class="side-card" to="/contact">
                <p class="side-card__label font-en">CONTACT</p>
                <p class="side-card__title">媒体与品牌合作</p>
                <p class="side-card__text">如需采访、转载或品牌合作，请联系我们。</p>
                <span class="side-card__link">
                  联系我们
                  <v-icon icon="mdi-arrow-right" size="15" />
                </span>
              </v-card>
            </aside>
          </v-col>

          <v-col cols="12" md="9" lg="10">
            <div class="d-md-none mb-4">
              <v-chip-group
                :model-value="activeCategory"
                mandatory
                selected-class="text-primary"
                @update:model-value="selectCategory"
              >
                <v-chip :value="allLabel" variant="outlined" filter>{{ allLabel }}</v-chip>
                <v-chip
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                  variant="outlined"
                  filter
                >
                  {{ category }}
                </v-chip>
              </v-chip-group>
            </div>

            <div class="list-meta">
              <p>
                共 <strong>{{ total }}</strong> 条
                <span v-if="activeCategory !== allLabel"> · {{ activeCategory }}</span>
              </p>
              <p class="list-meta__page font-en">
                {{ String(currentPage).padStart(2, '0') }} / {{ String(totalPages).padStart(2, '0') }}
              </p>
            </div>

            <div class="news-list">
              <article
                v-for="article in currentArticles"
                :key="article.id ?? article.title"
                class="news-row"
              >
                <NuxtLink :to="`/news/${article.id}`" class="news-row__cover" tabindex="-1">
                  <v-img
                    v-if="article.cover"
                    :src="article.cover"
                    :alt="article.title"
                    :aspect-ratio="16 / 10"
                    cover
                    eager
                  />
                  <div v-else class="news-row__cover-fallback" />
                </NuxtLink>

                <div class="news-row__body">
                  <div class="news-row__meta">
                    <v-chip size="x-small" color="primary" variant="tonal">{{ article.category }}</v-chip>
                    <span class="news-row__date font-en">{{ article.date }}</span>
                  </div>
                  <h2 class="news-row__title">
                    <NuxtLink :to="`/news/${article.id}`">{{ article.title }}</NuxtLink>
                  </h2>
                  <p class="news-row__excerpt">{{ article.excerpt }}</p>
                  <v-btn
                    :to="`/news/${article.id}`"
                    variant="text"
                    color="primary"
                    size="small"
                    append-icon="mdi-arrow-right"
                    class="news-row__more px-0"
                  >
                    查看详情
                  </v-btn>
                </div>
              </article>

              <v-alert
                v-if="currentArticles.length === 0"
                type="info"
                variant="tonal"
                rounded="lg"
                class="mt-4"
              >
                {{ total === 0 ? '企业动态与政策法规内容整理中，敬请期待。' : '该分类下暂无内容，试试其他分类。' }}
              </v-alert>
            </div>

            <div v-if="total > 0" class="pagination">
              <p class="pagination__count">共 {{ total }} 条</p>
              <v-pagination
                :model-value="currentPage"
                :length="totalPages"
                :total-visible="5"
                color="primary"
                density="comfortable"
                class="pagination__control"
                @update:model-value="goToPage"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<style scoped>
.section {
  padding: 56px 0 72px;
  background: #fff;
}

.side {
  position: sticky;
  top: 132px;
}

.side__label {
  color: #1976d2;
  font-size: 10.5px;
  letter-spacing: 0.24em;
}

.side__title {
  margin-top: 4px;
  color: #10233a;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.side__list {
  margin-top: 14px;
  padding: 0;
  border-top: 1px solid rgba(16, 35, 58, 0.09);
  background: transparent;
}

.side__list :deep(.v-list-item) {
  border-bottom: 1px solid rgba(16, 35, 58, 0.07);
  border-radius: 0;
  color: #5b6472;
  font-size: 14.5px;
  letter-spacing: 0.04em;
}

.side__list :deep(.v-list-item--active) {
  background: transparent;
  color: #1976d2;
  font-weight: 600;
}

.side__list :deep(.v-list-item--active .v-list-item__overlay) {
  opacity: 0;
}

.side-card {
  margin-top: 28px;
  padding: 20px 18px;
  background: linear-gradient(160deg, #eaf3fc, #f7fbff);
}

.side-card__label {
  color: #1976d2;
  font-size: 10px;
  letter-spacing: 0.22em;
}

.side-card__title {
  margin-top: 6px;
  color: #10233a;
  font-size: 15px;
  font-weight: 600;
}

.side-card__text {
  margin-top: 8px;
  color: #6b7c8f;
  font-size: 12.5px;
  line-height: 1.8;
}

.side-card__link {
  display: inline-flex;
  margin-top: 12px;
  align-items: center;
  gap: 4px;
  color: #1976d2;
  font-size: 12.5px;
}

.list-meta {
  display: flex;
  padding-bottom: 14px;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: 1px solid rgba(16, 35, 58, 0.1);
  color: #6b7c8f;
  font-size: 13px;
}

.list-meta strong {
  color: #1976d2;
  font-family: var(--font-en);
  font-size: 18px;
  font-weight: 600;
}

.list-meta__page {
  font-size: 12px;
  letter-spacing: 0.14em;
}

.news-list {
  display: flex;
  flex-direction: column;
}

.news-row {
  display: flex;
  padding: 26px 0;
  gap: 26px;
  border-bottom: 1px dashed rgba(16, 35, 58, 0.12);
}

.news-row__cover {
  width: 236px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 14px;
  background: #eef3f9;
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}

.news-row__cover:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 28px rgba(13, 71, 161, 0.16);
}

.news-row__cover-fallback {
  height: 100%;
  min-height: 140px;
  background: linear-gradient(130deg, #e3f2fd, #f5f7fa);
}

.news-row__body {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.news-row__meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.news-row__date {
  color: #8b98a6;
  font-size: 12px;
  letter-spacing: 0.06em;
}

.news-row__title {
  margin-top: 10px;
  color: #10233a;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.55;
}

.news-row__title a {
  transition: color 0.2s var(--ease);
}

.news-row__title a:hover {
  color: #1976d2;
}

.news-row__excerpt {
  display: -webkit-box;
  margin-top: 8px;
  overflow: hidden;
  color: #6b7c8f;
  font-size: 13.5px;
  line-height: 1.85;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.news-row__more {
  margin-top: 10px;
  align-self: flex-start;
  font-size: 12.5px;
}

.pagination {
  display: flex;
  padding-top: 28px;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.pagination__count {
  color: #7b8794;
  font-size: 13px;
}

.pagination__control {
  flex-wrap: wrap;
}

@media (max-width: 959px) {
  .news-row {
    gap: 18px;
  }

  .news-row__cover {
    width: 190px;
  }

  .news-row__title {
    font-size: 17px;
  }
}

@media (max-width: 640px) {
  .section {
    padding: 36px 0 52px;
  }

  .news-row {
    padding: 20px 0;
    flex-direction: column;
    gap: 14px;
  }

  .news-row__cover {
    width: 100%;
  }

  .news-row__title {
    font-size: 17px;
  }

  .pagination {
    flex-direction: column;
    align-items: flex-start;
  }

  .pagination__count {
    order: 2;
  }
}
</style>

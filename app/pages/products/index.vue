<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import type { SiteConfig } from '#shared/site'
import { siteConfig } from '~/config/site'

type Product = SiteConfig['products'][number]

const route = useRoute()
const router = useRouter()
const { xs } = useDisplay()

const page = siteConfig.pages.products
const ALL = '全部'
const activeCategory = ref<string>(ALL)
const activeGroup = ref<string>(ALL)
const selected = ref<Product | null>(null)
const dialogOpen = computed({
  get: () => selected.value !== null,
  set: (value: boolean) => {
    if (!value) selected.value = null
  },
})

const categories = computed(() => [ALL, ...page.categories])
const groups = computed(() => [ALL, ...page.groups])

const showResearch = computed(() => activeGroup.value === '在研')
const researchItems = computed(() =>
  siteConfig.pipeline.filter((item) => item.phase !== '已上市'),
)

const filtered = computed(() =>
  siteConfig.products.filter((product) => {
    const categoryMatch = activeCategory.value === ALL || product.category === activeCategory.value
    const groupMatch = activeGroup.value === ALL || product.group === activeGroup.value
    return categoryMatch && groupMatch
  }),
)

const syncQuery = () => {
  const query: Record<string, string> = {}
  if (activeCategory.value !== ALL) query.category = activeCategory.value
  if (activeGroup.value !== ALL) query.group = activeGroup.value
  router.replace({ path: '/products', query })
}

const selectCategory = (value: unknown) => {
  const next = typeof value === 'string' ? value : ALL
  if (next === activeCategory.value) return
  activeCategory.value = next
  syncQuery()
}

const selectGroup = (value: unknown) => {
  const next = typeof value === 'string' ? value : ALL
  if (next === activeGroup.value) return
  activeGroup.value = next
  syncQuery()
}

const resetFilters = () => {
  activeCategory.value = ALL
  activeGroup.value = ALL
  syncQuery()
}

const openProduct = (product: Product) => {
  selected.value = product
}

// Deep links from the footer/home, plus browser back/forward.
watch(
  () => route.query,
  (query) => {
    const category =
      typeof query.category === 'string' && page.categories.includes(query.category)
        ? query.category
        : ALL
    const group =
      typeof query.group === 'string' && page.groups.includes(query.group) ? query.group : ALL
    if (category !== activeCategory.value) activeCategory.value = category
    if (group !== activeGroup.value) activeGroup.value = group
  },
  { immediate: true },
)

useSeoMeta({
  title: `产品中心｜${siteConfig.brand.name} 制药`,
  description: page.intro[0] || `${siteConfig.brand.name} 制药产品中心`,
  ogTitle: `产品中心｜${siteConfig.brand.name} 制药`,
  ogDescription: page.intro[0] || '',
})
</script>

<template>
  <div class="products-page">
    <SitePageHead :title="page.title" :subtitle="page.subtitle" :intro="page.intro" />

    <section class="section">
      <v-container>
        <div class="filters">
          <div class="filter-row">
            <span class="filter-label">药品分类</span>
            <v-chip-group
              :model-value="activeCategory"
              mandatory
              selected-class="filter-chip--active"
              class="filter-chips"
              @update:model-value="selectCategory"
            >
              <v-chip
                v-for="category in categories"
                :key="category"
                :value="category"
                size="small"
                variant="outlined"
                filter
                class="filter-chip"
              >
                {{ category }}
              </v-chip>
            </v-chip-group>
          </div>

          <div class="filter-row">
            <span class="filter-label">治疗领域</span>
            <div class="filter-chips filter-chips--wrap">
              <v-chip
                v-for="group in groups"
                :key="group"
                size="small"
                :variant="activeGroup === group ? 'flat' : 'outlined'"
                :color="activeGroup === group ? 'primary' : undefined"
                class="filter-chip"
                @click="selectGroup(group)"
              >
                {{ group }}
              </v-chip>
            </div>
          </div>
        </div>

        <div class="result-meta">
          <p v-if="showResearch">
            共 <strong>{{ researchItems.length }}</strong> 个在研项目
          </p>
          <p v-else>
            共 <strong>{{ filtered.length }}</strong> 个产品
          </p>
          <p class="result-meta__filter">
            {{ activeCategory === ALL ? '全部药品分类' : activeCategory }}
            <span>/</span>
            {{ activeGroup === ALL ? '全部治疗领域' : activeGroup }}
          </p>
        </div>

        <div v-if="showResearch" class="research">
          <v-alert
            type="info"
            variant="tonal"
            rounded="xl"
            icon="mdi-flask-outline"
            class="research__notice"
          >
            在研项目尚处于临床前或临床研究阶段，暂未形成上市产品；以下信息仅用于研发进展交流，不构成产品推广。在研项目按研发管线展示，不区分制剂产品与原料药。
          </v-alert>

          <v-row>
            <v-col v-for="item in researchItems" :key="item.code" cols="12" md="6">
              <v-card class="research-card">
                <div class="research-card__head">
                  <div>
                    <p class="research-card__code font-en">{{ item.code }}</p>
                    <h2 class="research-card__name">{{ item.name }}</h2>
                  </div>
                  <v-chip size="small" color="primary" variant="tonal">{{ item.phase }}</v-chip>
                </div>

                <dl class="research-card__meta">
                  <div>
                    <dt>治疗领域</dt>
                    <dd>{{ item.category }}</dd>
                  </div>
                  <div>
                    <dt>适应症</dt>
                    <dd>{{ item.indication }}</dd>
                  </div>
                </dl>

                <div class="research-card__progress">
                  <div class="research-card__progress-label">
                    <span>研发进度</span>
                    <span class="font-en">{{ item.progress }}%</span>
                  </div>
                  <v-progress-linear
                    :model-value="item.progress"
                    color="primary"
                    height="6"
                    rounded
                    bg-color="surface-variant"
                  />
                </div>

                <p class="research-card__note">在研项目 · 暂未上市</p>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <v-row v-else-if="filtered.length">
          <v-col
            v-for="product in filtered"
            :key="product.code"
            cols="12"
            sm="6"
            lg="4"
          >
            <v-card class="product-card" @click="openProduct(product)">
              <div class="product-card__media">
                <v-img
                  :src="product.image"
                  :alt="product.name"
                  :aspect-ratio="4 / 3"
                  cover
                  eager
                  class="product-card__img"
                />
                <v-chip class="product-card__cat" size="x-small" color="primary" variant="flat">
                  {{ product.category }}
                </v-chip>
              </div>

              <div class="product-card__body">
                <p class="product-card__code font-en">{{ product.code }}</p>
                <h2 class="product-card__name">{{ product.name }}</h2>
                <p class="product-card__tag">{{ product.tag }}</p>
                <p class="product-card__meta">
                  <span>{{ product.form }}</span>
                  <span class="dot">·</span>
                  <span>{{ product.spec }}</span>
                </p>
                <p class="product-card__desc">{{ product.description }}</p>
                <div class="product-card__foot">
                  <span class="product-card__group">{{ product.group }}</span>
                  <v-btn
                    variant="text"
                    color="primary"
                    size="small"
                    append-icon="mdi-arrow-right"
                    @click.stop="openProduct(product)"
                  >
                    查看详情
                  </v-btn>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-alert
          v-else
          type="info"
          variant="tonal"
          rounded="xl"
          class="empty-state"
          icon="mdi-flask-outline"
        >
          <p class="empty-state__title">该筛选条件下暂无产品</p>
          <p class="empty-state__text">
            可以尝试切换药品分类或治疗领域；如需了解未公开产品信息，欢迎通过「联系我们」与我们的团队沟通。
          </p>
          <v-btn variant="flat" color="info" size="small" class="mt-3" @click="resetFilters">
            清除筛选
          </v-btn>
        </v-alert>
      </v-container>
    </section>

    <v-dialog v-model="dialogOpen" :max-width="xs ? undefined : 980" :fullscreen="xs" scrollable>
      <v-card v-if="selected" class="product-dialog">
        <v-btn
          icon="mdi-close"
          variant="text"
          class="product-dialog__close"
          aria-label="关闭"
          @click="dialogOpen = false"
        />

        <v-row no-gutters>
          <v-col cols="12" md="5">
            <v-img
              :src="selected.image"
              :alt="selected.name"
              :height="xs ? 220 : '100%'"
              cover
              eager
              class="product-dialog__img"
            />
          </v-col>

          <v-col cols="12" md="7">
            <div class="product-dialog__body">
              <div class="product-dialog__tags">
                <v-chip size="small" color="primary" variant="tonal">{{ selected.category }}</v-chip>
                <v-chip size="small" variant="outlined">{{ selected.group }}</v-chip>
                <v-chip size="small" color="secondary" variant="tonal">{{ selected.tag }}</v-chip>
              </div>

              <h2 class="product-dialog__title">{{ selected.name }}</h2>
              <p class="product-dialog__code font-en">PRODUCT CODE · {{ selected.code }}</p>

              <v-divider class="my-5" />

              <dl class="product-spec">
                <div>
                  <dt>剂型</dt>
                  <dd>{{ selected.form }}</dd>
                </div>
                <div>
                  <dt>规格</dt>
                  <dd>{{ selected.spec }}</dd>
                </div>
                <div>
                  <dt>治疗领域</dt>
                  <dd>{{ selected.group }}</dd>
                </div>
                <div>
                  <dt>持有人</dt>
                  <dd>{{ selected.holder }}</dd>
                </div>
              </dl>

              <h3 class="product-dialog__subtitle">适应症</h3>
              <p class="product-dialog__text">{{ selected.indication }}</p>

              <h3 class="product-dialog__subtitle">产品说明</h3>
              <p class="product-dialog__text">{{ selected.detail || selected.description }}</p>

              <div class="product-dialog__actions">
                <v-btn color="primary" to="/contact" @click="dialogOpen = false">咨询合作</v-btn>
                <v-btn variant="text" @click="dialogOpen = false">关闭</v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.section {
  padding: 48px 0 76px;
  background: #fff;
}

.filters {
  display: flex;
  padding: 22px 24px;
  flex-direction: column;
  gap: 14px;
  border: 1px solid rgba(16, 35, 58, 0.09);
  border-radius: 18px;
  background: #f8fafc;
}

.filter-row {
  display: flex;
  align-items: flex-start;
  gap: 18px;
}

.filter-label {
  width: 66px;
  flex-shrink: 0;
  padding-top: 8px;
  color: #10233a;
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.filter-chips {
  min-width: 0;
}

.filter-chips--wrap {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip {
  letter-spacing: 0.02em;
}

.filter-chip--active {
  border-color: #1976d2 !important;
  background: #1976d2 !important;
  color: #fff !important;
}

.result-meta {
  display: flex;
  margin: 26px 0 6px;
  padding-bottom: 12px;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: 1px solid rgba(16, 35, 58, 0.09);
  color: #6b7c8f;
  font-size: 13px;
}

.result-meta strong {
  color: #1976d2;
  font-family: var(--font-en);
  font-size: 18px;
  font-weight: 600;
}

.result-meta__filter {
  font-size: 12px;
  letter-spacing: 0.04em;
}

.result-meta__filter span {
  margin: 0 6px;
  opacity: 0.45;
}

.product-card {
  height: 100%;
  overflow: hidden;
  border: 1px solid rgba(16, 35, 58, 0.08);
  cursor: pointer;
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 44px rgba(13, 71, 161, 0.13);
}

.product-card__media {
  position: relative;
  background: #eef3f9;
}

.product-card__img {
  transition: transform 0.5s var(--ease);
}

.product-card:hover .product-card__img :deep(img) {
  transform: scale(1.04);
}

.product-card__cat {
  position: absolute;
  top: 14px;
  left: 14px;
  letter-spacing: 0.06em;
}

.product-card__body {
  padding: 18px 20px 16px;
}

.product-card__code {
  color: #9aa6b2;
  font-size: 10.5px;
  letter-spacing: 0.16em;
}

.product-card__name {
  margin-top: 6px;
  color: #10233a;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.5;
}

.product-card__tag {
  margin-top: 4px;
  color: #1976d2;
  font-size: 12px;
}

.product-card__meta {
  margin-top: 8px;
  color: #7b8794;
  font-size: 12.5px;
}

.product-card__meta .dot {
  margin: 0 6px;
  opacity: 0.5;
}

.product-card__desc {
  display: -webkit-box;
  margin-top: 10px;
  overflow: hidden;
  color: #6b7c8f;
  font-size: 13px;
  line-height: 1.8;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-card__foot {
  display: flex;
  margin-top: 12px;
  padding-top: 12px;
  align-items: center;
  justify-content: space-between;
  border-top: 1px dashed rgba(16, 35, 58, 0.1);
}

.product-card__group {
  color: #8b98a6;
  font-size: 12px;
}

.empty-state {
  padding: 26px;
}

.research__notice {
  margin-bottom: 8px;
  padding: 14px 18px;
  font-size: 13px;
}

.research-card {
  height: 100%;
  padding: 26px 26px 22px;
  border: 1px solid rgba(16, 35, 58, 0.09);
  background: #fff;
}

.research-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.research-card__code {
  color: #9aa6b2;
  font-size: 10.5px;
  letter-spacing: 0.16em;
}

.research-card__name {
  margin-top: 6px;
  color: #10233a;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.5;
}

.research-card__meta {
  display: grid;
  padding: 0;
  margin: 20px 0 0;
  grid-template-columns: 1fr 1.6fr;
  gap: 16px;
}

.research-card__meta dt {
  color: #8b98a6;
  font-size: 12px;
}

.research-card__meta dd {
  margin: 4px 0 0;
  color: #33414b;
  font-size: 13.5px;
  line-height: 1.7;
}

.research-card__progress {
  margin-top: 20px;
}

.research-card__progress-label {
  display: flex;
  margin-bottom: 8px;
  align-items: center;
  justify-content: space-between;
  color: #7b8794;
  font-size: 12px;
}

.research-card__note {
  margin-top: 16px;
  color: #9aa6b2;
  font-size: 11.5px;
  letter-spacing: 0.08em;
}

.empty-state__title {
  color: #0d47a1;
  font-size: 18px;
  font-weight: 600;
}

.empty-state__text {
  margin-top: 8px;
  color: #335268;
  font-size: 13.5px;
  line-height: 1.9;
}

.product-dialog__close {
  position: absolute;
  z-index: 3;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 10px rgba(16, 35, 58, 0.18);
}

.product-dialog__img {
  min-height: 100%;
  background: #eef3f9;
}

.product-dialog__body {
  padding: 38px 34px 30px;
}

.product-dialog__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.product-dialog__title {
  margin-top: 16px;
  color: #10233a;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.4;
}

.product-dialog__code {
  margin-top: 6px;
  color: #9aa6b2;
  font-size: 11px;
  letter-spacing: 0.18em;
}

.product-spec {
  display: grid;
  padding: 0;
  margin: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 20px;
}

.product-spec div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.product-spec dt {
  color: #8b98a6;
  font-size: 12px;
}

.product-spec dd {
  margin: 0;
  color: #10233a;
  font-size: 14px;
  font-weight: 500;
}

.product-dialog__subtitle {
  margin-top: 22px;
  color: #10233a;
  font-size: 15px;
  font-weight: 600;
}

.product-dialog__text {
  margin-top: 8px;
  color: #5b6472;
  font-size: 13.5px;
  line-height: 1.95;
}

.product-dialog__actions {
  display: flex;
  margin-top: 28px;
  gap: 8px;
}

@media (max-width: 700px) {
  .section {
    padding: 34px 0 56px;
  }

  .filters {
    padding: 16px;
  }

  .filter-row {
    flex-direction: column;
    gap: 6px;
  }

  .filter-label {
    width: auto;
    padding-top: 0;
  }

  .result-meta {
    flex-direction: column;
    gap: 4px;
  }

  .product-dialog__body {
    padding: 26px 20px 24px;
  }

  .product-dialog__title {
    font-size: 22px;
  }
}
</style>

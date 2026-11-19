<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { siteConfig } from '~/config/site'

const { mdAndUp } = useDisplay()
const abs = useAbsoluteUrl()

const carouselHeight = computed(() => (mdAndUp.value ? 560 : 500))
const newsCategories = computed(() => siteConfig.pages.news.categories)
const milestones = computed(() => siteConfig.pages.about.milestones)
const jobTypes = computed(() => siteConfig.pages.jobs.items.map((item) => item.type).filter((v, i, a) => a.indexOf(v) === i))

const articlesOf = (category: string) =>
  siteConfig.news.filter((article) => article.category === category).slice(0, 3)

const jobsOf = (type: string) => siteConfig.pages.jobs.items.filter((item) => item.type === type)

useSeoMeta({
  title: `${siteConfig.brand.name} 制药｜${siteConfig.brand.tagline}`,
  description: siteConfig.brand.description,
  ogTitle: `${siteConfig.brand.name} 制药｜${siteConfig.brand.tagline}`,
  ogDescription: siteConfig.brand.description,
})
</script>

<template>
  <div class="home">
    <!-- 轮播 Banner -->
    <section class="hero" aria-label="首页轮播">
      <v-carousel
        :height="carouselHeight"
        cycle
        :interval="6500"
        hide-delimiters
        show-arrows="hover"
        class="hero__carousel"
      >
        <v-carousel-item
          v-for="slide in siteConfig.banners"
          :key="slide.src"
          :src="slide.src"
          :alt="slide.alt"
          cover
        />
      </v-carousel>

      <div class="hero__overlay" aria-hidden="true" />

      <v-container class="hero__content">
        <p class="hero__script font-en">{{ siteConfig.hero.script }}</p>
        <h1 class="hero__title">
          <span v-for="line in siteConfig.hero.heading" :key="line">{{ line }}</span>
        </h1>
        <p class="hero__side">{{ siteConfig.hero.side }}</p>
        <div class="hero__actions">
          <v-btn color="primary" size="large" to="/products" append-icon="mdi-arrow-right">
            了解产品
          </v-btn>
          <v-btn variant="outlined" color="white" size="large" to="/about">关于我们</v-btn>
        </div>
      </v-container>
    </section>

    <!-- 新闻动态 -->
    <section class="section section--news">
      <v-container>
        <SectionHead
          en="News"
          zh="新闻动态"
          desc="了解 XXX 的研发进展、合作动态，以及医药行业的政策法规变化。"
          to="/news"
        />

        <v-row>
          <v-col v-for="category in newsCategories" :key="category" cols="12" md="6">
            <div class="news-panel">
              <div class="news-panel__head">
                <div>
                  <p class="news-panel__en font-en">{{ category === '企业动态' ? 'Company' : 'Policy' }}</p>
                  <h3 class="news-panel__title">{{ category }}</h3>
                </div>
                <v-btn
                  variant="text"
                  size="small"
                  color="primary"
                  :to="{ path: '/news', query: { category } }"
                  append-icon="mdi-arrow-right"
                >
                  MORE
                </v-btn>
              </div>

              <v-list class="news-panel__list" lines="three" density="comfortable">
                <v-list-item
                  v-for="article in articlesOf(category)"
                  :key="article.id ?? article.title"
                  :to="`/news/${article.id}`"
                  class="news-panel__item"
                >
                  <span class="news-panel__date font-en">{{ article.date }}</span>
                  <div class="news-panel__body">
                    <p class="news-panel__name">{{ article.title }}</p>
                    <p class="news-panel__excerpt">{{ article.excerpt }}</p>
                  </div>
                  <template #append>
                    <v-icon icon="mdi-chevron-right" size="18" opacity="0.35" />
                  </template>
                </v-list-item>
              </v-list>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 发展历程 -->
    <section class="section section--history">
      <v-container>
        <SectionHead
          en="Development History"
          zh="发展历程"
          desc="二十余年，从技术服务到原料药与制剂一体化，我们始终围绕临床需求做长期投入。"
          to="/about"
          link-text="ABOUT"
        />

        <div class="timeline">
          <div v-for="(milestone, index) in milestones" :key="milestone.period" class="timeline__item">
            <div class="timeline__rail" aria-hidden="true">
              <span class="timeline__dot">{{ index + 1 }}</span>
            </div>
            <v-card class="timeline__card">
              <p class="timeline__period font-en">{{ milestone.period }}</p>
              <h3 class="timeline__title">{{ milestone.title }}</h3>
              <p class="timeline__text">{{ milestone.text }}</p>
            </v-card>
          </div>
        </div>
      </v-container>
    </section>

    <!-- 产品中心 -->
    <section class="section section--products">
      <v-container>
        <SectionHead
          en="Products"
          zh="产品中心"
          desc="覆盖呼吸、心血管、神经、肌肉-骨骼、血液和造血器官、消化道和代谢等多个治疗领域。"
          to="/products"
        />

        <v-row>
          <v-col
            v-for="product in siteConfig.products.slice(0, 4)"
            :key="product.code"
            cols="12"
            sm="6"
            lg="3"
          >
            <v-card
              class="product-card"
              :to="{ path: '/products', query: { group: product.group } }"
            >
              <v-img
                :src="product.image"
                :alt="product.name"
                :aspect-ratio="4 / 3"
                cover
                eager
                class="product-card__img"
              >
                <template #placeholder>
                  <div class="product-card__placeholder" />
                </template>
              </v-img>
              <div class="product-card__body">
                <div class="product-card__tags">
                  <v-chip size="x-small" color="primary" variant="tonal">{{ product.category }}</v-chip>
                  <v-chip v-if="product.group" size="x-small" variant="outlined">{{ product.group }}</v-chip>
                </div>
                <h3 class="product-card__name">{{ product.name }}</h3>
                <p class="product-card__desc">{{ product.description }}</p>
                <span class="product-card__more font-en">
                  查看详情
                  <v-icon icon="mdi-arrow-right" size="15" />
                </span>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 加入我们 -->
    <section class="section section--jobs">
      <v-container>
        <SectionHead
          en="Join Us"
          zh="加入我们"
          desc="我们正在寻找对医药行业抱有长期热情的人。"
          to="/jobs"
        />

        <v-row>
          <v-col v-for="type in jobTypes" :key="type" cols="12" md="6">
            <v-card
              class="job-card"
              :to="{ path: '/jobs', query: { type } }"
            >
              <v-img
                :src="type === '社会招聘' ? '/images/job-social.svg' : '/images/job-campus.svg'"
                :alt="type"
                height="180"
                cover
                eager
              />
              <div class="job-card__body">
                <p class="job-card__en font-en">CAREERS</p>
                <h3 class="job-card__title">{{ type }}</h3>
                <p class="job-card__text">期待您的加入</p>
                <p class="job-card__meta">
                  {{ jobsOf(type).length }} 个在招岗位
                  <span>·</span>
                  上海 / 浙江台州
                </p>
                <span class="job-card__more">
                  查看岗位
                  <v-icon icon="mdi-arrow-right" size="16" />
                </span>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<style scoped>
.section {
  padding: 88px 0;
}

.section--news {
  background: #fff;
}

.section--history {
  background: #f5f7fa;
}

.section--products {
  background: #fff;
}

.section--jobs {
  background: linear-gradient(180deg, #f5f7fa 0%, #eef3f9 100%);
}

/* hero ------------------------------------------------------------------ */
.hero {
  position: relative;
  overflow: hidden;
  background: #0b2c56;
}

.hero__carousel {
  position: relative;
  z-index: 0;
  color: #fff;
}

.hero__overlay {
  position: absolute;
  z-index: 1;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(6, 22, 43, 0.88) 0%,
    rgba(7, 28, 53, 0.68) 44%,
    rgba(7, 28, 53, 0.12) 100%
  );
  pointer-events: none;
}

.hero__content {
  position: absolute;
  z-index: 2;
  inset: 0;
  display: flex;
  height: 100%;
  padding-top: 72px;
  flex-direction: column;
  justify-content: center;
  pointer-events: none;
}

.hero__content :deep(.v-btn) {
  pointer-events: auto;
}

.hero__script {
  color: #bbdefb;
  font-size: 15px;
  letter-spacing: 0.24em;
}

.hero__title {
  display: flex;
  margin-top: 14px;
  flex-direction: column;
  color: #fff;
  font-size: clamp(38px, 5vw, 62px);
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.24;
}

.hero__side {
  max-width: 560px;
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  line-height: 1.9;
}

.hero__actions {
  display: flex;
  margin-top: 30px;
  flex-wrap: wrap;
  gap: 12px;
}

/* news ------------------------------------------------------------------ */
.news-panel {
  height: 100%;
  padding: 26px 28px;
  border: 1px solid rgba(16, 35, 58, 0.08);
  border-radius: 18px;
  background: #fff;
  transition: box-shadow 0.3s var(--ease), transform 0.3s var(--ease);
}

.news-panel:hover {
  box-shadow: 0 18px 44px rgba(13, 71, 161, 0.1);
}

.news-panel__head {
  display: flex;
  padding-bottom: 14px;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid rgba(16, 35, 58, 0.09);
}

.news-panel__en {
  color: #1976d2;
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.news-panel__title {
  margin-top: 4px;
  color: #10233a;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.news-panel__list {
  padding: 0;
  background: transparent;
}

.news-panel__item {
  padding: 18px 0;
  border-bottom: 1px dashed rgba(16, 35, 58, 0.1);
}

.news-panel__item:last-child {
  border-bottom: 0;
}

.news-panel__item :deep(.v-list-item__content) {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.news-panel__date {
  width: 78px;
  flex-shrink: 0;
  padding-top: 3px;
  color: #1976d2;
  font-size: 12px;
  letter-spacing: 0.02em;
}

.news-panel__name {
  overflow: hidden;
  color: #10233a;
  font-size: 15.5px;
  font-weight: 500;
  line-height: 1.65;
  text-overflow: ellipsis;
  transition: color 0.2s var(--ease);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.news-panel__item:hover .news-panel__name {
  color: #1976d2;
}

.news-panel__excerpt {
  display: -webkit-box;
  margin-top: 6px;
  overflow: hidden;
  color: #7b8794;
  font-size: 13px;
  line-height: 1.75;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* timeline --------------------------------------------------------------- */
.timeline {
  position: relative;
  display: grid;
  padding-top: 8px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 26px;
}

.timeline__item {
  position: relative;
  padding-top: 54px;
}

.timeline__rail {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  height: 38px;
  align-items: flex-start;
}

.timeline__rail::before {
  width: 100%;
  height: 2px;
  margin-top: 18px;
  background: linear-gradient(90deg, #bbdefb, #1976d2);
  content: '';
}

.timeline__item:last-child .timeline__rail::before {
  background: linear-gradient(90deg, #1976d2, #bbdefb);
  opacity: 0.4;
}

.timeline__dot {
  position: absolute;
  top: 2px;
  left: 0;
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #1976d2;
  color: #fff;
  font-family: var(--font-en);
  font-size: 12px;
  box-shadow: 0 0 0 1px rgba(25, 118, 210, 0.35);
}

.timeline__card {
  height: 100%;
  padding: 24px 24px 26px;
  background: #fff;
  border: 1px solid rgba(16, 35, 58, 0.07);
}

.timeline__period {
  color: #1976d2;
  font-size: 13px;
  letter-spacing: 0.14em;
}

.timeline__title {
  margin-top: 8px;
  color: #10233a;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.03em;
  line-height: 1.5;
}

.timeline__text {
  margin-top: 10px;
  color: #5b6472;
  font-size: 13.5px;
  line-height: 1.9;
}

/* products --------------------------------------------------------------- */
.product-card {
  height: 100%;
  overflow: hidden;
  border: 1px solid rgba(16, 35, 58, 0.08);
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(13, 71, 161, 0.12);
}

.product-card__img {
  background: #eef3f9;
}

.product-card__placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, #e3f2fd, #f5f7fa);
}

.product-card__body {
  padding: 18px 20px 20px;
}

.product-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.product-card__name {
  margin-top: 12px;
  color: #10233a;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
}

.product-card__desc {
  display: -webkit-box;
  margin-top: 8px;
  overflow: hidden;
  color: #7b8794;
  font-size: 13px;
  line-height: 1.8;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-card__more {
  display: inline-flex;
  margin-top: 16px;
  align-items: center;
  gap: 4px;
  color: #1976d2;
  font-size: 11.5px;
  letter-spacing: 0.12em;
}

/* jobs ------------------------------------------------------------------- */
.job-card {
  display: flex;
  overflow: hidden;
  flex-direction: row;
  border: 1px solid rgba(16, 35, 58, 0.08);
  background: #fff;
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}

.job-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(13, 71, 161, 0.12);
}

.job-card :deep(.v-img) {
  width: 44%;
  flex-shrink: 0;
}

.job-card__body {
  padding: 26px 28px;
}

.job-card__en {
  color: #1976d2;
  font-size: 11px;
  letter-spacing: 0.24em;
}

.job-card__title {
  margin-top: 6px;
  color: #10233a;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.job-card__text {
  margin-top: 6px;
  color: #5b6472;
  font-size: 14px;
}

.job-card__meta {
  margin-top: 14px;
  color: #7b8794;
  font-size: 12.5px;
}

.job-card__meta span {
  margin: 0 6px;
  opacity: 0.5;
}

.job-card__more {
  display: inline-flex;
  margin-top: 22px;
  align-items: center;
  gap: 4px;
  color: #1976d2;
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 959px) {
  .section {
    padding: 60px 0;
  }

  .timeline {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .timeline__item {
    padding-top: 0;
    padding-left: 46px;
  }

  .timeline__rail {
    top: 0;
    bottom: 0;
    width: 34px;
    height: auto;
  }

  .timeline__rail::before {
    width: 2px;
    height: 100%;
    margin: 0 auto;
    background: linear-gradient(180deg, #1976d2, #bbdefb);
  }

  .timeline__dot {
    top: 0;
    left: 0;
  }

  .job-card {
    flex-direction: column;
  }

  .job-card :deep(.v-img) {
    width: 100%;
  }
}

@media (max-width: 700px) {
  .hero__content {
    padding-top: 40px;
  }

  .hero__script {
    font-size: 13px;
  }

  .hero__side {
    font-size: 13.5px;
  }

  .news-panel {
    padding: 20px 18px;
  }

  .news-panel__item :deep(.v-list-item__content) {
    gap: 10px;
  }

  .news-panel__date {
    width: 66px;
    font-size: 11px;
  }

  .timeline__card {
    padding: 20px 18px;
  }

  .job-card__body {
    padding: 20px;
  }

  .job-card__title {
    font-size: 22px;
  }
}
</style>

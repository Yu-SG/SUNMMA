<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { siteConfig } from '~/config/site'

const { mdAndUp } = useDisplay()

const carouselHeight = computed(() => (mdAndUp.value ? 560 : 500))
const about = siteConfig.pages.about
const milestones = computed(() => about.milestones)
const facts = computed(() => siteConfig.company)
const stats = computed(() => siteConfig.stats)
const pillars = computed(() => siteConfig.pillars)
const partners = computed(() => siteConfig.partners)

useSeoMeta({
  title: `${siteConfig.brand.name}｜${siteConfig.brand.tagline}`,
  description: siteConfig.brand.description,
  ogTitle: `${siteConfig.brand.name}｜${siteConfig.brand.tagline}`,
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

    <!-- 公司简介 -->
    <section class="section section--about">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6" lg="6">
            <div class="about-art">
              <v-img
                src="/images/about/park.jpg"
                alt="天府生命科技园"
                cover
                eager
                class="about-art__img"
              />
              <div class="about-art__badge">
                <span class="about-art__since font-en">SINCE 2016</span>
                <span class="about-art__label">成都高新区 · 天府生命科技园</span>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="6" lg="6">
            <p class="eyebrow font-en">ABOUT SUMAZ</p>
            <h2 class="section-title">药品上市许可持有人</h2>
            <div class="copy">
              <p v-for="(text, index) in about.intro" :key="index">{{ text }}</p>
            </div>

            <div class="facts">
              <div v-for="fact in facts" :key="fact.label" class="fact">
                <span class="fact__label">{{ fact.label }}</span>
                <span class="fact__value">{{ fact.value }}</span>
              </div>
            </div>

            <v-btn variant="text" color="primary" to="/about" append-icon="mdi-arrow-right" class="px-0 mt-2">
              了解舒美奇
            </v-btn>
          </v-col>
        </v-row>

        <v-row class="stats">
          <v-col v-for="stat in stats" :key="stat.label" cols="6" md="3">
            <v-card class="stat-card">
              <p class="stat-card__value font-en">{{ stat.value }}</p>
              <p class="stat-card__label">{{ stat.label }}</p>
              <p class="stat-card__en font-en">{{ stat.labelEn }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 产品中心 -->
    <section class="section section--products">
      <v-container>
        <SectionHead
          en="Products"
          zh="产品中心"
          desc="12 个已上市品种、8 个申报或在研品种、3 个在研新药，覆盖抗感染、心血管、神经系统、麻醉与围术期、营养与代谢、呼吸系统等治疗领域。"
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

    <!-- 质量管理 -->
    <section class="section section--quality">
      <v-container>
        <SectionHead
          en="Quality Management"
          zh="质量管理体系"
          desc="按 14 个章节建立质量管理体系，覆盖药品研制、生产经营、上市后研究与不良反应监测全生命周期。"
          to="/quality"
          link-text="QUALITY"
        />

        <v-row>
          <v-col v-for="pillar in pillars" :key="pillar.index" cols="12" sm="6" lg="3">
            <v-card class="quality-card">
              <span class="quality-card__index font-en">#{{ pillar.index }}</span>
              <h3 class="quality-card__title">{{ pillar.title }}</h3>
              <p class="quality-card__text">{{ pillar.description }}</p>
            </v-card>
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
          desc="从 2016 年成立到 12 个品种上市，我们把每一步都落在批件与放行记录上。"
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

    <!-- 对外合作 -->
    <section class="section section--partners">
      <v-container>
        <SectionHead
          en="Partnership"
          zh="对外合作"
          desc="能用众力，则无敌于天下；能用众智，则无畏于圣人。唯有合作，才能创造价值。"
        />

        <v-row>
          <v-col cols="12" lg="5">
            <div class="partner-copy">
              <p>
                公司开发项目主要依托自有技术团队，同时加强与研发单位的制剂开发合作，发展复杂制剂，包括注射乳剂、凝胶剂、眼用制剂等。
              </p>
              <p>
                对外合作开发创新药，目前布局产品包括抗骨质疏松、镇痛方向的化学药品与中药新药，合作科研院所包括北京协和、上海复旦等。药品持有人委托生产方面，合作剂型覆盖冻干针剂、粉针剂、乳剂、水针剂、胶囊剂、散剂、颗粒剂、凝胶剂、口服液等。
              </p>
            </div>
          </v-col>

          <v-col cols="12" lg="7">
            <div class="partner-cloud">
              <span v-for="name in partners" :key="name" class="partner-chip">{{ name }}</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 联系我们 -->
    <section class="section section--cta">
      <v-container>
        <v-sheet class="cta" rounded="xl">
          <div class="cta__text">
            <p class="cta__en font-en">WORK WITH US</p>
            <h2 class="cta__title">产品合作、委托生产、研发合作，都欢迎聊一聊。</h2>
            <p class="cta__desc">
              舒美奇成都生物科技有限公司 · 成都高新区天府生命科技园
            </p>
          </div>
          <div class="cta__actions">
            <v-btn color="white" size="large" to="/contact" append-icon="mdi-arrow-right">联系我们</v-btn>
            <v-btn variant="outlined" color="white" size="large" to="/quality">质量管理</v-btn>
          </div>
        </v-sheet>
      </v-container>
    </section>
  </div>
</template>

<style scoped>
.section {
  padding: 88px 0;
}

.section--about {
  background: #fff;
}

.section--products {
  background: #f5f7fa;
}

.section--quality {
  background: #fff;
}

.section--history {
  background: #f5f7fa;
}

.section--partners {
  background: #fff;
}

.section--cta {
  padding: 20px 0 88px;
  background: #fff;
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
    rgba(6, 22, 43, 0.9) 0%,
    rgba(7, 28, 53, 0.7) 44%,
    rgba(7, 28, 53, 0.16) 100%
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
  font-size: 14px;
  letter-spacing: 0.24em;
}

.hero__title {
  display: flex;
  margin-top: 14px;
  flex-direction: column;
  color: #fff;
  font-size: clamp(36px, 4.6vw, 58px);
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.26;
}

.hero__side {
  max-width: 620px;
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

/* about ----------------------------------------------------------------- */
.eyebrow {
  color: #1976d2;
  font-size: 11.5px;
  letter-spacing: 0.28em;
}

.section-title {
  margin-top: 8px;
  color: #10233a;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.copy {
  margin-top: 18px;
  color: #5b6472;
  font-size: 14.5px;
  line-height: 2;
}

.copy p + p {
  margin-top: 12px;
}

.about-art {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
}

.about-art__img {
  height: 460px;
  border-radius: 20px;
}

.about-art__badge {
  position: absolute;
  right: 18px;
  bottom: 18px;
  display: flex;
  padding: 14px 18px;
  flex-direction: column;
  gap: 4px;
  border-radius: 14px;
  background: rgba(6, 22, 43, 0.78);
}

.about-art__since {
  color: #bbdefb;
  font-size: 11px;
  letter-spacing: 0.2em;
}

.about-art__label {
  color: #fff;
  font-size: 13px;
}

.facts {
  display: grid;
  margin-top: 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 20px;
}

.fact {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.fact__label {
  color: #9aa6b2;
  font-size: 12px;
}

.fact__value {
  color: #10233a;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.6;
}

.stats {
  margin-top: 44px;
}

.stat-card {
  height: 100%;
  padding: 22px 20px;
  border: 1px solid rgba(16, 35, 58, 0.08);
  background: #f8fbfe;
  text-align: center;
}

.stat-card__value {
  color: #1976d2;
  font-size: 34px;
  font-weight: 700;
  line-height: 1.1;
}

.stat-card__label {
  margin-top: 8px;
  color: #33414b;
  font-size: 13.5px;
}

.stat-card__en {
  margin-top: 4px;
  color: #9aa6b2;
  font-size: 9.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

/* products -------------------------------------------------------------- */
.product-card {
  height: 100%;
  overflow: hidden;
  border: 1px solid rgba(16, 35, 58, 0.08);
  background: #fff;
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(13, 71, 161, 0.12);
}

.product-card__img {
  background: #fff;
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

/* quality --------------------------------------------------------------- */
.quality-card {
  height: 100%;
  padding: 26px 24px;
  border: 1px solid rgba(16, 35, 58, 0.08);
  background: #f8fbfe;
}

.quality-card__index {
  color: #1976d2;
  font-size: 11px;
  letter-spacing: 0.18em;
}

.quality-card__title {
  margin-top: 10px;
  color: #10233a;
  font-size: 17px;
  font-weight: 600;
}

.quality-card__text {
  margin-top: 10px;
  color: #6b7c8f;
  font-size: 13.5px;
  line-height: 1.9;
}

/* timeline -------------------------------------------------------------- */
.timeline {
  position: relative;
  display: grid;
  padding-top: 8px;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 18px;
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
  padding: 22px 22px 24px;
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
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.03em;
  line-height: 1.5;
}

.timeline__text {
  margin-top: 10px;
  color: #5b6472;
  font-size: 13px;
  line-height: 1.85;
}

/* partners -------------------------------------------------------------- */
.partner-copy {
  color: #5b6472;
  font-size: 14.5px;
  line-height: 2;
}

.partner-copy p + p {
  margin-top: 14px;
}

.partner-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.partner-chip {
  padding: 9px 16px;
  border: 1px solid rgba(16, 35, 58, 0.1);
  border-radius: 999px;
  background: #f8fbfe;
  color: #33414b;
  font-size: 13px;
  letter-spacing: 0.02em;
}

/* cta ------------------------------------------------------------------- */
.cta {
  display: flex;
  padding: 46px 48px;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  background: linear-gradient(120deg, #0d47a1, #1976d2);
}

.cta__en {
  color: rgba(255, 255, 255, 0.62);
  font-size: 11px;
  letter-spacing: 0.24em;
}

.cta__title {
  margin-top: 10px;
  color: #fff;
  font-size: 27px;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.5;
}

.cta__desc {
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 14px;
}

.cta__actions {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 10px;
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

  .about-art__img {
    height: 320px;
  }

  .cta {
    flex-direction: column;
    align-items: flex-start;
    padding: 30px 24px;
  }
}

@media (max-width: 700px) {
  .hero__content {
    padding-top: 40px;
  }

  .hero__script {
    font-size: 12px;
  }

  .hero__side {
    font-size: 13.5px;
  }

  .section-title {
    font-size: 26px;
  }

  .facts {
    grid-template-columns: 1fr;
  }

  .stats {
    margin-top: 30px;
  }
}
</style>

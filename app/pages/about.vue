<script setup lang="ts">
import { computed } from 'vue'
import { siteConfig } from '~/config/site'

const page = siteConfig.pages.about
const who = computed(() => page.sections[0])
const rnd = computed(() => page.sections[1])
const culture = computed(() => page.sections[2])
const milestones = computed(() => page.milestones)

useSeoMeta({
  title: `关于我们｜${siteConfig.brand.name}`,
  description: page.intro[0] || siteConfig.brand.description,
  ogTitle: `关于我们｜${siteConfig.brand.name}`,
  ogDescription: page.intro[0] || siteConfig.brand.description,
})
</script>

<template>
  <div class="about">
    <SitePageHead
      :title="page.title"
      :subtitle="page.subtitle"
      :intro="page.intro"
    />

    <!-- 公司简介 -->
    <section class="section section--intro">
      <v-container>
        <v-row align="center">
          <v-col cols="12" lg="7" md="7">
            <p class="eyebrow font-en">ABOUT SUMAZ</p>
            <h2 class="section-title">公司简介</h2>
            <div class="copy">
              <p v-for="(text, index) in page.intro" :key="index">{{ text }}</p>
              <p v-for="(text, index) in who?.paragraphs ?? []" :key="`who-${index}`">{{ text }}</p>
            </div>
            <div class="company-facts">
              <div v-for="fact in siteConfig.company" :key="fact.label" class="company-fact">
                <span class="company-fact__label">{{ fact.label }}</span>
                <span class="company-fact__value">{{ fact.value }}</span>
              </div>
            </div>
          </v-col>

          <v-col cols="12" lg="5" md="5">
            <div class="intro-art">
              <v-img src="/images/about/park.jpg" alt="天府生命科技园" cover eager class="intro-art__img" />
              <div class="intro-art__badge">
                <span class="intro-art__num font-en">2016</span>
                <span class="intro-art__label">年成立于成都高新区</span>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row class="stats">
          <v-col v-for="stat in siteConfig.stats" :key="stat.label" cols="6" md="3">
            <v-card class="stat-card">
              <p class="stat-card__value font-en">{{ stat.value }}</p>
              <p class="stat-card__label">{{ stat.label }}</p>
              <p class="stat-card__en font-en">{{ stat.labelEn }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 研发与质量 -->
    <section class="section section--capabilities">
      <v-container>
        <SectionHead
          en="R&D and Quality"
          :zh="rnd?.title ?? '研发与质量'"
          desc="专长于注射剂、口服液和口服固体制剂，同时发展注射乳剂、凝胶剂、眼用制剂等复杂制剂。"
        />

        <div class="copy copy--narrow">
          <p v-for="(text, index) in rnd?.paragraphs ?? []" :key="index">{{ text }}</p>
        </div>

        <v-row class="capability-grid">
          <v-col v-for="item in siteConfig.capabilities" :key="item.index" cols="12" md="4">
            <v-card class="capability-card">
              <div class="capability-card__head">
                <v-icon :icon="item.icon" size="30" color="primary" />
                <span class="capability-card__index font-en">{{ item.index }}</span>
              </div>
              <h3 class="capability-card__title">{{ item.title }}</h3>
              <p class="capability-card__en font-en">{{ item.titleEn }}</p>
              <p class="capability-card__text">{{ item.description }}</p>
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
        />

        <v-timeline side="end" density="comfortable" truncate-line="both" class="history-timeline">
          <v-timeline-item
            v-for="milestone in milestones"
            :key="milestone.period"
            dot-color="primary"
            size="small"
            fill-dot
          >
            <template #opposite>
              <span class="history-timeline__period font-en">{{ milestone.period }}</span>
            </template>
            <v-card class="history-timeline__card">
              <span class="history-timeline__period history-timeline__period--inline font-en">
                {{ milestone.period }}
              </span>
              <h3 class="history-timeline__title">{{ milestone.title }}</h3>
              <p class="history-timeline__text">{{ milestone.text }}</p>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-container>
    </section>

    <!-- 企业文化 -->
    <section class="section section--values">
      <v-container>
        <SectionHead
          en="Partnership"
          :zh="culture?.title ?? '委托生产与对外合作'"
          desc="合作的剂型覆盖冻干针剂、粉针剂、乳剂、水针剂、胶囊剂、口服溶液剂等，两级放行责任清晰。"
        />

        <div class="copy copy--narrow">
          <p v-for="(text, index) in culture?.paragraphs ?? []" :key="index">{{ text }}</p>
        </div>

        <v-sheet class="quote" rounded="xl">
          <p class="quote__text">{{ siteConfig.message.title.join('') }}</p>
          <p class="quote__sub">舒美奇 · 合作理念</p>
        </v-sheet>
      </v-container>
    </section>

    <!-- 联系我们（与关于我们同页） -->
    <SiteContactSection />
  </div>
</template>

<style scoped>
.section {
  padding: 84px 0;
}

.section--intro {
  background: #fff;
}

.section--capabilities {
  background: #f5f7fa;
}

.section--history {
  background: #fff;
}

.section--values {
  background: #f5f7fa;
}

.eyebrow {
  color: #1976d2;
  font-size: 12px;
  letter-spacing: 0.28em;
}

.section-title {
  margin-top: 8px;
  color: #10233a;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.copy {
  margin-top: 22px;
  color: #5b6472;
  font-size: 15px;
  line-height: 2;
}

.copy p + p {
  margin-top: 14px;
}

.copy--narrow {
  max-width: 840px;
}

.company-facts {
  display: grid;
  margin-top: 30px;
  padding-top: 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 32px;
  border-top: 1px solid rgba(16, 35, 58, 0.09);
}

.company-fact {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.company-fact__label {
  min-width: 64px;
  color: #7b8794;
  font-size: 13px;
}

.company-fact__value {
  color: #10233a;
  font-size: 14.5px;
  font-weight: 500;
}

.intro-art {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  box-shadow: 0 16px 36px rgba(13, 71, 161, 0.1);
}

.intro-art__img {
  height: 420px;
}

.intro-art__badge {
  position: absolute;
  right: 20px;
  bottom: 20px;
  display: flex;
  padding: 14px 18px;
  flex-direction: column;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 10px 26px rgba(13, 71, 161, 0.18);
}

.intro-art__num {
  color: #1976d2;
  font-size: 26px;
  font-weight: 600;
  line-height: 1;
}

.intro-art__label {
  margin-top: 6px;
  color: #5b6472;
  font-size: 12px;
}

.stats {
  margin-top: 26px;
}

.stat-card {
  height: 100%;
  padding: 20px 20px 18px;
  border: 1px solid rgba(16, 35, 58, 0.08);
  text-align: center;
}

.stat-card__value {
  color: #1976d2;
  font-size: 34px;
  font-weight: 600;
  line-height: 1.1;
}

.stat-card__label {
  margin-top: 8px;
  color: #10233a;
  font-size: 13px;
}

.stat-card__en {
  margin-top: 4px;
  color: #8b98a6;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.capability-grid {
  margin-top: 34px;
}

.capability-card {
  height: 100%;
  padding: 26px 24px;
  border: 1px solid rgba(16, 35, 58, 0.08);
  background: #fff;
}

.capability-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.capability-card__index {
  color: rgba(25, 118, 210, 0.32);
  font-size: 24px;
}

.capability-card__title {
  margin-top: 16px;
  color: #10233a;
  font-size: 19px;
  font-weight: 600;
}

.capability-card__en {
  margin-top: 4px;
  color: #8b98a6;
  font-size: 10.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.capability-card__text {
  margin-top: 14px;
  color: #5b6472;
  font-size: 13.5px;
  line-height: 1.9;
}

.history-timeline {
  max-width: 1000px;
  margin: 10px auto 0;
}

.history-timeline__period {
  color: #1976d2;
  font-size: 14px;
  letter-spacing: 0.08em;
}

.history-timeline__period--inline {
  display: none;
}

.history-timeline__card {
  padding: 22px 24px;
  border: 1px solid rgba(16, 35, 58, 0.08);
}

.history-timeline__title {
  color: #10233a;
  font-size: 19px;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.history-timeline__text {
  margin-top: 10px;
  color: #5b6472;
  font-size: 14px;
  line-height: 1.95;
}

.quote {
  margin-top: 20px;
  padding: 34px 36px;
  border: 1px solid rgba(16, 35, 58, 0.08);
  background: linear-gradient(120deg, #eef5fd, #f8fbfe);
}

.quote__text {
  color: #0d47a1;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.06em;
  line-height: 1.9;
}

.quote__sub {
  margin-top: 12px;
  color: #7b8794;
  font-size: 13px;
  letter-spacing: 0.08em;
}

@media (max-width: 960px) {
  .section {
    padding: 56px 0;
  }

  .section-title {
    font-size: 26px;
  }

  .intro-art__img {
    height: 300px;
  }

  .history-timeline__period {
    display: none;
  }

  .history-timeline__period--inline {
    display: block;
    margin-bottom: 6px;
    font-size: 12.5px;
  }
}

@media (max-width: 600px) {
  .company-facts {
    grid-template-columns: 1fr;
  }

  .stat-card__value {
    font-size: 26px;
  }
}
</style>

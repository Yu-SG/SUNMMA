<script setup lang="ts">
import { siteConfig } from '~/config/site'

const brand = siteConfig.brand
const pillars = siteConfig.pillars

const chapters = [
  { no: '01', name: '总则' },
  { no: '02', name: '质量管理' },
  { no: '03', name: '机构与人员' },
  { no: '04', name: '设备' },
  { no: '05', name: '物料与产品' },
  { no: '06', name: '确认与验证' },
  { no: '07', name: '文件管理' },
  { no: '08', name: '生产管理' },
  { no: '09', name: '质量控制与质量保证' },
  { no: '10', name: '委托生产与委托检验' },
  { no: '11', name: '产品发运与召回' },
  { no: '12', name: '自检' },
  { no: '13', name: '药物警戒' },
  { no: '14', name: '其它文件' },
]

const lifecycle = [
  { title: '药品研制', text: '从处方工艺研究到注册申报，质量要求前置到研发阶段。' },
  { title: '药品生产经营', text: '覆盖物料与产品、生产管理、质量控制与质量保证、产品发运与召回。' },
  { title: '上市后研究', text: '持续开展上市后研究与质量改进，验证产品在真实使用中的表现。' },
  { title: '不良反应监测及报告', text: '按药物警戒要求收集、评估与报告不良反应，纳入风险管理。' },
]

const documents = [
  { level: '第一层', title: '质量手册', text: '规定质量管理体系的总体要求与组织职责。' },
  { level: '第二层', title: '管理类 SMP · 质量标准 · 工艺规程', text: '规定各项管理活动的流程、标准与工艺控制要求。' },
  { level: '第三层', title: '操作类 SOP · 记录', text: '规定具体岗位的操作方法与记录要求，保证过程可追溯。' },
]

const qualityPolicy = {
  en: 'We are committed to provide high-quality products, continuously improve the effectiveness of our quality management system, and comply with all relevant regulatory requirements.',
  zh: '我们承诺提供高质量的产品，持续改进质量管理体系的有效性，并遵守所有相关法规要求。持续改进质量是我们的责任。',
}

useSeoMeta({
  title: `质量管理｜${brand.name}`,
  description: `${brand.name}按 14 个章节建立质量管理体系，覆盖药品研制、生产经营、上市后研究与不良反应监测全生命周期。`,
  ogTitle: `质量管理｜${brand.name}`,
  ogDescription: '质量方针、体系文件架构、机构与人员、受托生产与上市放行责任。',
})
</script>

<template>
  <div class="quality-page">
    <SitePageHead
      title="质量管理"
      subtitle="14 章体系文件 · 全生命周期管理"
      :intro="[
        '舒美奇为药品上市许可持有人，履行药品上市放行责任，对其取得药品注册证书的药品质量负责。',
        '公司按 14 个章节建立质量管理体系，涵盖药品研制、药品生产经营、上市后研究、不良反应监测及报告等全生命周期环节。',
      ]"
    />

    <!-- 质量方针 -->
    <section class="section section--policy">
      <v-container>
        <SectionHead en="Quality Policy" zh="质量方针" desc="质量方针是体系的顶层承诺，也是每一次放行决策的依据。" />

        <v-sheet class="policy" rounded="xl">
          <p class="policy__en font-en">{{ qualityPolicy.en }}</p>
          <v-divider class="my-5" />
          <p class="policy__zh">{{ qualityPolicy.zh }}</p>
          <p class="policy__sign">—— {{ brand.name }}成都生物科技有限公司</p>
        </v-sheet>
      </v-container>
    </section>

    <!-- 体系结构 -->
    <section class="section section--system">
      <v-container>
        <SectionHead en="System" zh="体系文件架构" desc="从质量手册到操作类 SOP 与记录，三级文件支撑同一套质量要求。" />

        <v-row>
          <v-col v-for="doc in documents" :key="doc.title" cols="12" md="4">
            <v-card class="doc-card">
              <p class="doc-card__level font-en">{{ doc.level }}</p>
              <h3 class="doc-card__title">{{ doc.title }}</h3>
              <p class="doc-card__text">{{ doc.text }}</p>
            </v-card>
          </v-col>
        </v-row>

        <div class="chapters">
          <p class="chapters__label font-en">14 CHAPTERS</p>
          <ul class="chapters__list">
            <li v-for="item in chapters" :key="item.no" class="chapter">
              <span class="chapter__no font-en">{{ item.no }}</span>
              <span class="chapter__name">{{ item.name }}</span>
            </li>
          </ul>
        </div>
      </v-container>
    </section>

    <!-- 全生命周期 -->
    <section class="section section--lifecycle">
      <v-container>
        <SectionHead en="Lifecycle" zh="覆盖药品全生命周期" desc="体系不止管生产，也管研发源头与上市后的每一次反馈。" />

        <v-row>
          <v-col v-for="(item, index) in lifecycle" :key="item.title" cols="12" sm="6" md="3">
            <v-card class="life-card">
              <span class="life-card__no font-en">0{{ index + 1 }}</span>
              <h3 class="life-card__title">{{ item.title }}</h3>
              <p class="life-card__text">{{ item.text }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 质量要点 -->
    <section class="section section--pillars">
      <v-container>
        <SectionHead en="Key Practices" zh="体系运行要点" desc="制度、人员与责任分工，决定体系能跑多久。" />

        <v-row>
          <v-col v-for="pillar in pillars" :key="pillar.index" cols="12" sm="6" md="3">
            <v-card class="pillar-card">
              <span class="pillar-card__index font-en">#{{ pillar.index }}</span>
              <h3 class="pillar-card__title">{{ pillar.title }}</h3>
              <p class="pillar-card__en font-en">{{ pillar.titleEn }}</p>
              <p class="pillar-card__text">{{ pillar.description }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 委托生产与放行 -->
    <section class="section section--release">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="7">
            <SectionHead en="Release" zh="受托生产与上市放行" desc="成品检验与留样由受托方完成，放行责任由持有人承担。" />
            <div class="release-copy">
              <p>
                公司合作的剂型包括冻干针剂、粉针剂、乳剂、水针剂、胶囊剂、散剂、颗粒剂、凝胶剂、口服液等；受托生产企业包括成都通德药业、四川制药、成都天台山制药、峨眉山通惠制药、宏明博思、深圳立健、沈阳双鼎、成都硕德、成都海通药业、美大康佳乐、大连美创、亚宝药业等。
              </p>
              <p>
                成品的检验、留样均由受托方完成。受托方质量受权人负责药品出厂放行，我司质量受权人负责上市放行——两级放行，责任清晰。
              </p>
            </div>
          </v-col>
          <v-col cols="12" md="5">
            <v-card class="release-card">
              <p class="release-card__label font-en">TWO-STEP RELEASE</p>
              <div class="release-step">
                <span class="release-step__no font-en">01</span>
                <div>
                  <p class="release-step__title">出厂放行</p>
                  <p class="release-step__text">受托生产企业质量受权人，依据检验结果与生产过程放行。</p>
                </div>
              </div>
              <div class="release-step">
                <span class="release-step__no font-en">02</span>
                <div>
                  <p class="release-step__title">上市放行</p>
                  <p class="release-step__text">舒美奇质量受权人，作为持有人对药品质量负责。</p>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="section section--cta">
      <v-container>
        <v-sheet class="cta" rounded="xl">
          <div>
            <p class="cta__en font-en">MAH RESPONSIBILITY</p>
            <h2 class="cta__title">质量是持有人的第一责任。</h2>
            <p class="cta__text">如需了解体系文件、受托生产或供应商合作，欢迎与我们联系。</p>
          </div>
          <v-btn color="white" size="large" to="/about#contact" append-icon="mdi-arrow-right">联系我们</v-btn>
        </v-sheet>
      </v-container>
    </section>
  </div>
</template>

<style scoped>
.section {
  padding: 78px 0;
}

.section--policy {
  background: #fff;
}

.section--system {
  background: #f5f7fa;
}

.section--lifecycle {
  background: #fff;
}

.section--pillars {
  background: #f5f7fa;
}

.section--release {
  background: #fff;
}

.section--cta {
  padding: 20px 0 84px;
  background: #fff;
}

.policy {
  padding: 40px 44px;
  border: 1px solid rgba(16, 35, 58, 0.08);
  background: linear-gradient(160deg, #f7fbff, #eef5fd);
}

.policy__en {
  color: #1976d2;
  font-size: 14px;
  line-height: 1.95;
}

.policy__zh {
  color: #10233a;
  font-size: 17px;
  font-weight: 500;
  line-height: 2;
}

.policy__sign {
  margin-top: 18px;
  color: #7b8794;
  font-size: 13px;
  text-align: right;
}

.doc-card {
  height: 100%;
  padding: 26px 24px;
  border: 1px solid rgba(16, 35, 58, 0.08);
  background: #fff;
}

.doc-card__level {
  color: #1976d2;
  font-size: 11px;
  letter-spacing: 0.2em;
}

.doc-card__title {
  margin-top: 10px;
  color: #10233a;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.6;
}

.doc-card__text {
  margin-top: 8px;
  color: #6b7c8f;
  font-size: 13.5px;
  line-height: 1.85;
}

.chapters {
  margin-top: 34px;
  padding: 26px 28px;
  border: 1px solid rgba(16, 35, 58, 0.08);
  border-radius: 18px;
  background: #fff;
}

.chapters__label {
  color: #9aa6b2;
  font-size: 10.5px;
  letter-spacing: 0.24em;
}

.chapters__list {
  display: grid;
  margin: 16px 0 0;
  padding: 0;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px 18px;
  list-style: none;
}

.chapter {
  display: flex;
  align-items: baseline;
  gap: 10px;
  color: #33414b;
  font-size: 14px;
}

.chapter__no {
  color: #1976d2;
  font-size: 11px;
  letter-spacing: 0.08em;
}

.life-card {
  height: 100%;
  padding: 26px 24px;
  border: 1px solid rgba(16, 35, 58, 0.08);
}

.life-card__no {
  color: #bbdefb;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: 0.06em;
}

.life-card__title {
  margin-top: 12px;
  color: #10233a;
  font-size: 17px;
  font-weight: 600;
}

.life-card__text {
  margin-top: 8px;
  color: #6b7c8f;
  font-size: 13.5px;
  line-height: 1.85;
}

.pillar-card {
  height: 100%;
  padding: 24px 22px;
  border: 1px solid rgba(16, 35, 58, 0.08);
}

.pillar-card__index {
  color: #1976d2;
  font-size: 11px;
  letter-spacing: 0.18em;
}

.pillar-card__title {
  margin-top: 10px;
  color: #10233a;
  font-size: 16.5px;
  font-weight: 600;
}

.pillar-card__en {
  margin-top: 4px;
  color: #9aa6b2;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.pillar-card__text {
  margin-top: 10px;
  color: #6b7c8f;
  font-size: 13px;
  line-height: 1.85;
}

.release-copy {
  margin-top: 8px;
  color: #5b6472;
  font-size: 14px;
  line-height: 2;
}

.release-copy p + p {
  margin-top: 14px;
}

.release-card {
  padding: 28px 26px;
  border: 1px solid rgba(16, 35, 58, 0.08);
  background: #f8fbfe;
}

.release-card__label {
  color: #1976d2;
  font-size: 10.5px;
  letter-spacing: 0.22em;
}

.release-step {
  display: flex;
  margin-top: 22px;
  gap: 16px;
}

.release-step__no {
  color: #bbdefb;
  font-size: 20px;
  font-weight: 600;
}

.release-step__title {
  color: #10233a;
  font-size: 16px;
  font-weight: 600;
}

.release-step__text {
  margin-top: 6px;
  color: #6b7c8f;
  font-size: 13px;
  line-height: 1.8;
}

.cta {
  display: flex;
  padding: 44px 46px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
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
  letter-spacing: 0.03em;
}

.cta__text {
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 14px;
}

@media (max-width: 959px) {
  .section {
    padding: 54px 0;
  }

  .chapters__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .policy {
    padding: 26px 22px;
  }

  .cta {
    flex-direction: column;
    align-items: flex-start;
    padding: 30px 24px;
  }
}
</style>

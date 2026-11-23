<script setup lang="ts">
import { computed } from 'vue'
import { siteConfig } from '~/config/site'

const page = siteConfig.pages.pharmacovigilance
const phone = siteConfig.site.phone || siteConfig.brand.phone
const hotline = '028-65220800-8008'
const pvEmail = siteConfig.brand.email || 'smqcdpv@126.com'
const phoneHref = computed(() => `tel:${phone.replace(/[^\d+]/g, '')}`)
const hotlineHref = `tel:${hotline.replace(/[^\d+]/g, '')}`

const steps = [
  { title: '提交报告', text: '通过表单或热线告诉我们药品名称、用药情况与不良反应表现。' },
  { title: '评估随访', text: '药物警戒团队会在 24 小时内完成初步评估，必要时与你电话核实。' },
  { title: '上报与改进', text: '按要求向监管部门报告，并将信号纳入产品风险管理和质量改进。' },
]

useSeoMeta({
  title: `药物警戒｜${siteConfig.brand.name}`,
  description: page.intro[0] || `${siteConfig.brand.name}药物警戒`,
  ogTitle: `药物警戒｜${siteConfig.brand.name}`,
  ogDescription: page.intro[0] || '',
})
</script>

<template>
  <div class="pv-page">
    <SitePageHead :title="page.title" :subtitle="page.subtitle" :intro="page.intro" />

    <section class="section">
      <v-container>
        <v-alert
          type="warning"
          variant="tonal"
          rounded="xl"
          icon="mdi-alert-outline"
          class="pv-alert"
        >
          <p class="pv-alert__title">紧急情况请先就医</p>
          <p class="pv-alert__text">
            如出现严重或危及生命的不良反应，请立即前往医院就诊。
            <template v-if="hotline">同时可拨打我们的药物警戒热线 {{ hotline }}。</template>
            <template v-else>就诊后可通过本页表单提交报告，我们会按药物警戒流程处理。</template>
            本表单不替代医疗诊断与治疗。
          </p>
        </v-alert>

        <v-row class="pv-row">
          <v-col cols="12" lg="4" md="4">
            <div class="pv-aside">
              <v-card class="hotline-card">
                <p class="hotline-card__label font-en">PHARMACOVIGILANCE HOTLINE</p>
                <h2 class="hotline-card__title">药物警戒热线</h2>
                <template v-if="hotline">
                  <a class="hotline-card__phone font-en" :href="hotlineHref">
                    {{ hotline }}
                  </a>
                  <p class="hotline-card__time">周一至周五 9:00 – 17:30</p>
                  <v-divider class="my-4" />
                </template>
                <p v-else class="hotline-card__pending">
                  热线号码与报告邮箱整理中，请通过右侧表单提交报告。
                </p>
                <p v-if="pvEmail" class="hotline-card__email">
                  报告邮箱：
                  <a :href="`mailto:${pvEmail}`">{{ pvEmail }}</a>
                </p>
                <p class="hotline-card__note">
                  你也可以直接通过右侧表单提交报告，我们会在 24 小时内响应。
                </p>
              </v-card>

              <v-card class="steps-card">
                <h3 class="steps-card__title">报告处理流程</h3>
                <ol class="steps">
                  <li v-for="(step, index) in steps" :key="step.title" class="step">
                    <span class="step__num font-en">0{{ index + 1 }}</span>
                    <div>
                      <p class="step__title">{{ step.title }}</p>
                      <p class="step__text">{{ step.text }}</p>
                    </div>
                  </li>
                </ol>
              </v-card>

              <v-card class="privacy-card">
                <h3 class="privacy-card__title">隐私与数据使用</h3>
                <p class="privacy-card__text">
                  你提供的信息仅用于药品不良反应的评估、随访与法规报告。我们会对报告人信息保密，并在法定保存期限后妥善处理。
                </p>
              </v-card>
            </div>
          </v-col>

          <v-col cols="12" lg="8" md="8">
            <v-card class="form-card">
              <div class="form-card__head">
                <p class="form-card__label font-en">ADVERSE EVENT REPORT</p>
                <h2 class="form-card__title">不良反应报告</h2>
                <p class="form-card__text">
                  请尽量完整地填写药品名称、用药时间、症状与处理经过，便于我们准确评估。
                </p>
              </div>
              <SiteForm :page="page" type="pharmacovigilance" />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<style scoped>
.section {
  padding: 48px 0 80px;
  background: #fff;
}

.pv-alert {
  padding: 18px 20px;
}

.pv-alert__title {
  color: #7a4300;
  font-size: 15px;
  font-weight: 600;
}

.pv-alert__text {
  margin-top: 6px;
  color: #7a5a2e;
  font-size: 13px;
  line-height: 1.9;
}

.pv-row {
  margin-top: 26px;
  row-gap: 20px;
}

.pv-aside {
  /* Shared emphasis-card tokens — kept in sync with /investor. */
  --panel-bg: linear-gradient(158deg, #0b2c56 0%, #143f74 55%, #1b5aa6 100%);
  --panel-accent: #bbdefb;
  --panel-text: #ffffff;
  --panel-muted: rgba(255, 255, 255, 0.72);
  --panel-line: rgba(255, 255, 255, 0.18);
  --panel-warning: #ffcc80;

  display: flex;
  flex-direction: column;
  gap: 18px;
}

.hotline-card {
  padding: 26px 24px;
  background: var(--panel-bg);
  color: var(--panel-text);
}

.hotline-card__label {
  color: var(--panel-muted);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.24em;
}

.hotline-card__title {
  position: relative;
  margin-top: 6px;
  padding-left: 12px;
  color: var(--panel-text);
  font-size: 20px;
  font-weight: 600;
}

/* A single small amber cue keeps the warning context without recolouring the card. */
.hotline-card__title::before {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 0;
  width: 3px;
  border-radius: 2px;
  background: var(--panel-warning);
  content: '';
}

.hotline-card__phone {
  display: block;
  margin-top: 14px;
  color: var(--panel-accent);
  font-size: 30px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.hotline-card__time {
  margin-top: 4px;
  color: var(--panel-muted);
  font-size: 12px;
}

.hotline-card__pending {
  margin-top: 14px;
  color: var(--panel-muted);
  font-size: 13px;
  line-height: 1.8;
}

.hotline-card :deep(.v-divider) {
  border-color: var(--panel-line);
  opacity: 1;
}

.hotline-card__email,
.hotline-card__note {
  color: var(--panel-muted);
  font-size: 12.5px;
  line-height: 1.8;
}

.hotline-card__email a {
  color: var(--panel-accent);
}

.hotline-card__note {
  margin-top: 8px;
}

.steps-card,
.privacy-card {
  padding: 22px 22px;
  border: 1px solid rgba(16, 35, 58, 0.09);
  background: #f8fafc;
}

.steps-card__title,
.privacy-card__title {
  color: #10233a;
  font-size: 15px;
  font-weight: 600;
}

.steps {
  display: flex;
  padding: 0;
  margin: 16px 0 0;
  flex-direction: column;
  gap: 16px;
  list-style: none;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.step__num {
  color: #1976d2;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
}

.step__title {
  color: #10233a;
  font-size: 13.5px;
  font-weight: 600;
}

.step__text {
  margin-top: 3px;
  color: #6b7c8f;
  font-size: 12.5px;
  line-height: 1.8;
}

.privacy-card__text {
  margin-top: 8px;
  color: #6b7c8f;
  font-size: 12.5px;
  line-height: 1.9;
}

.form-card {
  height: 100%;
  padding: 30px 30px 26px;
  border: 1px solid rgba(16, 35, 58, 0.09);
  box-shadow: 0 18px 46px rgba(13, 71, 161, 0.06);
}

.form-card__label {
  color: #1976d2;
  font-size: 10.5px;
  letter-spacing: 0.24em;
}

.form-card__title {
  margin-top: 6px;
  color: #10233a;
  font-size: 24px;
  font-weight: 700;
}

.form-card__text {
  margin-top: 8px;
  color: #7b8794;
  font-size: 13px;
  line-height: 1.8;
}

.form-card :deep(.site-form) {
  margin-top: 22px;
}

@media (max-width: 700px) {
  .section {
    padding: 32px 0 56px;
  }

  .form-card {
    padding: 22px 18px 20px;
  }

  .hotline-card__phone {
    font-size: 26px;
  }
}
</style>

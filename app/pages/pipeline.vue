<script setup lang="ts">
import { siteConfig } from '~/config/site'

const brand = siteConfig.brand
const pipeline = siteConfig.pipeline
const stats = siteConfig.stats

const points = [
  {
    title: '共享的靶点与递送数据',
    text: '前序项目的机制数据、载体经验与工艺参数，被沉淀为可复用的知识资产，新项目不必从零开始。',
  },
  {
    title: '可验证的决策节点',
    text: '每个项目都设有清晰的里程碑与终止标准，用可量化的数据判断继续、调整或停止。',
  },
  {
    title: '可放大的 CMC 能力',
    text: '从实验室规模到临床供样，工艺与分析方法在同一体系内放大，降低从发现到临床的转化风险。',
  },
]

const phaseClass = (phase: string) => {
  if (phase.includes('Phase')) return 'pipe__pill--clinical'
  if (phase.toUpperCase().includes('IND')) return 'pipe__pill--ind'
  return 'pipe__pill--pre'
}

useSeoMeta({
  title: `研发管线｜${brand.name}`,
  description: `${brand.name} 在细胞疗法、基因编辑与核酸药物方向的在研管线与开发进展。`,
  ogTitle: `研发管线｜${brand.name}`,
  ogDescription: `${brand.name} 在细胞疗法、基因编辑与核酸药物方向的在研管线与开发进展。`,
})
</script>

<template>
  <div>
    <!-- ================= hero ================= -->
    <PageHero
      en="Pipeline"
      zh="研发管线"
      :title="['让每一条管线，', '都指向真实的获益。']"
      lead="我们围绕未被满足的临床需求，构建多元化的产品组合。所有项目共享同一套技术底座与转化体系，在科学风险与患者价值之间取得平衡。"
      art="plate"
    />

    <!-- ================= development ================= -->
    <section class="pipe__dev section">
      <div class="container">
        <div class="pipe__dev-head">
          <div class="pipe__head-copy" data-reveal>
            <SectionHead en="Development" zh="在研管线" />
            <svg class="pipe__squiggle" viewBox="0 0 230 26" aria-hidden="true">
              <path
                d="M2 18c32-13 56 6 88-3s48-14 74 2c16 9 38 6 62 2"
                fill="none"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linecap="round"
              />
            </svg>
          </div>

          <ul class="pipe__legend" data-reveal>
            <li><i class="pipe__dot pipe__dot--clinical" />临床阶段</li>
            <li><i class="pipe__dot pipe__dot--ind" />IND 申报</li>
            <li><i class="pipe__dot pipe__dot--pre" />临床前</li>
          </ul>
        </div>

        <div class="pipe__table">
          <div class="pipe__thead" aria-hidden="true">
            <span>项目编号</span>
            <span>产品名称</span>
            <span>技术类别</span>
            <span>适应症</span>
            <span>开发阶段 / 进度</span>
          </div>

          <article
            v-for="item in pipeline"
            :key="item.code"
            class="pipe__row"
            data-reveal
          >
            <span class="pipe__code">{{ item.code }}</span>

            <h3 class="pipe__name">{{ item.name }}</h3>

            <span class="pipe__cat">{{ item.category }}</span>

            <p class="pipe__ind">{{ item.indication }}</p>

            <div class="pipe__phase">
              <span class="pipe__pill" :class="phaseClass(item.phase)">
                {{ item.phase }}
              </span>
              <div class="pipe__meter">
                <span class="pipe__bar" aria-hidden="true">
                  <i :style="{ width: `${item.progress}%` }" />
                </span>
                <em class="pipe__pct font-en">{{ item.progress }}%</em>
              </div>
            </div>
          </article>
        </div>

        <div class="pipe__foot" data-reveal>
          <p class="pipe__count">
            共 <strong class="font-en">{{ pipeline.length }}</strong> 个在研项目
          </p>
          <ArrowLink to="/contact" label="获取完整的管线资料" />
        </div>
      </div>
    </section>

    <!-- ================= platform (blue) ================= -->
    <section class="pipe__adv">
  
      <div class="pipe__adv-body">
        <span class="watermark pipe__adv-watermark" aria-hidden="true">Platform</span>

        <div class="container">
          <SectionHead en="Platform" zh="平台优势" light data-reveal />

          <div class="pipe__adv-grid">
            <div class="pipe__adv-intro" data-reveal>
              <h2 class="pipe__adv-title">平台带来的，<br>不只是效率。</h2>

              <svg class="pipe__adv-squiggle" viewBox="0 0 260 34" aria-hidden="true">
                <path
                  d="M3 24c34-16 58 6 92-6s52-16 84 2c14 8 34 6 56 6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
              </svg>
            </div>

            <div class="pipe__adv-copy" data-reveal>
              <p>
                共享的技术底座意味着靶点经验、递送数据与工艺知识可以跨项目流动。每个新项目，都站在所有前序项目的积累之上。
              </p>
              <p>
                同时，我们坚持为每个项目设置清晰的决策节点，用可量化的数据判断继续、调整或终止，让资源始终投向最有价值的创新方向。
              </p>

              <ArrowLink to="/contact" label="讨论合作机会" light class="pipe__adv-link" />
            </div>
          </div>

          <ol class="pipe__points">
            <li
              v-for="(point, i) in points"
              :key="point.title"
              class="pipe__point"
              data-reveal
            >
              <span class="pipe__pno font-en">{{ String(i + 1).padStart(2, '0') }}</span>
              <h3 class="pipe__ptitle">{{ point.title }}</h3>
              <p class="pipe__ptext">{{ point.text }}</p>
            </li>
          </ol>
        </div>
      </div>

      </section>

    <!-- ================= numbers ================= -->
    <section class="pipe__nums section">
      <div class="container">
        <div class="pipe__nums-head" data-reveal>
          <SectionHead en="Numbers" zh="我们的进展" />
          <p class="pipe__nums-note">
            数字只是结果。真正花时间的，是每一个项目在里程碑前后的判断与验证。
          </p>
        </div>

        <div class="pipe__nums-grid" data-reveal>
          <div
            v-for="(stat, i) in stats"
            :key="stat.label"
            class="pipe__nums-item"
          >
            <span class="pipe__nums-no font-en">{{ String(i + 1).padStart(2, '0') }}</span>
            <strong class="pipe__nums-value font-en">{{ stat.value }}</strong>
            <span class="pipe__nums-label">{{ stat.label }}</span>
            <span class="pipe__nums-en font-en">{{ stat.labelEn }}</span>
          </div>
        </div>

        <svg class="pipe__nums-squiggle" viewBox="0 0 240 26" aria-hidden="true">
          <path
            d="M3 19c34-13 58 5 90-3s48-13 72 1c14 8 32 5 32 5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.3"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </section>

    <ContactBlock />
  </div>
</template>

<style scoped>
/* ================= development ================= */
.pipe__dev {
  position: relative;
  padding: 92px 0 110px;
  background: var(--c-cream);
  overflow: hidden;
}

.pipe__dev-head {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 40px;
  align-items: end;
  margin-bottom: 40px;
}

.pipe__head-copy :deep(.head01) {
  margin-bottom: 0;
}

.pipe__squiggle {
  width: 200px;
  height: 22px;
  margin-top: 18px;
  color: var(--c-primary-400);
}

.pipe__legend {
  display: flex;
  padding-bottom: 8px;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
}

.pipe__legend li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--c-muted);
  font-size: 12px;
  letter-spacing: 0.06em;
}

.pipe__dot {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.pipe__dot--clinical {
  background: var(--c-primary);
}

.pipe__dot--ind {
  background: var(--c-primary-400);
}

.pipe__dot--pre {
  background: var(--c-muted);
}

.pipe__table {
  position: relative;
  z-index: 2;
}

.pipe__thead,
.pipe__row {
  display: grid;
  grid-template-columns:
    104px minmax(0, 1.02fr) minmax(0, 0.78fr) minmax(0, 1.05fr)
    236px;
  gap: 24px;
  align-items: center;
}

.pipe__thead {
  padding: 0 0 14px;
  border-bottom: 1px solid var(--c-line-strong);
  color: var(--c-muted);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.16em;
}

.pipe__row {
  padding: 26px 0;
  border-bottom: 1px solid var(--c-line);
  transition: background 0.35s var(--ease);
}

.pipe__row:hover {
  background: rgba(25, 118, 210, 0.04);
}

.pipe__code {
  color: var(--c-primary);
  font-family: var(--font-en);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.08em;
}

.pipe__name {
  color: var(--c-ink);
  font-family: var(--font-en);
  font-size: 20px;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: 0.02em;
}

.pipe__cat {
  color: var(--c-muted);
  font-size: 12.5px;
  letter-spacing: 0.06em;
}

.pipe__ind {
  color: var(--c-text);
  font-size: 14px;
  line-height: 1.85;
  letter-spacing: 0.05em;
}

.pipe__phase {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.pipe__pill {
  display: inline-flex;
  padding: 5px 12px;
  border-radius: var(--r-pill);
  font-family: var(--font-en);
  font-size: 11px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.1em;
}

.pipe__pill--clinical {
  background: var(--c-primary);
  color: var(--c-white);
}

.pipe__pill--ind {
  background: rgba(100, 181, 246, 0.16);
  color: var(--c-primary-600);
}

.pipe__pill--pre {
  background: rgba(29, 43, 54, 0.06);
  color: var(--c-muted);
}

.pipe__meter {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px;
}

.pipe__bar {
  position: relative;
  height: 4px;
  flex: 1;
  overflow: hidden;
  border-radius: var(--r-pill);
  background: rgba(25, 118, 210, 0.12);
}

.pipe__bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--c-primary-400), var(--c-primary));
}

.pipe__pct {
  min-width: 30px;
  color: var(--c-muted);
  font-size: 11px;
  font-style: normal;
  letter-spacing: 0.06em;
  text-align: right;
}

.pipe__foot {
  position: relative;
  z-index: 2;
  display: flex;
  margin-top: 34px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.pipe__count {
  color: var(--c-muted);
  font-size: 13px;
  letter-spacing: 0.08em;
}

.pipe__count strong {
  margin: 0 4px;
  color: var(--c-primary);
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.04em;
}

/* ================= platform ================= */
.pipe__adv {
  position: relative;
  background: var(--c-cream);
}

.pipe__adv-body {
  position: relative;
  padding: 64px 0 96px;
  background: var(--c-primary);
  color: rgba(255, 255, 255, 0.86);
  overflow: hidden;
}

.pipe__adv-watermark {
  top: 20px;
  right: -20px;
  color: rgba(255, 255, 255, 0.06);
  font-size: clamp(110px, 13vw, 200px);
}

.pipe__adv-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: clamp(36px, 5vw, 80px);
  align-items: start;
  margin-top: 8px;
}

.pipe__adv-title {
  color: var(--c-white);
  font-size: clamp(24px, 2.8vw, 34px);
  font-weight: 500;
  line-height: 1.85;
  letter-spacing: 0.08em;
}

.pipe__adv-squiggle {
  width: 260px;
  height: 34px;
  margin-top: 26px;
  color: rgba(255, 255, 255, 0.55);
}

.pipe__adv-copy p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  line-height: 2.1;
  letter-spacing: 0.06em;
}

.pipe__adv-copy p + p {
  margin-top: 1.5em;
}

.pipe__adv-link {
  margin-top: 30px;
}

.pipe__adv :deep(.arrow-link__squiggle) {
  color: rgba(255, 255, 255, 0.72);
}

.pipe__points {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 60px;
  border-top: 1px solid rgba(255, 255, 255, 0.24);
}

.pipe__point {
  padding: 28px 30px 0;
  border-left: 1px solid rgba(255, 255, 255, 0.16);
}

.pipe__point:first-child {
  padding-left: 0;
  border-left: 0;
}

.pipe__pno {
  display: block;
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
  letter-spacing: 0.16em;
}

.pipe__ptitle {
  margin-top: 10px;
  color: var(--c-white);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.75;
  letter-spacing: 0.07em;
}

.pipe__ptext {
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 13.5px;
  line-height: 2;
  letter-spacing: 0.05em;
}

/* ================= numbers ================= */
.pipe__nums {
  position: relative;
  padding: 96px 0 110px;
  background: var(--c-cream);
  overflow: hidden;
}

.pipe__nums-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
  gap: 48px;
  align-items: end;
  margin-bottom: 40px;
}

.pipe__nums-head :deep(.head01) {
  margin-bottom: 0;
}

.pipe__nums-note {
  max-width: 430px;
  padding-bottom: 6px;
  color: var(--c-muted);
  font-size: 14.5px;
  line-height: 2.1;
  letter-spacing: 0.06em;
}

.pipe__nums-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid var(--c-line-strong);
}

.pipe__nums-item {
  padding: 34px 26px 30px;
  border-left: 1px solid var(--c-line);
}

.pipe__nums-item:first-child {
  padding-left: 0;
  border-left: 0;
}

.pipe__nums-no {
  display: block;
  color: rgba(25, 118, 210, 0.34);
  font-size: 11px;
  letter-spacing: 0.16em;
}

.pipe__nums-value {
  display: block;
  margin-top: 10px;
  color: var(--c-primary);
  font-size: clamp(38px, 4vw, 54px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: 0.02em;
}

.pipe__nums-label {
  display: block;
  margin-top: 10px;
  color: var(--c-text);
  font-size: 13.5px;
  line-height: 1.95;
  letter-spacing: 0.05em;
}

.pipe__nums-en {
  display: block;
  margin-top: 4px;
  color: var(--c-muted);
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.pipe__nums-squiggle {
  width: 240px;
  height: 26px;
  margin: 46px 0 0 auto;
  color: var(--c-primary-400);
}

/* ================= responsive ================= */
@media (max-width: 1100px) {
  .pipe__thead,
  .pipe__row {
    grid-template-columns:
      96px minmax(0, 1fr) minmax(0, 0.8fr) minmax(0, 1fr)
      208px;
    gap: 20px;
  }

  .pipe__name {
    font-size: 18px;
  }

  .pipe__nums-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pipe__nums-item:nth-child(odd) {
    padding-left: 0;
    border-left: 0;
  }

  .pipe__nums-item:nth-child(n + 3) {
    border-top: 1px solid var(--c-line);
  }
}

@media (max-width: 900px) {
  .pipe__dev-head {
    grid-template-columns: 1fr;
    gap: 20px;
    align-items: start;
    margin-bottom: 30px;
  }

  .pipe__legend {
    padding-bottom: 0;
  }

  .pipe__thead {
    display: none;
  }

  .pipe__table {
    display: grid;
    gap: 14px;
  }

  .pipe__row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 24px 22px 26px;
    border: 1px solid var(--c-line);
    border-radius: var(--r-md);
    background: var(--c-white);
    box-shadow: var(--shadow-card);
  }

  .pipe__row:hover {
    background: var(--c-white);
  }

  .pipe__code {
    order: 1;
    font-size: 12px;
    letter-spacing: 0.12em;
  }

  .pipe__name {
    order: 2;
    font-size: 20px;
  }

  .pipe__cat {
    order: 3;
    font-size: 12px;
  }

  .pipe__ind {
    order: 4;
    margin-top: 2px;
  }

  .pipe__phase {
    order: 5;
    margin-top: 10px;
    padding-top: 16px;
    flex-direction: row;
    align-items: center;
    gap: 14px;
    border-top: 1px solid var(--c-line);
  }

  .pipe__pill {
    flex-shrink: 0;
  }

  .pipe__meter {
    flex: 1;
  }

  .pipe__foot {
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
  }

  .pipe__adv-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .pipe__points {
    grid-template-columns: 1fr;
    margin-top: 40px;
  }

  .pipe__point {
    padding: 22px 0 0;
    border-top: 1px solid rgba(255, 255, 255, 0.16);
    border-left: 0;
  }

  .pipe__point:first-child {
    border-top: 0;
  }

  .pipe__nums-head {
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: start;
  }
}

@media (max-width: 768px) {
  .pipe__dev {
    padding: 66px 0 78px;
  }

  .pipe__squiggle {
    width: 170px;
    margin-top: 14px;
  }

  .pipe__name {
    font-size: 19px;
  }

  .pipe__adv-body {
    padding: 52px 0 68px;
  }

  .pipe__adv-title {
    font-size: 22px;
  }

  .pipe__adv-squiggle {
    width: 200px;
    margin-top: 20px;
  }

  .pipe__points {
    margin-top: 32px;
  }

  .pipe__nums {
    padding: 66px 0 78px;
  }

  .pipe__nums-head {
    margin-bottom: 30px;
  }

  .pipe__nums-item {
    padding: 26px 14px 22px;
  }

  .pipe__nums-value {
    font-size: 32px;
  }

  .pipe__nums-squiggle {
    width: 180px;
    margin-top: 34px;
  }
}
</style>

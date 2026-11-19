<script setup lang="ts">
import { siteConfig } from '~/config/site'

const brand = siteConfig.brand
const { pillars, capabilities, stats, company } = siteConfig

const storyText = [
  `${brand.founded} 年，几位来自细胞治疗、基因工程与药物化学领域的科学家聚在一起，希望回答一个长期困扰行业的问题：如何让前沿技术更高效地转化为真正可用的药物。`,
  '从第一套工程化细胞筛选平台，到今天的三大核心技术平台与覆盖细胞治疗、抗体及核酸药物的研发管线，我们始终把临床需求放在研发的第一位。',
  `今天，${brand.name} 已与全球多家药企和学术机构建立长期合作。我们开放平台、共享能力，也共同承担创新过程中的风险与回报。`,
]

useSeoMeta({
  title: `关于我们｜${brand.name}`,
  description: brand.description,
  ogTitle: `关于我们｜${brand.name}`,
  ogDescription: brand.description,
})
const anchorItems = [
  { id: 'story', label: '我们的故事' },
  { id: 'values', label: '价值观' },
  { id: 'platforms', label: '技术平台' },
]</script>

<template>
  <div>
    <!-- ================= hero ================= -->
    <PageHero
      en="About us"
      zh="关于我们"
      :title="['我们相信，', '创新的价值在于被需要。']"
      :lead="brand.description"
      art="molecule"
    />

    <!-- ================= story ================= -->
    <section id="story" class="about__story section">
      <span class="watermark about__watermark" aria-hidden="true">Story</span>

      <div class="container">
        <SectionHead en="Our Story" zh="我们的故事" data-reveal />

        <div class="about__story-grid">
          <div class="about__story-copy" data-reveal>
            <p class="about__since">Since {{ brand.founded }}</p>

            <h2 class="about__story-title">
              {{ brand.tagline }}，<br>从一间实验室开始。
            </h2>

            <div class="about__story-body">
              <p v-for="(paragraph, i) in storyText" :key="i">{{ paragraph }}</p>
            </div>

            <svg class="about__squiggle" viewBox="0 0 230 26" aria-hidden="true">
              <path
                d="M2 18c32-13 56 6 88-3s48-14 74 2c16 9 38 6 62 2"
                fill="none"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linecap="round"
              />
            </svg>
          </div>

          <aside class="about__side card" data-reveal>
            <div class="about__side-top">
              <p class="about__side-label font-en">Company Profile</p>
              <span class="big-num big-num--blue about__num" aria-hidden="true">
                <span class="big-num__hash">#</span>01
              </span>
            </div>

            <div class="frame about__frame">
              <ArtPanel variant="lab" />
            </div>

            <dl class="about__profile">
              <div v-for="row in company" :key="row.label" class="about__row">
                <dt>{{ row.label }}</dt>
                <dd>{{ row.value }}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </section>

    <!-- ================= values (blue) ================= -->
    <section id="values" class="about__values">
  
      <div class="about__values-body">
        <span class="watermark about__values-watermark" aria-hidden="true">Values</span>

        <div class="container">
          <div class="about__values-head" data-reveal>
            <SectionHead en="Our Values" zh="我们的价值观" light />
            <p class="about__values-note">
              四条原则，决定我们选择什么样的问题，也决定我们如何与伙伴相处。
            </p>
          </div>

          <div class="about__values-grid">
            <article
              v-for="item in pillars"
              :key="item.index"
              class="about__value"
              data-reveal
            >
              <span class="big-num about__value-num" aria-hidden="true">
                <span class="big-num__hash">#</span>{{ item.index }}
              </span>
              <h3 class="about__value-title">{{ item.title }}</h3>
              <p class="about__value-en font-en">{{ item.titleEn }}</p>
              <p class="about__value-text">{{ item.description }}</p>
            </article>
          </div>

          <svg class="about__values-squiggle" viewBox="0 0 300 40" aria-hidden="true">
            <path
              d="M4 28c40-20 66 6 104-8s58-18 92 4c16 11 44 8 44 8"
              fill="none"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>

      </section>

    <!-- ================= platforms ================= -->
    <section id="platforms" class="about__plat section section--white">
      <div class="container">
        <div class="about__plat-head" data-reveal>
          <SectionHead en="Platforms" zh="技术平台" />
          <p class="about__plat-note">
            从靶点验证、候选分子设计到 CMC 放大与临床支持，平台化能力让不同项目共享同一套科学与工程体系。
          </p>
        </div>

        <ul class="about__plat-list">
          <li
            v-for="item in capabilities"
            :key="item.index"
            class="about__plat-row"
            data-reveal
          >
            <span class="about__plat-ico" aria-hidden="true">
              <svg v-if="item.index === '01'" viewBox="0 0 32 32">
                <path
                  d="M12 4c0 5 8 7 8 12s-8 7-8 12"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M20 4c0 5-8 7-8 12s8 7 8 12"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M13 9h6M11.5 14h9M11.5 20h9M13 25h6"
                  stroke="currentColor"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
              </svg>

              <svg v-else-if="item.index === '02'" viewBox="0 0 32 32">
                <circle
                  cx="16"
                  cy="16"
                  r="10.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.4"
                />
                <circle cx="16" cy="5.5" r="2.2" fill="currentColor" />
                <circle cx="25.5" cy="21.2" r="2.2" fill="currentColor" />
                <circle cx="6.5" cy="21.2" r="2.2" fill="currentColor" />
              </svg>

              <svg v-else viewBox="0 0 32 32">
                <path
                  d="M6 5v22h21"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M10 21l5.5-6.5 4 3.5L26 9"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle cx="26" cy="9" r="2" fill="currentColor" />
              </svg>
            </span>

            <div class="about__plat-main">
              <h3 class="about__plat-title">{{ item.title }}</h3>
              <p class="about__plat-en font-en">{{ item.titleEn }}</p>
            </div>

            <p class="about__plat-desc">{{ item.description }}</p>

            <span class="about__plat-no font-en" aria-hidden="true">{{ item.index }}</span>
          </li>
        </ul>

        <div class="about__plat-stats" data-reveal>
          <div v-for="stat in stats" :key="stat.label" class="about__plat-stat">
            <strong class="font-en">{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </div>
        </div>

        <div class="about__plat-foot" data-reveal>
          <ArrowLink to="/pipeline" label="查看研发管线" />
        </div>
      </div>
    </section>

    <ContactBlock id="contact" />
    <SectionAnchor :items="anchorItems" />
  </div>
</template>

<style scoped>
/* ================= story ================= */
.about__story {
  position: relative;
  padding: 100px 0 120px;
  background: var(--c-cream);
  overflow: hidden;
}

.about__watermark {
  top: 24px;
  right: -10px;
  font-size: clamp(100px, 12vw, 180px);
}

.about__story-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: clamp(40px, 6vw, 88px);
  align-items: start;
}

.about__since {
  color: var(--c-primary);
  font-family: var(--font-script);
  font-size: clamp(26px, 2.6vw, 36px);
  line-height: 1;
  letter-spacing: 0.01em;
  transform: rotate(-3deg);
  transform-origin: left center;
}

.about__story-title {
  margin-top: 18px;
  color: var(--c-ink);
  font-size: clamp(22px, 2.5vw, 30px);
  font-weight: 500;
  line-height: 1.85;
  letter-spacing: 0.08em;
}

.about__story-body {
  max-width: 580px;
  margin-top: 26px;
}

.about__story-body p {
  color: var(--c-text);
  font-size: 15px;
  line-height: 2.15;
  letter-spacing: 0.06em;
}

.about__story-body p + p {
  margin-top: 1.4em;
}

.about__squiggle {
  width: 230px;
  height: 26px;
  margin-top: 36px;
  color: var(--c-primary-400);
}

.about__side {
  padding: 30px;
}

.about__side-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.about__side-label {
  padding-top: 6px;
  color: var(--c-muted);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.about__num {
  font-size: clamp(40px, 4vw, 54px);
  line-height: 0.8;
}

.about__frame {
  height: 172px;
  margin-top: 18px;
}

.about__profile {
  margin-top: 22px;
}

.about__row {
  display: flex;
  padding: 14px 0;
  align-items: baseline;
  justify-content: space-between;
  gap: 18px;
  border-top: 1px solid var(--c-line);
}

.about__row:last-child {
  border-bottom: 1px solid var(--c-line);
}

.about__row dt {
  color: var(--c-muted);
  font-size: 12.5px;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.about__row dd {
  color: var(--c-ink);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-align: right;
}

/* ================= values ================= */
.about__values {
  position: relative;
  background: var(--c-cream);
}

.about__values-body {
  position: relative;
  padding: 64px 0 96px;
  background: var(--c-primary);
  color: rgba(255, 255, 255, 0.86);
  overflow: hidden;
}

.about__values-watermark {
  top: 16px;
  right: -24px;
  color: rgba(255, 255, 255, 0.07);
  font-size: clamp(110px, 13vw, 200px);
}

.about__values-head {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.85fr);
  gap: 48px;
  align-items: end;
  margin-bottom: 46px;
}

.about__values-head :deep(.head01) {
  margin-bottom: 0;
}

.about__values-note {
  max-width: 430px;
  padding-bottom: 6px;
  color: rgba(255, 255, 255, 0.74);
  font-size: 14.5px;
  line-height: 2.05;
  letter-spacing: 0.06em;
}

.about__values-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.about__value {
  padding: 32px 34px 36px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: var(--r-md);
  background: rgba(255, 255, 255, 0.06);
  transition: background 0.4s var(--ease), border-color 0.4s var(--ease),
    transform 0.4s var(--ease);
}

.about__value:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.11);
  transform: translateY(-4px);
}

.about__value-num {
  color: rgba(255, 255, 255, 0.92);
  font-size: clamp(38px, 3.8vw, 54px);
  line-height: 0.8;
}

.about__value-title {
  margin-top: 22px;
  color: var(--c-white);
  font-size: clamp(19px, 1.9vw, 23px);
  font-weight: 500;
  line-height: 1.7;
  letter-spacing: 0.08em;
}

.about__value-en {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 11.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.about__value-text {
  margin-top: 18px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 14px;
  line-height: 2.1;
  letter-spacing: 0.06em;
}

.about__values-squiggle {
  position: relative;
  z-index: 2;
  width: 300px;
  height: 40px;
  margin: 54px 0 0 auto;
  color: rgba(255, 255, 255, 0.5);
}

/* ================= platforms ================= */
.about__plat {
  padding: 110px 0 120px;
  background: var(--c-white);
}

.about__plat-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
  gap: 48px;
  align-items: end;
  margin-bottom: 30px;
}

.about__plat-head :deep(.head01) {
  margin-bottom: 0;
}

.about__plat-note {
  max-width: 450px;
  padding-bottom: 6px;
  color: var(--c-muted);
  font-size: 14.5px;
  line-height: 2.1;
  letter-spacing: 0.06em;
}

.about__plat-list {
  margin-top: 26px;
  border-top: 1px solid var(--c-line);
}

.about__plat-row {
  display: grid;
  grid-template-columns: 66px minmax(0, 0.92fr) minmax(0, 1.45fr) 40px;
  padding: 32px 0;
  align-items: center;
  gap: 28px;
  border-bottom: 1px solid var(--c-line);
}

.about__plat-ico {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border-radius: 16px;
  background: rgba(25, 118, 210, 0.08);
  color: var(--c-primary);
  transition: background 0.35s var(--ease), color 0.35s var(--ease),
    transform 0.35s var(--ease);
}

.about__plat-ico svg {
  width: 28px;
  height: 28px;
}

.about__plat-row:hover .about__plat-ico {
  background: var(--c-primary);
  color: var(--c-white);
  transform: translateY(-2px);
}

.about__plat-title {
  color: var(--c-ink);
  font-size: 19px;
  font-weight: 500;
  line-height: 1.7;
  letter-spacing: 0.07em;
}

.about__plat-en {
  margin-top: 4px;
  color: var(--c-primary);
  font-size: 11.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.about__plat-desc {
  color: var(--c-muted);
  font-size: 14.5px;
  line-height: 2.05;
  letter-spacing: 0.06em;
}

.about__plat-no {
  color: rgba(25, 118, 210, 0.4);
  font-size: 13px;
  letter-spacing: 0.1em;
  text-align: right;
}

.about__plat-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 64px;
  padding: 34px 0;
  border-top: 1px solid var(--c-line);
  border-bottom: 1px solid var(--c-line);
}

.about__plat-stat {
  padding: 0 26px;
  border-left: 1px solid var(--c-line);
}

.about__plat-stat:first-child {
  padding-left: 0;
  border-left: 0;
}

.about__plat-stat strong {
  display: block;
  color: var(--c-primary);
  font-size: clamp(30px, 3vw, 40px);
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: 0.02em;
}

.about__plat-stat span {
  display: block;
  margin-top: 6px;
  color: var(--c-muted);
  font-size: 12px;
  line-height: 1.85;
  letter-spacing: 0.04em;
}

.about__plat-foot {
  display: flex;
  margin-top: 40px;
  justify-content: flex-end;
}

/* ================= responsive ================= */
@media (max-width: 1100px) {
  .about__story-grid {
    gap: 48px;
  }

  .about__plat-row {
    grid-template-columns: 62px minmax(0, 1fr) minmax(0, 1.4fr);
    gap: 22px;
  }

  .about__plat-no {
    display: none;
  }

  .about__plat-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 24px;
  }

  .about__plat-stat:nth-child(odd) {
    padding-left: 0;
    border-left: 0;
  }
}

@media (max-width: 900px) {
  .about__story-grid {
    grid-template-columns: 1fr;
    gap: 44px;
  }

  .about__side {
    max-width: 560px;
  }

  .about__values-head,
  .about__plat-head {
    grid-template-columns: 1fr;
    gap: 18px;
    align-items: start;
  }

  .about__plat-row {
    grid-template-columns: 62px minmax(0, 1fr);
    gap: 18px 22px;
    padding: 26px 0;
  }

  .about__plat-title {
    font-size: 18px;
  }

  .about__plat-desc {
    grid-column: 2;
  }
}

@media (max-width: 768px) {
  .about__story {
    padding: 68px 0 76px;
  }

  .about__story-grid {
    gap: 36px;
  }

  .about__side {
    padding: 22px;
  }

  .about__frame {
    height: 150px;
  }

  .about__squiggle {
    width: 190px;
    margin-top: 28px;
  }

  .about__values-body {
    padding: 52px 0 68px;
  }

  .about__values-head {
    margin-bottom: 32px;
  }

  .about__values-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .about__value {
    padding: 26px 24px 28px;
  }

  .about__value-title {
    margin-top: 18px;
  }

  .about__values-squiggle {
    width: 220px;
    margin-top: 36px;
  }

  .about__plat {
    padding: 68px 0 78px;
  }

  .about__plat-row {
    grid-template-columns: 46px minmax(0, 1fr);
    gap: 14px 16px;
    padding: 24px 0;
  }

  .about__plat-ico {
    width: 44px;
    height: 44px;
    border-radius: 12px;
  }

  .about__plat-ico svg {
    width: 22px;
    height: 22px;
  }

  .about__plat-desc {
    grid-column: 1 / -1;
  }

  .about__plat-stats {
    margin-top: 44px;
    padding: 26px 0;
  }

  .about__plat-stat {
    padding: 0 12px;
  }

  .about__plat-stat strong {
    font-size: 28px;
  }

  .about__plat-foot {
    margin-top: 30px;
    justify-content: flex-start;
  }
}
</style>

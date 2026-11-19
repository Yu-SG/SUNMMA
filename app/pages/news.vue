<script setup lang="ts">
import { siteConfig } from '~/config/site'

const brand = siteConfig.brand
const news = siteConfig.news

useSeoMeta({
  title: `新闻动态｜${brand.name}`,
  description: `${brand.name} 的公司动态、研发进展与合作交流公告。`,
  ogTitle: `新闻动态｜${brand.name}`,
  ogDescription: `${brand.name} 的公司动态、研发进展与合作交流公告。`,
})

const categories = computed(() => ['全部', ...Array.from(new Set(news.map((item) => item.category)))])
const active = ref('全部')
const filtered = computed(() =>
  active.value === '全部' ? news : news.filter((item) => item.category === active.value),
)
const anchorItems = [
  { id: 'archive', label: '全部动态' },
  { id: 'media', label: '媒体联络' },
]</script>

<template>
  <div>
    <PageHero
      en="News"
      zh="新闻动态"
      :title="['每一步进展，', '都值得被记录。']"
      lead="这里汇集我们的研发进展、合作公告与团队动态。透明地分享进展，也坦诚地面对挑战。"
    >
      <dl class="news__meta" data-reveal>
        <div class="news__meta-item">
          <dt>最新更新</dt>
          <dd class="font-en">{{ news[0]?.date }}</dd>
        </div>
        <div class="news__meta-item">
          <dt>动态分类</dt>
          <dd>{{ categories.length - 1 }} 类</dd>
        </div>
        <div class="news__meta-item">
          <dt>媒体联络</dt>
          <dd>
            <a :href="`mailto:${brand.email}`">{{ brand.email }}</a>
          </dd>
        </div>
      </dl>
    </PageHero>

    <!-- ================= archive ================= -->
    <section id="archive" class="news__archive section">
      <span class="watermark news__watermark" aria-hidden="true">Archive</span>

      <div class="container">
        <div class="news__grid">
          <div class="head02 news__label" data-reveal>
            <p class="head02__en">News</p>
            <p class="head02__zh">全部动态</p>
          </div>

          <div class="news__main">
            <div class="news__filters" data-reveal>
              <button
                v-for="category in categories"
                :key="category"
                type="button"
                class="news__chip"
                :class="{ 'news__chip--active': active === category }"
                :aria-pressed="active === category"
                @click="active = category"
              >
                {{ category }}
              </button>
            </div>

            <div class="news__list" data-reveal>
              <NewsList :items="filtered" />
              <p v-if="!filtered.length" class="news__empty">
                该分类下暂无动态，欢迎稍后再来看看。
              </p>
            </div>

            <div class="news__foot" data-reveal>
              <div class="news__count">
                <span class="big-num big-num--blue news__count-num">
                  <span class="big-num__hash">#</span>{{ String(filtered.length).padStart(2, '0') }}
                </span>
                <p class="news__count-label">共 {{ filtered.length }} 条动态</p>
              </div>
              <ArrowLink to="/contact" label="媒体与采访联络" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= media (blue) ================= -->
    <section id="media" class="news__media">
  
      <div class="news__media-body">
        <div class="container news__media-grid">
          <div class="news__media-copy" data-reveal>
            <SectionHead en="Media" zh="媒体联络" light />
            <p class="news__media-lead">
              如需获取公司介绍、研发进展资料，或安排采访与拍摄，<br>
              欢迎直接联系我们的品牌与传播团队。
            </p>

            <svg class="news__media-line" viewBox="0 0 220 24" aria-hidden="true">
              <path
                d="M4 16c30-12 52 5 82-2s44-12 66 1c13 8 30 5 30 5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linecap="round"
              />
            </svg>
          </div>

          <div class="news__media-card" data-reveal>
            <p class="news__media-label">品牌与传播</p>
            <a class="news__mail font-en" :href="`mailto:${brand.email}`">{{ brand.email }}</a>
            <p class="news__media-note">我们通常会在两个工作日内回复媒体与投资人的问询。</p>
            <ArrowLink to="/contact" label="预约一次沟通" light class="news__media-link" />
          </div>
        </div>
      </div>

      </section>

    <ContactBlock id="contact" />
    <SectionAnchor :items="anchorItems" />
  </div>
</template>

<style scoped>
/* ================= hero meta band ================= */
.news__meta {
  display: grid;
  margin-top: 56px;
  padding-top: 26px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  border-top: 1px solid var(--c-line-strong);
}

.news__meta-item {
  display: grid;
  gap: 6px;
}

.news__meta-item dt {
  color: var(--c-muted);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.16em;
}

.news__meta-item dd {
  color: var(--c-primary);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.06em;
}

.news__meta-item dd a {
  transition: color 0.25s var(--ease);
}

.news__meta-item dd a:hover {
  color: var(--c-primary-800);
}

/* ================= archive ================= */
.news__archive {
  position: relative;
  padding: 80px 0 110px;
  background: var(--c-cream);
  overflow: hidden;
}

.news__watermark {
  top: 20px;
  right: -8px;
  font-size: clamp(110px, 14vw, 200px);
}

.news__grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  gap: 48px;
  max-width: calc(var(--contents-inner) + 80px);
}

.news__label {
  padding-top: 4px;
}

.news__main {
  min-width: 0;
}

.news__filters {
  display: flex;
  margin-bottom: 38px;
  gap: 10px;
  flex-wrap: wrap;
}

.news__chip {
  height: 42px;
  padding: 0 22px;
  border: 1px solid var(--c-line-strong);
  border-radius: var(--r-pill);
  background: transparent;
  color: var(--c-primary);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.1em;
  transition: background 0.3s var(--ease), color 0.3s var(--ease),
    border-color 0.3s var(--ease), transform 0.3s var(--ease);
}

.news__chip:hover {
  border-color: var(--c-primary);
  transform: translateY(-1px);
}

.news__chip--active {
  border-color: var(--c-primary);
  background: var(--c-primary);
  color: var(--c-white);
  box-shadow: 0 10px 22px rgba(13, 71, 161, 0.16);
}

.news__chip--active:hover {
  border-color: var(--c-primary-800);
  background: var(--c-primary-800);
}

.news__list {
  min-height: 180px;
}

.news__empty {
  padding: 40px 0;
  color: var(--c-muted);
  font-size: 14px;
  letter-spacing: 0.06em;
}

.news__foot {
  display: flex;
  margin-top: 34px;
  padding-top: 8px;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.news__count {
  display: flex;
  align-items: baseline;
  gap: 18px;
}

.news__count-num {
  font-size: clamp(44px, 5vw, 68px);
}

.news__count-label {
  color: var(--c-muted);
  font-size: 13px;
  letter-spacing: 0.1em;
}

/* ================= media ================= */
.news__media {
  position: relative;
  background: var(--c-cream);
}

.news__media-body {
  position: relative;
  padding: 74px 0 96px;
  background: var(--c-primary);
  color: var(--c-white);
  overflow: hidden;
}

.news__media-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, 0.86fr);
  gap: clamp(40px, 6vw, 90px);
  align-items: start;
}

.news__media-lead {
  max-width: 460px;
  margin-top: -24px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 15px;
  line-height: 2.1;
  letter-spacing: 0.06em;
}

.news__media-card {
  padding: 34px 36px 30px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: var(--r-md);
  background: rgba(255, 255, 255, 0.07);
}

.news__media-label {
  color: rgba(255, 255, 255, 0.66);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.18em;
}

.news__mail {
  display: inline-block;
  margin-top: 10px;
  color: var(--c-white);
  font-size: clamp(22px, 2.4vw, 30px);
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.03em;
  transition: opacity 0.25s var(--ease);
}

.news__mail:hover {
  opacity: 0.78;
}

.news__media-note {
  margin-top: 16px;
  color: rgba(255, 255, 255, 0.68);
  font-size: 13px;
  line-height: 2;
  letter-spacing: 0.06em;
}

.news__media-link {
  margin-top: 26px;
}

.news__media-line {
  width: 220px;
  height: 24px;
  margin-top: 30px;
  color: rgba(255, 255, 255, 0.5);
}

/* ================= responsive ================= */
/* the vertical word only has room outside the 1180px content column */
@media (max-width: 1400px) {
  .news__watermark {
    display: none;
  }
}

@media (max-width: 1100px) {
  .news__media-grid {
    grid-template-columns: minmax(0, 1fr) minmax(300px, 0.9fr);
  }
}

@media (max-width: 900px) {
  .news__meta {
    margin-top: 44px;
    gap: 18px;
  }

  .news__grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .news__label {
    padding-top: 0;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }

  .news__label .head02__en,
  .news__label .head02__zh {
    writing-mode: horizontal-tb;
    transform: none;
  }

  .news__label .head02__zh {
    display: none;
  }

  .news__media-grid {
    grid-template-columns: 1fr;
    gap: 34px;
  }

  .news__media-lead {
    margin-top: 0;
  }

  .news__media-lead br {
    display: none;
  }
}

@media (max-width: 768px) {
  .news__archive {
    padding: 44px 0 78px;
  }

  .news__label {
    display: none;
  }

  .news__meta {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .news__meta-item {
    display: flex;
    align-items: baseline;
    gap: 14px;
  }

  .news__meta-item dt {
    width: 64px;
    flex-shrink: 0;
  }

  .news__filters {
    margin-bottom: 28px;
    gap: 8px;
  }

  .news__chip {
    height: 38px;
    padding: 0 16px;
    font-size: 12px;
  }

  .news__foot {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .news__media-body {
    padding: 56px 0 70px;
  }

  .news__media-card {
    padding: 26px 22px;
  }
}
</style>

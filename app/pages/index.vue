<script setup lang="ts">
import { siteConfig } from '~/config/site'

const brand = siteConfig.brand

const anchorItems = [
  { id: 'news', label: '新闻' },
  { id: 'message', label: '理念' },
  { id: 'about', label: '关于' },
  { id: 'products', label: '产品' },
  { id: 'greeting', label: '寄语' },
  { id: 'facility', label: '研发中心' },
]
const { hero, banners, message, aboutStory, products, news, greeting, facility, stats } = siteConfig

useSeoMeta({
  title: `${brand.name}｜${brand.tagline}`,
  description: brand.description,
  ogTitle: `${brand.name}｜${brand.tagline}`,
  ogDescription: brand.description,
})
</script>

<template>
  <div>
    <!-- ================= hero ================= -->
    <section class="hero">
      <HeroCarousel :slides="banners" />

      <div class="hero__body">
        <div class="hero__deco" aria-hidden="true">
          <svg viewBox="0 0 1440 520" preserveAspectRatio="none">
            <path
              d="M560 420c170-16 250-104 344-176 76-60 176-104 296-124"
              fill="none"
              stroke="var(--c-primary)"
              stroke-width="1.2"
              stroke-linecap="round"
              opacity="0.85"
            />
          </svg>
          <span class="hero__script">{{ hero.script }}</span>
        </div>

        <div class="container hero__inner">
          <div class="hero__copy">
            <h1 class="hero__title">
              <template v-for="(line, i) in hero.heading" :key="i">
                <span class="hero__line">{{ line }}</span>
              </template>
            </h1>
            <p class="hero__lead">{{ brand.description }}</p>
            <div class="hero__actions">
              <NuxtLink to="/products" class="btn btn--primary">
                查看产品中心
                <span class="btn__ico" aria-hidden="true">
                  <svg viewBox="0 0 24 12" width="14" height="10">
                    <path d="M1 6h20M16 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </NuxtLink>
              <NuxtLink to="/about" class="btn btn--outline">了解我们</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= news ================= -->
    <section id="news" class="news section">
      <div class="container news__grid">
        <div class="news__label">
          <p class="head02__en">News</p>
          <p class="head02__zh">最新动态</p>
        </div>
        <div class="news__main" data-reveal>
          <NewsList :items="news" />
          <div class="news__more">
            <ArrowLink to="/news" label="查看全部动态" />
          </div>
        </div>
      </div>
    </section>

    <!-- ================= message ================= -->
    <section id="message" class="msg">
      <span class="watermark msg__watermark">Message</span>

      <div class="container">
        <div class="msg__grid">
          <div class="msg__media frame frame--lg" data-reveal>
            <ArtPanel variant="portrait" />
          </div>

          <div class="msg__copy" data-reveal>
            <h2 class="msg__title">
              <template v-for="(line, i) in message.title" :key="i">
                {{ line }}<br v-if="i < message.title.length - 1">
              </template>
            </h2>
            <div class="msg__text">
              <p v-for="(p, i) in message.paragraphs" :key="i">{{ p }}</p>
            </div>
            <ArrowLink to="/about" :label="message.link" class="msg__link" />
          </div>
        </div>

        <div class="msg__sub frame" data-reveal>
          <ArtPanel variant="cell" />
        </div>

        <svg class="msg__birds" viewBox="0 0 90 60" aria-hidden="true">
          <path d="M6 34c9-14 19-18 27-9 8-9 18-5 27 9-10-5-18-3-27 6-9-9-17-10-27-6z" fill="currentColor" />
          <path d="M8 52c6-9 12-12 17-6 5-6 11-3 17 6-6-3-11-2-17 4-6-6-11-7-17-4z" fill="currentColor" opacity="0.75" />
        </svg>
      </div>
    </section>

    <!-- ================= about (blue) ================= -->
    <section id="about" class="about">
  
      <div class="about__body">
        <div class="container">
          <SectionHead en="About us" zh="关于我们" light data-reveal />

          <div class="about__story">
            <article
              v-for="(item, i) in aboutStory"
              :key="item.no"
              class="story"
              :class="{ 'story--reverse': i % 2 === 1 }"
              data-reveal
            >
              <div class="story__text">
                <h3 class="story__title">
                  <template v-for="(line, j) in item.title" :key="j">
                    {{ line }}<br v-if="j < item.title.length - 1">
                  </template>
                </h3>
                <span class="story__rule" />
                <p class="story__lead">{{ item.text }}</p>
              </div>

              <div class="story__media">
                <div class="frame frame--lg story__frame">
                  <ArtPanel :variant="item.art" />
                </div>
                <span class="big-num story__num">
                  <span class="big-num__hash">#</span>{{ item.no }}
                </span>
              </div>
            </article>
          </div>

          <svg class="about__line" viewBox="0 0 300 60" aria-hidden="true">
            <path
              d="M2 40c40-30 70 10 108-6s58-24 92 8c14 12 40 6 40 6"
              fill="none"
              stroke="rgba(255,255,255,0.55)"
              stroke-width="1.2"
              stroke-linecap="round"
            />
          </svg>

          <div class="about__foot">
            <ArrowLink to="/about" label="关于我们" light />
          </div>
        </div>
      </div>

      </section>

    <!-- ================= products ================= -->
    <section id="products" class="menu">
      <div class="menu__media" data-reveal>
        <ArtPanel variant="cell" />
        <div class="menu__media-overlay" />
      </div>

      <div class="container menu__body">
        <div class="menu__head" data-reveal>
          <SectionHead en="Products" zh="产品中心" />
          <p class="menu__lead">
            从屏障修护到功效精华，我们把实验室里的研究与真实的肌肤问题对齐，做出可以长期使用的产品。
          </p>
          <ArrowLink to="/products" label="查看全部产品" />
        </div>

        <NuxtLink
          v-for="item in products"
          :key="item.code"
          to="/products"
          class="m-card"
          data-reveal
        >
          <span class="m-card__photo">
            <img :src="item.image" :alt="item.name" loading="lazy" decoding="async" />
          </span>
          <div class="m-card__body">
            <p class="m-card__cat">{{ item.category }} / {{ item.tag }}</p>
            <h3 class="m-card__title">{{ item.name }}</h3>
            <p class="m-card__text">{{ item.description }}</p>
          </div>
          <div class="m-card__foot">
            <span class="m-card__code font-en">{{ item.code }}</span>
            <span class="m-card__go" aria-hidden="true">
              <svg viewBox="0 0 24 12" width="16" height="10">
                <path d="M1 6h20M16 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ================= stats ================= -->
    <section class="stats">
      <div class="container stats__grid">
        <div v-for="stat in stats" :key="stat.label" class="stat">
          <strong class="font-en">{{ stat.value }}</strong>
          <span>{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <!-- ================= greeting ================= -->
    <section id="greeting" class="greet">
      <div class="container">
        <SectionHead en="Greeting" :zh="greeting.title" data-reveal />

        <div class="greet__grid">
          <div class="greet__copy" data-reveal>
            <div class="greet__text">
              <p v-for="(p, i) in greeting.message" :key="i">{{ p }}</p>
            </div>

            <dl class="greet__profile">
              <div class="greet__row">
                <dt>{{ greeting.role }}</dt>
                <dd>
                  <strong>{{ greeting.name }}</strong>
                  <span class="font-en">{{ greeting.nameEn }}</span>
                </dd>
              </div>
              <div class="greet__row greet__row--list">
                <dt>经历</dt>
                <dd>
                  <ul>
                    <li v-for="item in greeting.career" :key="item">{{ item }}</li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>

          <div class="greet__media">
            <div class="frame frame--lg greet__frame" data-reveal>
              <ArtPanel :variant="greeting.art" />
            </div>
            <ArrowLink to="/about" label="创始人介绍" class="greet__link" />
          </div>
        </div>
      </div>
    </section>

    <!-- ================= facility ================= -->
    <section id="facility" class="fac">
      <div class="container fac__head">
        <SectionHead en="Facility" zh="研发中心" />
        <p class="fac__watermark" aria-hidden="true">Science in<br>the making.</p>
      </div>

      <div class="fac__scroller">
        <article v-for="item in facility" :key="item.no" class="fac__item" data-reveal>
          <div class="fac__art frame">
            <ArtPanel :variant="item.art" />
            <p class="fac__label">{{ item.label }}</p>
          </div>
          <p class="fac__no font-en">{{ item.no }}</p>
          <p class="fac__text">{{ item.text }}</p>
        </article>
      </div>

      <div class="container fac__foot">
        <ArrowLink to="/about" label="了解研发中心" />
      </div>
    </section>

    <ContactBlock id="contact" />
    <SectionAnchor :items="anchorItems" />
  </div>
</template>

<style scoped>
/* ================= hero ================= */
.hero {
  position: relative;
  padding-top: var(--header-h);
  background: var(--c-cream);
}

.hero__body {
  position: relative;
  padding: 84px 0 96px;
  background: var(--c-cream);
  overflow: hidden;
}

.hero__deco {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 520px;
  pointer-events: none;
}

.hero__deco svg {
  width: 100%;
  height: 100%;
}

.hero__script {
  position: absolute;
  top: 52px;
  right: 6%;
  color: var(--c-primary);
  font-family: var(--font-script);
  font-size: clamp(30px, 3.4vw, 54px);
  line-height: 1;
  letter-spacing: 0.01em;
  white-space: nowrap;
  transform: rotate(-6deg);
}

.hero__inner {
  position: relative;
  z-index: 2;
}

.hero__copy {
  max-width: 880px;
}

.hero__title {
  color: var(--c-ink);
  font-size: clamp(28px, 3.3vw, 46px);
  font-weight: 500;
  line-height: 1.95;
  letter-spacing: 0.1em;
}

.hero__line {
  display: block;
}

.hero__lead {
  max-width: 620px;
  margin-top: 22px;
  color: var(--c-muted);
  font-size: 15px;
  line-height: 2.1;
  letter-spacing: 0.06em;
}

.hero__actions {
  display: flex;
  margin-top: 34px;
  gap: 12px;
  flex-wrap: wrap;
}



/* ================= news ================= */
.news {
  padding: 90px 0 80px;
  background: var(--c-cream);
}

.news__grid {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 44px;
  max-width: calc(var(--contents-inner) + 80px);
}

.news__label {
  display: flex;
  padding-top: 26px;
  gap: 12px;
  color: var(--c-primary);
  align-items: flex-start;
}

.news__label .head02__en {
  font-family: var(--font-en);
  font-size: 24px;
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: 0.03em;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
}

.news__label .head02__zh {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.7;
  letter-spacing: 0.18em;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
}

.news__main {
  min-width: 0;
}

.news__more {
  display: flex;
  margin-top: 34px;
  justify-content: flex-end;
}

/* ================= message ================= */
.msg {
  position: relative;
  padding: 60px 0 130px;
  background: var(--c-cream);
  overflow: hidden;
}

.msg__watermark {
  top: 60px;
  right: -20px;
  font-size: clamp(120px, 15vw, 230px);
}

.msg__grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: clamp(40px, 6vw, 90px);
  align-items: center;
}

.msg__media {
  height: clamp(360px, 44vw, 600px);
}

.msg__title {
  color: var(--c-ink);
  font-size: clamp(23px, 2.6vw, 32px);
  font-weight: 500;
  line-height: 1.9;
  letter-spacing: 0.08em;
}

.msg__text {
  margin-top: 34px;
}

.msg__text p {
  color: var(--c-text);
  font-size: 15px;
  line-height: 2.15;
  letter-spacing: 0.06em;
  white-space: pre-line;
}

.msg__text p + p {
  margin-top: 1.6em;
}

.msg__link {
  margin-top: 38px;
}

.msg__sub {
  position: absolute;
  z-index: 1;
  top: -60px;
  right: 0;
  width: 260px;
  height: 170px;
  border-radius: var(--r-md) 0 0 var(--r-md);
  overflow: hidden;
  opacity: 0.95;
}

.msg__birds {
  position: absolute;
  bottom: 42px;
  left: 4%;
  width: 90px;
  height: 60px;
  color: var(--c-primary);
}

/* ================= about ================= */
.about {
  position: relative;
  background: var(--c-cream);
}

.about__body {
  position: relative;
  padding: 70px 0 110px;
  background: var(--c-primary);
  color: #fff;
  overflow: hidden;
}

.about__story {
  display: grid;
  gap: 100px;
  margin-top: 24px;
}

.story {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: clamp(30px, 6vw, 90px);
  align-items: center;
}

.story--reverse .story__text {
  order: 2;
}

.story--reverse .story__media {
  order: 1;
}

.story__title {
  color: #fff;
  font-size: clamp(20px, 2.2vw, 26px);
  font-weight: 500;
  line-height: 1.95;
  letter-spacing: 0.08em;
}

.story__rule {
  display: block;
  width: 34px;
  height: 1px;
  margin: 26px 0 22px;
  background: rgba(255, 255, 255, 0.6);
}

.story__lead {
  max-width: 400px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  line-height: 2.1;
  letter-spacing: 0.06em;
}

.story__media {
  position: relative;
}

.story__frame {
  height: clamp(260px, 30vw, 400px);
}

.story__num {
  position: absolute;
  right: -14px;
  bottom: -34px;
  color: var(--c-cream);
  opacity: 0.95;
}

.story--reverse .story__num {
  right: auto;
  left: -14px;
}

.about__line {
  width: 300px;
  height: 60px;
  margin: 90px 0 0 40px;
  opacity: 0.8;
}

.about__foot {
  display: flex;
  margin-top: 26px;
  justify-content: flex-end;
}

/* ================= pipeline (menu) ================= */
.menu {
  position: relative;
  padding-bottom: 110px;
  background: var(--c-cream);
}

.menu__media {
  position: relative;
  height: clamp(280px, 38vw, 540px);
  overflow: hidden;
}

.menu__media-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(244, 244, 240, 0) 40%, rgba(244, 244, 240, 0.85) 100%);
}

.menu__body {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 0.72fr 1fr 1fr;
  gap: 26px;
  margin-top: -200px;
  align-items: start;
}

.menu__head {
  padding-right: 20px;
  grid-column: 1;
  grid-row: 1 / span 2;
}

.menu__lead {
  margin: -20px 0 30px;
  color: var(--c-muted);
  font-size: 14px;
  line-height: 2.1;
  letter-spacing: 0.06em;
}

.m-card {
  display: flex;
  min-height: 316px;
  overflow: hidden;
  padding: 26px;
  flex-direction: column;
  border-radius: var(--r-md);
  background: var(--c-white);
  box-shadow: 0 16px 40px rgba(13, 71, 161, 0.09);
  color: var(--c-primary);
  transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
}

.m-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 50px rgba(13, 71, 161, 0.14);
}

.m-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.m-card__photo {
  position: relative;
  display: block;
  height: 132px;
  margin: -26px -26px 0;
  overflow: hidden;
  background: var(--c-primary-100);
}

.m-card__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s var(--ease);
}

.m-card:hover .m-card__photo img {
  transform: scale(1.06);
}

.m-card__body {
  margin-top: auto;
  padding-top: 26px;
}

.m-card__cat {
  color: var(--c-primary);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
}

.m-card__title {
  margin-top: 8px;
  color: var(--c-ink);
  font-size: 17px;
  font-weight: 500;
  line-height: 1.7;
  letter-spacing: 0.06em;
}

.m-card__text {
  margin-top: 6px;
  color: var(--c-muted);
  font-size: 12.5px;
  line-height: 1.9;
  letter-spacing: 0.04em;
}

.m-card__foot {
  display: flex;
  margin-top: 18px;
  padding-top: 14px;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--c-line);
}

.m-card__code {
  color: var(--c-muted);
  font-size: 12px;
  letter-spacing: 0.08em;
}

.m-card__go {
  display: grid;
  width: 38px;
  height: 24px;
  place-items: center;
  border-radius: var(--r-pill);
  background: var(--c-primary);
  color: #fff;
  transition: transform 0.3s var(--ease);
}

.m-card:hover .m-card__go {
  transform: translateX(4px);
}

/* ================= stats ================= */
.stats {
  padding: 44px 0;
  background: var(--c-white);
}

.stats__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-width: calc(var(--contents-inner) + 80px);
}

.stat {
  display: flex;
  padding: 6px 24px;
  flex-direction: column;
  gap: 4px;
  border-left: 1px solid var(--c-line);
  text-align: center;
}

.stat:first-child {
  border-left: 0;
}

.stat strong {
  color: var(--c-primary);
  font-family: var(--font-en);
  font-size: 34px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0.02em;
}

.stat span {
  color: var(--c-muted);
  font-size: 12px;
  line-height: 1.8;
  letter-spacing: 0.04em;
}

/* ================= greeting ================= */
.greet {
  padding: 110px 0;
  background: var(--c-cream);
}

.greet__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: clamp(40px, 6vw, 80px);
  align-items: start;
}

.greet__text p {
  color: var(--c-text);
  font-size: 15px;
  line-height: 2.15;
  letter-spacing: 0.06em;
}

.greet__text p + p {
  margin-top: 1.4em;
}

.greet__profile {
  margin-top: 44px;
}

.greet__row {
  display: flex;
  padding: 20px 0;
  gap: 28px;
  border-top: 1px solid var(--c-line-strong);
}

.greet__row:last-child {
  border-bottom: 1px solid var(--c-line-strong);
}

.greet__row dt {
  width: 84px;
  flex-shrink: 0;
  color: var(--c-muted);
  font-size: 13px;
  letter-spacing: 0.08em;
}

.greet__row dd {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 16px;
}

.greet__row dd strong {
  color: var(--c-ink);
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.14em;
}

.greet__row dd span {
  color: var(--c-muted);
  font-family: var(--font-en);
  font-size: 13px;
  letter-spacing: 0.08em;
}

.greet__row--list dd ul {
  display: grid;
  gap: 6px;
  color: var(--c-text);
  font-size: 13px;
  line-height: 1.9;
}

.greet__row--list dd li {
  position: relative;
  padding-left: 14px;
}

.greet__row--list dd li::before {
  position: absolute;
  top: 0.85em;
  left: 0;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--c-primary-400);
  content: '';
}

.greet__media {
  position: relative;
}

.greet__frame {
  height: clamp(320px, 38vw, 560px);
}

.greet__link {
  margin-top: 30px;
}

/* ================= facility ================= */
.fac {
  position: relative;
  padding: 100px 0 120px;
  background: var(--c-cream);
  overflow: hidden;
}

.fac__head {
  position: relative;
}

.fac__watermark {
  position: absolute;
  z-index: 0;
  top: -30px;
  right: 0;
  color: rgba(25, 118, 210, 0.08);
  font-family: var(--font-en);
  font-size: clamp(56px, 8vw, 116px);
  font-weight: 500;
  line-height: 0.95;
  letter-spacing: 0.01em;
  text-align: right;
  white-space: nowrap;
  pointer-events: none;
}

.fac__scroller {
  display: flex;
  margin-top: 20px;
  padding: 0 var(--container-pad) 18px;
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
}

.fac__item {
  flex: 0 0 clamp(240px, 24vw, 330px);
  scroll-snap-align: start;
}

.fac__art {
  position: relative;
  height: clamp(300px, 30vw, 400px);
}

.fac__label {
  position: absolute;
  top: 18px;
  right: 18px;
  padding: 14px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--c-primary);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.8;
  letter-spacing: 0.16em;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.fac__no {
  margin-top: 16px;
  color: var(--c-primary);
  font-family: var(--font-en);
  font-size: 13px;
  letter-spacing: 0.1em;
}

.fac__text {
  margin-top: 4px;
  color: var(--c-muted);
  font-size: 13px;
  line-height: 1.95;
  letter-spacing: 0.04em;
}

.fac__foot {
  display: flex;
  margin-top: 34px;
  justify-content: flex-end;
}

/* ================= responsive ================= */
@media (max-width: 1100px) {
  .menu__body {
    grid-template-columns: 1fr 1fr;
    margin-top: -120px;
  }

  .menu__head {
    grid-column: 1 / -1;
    grid-row: auto;
  }

  .menu__lead {
    margin-top: 6px;
    max-width: 620px;
  }

  .stats__grid {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 24px;
  }

  .stat:nth-child(3) {
    border-left: 0;
  }
}

@media (max-width: 900px) {
  .hero__script,
  .hero__deco {
    display: none;
  }

  .hero__title {
    line-height: 1.95;
  }

  .msg__grid,
  .story,
  .greet__grid {
    grid-template-columns: 1fr;
  }

  .story--reverse .story__text,
  .story--reverse .story__media {
    order: 0;
  }

  .story--reverse .story__num {
    right: -14px;
    left: auto;
  }

  .msg__sub {
    display: none;
  }

  .msg__watermark {
    display: none;
  }

  .about__story {
    gap: 64px;
  }

  .about__line {
    display: none;
  }

  .about__foot {
    margin-top: 44px;
    justify-content: flex-start;
  }

  .news__grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .news__label {
    padding-top: 0;
  }

  .news__label .head02__en,
  .news__label .head02__zh {
    writing-mode: horizontal-tb;
    transform: none;
  }

  .news__label .head02__zh {
    display: none;
  }
}

@media (max-width: 768px) {
  .hero__body {
    padding: 56px 0 72px;
  }


  .menu__body {
    grid-template-columns: 1fr;
    margin-top: -80px;
  }

  .menu__media {
    height: 240px;
  }

  .m-card {
    min-height: 260px;
  }

  .stats__grid {
    grid-template-columns: 1fr 1fr;
  }

  .stat {
    padding: 6px 10px;
  }

  .stat strong {
    font-size: 26px;
  }

  .greet,
  .fac,
  .msg {
    padding: 72px 0 82px;
  }

  .fac__watermark {
    display: none;
  }

  .greet__row {
    flex-direction: column;
    gap: 8px;
  }

  .greet__row dt {
    width: auto;
  }

  .story__num {
    right: 6px;
    bottom: -16px;
  }

  .fac__item {
    flex: 0 0 min(72vw, 300px);
  }

  .fac__text {
    font-size: 12.5px;
  }
}
</style>

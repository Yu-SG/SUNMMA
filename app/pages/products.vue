<script setup lang="ts">
import { siteConfig } from '~/config/site'

const brand = siteConfig.brand
const products = siteConfig.products

const anchorItems = [
  { id: 'collection', label: '产品系列' },
  { id: 'why', label: '我们的标准' },
]

useSeoMeta({
  title: `产品中心｜${brand.name}`,
  description: `${brand.name} 产品中心：面部护理、功效精华、身体护理与定制礼盒，全部基于自研配方与功效评价体系。`,
  ogTitle: `产品中心｜${brand.name}`,
  ogDescription: `${brand.name} 产品中心：面部护理、功效精华、身体护理与定制礼盒。`,
})

const points = [
  { no: '01', title: '配方可追溯', text: '每一款产品的原料来源、配比与批次记录都完整留存，可追溯到具体生产批次。' },
  { no: '02', title: '功效有数据', text: '在上市前完成体外评价与人体功效测试，用数据说明效果，而不是形容词。' },
  { no: '03', title: '量产有保障', text: '与具备资质的工厂长期合作，从打样到量产保持同一套质量标准。' },
]
</script>

<template>
  <div>
    <PageHero
      en="Products"
      zh="产品中心"
      :title="['以科学配方，', '回应真实的肌肤需求。']"
      lead="从屏障修护到功效精华，我们把实验室里的研究与真实的肌肤问题对齐，做出可以长期使用的产品。"
      art="cell"
    />

    <!-- ================= products ================= -->
    <section id="collection" class="prod section">
      <div class="container">
        <div class="prod__head" data-reveal>
          <SectionHead en="Collection" zh="产品系列" />
          <p class="prod__lead">
            四大产品线覆盖日常护理与定制需求，配方均可按渠道与人群做适配调整。
          </p>
        </div>

        <div class="prod__grid">
          <article v-for="item in products" :key="item.code" class="prod-card" data-reveal>
            <div class="prod-card__media">
              <img :src="item.image" :alt="item.name" loading="lazy" decoding="async" />
            </div>
            <div class="prod-card__body">
              <p class="prod-card__cat">{{ item.category }}</p>
              <h3 class="prod-card__title">{{ item.name }}</h3>
              <p class="prod-card__desc">{{ item.description }}</p>
              <div class="prod-card__foot">
                <span class="prod-card__tag">{{ item.tag }}</span>
                <span class="prod-card__code font-en">{{ item.code }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ================= why (blue) ================= -->
    <section id="why" class="why">
  
      <div class="why__body section--blue">
        <div class="container">
          <SectionHead en="Why us" zh="为什么选择我们" light data-reveal />
          <div class="why__grid">
            <div v-for="point in points" :key="point.no" class="why__item" data-reveal>
              <span class="why__no font-en">#{{ point.no }}</span>
              <h3 class="why__title">{{ point.title }}</h3>
              <p class="why__text">{{ point.text }}</p>
            </div>
          </div>
          <div class="why__foot">
            <ArrowLink to="/contact" label="索取产品资料" light />
          </div>
        </div>
      </div>

      </section>

    <ContactBlock
      id="contact"
      :title="['想要样品或报价？']"
      note="告诉我们渠道、人群与目标价位，我们会给出可落地的配方与包装建议。"
    />

    <SectionAnchor :items="anchorItems" />
  </div>
</template>

<style scoped>
.prod {
  padding: 96px 0 110px;
}

.prod__head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.8fr);
  gap: 48px;
  align-items: end;
  margin-bottom: 48px;
}

.prod__lead {
  color: var(--c-muted);
  font-size: 15px;
  line-height: 2.1;
  letter-spacing: 0.06em;
}

.prod__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.prod-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--r-md);
  background: var(--c-white);
  box-shadow: var(--shadow-card);
  transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
}

.prod-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 50px rgba(13, 71, 161, 0.14);
}

.prod-card__media {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--c-primary-100);
}

.prod-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s var(--ease);
}

.prod-card:hover .prod-card__media img {
  transform: scale(1.05);
}

.prod-card__body {
  display: flex;
  padding: 24px;
  flex: 1;
  flex-direction: column;
}

.prod-card__cat {
  color: var(--c-primary);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
}

.prod-card__title {
  margin-top: 8px;
  color: var(--c-ink);
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.06em;
}

.prod-card__desc {
  margin-top: 10px;
  color: var(--c-muted);
  font-size: 13px;
  line-height: 2;
  letter-spacing: 0.04em;
}

.prod-card__foot {
  display: flex;
  margin-top: auto;
  padding-top: 18px;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--c-line);
}

.prod-card__tag {
  color: var(--c-primary);
  font-size: 11px;
  letter-spacing: 0.1em;
}

.prod-card__code {
  color: var(--c-muted);
  font-size: 12px;
  letter-spacing: 0.08em;
}

.why {
  position: relative;
  background: var(--c-cream);
}

.why__body {
  padding: 64px 0 72px;
}

.why__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.why__item {
  padding-top: 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.35);
}

.why__no {
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--font-en);
  font-size: 13px;
  letter-spacing: 0.1em;
}

.why__title {
  margin-top: 10px;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.08em;
}

.why__text {
  margin-top: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  line-height: 2.05;
  letter-spacing: 0.05em;
}

.why__foot {
  display: flex;
  margin-top: 44px;
  justify-content: flex-end;
}

@media (max-width: 1100px) {
  .prod__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .why__grid {
    grid-template-columns: 1fr;
    gap: 22px;
  }
}

@media (max-width: 768px) {
  .prod {
    padding: 64px 0 76px;
  }

  .prod__head {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 32px;
  }

  .prod__grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .why__foot {
    justify-content: flex-start;
  }
}
</style>

<script setup lang="ts">
import { siteConfig } from '~/config/site'

const brand = siteConfig.brand
const academic = siteConfig.academic

const anchorItems = [
  { id: 'publications', label: '研究成果' },
  { id: 'events', label: '学术活动' },
  { id: 'collab', label: '产学研合作' },
]

useSeoMeta({
  title: `学术交流｜${brand.name}`,
  description: `${brand.name} 学术交流：配方与功效研究成果、学术会议与产学研合作，与高校、医院和研究机构共同推进可信的功效评价。`,
  ogTitle: `学术交流｜${brand.name}`,
  ogDescription: `${brand.name} 学术交流：研究成果、学术会议与产学研合作。`,
})
</script>

<template>
  <div>
    <PageHero
      en="Academic"
      zh="学术交流"
      :title="['把研究说清楚，', '把结论交给数据。']"
      lead="我们相信，好的产品来自可验证的科学。这里记录我们的研究成果、参与学术会议的情况，以及正在进行的合作。"
      art="helix"
    />

    <!-- ================= intro + papers ================= -->
    <section id="publications" class="ac section">
      <div class="container">
        <div class="ac__head" data-reveal>
          <SectionHead en="Publications" zh="研究成果" />
          <p class="ac__lead">{{ academic.intro }}</p>
        </div>

        <div class="ac__papers">
          <article v-for="paper in academic.papers" :key="paper.title" class="ac-paper" data-reveal>
            <span class="ac-paper__year font-en">{{ paper.year }}</span>
            <div class="ac-paper__body">
              <h3 class="ac-paper__title">{{ paper.title }}</h3>
              <div class="ac-paper__meta">
                <span class="ac-paper__journal">{{ paper.journal }}</span>
                <span v-for="tag in paper.tags" :key="tag" class="ac-paper__tag">{{ tag }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ================= events (blue) ================= -->
    <section id="events" class="events">
  
      <div class="events__body section--blue">
        <div class="container">
          <SectionHead en="Events" zh="学术活动" light data-reveal />

          <div class="events__grid">
            <article v-for="event in academic.events" :key="event.name" class="event" data-reveal>
              <p class="event__date font-en">{{ event.date }}</p>
              <h3 class="event__name">{{ event.name }}</h3>
              <p class="event__meta">{{ event.place }} · {{ event.role }}</p>
            </article>
          </div>

          <div class="events__foot">
            <ArrowLink to="/contact" label="邀请我们参与交流" light />
          </div>
        </div>
      </div>

      </section>

    <!-- ================= collaboration ================= -->
    <section id="collab" class="collab section">
      <div class="container collab__grid">
        <div data-reveal>
          <SectionHead en="Collaboration" zh="产学研合作" />
          <p class="collab__lead">
            我们开放部分研究平台与数据能力，与高校、医院和检测机构共同完成从机制到功效的验证。
          </p>
        </div>
        <ul class="collab__list" data-reveal>
          <li v-for="(item, i) in academic.collab" :key="item" class="collab__item">
            <span class="collab__no font-en">{{ String(i + 1).padStart(2, '0') }}</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </section>

    <ContactBlock
      id="contact"
      :title="['想一起做研究？']"
      note="欢迎高校、医院与检测机构提出合作方向，我们会在两个工作日内回复。"
    />

    <SectionAnchor :items="anchorItems" />
  </div>
</template>

<style scoped>
.ac {
  padding: 96px 0 80px;
}

.ac__head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.9fr);
  gap: 48px;
  align-items: end;
  margin-bottom: 44px;
}

.ac__lead {
  color: var(--c-muted);
  font-size: 15px;
  line-height: 2.1;
  letter-spacing: 0.06em;
}

.ac__papers {
  border-top: 1px solid var(--c-line-strong);
}

.ac-paper {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  padding: 26px 8px;
  gap: 20px;
  border-bottom: 1px solid var(--c-line-strong);
  transition: background 0.3s var(--ease);
}

.ac-paper:hover {
  background: rgba(25, 118, 210, 0.04);
}

.ac-paper__year {
  color: var(--c-primary);
  font-family: var(--font-en);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.08em;
}

.ac-paper__title {
  color: var(--c-ink);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.8;
  letter-spacing: 0.06em;
}

.ac-paper__meta {
  display: flex;
  margin-top: 8px;
  flex-wrap: wrap;
  gap: 8px 14px;
  align-items: center;
}

.ac-paper__journal {
  color: var(--c-muted);
  font-size: 12.5px;
  letter-spacing: 0.04em;
}

.ac-paper__tag {
  padding: 3px 10px;
  border-radius: var(--r-pill);
  background: var(--c-primary-100);
  color: var(--c-primary);
  font-size: 11px;
  letter-spacing: 0.06em;
}

.events {
  position: relative;
  background: var(--c-cream);
}

.events__body {
  padding: 64px 0 72px;
}

.events__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.event {
  padding: 26px;
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: var(--r-md);
  background: rgba(255, 255, 255, 0.06);
}

.event__date {
  color: rgba(255, 255, 255, 0.75);
  font-family: var(--font-en);
  font-size: 13px;
  letter-spacing: 0.1em;
}

.event__name {
  margin-top: 10px;
  color: #fff;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.7;
  letter-spacing: 0.05em;
}

.event__meta {
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  letter-spacing: 0.05em;
}

.events__foot {
  display: flex;
  margin-top: 40px;
  justify-content: flex-end;
}

.collab {
  padding: 90px 0 100px;
}

.collab__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 60px;
  align-items: start;
}

.collab__lead {
  max-width: 460px;
  color: var(--c-muted);
  font-size: 15px;
  line-height: 2.1;
  letter-spacing: 0.06em;
}

.collab__list {
  display: grid;
}

.collab__item {
  display: flex;
  padding: 20px 4px;
  gap: 20px;
  align-items: baseline;
  border-top: 1px solid var(--c-line);
  color: var(--c-text);
  font-size: 15px;
  letter-spacing: 0.05em;
}

.collab__item:last-child {
  border-bottom: 1px solid var(--c-line);
}

.collab__no {
  color: var(--c-primary);
  font-family: var(--font-en);
  font-size: 12px;
  letter-spacing: 0.1em;
}

@media (max-width: 1100px) {
  .events__grid {
    grid-template-columns: 1fr;
  }

  .collab__grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

@media (max-width: 768px) {
  .ac {
    padding: 64px 0 56px;
  }

  .ac__head {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 28px;
  }

  .ac-paper {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .events__body {
    padding: 48px 0 56px;
  }

  .events__foot {
    justify-content: flex-start;
  }

  .collab {
    padding: 64px 0 72px;
  }
}
</style>

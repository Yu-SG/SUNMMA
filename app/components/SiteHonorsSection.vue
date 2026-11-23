<script setup lang="ts">
import { ref } from 'vue'

interface Honor {
  title: string
  issuer: string
  date: string
  image: string
  note?: string
}

const honors: Honor[] = [
  {
    title: '高新技术企业证书',
    issuer: '四川省科学技术厅 · 四川省财政厅 · 国家税务总局四川省税务局',
    date: '2023 年 12 月',
    image: '/images/honors/high-tech-2023.jpg',
    note: '证书编号 GR202351006036，有效期三年',
  },
  {
    title: '四川省“专精特新”中小企业',
    issuer: '四川省经济和信息化厅',
    date: '2023.11 — 2026.10',
    image: '/images/honors/sme-specialized.jpg',
  },
  {
    title: '四川省创新型中小企业',
    issuer: '四川省经济和信息化厅',
    date: '',
    image: '/images/honors/sme-innovative.jpg',
  },
  {
    title: '成都高新区梯度培育企业 · 瞪羚企业',
    issuer: '成都高新区管委会',
    date: '2023 年 11 月',
    image: '/images/honors/gazelle-2023.jpg',
  },
  {
    title: '成都高新区梯度培育企业 · 种子期雏鹰企业',
    issuer: '成都高新区管委会',
    date: '2020 年 9 月',
    image: '/images/honors/eagle-2020.jpg',
  },
]

const active = ref<Honor | null>(null)
const open = ref(false)

const show = (honor: Honor) => {
  active.value = honor
  open.value = true
}
</script>

<template>
  <section id="honors" class="honors">
    <v-container>
      <SectionHead
        en="Honors"
        zh="荣誉资质"
        desc="从高新技术企业到四川省“专精特新”中小企业，这些认定记录了我们把研发做扎实的过程。"
      />

      <v-row class="honor-grid">
        <v-col v-for="honor in honors" :key="honor.title" cols="12" sm="6" lg="4">
          <v-card class="honor-card" @click="show(honor)">
            <v-img
              :src="honor.image"
              :alt="honor.title"
              :aspect-ratio="4 / 3"
              cover
              eager
              class="honor-card__img"
            />
            <div class="honor-card__body">
              <h3 class="honor-card__title">{{ honor.title }}</h3>
              <p class="honor-card__issuer">{{ honor.issuer }}</p>
              <p v-if="honor.date" class="honor-card__date font-en">{{ honor.date }}</p>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="open" :max-width="900" scrollable>
      <v-card v-if="active" class="honor-dialog">
        <v-btn
          icon="mdi-close"
          variant="text"
          class="honor-dialog__close"
          aria-label="关闭"
          @click="open = false"
        />
        <v-img :src="active.image" :alt="active.title" cover class="honor-dialog__img" />
        <div class="honor-dialog__body">
          <h2 class="honor-dialog__title">{{ active.title }}</h2>
          <p class="honor-dialog__issuer">{{ active.issuer }}</p>
          <p v-if="active.date" class="honor-dialog__meta font-en">{{ active.date }}</p>
          <p v-if="active.note" class="honor-dialog__note">{{ active.note }}</p>
        </div>
      </v-card>
    </v-dialog>
  </section>
</template>

<style scoped>
.honors {
  padding: 78px 0 84px;
  background: #fff;
  scroll-margin-top: 100px;
}

.honor-grid {
  row-gap: 4px;
}

.honor-card {
  height: 100%;
  overflow: hidden;
  border: 1px solid rgba(16, 35, 58, 0.08);
  cursor: pointer;
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}

.honor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgba(13, 71, 161, 0.12);
}

.honor-card__img {
  background: #f1f5fa;
}

.honor-card__body {
  padding: 16px 18px 18px;
}

.honor-card__title {
  color: #10233a;
  font-size: 15.5px;
  font-weight: 600;
  line-height: 1.6;
}

.honor-card__issuer {
  margin-top: 6px;
  color: #7b8794;
  font-size: 12.5px;
  line-height: 1.7;
}

.honor-card__date {
  margin-top: 6px;
  color: #1976d2;
  font-size: 12px;
  letter-spacing: 0.04em;
}

.honor-dialog {
  overflow: hidden;
}

.honor-dialog__close {
  position: absolute;
  z-index: 3;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 2px 10px rgba(16, 35, 58, 0.18);
}

.honor-dialog__img {
  max-height: 62vh;
  background: #f1f5fa;
}

.honor-dialog__body {
  padding: 20px 26px 24px;
}

.honor-dialog__title {
  color: #10233a;
  font-size: 20px;
  font-weight: 700;
}

.honor-dialog__issuer {
  margin-top: 6px;
  color: #6b7c8f;
  font-size: 13px;
  line-height: 1.7;
}

.honor-dialog__meta {
  margin-top: 4px;
  color: #1976d2;
  font-size: 12.5px;
}

.honor-dialog__note {
  margin-top: 8px;
  color: #7b8794;
  font-size: 12.5px;
}

@media (max-width: 700px) {
  .honors {
    padding: 54px 0 60px;
  }
}
</style>

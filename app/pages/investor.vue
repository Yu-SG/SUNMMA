<script setup lang="ts">
import { computed, ref } from 'vue'
import { siteConfig } from '~/config/site'

const page = siteConfig.pages.investor
const ALL = '全部'
const activeType = ref(ALL)
const types = computed(() => [ALL, ...new Set(page.items.map((item) => item.type))])
const filtered = computed(() =>
  activeType.value === ALL ? page.items : page.items.filter((item) => item.type === activeType.value),
)

const formatDate = (date: string) => {
  const [year, month, day] = date.split('-')
  return { day, month: `${year}.${month}`, year }
}

const selectType = (value: unknown) => {
  activeType.value = typeof value === 'string' ? value : ALL
}

type Notice = (typeof page.items)[number]

const noticeOpen = ref(false)
const activeNotice = ref<Notice | null>(null)

const openNotice = (item: Notice) => {
  activeNotice.value = item
  noticeOpen.value = true
}

useSeoMeta({
  title: `投资者关系｜${siteConfig.brand.name} 制药`,
  description: page.intro[0] || `${siteConfig.brand.name} 制药投资者关系`,
  ogTitle: `投资者关系｜${siteConfig.brand.name} 制药`,
  ogDescription: page.intro[0] || '',
})
</script>

<template>
  <div class="investor-page">
    <SitePageHead :title="page.title" :subtitle="page.subtitle" :intro="page.intro" />

    <section class="section">
      <v-container>
        <v-row>
          <v-col cols="12" md="8" lg="8">
            <SectionHead en="Announcements" zh="公告与信息披露" desc="公司公告、定期报告与投资者活动信息。" />

            <div class="notice-chips">
              <v-chip
                v-for="type in types"
                :key="type"
                size="small"
                :variant="activeType === type ? 'flat' : 'outlined'"
                :color="activeType === type ? 'primary' : undefined"
                class="notice-chip"
                @click="selectType(type)"
              >
                {{ type }}
              </v-chip>
            </div>

            <div class="notice-list">
              <button
                v-for="item in filtered"
                :key="item.title"
                type="button"
                class="notice-row"
                @click="openNotice(item)"
              >
                <div class="notice-date">
                  <span class="notice-date__day font-en">{{ formatDate(item.date).day }}</span>
                  <span class="notice-date__month font-en">{{ formatDate(item.date).month }}</span>
                </div>
                <div class="notice-body">
                  <v-chip size="x-small" color="primary" variant="tonal">{{ item.type }}</v-chip>
                  <h3 class="notice-title">{{ item.title }}</h3>
                </div>
                <span class="notice-action">
                  查看
                  <v-icon icon="mdi-file-document-outline" size="16" />
                </span>
              </button>
            </div>
          </v-col>

          <v-col cols="12" md="4" lg="4">
            <aside class="investor-aside">
              <v-card class="investor-contact">
                <p class="investor-contact__label font-en">INVESTOR RELATIONS</p>
                <h3 class="investor-contact__title">投资者关系联络</h3>
                <p class="investor-contact__text">
                  我们欢迎投资者、分析师与媒体就公司经营与发展进行沟通。
                </p>
                <ul class="investor-contact__list">
                  <li>
                    <v-icon icon="mdi-email-outline" size="16" />
                    <span>ir@xxx.com</span>
                  </li>
                  <li>
                    <v-icon icon="mdi-phone-outline" size="16" />
                    <span>{{ siteConfig.site.phone }}</span>
                  </li>
                  <li>
                    <v-icon icon="mdi-map-marker-outline" size="16" />
                    <span>{{ siteConfig.brand.address }}</span>
                  </li>
                </ul>
                <v-btn color="primary" to="/contact" block class="mt-2">投资者咨询</v-btn>
              </v-card>

              <v-card class="investor-note">
                <h3 class="investor-note__title">信息披露说明</h3>
                <p class="investor-note__text">
                  本页面所载信息仅为公司公开信息的汇总，不构成任何投资建议。公告全文以公司在监管机构指定媒体披露的内容为准。
                </p>
                <v-divider class="my-4" />
                <p class="investor-note__meta font-en">LAST UPDATED · 2026.10</p>
              </v-card>
            </aside>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <v-dialog v-model="noticeOpen" max-width="720" scrollable>
      <v-card v-if="activeNotice" rounded="xl">
        <v-card-item class="pb-2">
          <v-card-title class="text-h6">{{ activeNotice.title }}</v-card-title>
          <v-card-subtitle class="d-flex align-center ga-2 pt-2">
            <v-chip size="x-small" color="primary" variant="tonal">{{ activeNotice.type }}</v-chip>
            <span class="font-en">{{ activeNotice.date }}</span>
          </v-card-subtitle>
        </v-card-item>
        <v-divider />
        <v-card-text class="py-5 notice-detail">
          <p v-if="activeNotice.summary" class="notice-detail__summary">{{ activeNotice.summary }}</p>
          <p v-for="(paragraph, index) in activeNotice.body || []" :key="index" class="notice-detail__paragraph">
            {{ paragraph }}
          </p>
          <p v-if="!activeNotice.summary && !(activeNotice.body || []).length" class="text-medium-emphasis">
            公告全文请以监管机构指定媒体披露的内容为准。
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions class="px-4 py-3">
          <v-btn
            v-if="activeNotice.url"
            :href="activeNotice.url"
            target="_blank"
            rel="noopener noreferrer"
            variant="text"
            color="primary"
            append-icon="mdi-open-in-new"
          >
            查看原文
          </v-btn>
          <v-spacer />
          <v-btn variant="text" @click="noticeOpen = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.section {
  padding: 56px 0 80px;
  background: #fff;
}

.notice-chips {
  display: flex;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 8px;
}

.notice-chip {
  letter-spacing: 0.02em;
}

.notice-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid rgba(16, 35, 58, 0.1);
}

.notice-row {
  display: flex;
  width: 100%;
  padding: 22px 4px;
  align-items: center;
  gap: 22px;
  border: 0;
  border-bottom: 1px dashed rgba(16, 35, 58, 0.12);
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s var(--ease);
}

.notice-detail__summary {
  margin: 0 0 18px;
  color: rgb(var(--v-theme-on-surface));
  font-size: 15px;
  font-weight: 500;
  line-height: 1.9;
}

.notice-detail__paragraph {
  margin: 0 0 14px;
  color: rgba(var(--v-theme-on-surface), 0.78);
  font-size: 14.5px;
  line-height: 2;
}

.notice-detail__paragraph:last-child {
  margin-bottom: 0;
}

.notice-row:hover {
  background: #f8fbff;
}

.notice-date {
  display: flex;
  width: 84px;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  border-right: 1px solid rgba(16, 35, 58, 0.1);
}

.notice-date__day {
  color: #1976d2;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.1;
}

.notice-date__month {
  color: #8b98a6;
  font-size: 11px;
  letter-spacing: 0.08em;
}

.notice-body {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.notice-title {
  color: #10233a;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.6;
  transition: color 0.2s var(--ease);
}

.notice-row:hover .notice-title {
  color: #1976d2;
}

.notice-action {
  display: inline-flex;
  margin-left: auto;
  align-items: center;
  gap: 4px;
  color: #8b98a6;
  font-size: 12.5px;
  white-space: nowrap;
}

.notice-row:hover .notice-action {
  color: #1976d2;
}

.investor-aside {
  display: flex;
  padding-top: 84px;
  flex-direction: column;
  gap: 18px;
}

.investor-contact {
  padding: 26px 24px;
  background: linear-gradient(160deg, #0d47a1, #1976d2 70%, #26c6da);
  color: #fff;
}

.investor-contact__label {
  color: rgba(255, 255, 255, 0.62);
  font-size: 10px;
  letter-spacing: 0.24em;
}

.investor-contact__title {
  margin-top: 6px;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
}

.investor-contact__text {
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 13px;
  line-height: 1.85;
}

.investor-contact__list {
  display: flex;
  padding: 0;
  margin: 18px 0 20px;
  flex-direction: column;
  gap: 10px;
  list-style: none;
  color: rgba(255, 255, 255, 0.86);
  font-size: 13px;
}

.investor-contact__list li {
  display: flex;
  align-items: flex-start;
  gap: 7px;
}

.investor-contact :deep(.v-btn) {
  background: #fff;
  color: #0d47a1;
}

.investor-note {
  padding: 24px;
  border: 1px solid rgba(16, 35, 58, 0.09);
  background: #f8fafc;
}

.investor-note__title {
  color: #10233a;
  font-size: 16px;
  font-weight: 600;
}

.investor-note__text {
  margin-top: 10px;
  color: #6b7c8f;
  font-size: 12.5px;
  line-height: 1.9;
}

.investor-note__meta {
  color: #9aa6b2;
  font-size: 10px;
  letter-spacing: 0.16em;
}

@media (max-width: 959px) {
  .investor-aside {
    padding-top: 10px;
  }

  .notice-row {
    gap: 14px;
  }

  .notice-date {
    width: 64px;
  }

  .notice-date__day {
    font-size: 22px;
  }

  .notice-title {
    font-size: 14.5px;
  }

  .notice-action {
    display: none;
  }
}
</style>

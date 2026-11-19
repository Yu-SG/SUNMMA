<script setup lang="ts">
import { computed } from 'vue'
import { siteConfig } from '~/config/site'

const page = siteConfig.pages.contact
const brand = siteConfig.brand
const phoneHref = computed(() => `tel:${siteConfig.site.phone.replace(/[^\d+]/g, '')}`)
const mapHref = computed(() => `https://map.baidu.com/search/${encodeURIComponent(brand.address)}`)

const departments = [
  { label: '产品与商务合作', email: 'partner@xxx.com' },
  { label: '投资者关系', email: 'ir@xxx.com' },
  { label: '简历投递', email: 'hr@xxx.com' },
]

useSeoMeta({
  title: `联系我们｜${siteConfig.brand.name} 制药`,
  description: page.intro[0] || `联系 ${siteConfig.brand.name} 制药`,
  ogTitle: `联系我们｜${siteConfig.brand.name} 制药`,
  ogDescription: page.intro[0] || '',
})
</script>

<template>
  <div class="contact-page">
    <SitePageHead :title="page.title" :subtitle="page.subtitle" :intro="page.intro" />

    <section class="section">
      <v-container>
        <v-row class="contact-row">
          <v-col cols="12" lg="5" md="5">
            <div class="contact-info">
              <p class="contact-info__label font-en">CONTACT INFORMATION</p>
              <h2 class="contact-info__title">联系方式</h2>

              <ul class="contact-list">
                <li>
                  <span class="contact-list__icon"><v-icon icon="mdi-map-marker-outline" size="20" /></span>
                  <div>
                    <span class="contact-list__label">公司地址</span>
                    <span class="contact-list__value">{{ brand.address }}</span>
                  </div>
                </li>
                <li>
                  <span class="contact-list__icon"><v-icon icon="mdi-phone-outline" size="20" /></span>
                  <div>
                    <span class="contact-list__label">总机电话</span>
                    <a class="contact-list__value" :href="phoneHref">{{ siteConfig.site.phone }}</a>
                  </div>
                </li>
                <li>
                  <span class="contact-list__icon"><v-icon icon="mdi-email-outline" size="20" /></span>
                  <div>
                    <span class="contact-list__label">电子邮箱</span>
                    <a class="contact-list__value" :href="`mailto:${brand.email}`">{{ brand.email }}</a>
                  </div>
                </li>
                <li>
                  <span class="contact-list__icon"><v-icon icon="mdi-clock-outline" size="20" /></span>
                  <div>
                    <span class="contact-list__label">工作时间</span>
                    <span class="contact-list__value">周一至周五 9:00 – 17:30</span>
                  </div>
                </li>
              </ul>

              <div class="department-list">
                <p class="department-list__title">部门联络</p>
                <div v-for="department in departments" :key="department.email" class="department">
                  <span>{{ department.label }}</span>
                  <a :href="`mailto:${department.email}`">{{ department.email }}</a>
                </div>
              </div>

              <a class="map-card" :href="mapHref" target="_blank" rel="noopener noreferrer">
                <div class="map-card__grid" aria-hidden="true">
                  <span class="map-card__road map-card__road--h" />
                  <span class="map-card__road map-card__road--v" />
                  <span class="map-card__pin"><v-icon icon="mdi-map-marker" size="26" color="primary" /></span>
                </div>
                <div class="map-card__text">
                  <span>查看地图位置</span>
                  <v-icon icon="mdi-open-in-new" size="14" />
                </div>
              </a>
            </div>
          </v-col>

          <v-col cols="12" lg="7" md="7">
            <v-card class="form-card">
              <div class="form-card__head">
                <p class="form-card__label font-en">ENQUIRY</p>
                <h2 class="form-card__title">在线留言</h2>
                <p class="form-card__text">
                  请填写以下信息，我们会在 2 个工作日内与你联系。
                </p>
              </div>
              <SiteForm :page="page" type="contact" />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<style scoped>
.section {
  padding: 52px 0 80px;
  background: #fff;
}

.contact-row {
  row-gap: 26px;
}

.contact-info__label {
  color: #1976d2;
  font-size: 10.5px;
  letter-spacing: 0.24em;
}

.contact-info__title {
  margin-top: 6px;
  color: #10233a;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.contact-list {
  display: flex;
  padding: 0;
  margin: 24px 0 0;
  flex-direction: column;
  gap: 18px;
  list-style: none;
}

.contact-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.contact-list__icon {
  display: grid;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 12px;
  background: #eaf3fc;
  color: #1976d2;
}

.contact-list__label {
  display: block;
  color: #8b98a6;
  font-size: 12px;
}

.contact-list__value {
  display: block;
  margin-top: 2px;
  color: #10233a;
  font-size: 14.5px;
  line-height: 1.7;
  word-break: break-word;
}

a.contact-list__value:hover {
  color: #1976d2;
}

.department-list {
  margin-top: 26px;
  padding-top: 20px;
  border-top: 1px solid rgba(16, 35, 58, 0.09);
}

.department-list__title {
  color: #10233a;
  font-size: 14px;
  font-weight: 600;
}

.department {
  display: flex;
  margin-top: 10px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #6b7c8f;
  font-size: 13px;
}

.department a {
  color: #1976d2;
}

.map-card {
  display: block;
  margin-top: 26px;
  overflow: hidden;
  border: 1px solid rgba(16, 35, 58, 0.09);
  border-radius: 16px;
  transition: box-shadow 0.25s var(--ease);
}

.map-card:hover {
  box-shadow: 0 14px 30px rgba(13, 71, 161, 0.12);
}

.map-card__grid {
  position: relative;
  height: 132px;
  background:
    linear-gradient(rgba(25, 118, 210, 0.08) 1px, transparent 1px) 0 0 / 100% 26px,
    linear-gradient(90deg, rgba(25, 118, 210, 0.08) 1px, transparent 1px) 0 0 / 34px 100%,
    linear-gradient(140deg, #eaf4fd, #f7fbff);
}

.map-card__road {
  position: absolute;
  background: rgba(25, 118, 210, 0.12);
}

.map-card__road--h {
  top: 58%;
  left: 0;
  width: 100%;
  height: 10px;
}

.map-card__road--v {
  top: 0;
  left: 38%;
  width: 10px;
  height: 100%;
}

.map-card__pin {
  position: absolute;
  top: 50%;
  left: 52%;
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 8px 18px rgba(13, 71, 161, 0.22);
  transform: translate(-50%, -50%);
}

.map-card__text {
  display: flex;
  padding: 12px 16px;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  color: #10233a;
  font-size: 13px;
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
}

.form-card :deep(.site-form) {
  margin-top: 22px;
}

@media (max-width: 700px) {
  .section {
    padding: 34px 0 56px;
  }

  .form-card {
    padding: 22px 18px 20px;
  }

  .contact-info__title {
    font-size: 24px;
  }
}
</style>

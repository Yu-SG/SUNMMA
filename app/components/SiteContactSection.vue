<script setup lang="ts">
import { computed } from 'vue'
import { siteConfig } from '~/config/site'

const page = siteConfig.pages.contact
const brand = siteConfig.brand
const phone = siteConfig.site.phone || brand.phone
const phoneHref = computed(() => `tel:${phone.replace(/[^\d+]/g, '')}`)
const mapHref = computed(() => `https://map.baidu.com/search/${encodeURIComponent(brand.address)}`)

const departments = [
  { name: '生产部', phone: '028-65220800-8003' },
  { name: '质量部', phone: '028-65220800-8006' },
  { name: '办公室', phone: '028-65220800-8001' },
  { name: '药物警戒部', phone: '028-65220800-8008' },
  { name: '药政部', phone: '028-85182488' },
]

const salesContact = { name: '杨博', phone: '13925189289' }
</script>

<template>
  <section id="contact" class="contact-section">
    <v-container>
      <SectionHead
        en="Contact"
        zh="联系我们"
        desc="无论是产品合作、委托生产、研发合作，还是供应商合作，都欢迎与我们联系。"
      />

      <v-row class="contact-row">
        <v-col cols="12" lg="5" md="5">
          <div class="contact-info">
            <p class="contact-info__label font-en">CONTACT INFORMATION</p>
            <h2 class="contact-info__title">联系方式</h2>

            <ul class="contact-list">
              <li>
                <span class="contact-list__icon"><v-icon icon="mdi-domain" size="20" /></span>
                <div>
                  <span class="contact-list__label">公司名称</span>
                  <span class="contact-list__value">舒美奇成都生物科技有限公司</span>
                </div>
              </li>
              <li>
                <span class="contact-list__icon"><v-icon icon="mdi-map-marker-outline" size="20" /></span>
                <div>
                  <span class="contact-list__label">公司地址</span>
                  <span class="contact-list__value">{{ brand.address }}</span>
                </div>
              </li>
              <li v-if="phone">
                <span class="contact-list__icon"><v-icon icon="mdi-phone-outline" size="20" /></span>
                <div>
                  <span class="contact-list__label">总机电话</span>
                  <a class="contact-list__value" :href="phoneHref">{{ phone }}</a>
                </div>
              </li>
              <li v-if="brand.email">
                <span class="contact-list__icon"><v-icon icon="mdi-email-outline" size="20" /></span>
                <div>
                  <span class="contact-list__label">药物警戒邮箱</span>
                  <a class="contact-list__value" :href="`mailto:${brand.email}`">{{ brand.email }}</a>
                </div>
              </li>
            </ul>

            <p v-if="!phone || !brand.email" class="contact-note">
              电话、邮箱与微信公众号信息整理中，请先通过右侧表单留言，我们会在 2 个工作日内回复。
            </p>

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
              <p class="form-card__text">请填写以下信息，我们会在 2 个工作日内与你联系。</p>
            </div>
            <SiteForm :page="page" type="contact" />
          </v-card>
        </v-col>
      </v-row>

      <div class="departments">
        <h3 class="departments__title">部门联络</h3>
        <ul class="departments__grid">
          <li v-for="dept in departments" :key="dept.name" class="department">
            <span class="department__name">{{ dept.name }}</span>
            <span class="department__phone font-en">{{ dept.phone }}</span>
          </li>
          <li class="department department--sales">
            <span class="department__name">产品销售联系人</span>
            <span class="department__phone font-en">{{ salesContact.name }} · {{ salesContact.phone }}</span>
          </li>
        </ul>
      </div>
    </v-container>
  </section>
</template>

<style scoped>
.contact-section {
  padding: 78px 0 84px;
  background: #f5f7fa;
  scroll-margin-top: 120px;
}

.contact-row {
  row-gap: 26px;
}

.departments {
  margin-top: 42px;
  padding-top: 30px;
  border-top: 1px solid rgba(16, 35, 58, 0.09);
}

.departments__title {
  color: #10233a;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.departments__grid {
  display: grid;
  padding: 0;
  margin: 18px 0 0;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px 18px;
  list-style: none;
}

.department {
  display: flex;
  padding: 14px 16px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid rgba(16, 35, 58, 0.08);
  border-radius: 12px;
  background: #fff;
}

.department__name {
  color: #33414b;
  font-size: 13.5px;
}

.department__phone {
  color: #1976d2;
  font-size: 13.5px;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.department--sales {
  border-color: rgba(25, 118, 210, 0.28);
  background: #f3f9ff;
}

.department--sales .department__name {
  color: #0d47a1;
  font-weight: 500;
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

.contact-note {
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #fff;
  color: #5b6472;
  font-size: 13px;
  line-height: 1.85;
}

.map-card {
  display: block;
  margin-top: 26px;
  overflow: hidden;
  border: 1px solid rgba(16, 35, 58, 0.09);
  border-radius: 16px;
  background: #fff;
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
  background: #fff;
  color: #10233a;
  font-size: 13px;
}

.form-card {
  height: 100%;
  padding: 30px 30px 26px;
  border: 1px solid rgba(16, 35, 58, 0.09);
  background: #fff;
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

@media (max-width: 959px) {
  .departments__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .contact-section {
    padding: 54px 0 60px;
  }

  .form-card {
    padding: 22px 18px 20px;
  }

  .contact-info__title {
    font-size: 24px;
  }

  .departments__grid {
    grid-template-columns: 1fr;
  }
}
</style>

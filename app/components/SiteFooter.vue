<script setup lang="ts">
import { computed } from 'vue'
import { siteConfig } from '~/config/site'

const year = new Date().getFullYear()
const phoneHref = computed(() => {
  const raw = siteConfig.site.phone || siteConfig.brand.phone
  return `tel:${raw.replace(/[^\d+]/g, '')}`
})
const navLinks = computed(() => siteConfig.nav.filter((item) => item.to !== '/'))
const productLinks = computed(() => siteConfig.pages.products.categories)
const newsLinks = computed(() => siteConfig.pages.news.categories)
</script>

<template>
  <v-footer color="footer" class="site-footer pa-0">
    <div class="footer-main">
      <v-container class="footer-inner">
        <v-row density="compact">
          <v-col cols="12" lg="3" md="6">
            <div class="footer-brand">
              <img
                v-if="siteConfig.brand.logo"
                :src="siteConfig.brand.logo"
                :alt="siteConfig.brand.name"
                class="footer-brand__logo"
              />
              <SiteLogo v-else light :size="40" />
            </div>
            <p class="footer-desc">{{ siteConfig.brand.description }}</p>
            <div v-if="siteConfig.social.wechat" class="footer-qr">
              <v-img
                src="/images/qr-wechat.svg"
                alt="微信公众号二维码"
                width="92"
                height="92"
                eager
                class="footer-qr__img"
              />
              <div>
                <p class="footer-qr__title">微信公众号</p>
                <p class="footer-qr__hint">扫码关注 {{ siteConfig.brand.name }} 最新动态</p>
              </div>
            </div>
          </v-col>

          <v-col cols="6" lg="2" md="3" sm="6">
            <h3 class="footer-title">站点导航</h3>
            <ul class="footer-list">
              <li v-for="item in navLinks" :key="item.to">
                <NuxtLink :to="item.to">{{ item.label }}</NuxtLink>
              </li>
            </ul>
          </v-col>

          <v-col cols="6" lg="2" md="3" sm="6">
            <h3 class="footer-title">产品与栏目</h3>
            <ul class="footer-list">
              <li v-for="category in productLinks" :key="category">
                <NuxtLink :to="{ path: '/products', query: { category } }">{{ category }}</NuxtLink>
              </li>
              <li v-for="category in newsLinks" :key="category">
                <NuxtLink :to="{ path: '/news', query: { category } }">{{ category }}</NuxtLink>
              </li>
              <li><NuxtLink to="/investor">投资者关系</NuxtLink></li>
              <li><NuxtLink to="/jobs">加入我们</NuxtLink></li>
            </ul>
          </v-col>

          <v-col cols="12" lg="3" md="6" sm="6">
            <h3 class="footer-title">联系方式</h3>
            <ul class="footer-list footer-list--contact">
              <li v-if="siteConfig.site.phone">
                <a :href="phoneHref">
                  <v-icon icon="mdi-phone-outline" size="15" />
                  {{ siteConfig.site.phone }}
                </a>
              </li>
              <li v-if="siteConfig.brand.email">
                <a :href="`mailto:${siteConfig.brand.email}`">
                  <v-icon icon="mdi-email-outline" size="15" />
                  {{ siteConfig.brand.email }}
                </a>
              </li>
              <li>
                <span class="footer-address">
                  <v-icon icon="mdi-map-marker-outline" size="15" />
                  {{ siteConfig.brand.address }}
                </span>
              </li>
              <li v-if="!siteConfig.site.phone && !siteConfig.brand.email" class="footer-hours">
                电话与邮箱信息整理中
              </li>
            </ul>
          </v-col>

          <v-col cols="12" lg="2" md="6" sm="6">
            <h3 class="footer-title">友情链接</h3>
            <ul class="footer-list">
              <li v-for="link in siteConfig.site.footerLinks" :key="link.url">
                <a :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
              </li>
            </ul>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div class="footer-legal">
      <v-container class="footer-legal__inner">
        <p class="footer-legal__line">
          <span>© {{ year }} {{ siteConfig.brand.nameEn }}. All rights reserved.</span>
          <a v-if="siteConfig.site.icp" href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">
            {{ siteConfig.site.icp }}
          </a>
        </p>
        <p v-if="siteConfig.site.license" class="footer-legal__line">
          《互联网药品信息服务资格证书》编号：{{ siteConfig.site.license }}
        </p>
        <p class="footer-legal__line footer-legal__disclaimer">
          {{ siteConfig.site.disclaimer }}
        </p>
      </v-container>
    </div>
  </v-footer>
</template>

<style scoped>
.site-footer {
  display: block;
  color: #c9d8e8;
  font-size: 13.5px;
  letter-spacing: 0.03em;
}

.footer-main {
  width: 100%;
  padding: 64px 0 48px;
  border-top: 3px solid #1976d2;
}

.footer-inner {
  max-width: 1240px;
  padding-inline: 24px;
}

.footer-brand {
  display: inline-flex;
  padding: 12px 16px;
  border-radius: 12px;
  background: #fff;
}

.footer-brand__logo {
  display: block;
  width: auto;
  height: 36px;
}

.footer-desc {
  max-width: 380px;
  margin-top: 18px;
  color: #8fa6bd;
  font-size: 13px;
  line-height: 1.9;
}

.footer-qr {
  display: flex;
  margin-top: 22px;
  align-items: center;
  gap: 14px;
}

.footer-qr__img {
  flex-shrink: 0;
  border-radius: 10px;
  background: #fff;
}

.footer-qr__title {
  color: #fff;
  font-size: 13px;
  font-weight: 500;
}

.footer-qr__hint {
  margin-top: 4px;
  color: #8fa6bd;
  font-size: 11.5px;
}

.footer-title {
  margin-bottom: 18px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.12em;
}

.footer-list {
  display: flex;
  padding: 0;
  margin: 0;
  flex-direction: column;
  gap: 11px;
  list-style: none;
  color: #9fb3c8;
}

.footer-list a {
  transition: color 0.2s var(--ease);
}

.footer-list a:hover {
  color: #64b5f6;
}

.footer-list--contact li {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  line-height: 1.6;
}

.footer-list--contact a,
.footer-address {
  display: inline-flex;
  min-width: 0;
  align-items: flex-start;
  gap: 6px;
  word-break: break-word;
}

.footer-list--contact :deep(.v-icon) {
  margin-top: 2px;
  flex-shrink: 0;
}

.footer-hours {
  color: #7c93a9;
}

.footer-legal {
  width: 100%;
  padding: 22px 0 26px;
  background: rgba(0, 0, 0, 0.24);
}

.footer-legal__inner {
  max-width: 1240px;
  padding-inline: 24px;
}

.footer-legal__line {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  gap: 8px 24px;
  color: #7f95aa;
  font-size: 12px;
  line-height: 1.9;
}

.footer-legal__line + .footer-legal__line {
  margin-top: 6px;
}

.footer-legal__line a {
  color: #9fb3c8;
}

.footer-legal__line a:hover {
  color: #64b5f6;
}

.footer-legal__disclaimer {
  color: #6e8499;
}

@media (max-width: 960px) {
  .footer-main {
    padding: 44px 0 32px;
  }

  .footer-inner,
  .footer-legal__inner {
    padding-inline: 24px;
  }
}

@media (max-width: 600px) {
  .footer-inner,
  .footer-legal__inner {
    padding-inline: 16px;
  }
}
</style>

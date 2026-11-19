<script setup lang="ts">
import { siteConfig } from '~/config/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="ft">
    <div class="container">
      <div class="ft__top">
        <div class="ft__brand">
          <div class="ft__logo">
            <span v-if="siteConfig.brand.logo" class="ft__mark ft__mark--image">
              <img :src="siteConfig.brand.logo" alt="" />
            </span>
            <span v-else class="ft__mark" aria-hidden="true">
              <svg viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" stroke-width="1.2" />
                <path d="M11 24c2.4-7.4 6.6-11 9-11s6.6 3.6 9 11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                <path d="M13.6 27.4c1.6-4 4-6 6.4-6s4.8 2 6.4 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                <circle cx="20" cy="10.4" r="1.7" fill="currentColor" />
              </svg>
            </span>
            <span class="ft__name">
              {{ siteConfig.brand.name }}
              <small>{{ siteConfig.brand.nameEn }}</small>
            </span>
          </div>
          <p class="ft__desc">{{ siteConfig.brand.description }}</p>
          <div class="ft__social">
            <a :href="`mailto:${siteConfig.brand.email}`" aria-label="邮件联系">
              <svg viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.6" /><path d="M3.5 6.6 12 13l8.5-6.4" fill="none" stroke="currentColor" stroke-width="1.6" /></svg>
            </a>
            <a href="#" aria-label="微信" @click.prevent>
              <svg viewBox="0 0 24 24"><path d="M9.2 4.2C5.6 4.2 2.7 6.7 2.7 9.8c0 1.7.9 3.2 2.4 4.2l-.6 2 2.2-1.2c.8.3 1.6.4 2.5.4h.6a5.4 5.4 0 0 1-.2-1.4c0-3 2.9-5.3 6.4-5.3h.5c-.6-2.4-3.3-4.3-6.5-4.3Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" /><path d="M21.3 13.8c0-2.5-2.4-4.5-5.4-4.5s-5.4 2-5.4 4.5 2.4 4.5 5.4 4.5c.7 0 1.3-.1 1.9-.3l1.8 1-.5-1.6c1.4-.8 2.2-2.1 2.2-3.6Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" /></svg>
            </a>
            <a href="#" aria-label="领英" @click.prevent>
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="1.6" /><path d="M7.5 10.5V17M7.5 7.4v.1M11.5 17v-3.6c0-1.5.9-2.4 2.1-2.4s2.1.9 2.1 2.4V17" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
            </a>
          </div>
        </div>

        <nav class="ft__col" aria-label="页脚导航">
          <span class="ft__label">网站导航</span>
          <NuxtLink v-for="item in siteConfig.nav" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
        </nav>

        <div class="ft__col">
          <span class="ft__label">产品与学术</span>
          <NuxtLink v-for="item in siteConfig.products" :key="item.code" to="/products">
            {{ item.name }}
          </NuxtLink>
          <NuxtLink to="/academic">学术交流</NuxtLink>
        </div>

        <div class="ft__col ft__col--contact">
          <span class="ft__label">联系我们</span>
          <a :href="`tel:${siteConfig.brand.phone.replace(/\s/g, '')}`">{{ siteConfig.brand.phone }}</a>
          <a :href="`mailto:${siteConfig.brand.email}`">{{ siteConfig.brand.email }}</a>
          <p>{{ siteConfig.brand.address }}</p>
        </div>

        <div class="ft__map">
          <div class="ft__map-art">
            <ArtPanel variant="map" />
            <span class="ft__map-pin" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" fill="none" stroke="currentColor" stroke-width="1.6" /><circle cx="12" cy="10" r="2.6" fill="none" stroke="currentColor" stroke-width="1.6" /></svg>
            </span>
          </div>
          <p class="ft__map-note">{{ siteConfig.brand.shortName }} · 研发中心<br><span>{{ siteConfig.brand.address }}</span></p>
        </div>
      </div>

      <div class="ft__bottom">
        <div class="ft__legal">
          <span>© {{ year }} {{ siteConfig.brand.nameEn }}. All rights reserved.</span>
          <span>沪ICP备XXXXXXXX号</span>
        </div>
        <div class="ft__links">
          <NuxtLink to="/news">新闻中心</NuxtLink>
          <NuxtLink to="/contact">合作咨询</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.ft {
  position: relative;
  padding: 80px 0 30px;
  background: var(--c-cream);
}

.ft__top {
  display: grid;
  grid-template-columns: 1.6fr 0.7fr 0.7fr 0.9fr 0.9fr;
  gap: 40px;
}

.ft__logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ft__mark {
  width: 40px;
  height: 40px;
  color: var(--c-primary);
}

.ft__mark svg {
  width: 100%;
  height: 100%;
}

.ft__mark--image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.ft__name {
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: var(--c-ink);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.14em;
  line-height: 1.2;
}

.ft__name small {
  color: var(--c-muted);
  font-family: var(--font-en);
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.12em;
}

.ft__desc {
  max-width: 340px;
  margin-top: 18px;
  color: var(--c-muted);
  font-size: 13px;
  line-height: 2;
  letter-spacing: 0.05em;
}

.ft__social {
  display: flex;
  margin-top: 20px;
  gap: 10px;
}

.ft__social a {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid var(--c-line);
  border-radius: 50%;
  color: var(--c-primary);
  transition: background 0.25s var(--ease), color 0.25s var(--ease), border-color 0.25s var(--ease);
}

.ft__social a:hover {
  border-color: var(--c-primary);
  background: var(--c-primary);
  color: #fff;
}

.ft__social svg {
  width: 18px;
  height: 18px;
}

.ft__col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: var(--c-muted);
  font-size: 14px;
  letter-spacing: 0.05em;
}

.ft__col a {
  transition: color 0.25s var(--ease);
}

.ft__col a:hover {
  color: var(--c-primary);
}

.ft__col--contact p {
  margin-top: 2px;
  line-height: 1.9;
}

.ft__label {
  color: var(--c-ink);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.16em;
}

.ft__map {
  justify-self: end;
  width: 100%;
  max-width: 260px;
}

.ft__map-art {
  position: relative;
  height: 150px;
  border-radius: var(--r-md);
  overflow: hidden;
  background: var(--c-primary-100);
}

.ft__map-pin {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border-radius: 50%;
  background: #fff;
  color: var(--c-primary);
  box-shadow: 0 8px 20px rgba(13, 71, 161, 0.18);
  transform: translate(-50%, -50%);
}

.ft__map-pin svg {
  width: 24px;
  height: 24px;
}

.ft__map-note {
  margin-top: 12px;
  color: var(--c-ink);
  font-size: 12px;
  line-height: 1.8;
  letter-spacing: 0.06em;
}

.ft__map-note span {
  color: var(--c-muted);
}

.ft__bottom {
  display: flex;
  margin-top: 60px;
  padding-top: 22px;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-top: 1px solid var(--c-line);
  color: var(--c-muted);
  font-size: 12px;
  letter-spacing: 0.05em;
}

.ft__legal {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.ft__links {
  display: flex;
  gap: 22px;
}

.ft__links a:hover {
  color: var(--c-primary);
}

@media (max-width: 1100px) {
  .ft__top {
    grid-template-columns: 1.4fr 1fr 1fr;
    row-gap: 40px;
  }

  .ft__map {
    justify-self: start;
    max-width: 100%;
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .ft {
    padding-top: 60px;
  }

  .ft__top {
    grid-template-columns: 1fr 1fr;
  }

  .ft__brand {
    grid-column: 1 / -1;
  }

  .ft__map {
    grid-column: 1 / -1;
    max-width: 100%;
  }

  .ft__bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>

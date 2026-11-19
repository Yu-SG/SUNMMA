<script setup lang="ts">
import { siteConfig } from '~/config/site'

defineProps<{
  title?: string[]
  note?: string
}>()

const tel = siteConfig.brand.phone.replace(/\s/g, '')
</script>

<template>
  <section class="contact">

    <div class="contact__body">
      <div class="container">
        <div class="contact__grid">
          <div class="contact__head" data-reveal>
            <p class="contact__en">Contact</p>
            <h2 class="contact__title">
              <template v-for="(line, i) in title || ['首先，', '先聊一聊也可以。']" :key="i">
                {{ line }}<br v-if="i < (title || ['首先，', '先聊一聊也可以。']).length - 1">
              </template>
            </h2>
            <p class="contact__note">
              {{ note || '无论是联合开发、技术授权，还是想了解我们在做的研究，都欢迎直接联系我们。' }}
            </p>
          </div>

          <div class="contact__action" data-reveal>
            <p class="contact__tel-label">电话咨询</p>
            <a class="contact__tel" :href="`tel:${tel}`">{{ siteConfig.brand.phone }}</a>
            <p class="contact__tel-time">工作日 9:00 – 18:00</p>

            <div class="contact__btns">
              <NuxtLink to="/contact" class="btn btn--white">
                <span class="btn__ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <rect x="3.5" y="5" width="17" height="14.5" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.7" />
                    <path d="M3.5 9.5h17M8 3.2v3.4M16 3.2v3.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                  </svg>
                </span>
                预约 30 分钟电话
              </NuxtLink>
              <NuxtLink to="/contact" class="btn btn--outline">在线留言</NuxtLink>
            </div>

            <div class="contact__meta">
              <span>{{ siteConfig.brand.email }}</span>
              <span>{{ siteConfig.brand.address }}</span>
            </div>
          </div>
        </div>

        <div class="contact__deco" aria-hidden="true">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path
              d="M0 14c120-18 200 22 320 6s180-26 300-8"
              fill="none"
              stroke="rgba(255,255,255,0.6)"
              stroke-width="1.2"
              stroke-linecap="round"
            />
            <path
              d="M1080 34c110-14 200 16 300-4"
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              stroke-width="1.2"
              stroke-linecap="round"
            />
          </svg>
          <svg class="contact__bird contact__bird--one" viewBox="0 0 40 24">
            <path
              d="M2 16c6-8 12-10 17-5 5-5 11-3 17 5-6-3-11-2-17 3-6-5-11-6-17-3z"
              fill="currentColor"
            />
          </svg>
          <svg class="contact__bird contact__bird--two" viewBox="0 0 40 24">
            <path
              d="M2 16c6-8 12-10 17-5 5-5 11-3 17 5-6-3-11-2-17 3-6-5-11-6-17-3z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
.contact {
  position: relative;
  background: var(--c-cream);
}

.contact__body {
  position: relative;
  padding: 40px 0 56px;
  background: var(--c-primary);
  color: #fff;
  overflow: hidden;
}

.contact__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 0.85fr);
  gap: 60px;
  align-items: center;
}

.contact__en {
  color: rgba(255, 255, 255, 0.85);
  font-family: var(--font-en);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.08em;
}

.contact__title {
  margin: 10px 0 18px;
  color: #fff;
  font-size: clamp(26px, 3vw, 38px);
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: 0.08em;
}

.contact__note {
  max-width: 440px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  line-height: 2;
  letter-spacing: 0.06em;
}

.contact__tel-label {
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  letter-spacing: 0.16em;
}

.contact__tel {
  display: inline-block;
  margin-top: 2px;
  color: #fff;
  font-family: var(--font-en);
  font-size: clamp(30px, 3vw, 40px);
  font-weight: 500;
  letter-spacing: 0.04em;
  line-height: 1.25;
}

.contact__tel-time {
  color: rgba(255, 255, 255, 0.75);
  font-size: 12px;
  letter-spacing: 0.08em;
}

.contact__btns {
  display: flex;
  margin-top: 22px;
  gap: 12px;
  flex-wrap: wrap;
}

.contact__btns .btn--outline {
  border-color: rgba(255, 255, 255, 0.5);
  color: #fff;
}

.contact__btns .btn--outline:hover {
  background: #fff;
  border-color: #fff;
  color: var(--c-primary);
}

.contact__meta {
  display: flex;
  margin-top: 22px;
  gap: 8px 24px;
  flex-wrap: wrap;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  letter-spacing: 0.06em;
}

.contact__deco {
  position: relative;
  height: 56px;
  margin-top: 34px;
}

.contact__deco > svg:first-child {
  width: 100%;
  height: 44px;
  opacity: 0.7;
}

.contact__bird {
  position: absolute;
  right: 12%;
  bottom: 6px;
  width: 34px;
  height: 20px;
  color: rgba(255, 255, 255, 0.9);
}

.contact__bird--two {
  right: 17%;
  bottom: -2px;
  width: 22px;
  height: 13px;
  opacity: 0.75;
}

@media (max-width: 900px) {
  .contact__grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .contact__deco {
    margin-top: 16px;
  }
}
</style>

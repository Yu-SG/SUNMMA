<script setup lang="ts">
import { siteConfig } from '~/config/site'

const brand = siteConfig.brand
const tel = brand.phone.replace(/\s/g, '')
const siteUrl = 'https://xxx.com'

useSeoMeta({
  title: `联系我们｜${brand.name} 地址·电话·邮箱`,
  description: `${brand.name} 联系方式：地址 ${brand.address}，电话 ${brand.phone}，邮箱 ${brand.email}。工作日 9:00–18:00 可直接来电，或在线提交需求。`,
  ogTitle: `联系我们｜${brand.name}`,
  ogDescription: `${brand.name} 联系方式：地址、电话、邮箱与工作时间，支持在线留言。`,
  ogType: 'website',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: brand.name,
        alternateName: brand.nameEn,
        url: siteUrl,
        logo: `${siteUrl}/favicon.ico`,
        email: brand.email,
        telephone: brand.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: brand.address,
          addressCountry: 'CN',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: brand.phone,
            email: brand.email,
            contactType: 'customer service',
            areaServed: 'CN',
            availableLanguage: ['Chinese', 'English'],
            hoursAvailable: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '09:00',
              closes: '18:00',
            },
          },
        ],
      }),
    },
  ],
})

const submitted = ref(false)
const form = reactive({
  name: '',
  company: '',
  email: '',
  topic: '联合开发',
  message: '',
})

const submit = () => {
  submitted.value = true
}
const anchorItems = [
  { id: 'information', label: '公司信息' },
  { id: 'talk', label: '电话咨询' },
  { id: 'enquiry', label: '在线留言' },
  { id: 'access', label: '到访我们' },
]</script>

<template>
  <div>
    <PageHero
      en="Contact"
      zh="联系我们"
      :title="['好的合作，', '从一次对话开始。']"
      lead="无论你希望推进联合开发、评估授权机会，还是探讨学术合作，我们都期待听到你的想法。"
    />

    <!-- ================= information ================= -->
    <section id="information" class="contact__info section">
      <div class="container">
        <div class="contact__info-head" data-reveal>
          <SectionHead en="Information" zh="公司信息" />
          <p class="contact__info-note">以下信息实时有效，如需到访请提前电话或邮件预约。</p>
        </div>

        <dl class="contact__info-grid" data-reveal>
          <div class="contact__info-item">
            <dt>公司名称</dt>
            <dd>{{ brand.name }}（{{ brand.nameEn }}）</dd>
          </div>
          <div class="contact__info-item">
            <dt>地址</dt>
            <dd>{{ brand.address }}</dd>
          </div>
          <div class="contact__info-item">
            <dt>电话</dt>
            <dd><a :href="`tel:${tel}`">{{ brand.phone }}</a></dd>
          </div>
          <div class="contact__info-item">
            <dt>邮箱</dt>
            <dd><a :href="`mailto:${brand.email}`">{{ brand.email }}</a></dd>
          </div>
          <div class="contact__info-item">
            <dt>工作时间</dt>
            <dd>周一至周五 9:00 – 18:00</dd>
          </div>
          <div class="contact__info-item">
            <dt>微信</dt>
            <dd>{{ brand.wechat }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- ================= talk (blue) ================= -->
    <section id="talk" class="contact__talk">
  
      <div class="contact__talk-body section--blue">
        <div class="container">
          <div class="contact__talk-grid">
            <div class="contact__talk-copy" data-reveal>
              <SectionHead en="Talk to us" zh="先聊一聊" light />
              <h2 class="contact__talk-title">
                首先，<br>
                先聊一聊也可以。
              </h2>
              <p class="contact__talk-note">
                无论是联合开发、技术授权，还是想了解我们在做的研究，都欢迎直接联系我们。
              </p>

              <svg class="contact__talk-line" viewBox="0 0 220 24" aria-hidden="true">
                <path
                  d="M4 16c30-12 52 5 82-2s44-12 66 1c13 8 30 5 30 5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
              </svg>
            </div>

            <div class="contact__talk-action" data-reveal>
              <p class="contact__tel-label">电话咨询</p>
              <a class="contact__tel font-en" :href="`tel:${tel}`">{{ brand.phone }}</a>
              <p class="contact__tel-time">工作日 9:00 – 18:00</p>

              <div class="contact__btns">
                <a href="#enquiry" class="btn btn--white">
                  <span class="btn__ico" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14">
                      <rect x="3.5" y="5" width="17" height="14.5" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.7" />
                      <path d="M3.5 9.5h17M8 3.2v3.4M16 3.2v3.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                    </svg>
                  </span>
                  预约 30 分钟电话
                </a>
                <a :href="`mailto:${brand.email}`" class="btn btn--outline">发送邮件</a>
              </div>

              <div class="contact__meta">
                <a :href="`mailto:${brand.email}`">{{ brand.email }}</a>
                <span>{{ brand.address }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      </section>

    <!-- ================= enquiry (cream) ================= -->
    <section id="enquiry" class="contact__enquiry section">
      <div class="container">
        <div class="contact__head" data-reveal>
          <SectionHead en="Enquiry" zh="告诉我们你的需求" />
          <svg class="contact__head-line" viewBox="0 0 200 26" aria-hidden="true">
            <path
              d="M3 18c28-11 48 4 76-2s42-11 62 1c12 7 28 5 28 5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linecap="round"
            />
          </svg>
        </div>

        <div class="contact__grid">
          <div class="contact__channels" data-reveal>
            <p class="contact__channels-lead">
              选一个最方便的方式开始。我们通常会在两个工作日内回复；如果是紧急的临床或安全性事项，请直接致电。
            </p>

            <a class="chan" :href="`mailto:${brand.email}`">
              <span class="chan__ico" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <rect x="2.8" y="5.2" width="18.4" height="13.6" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.5" />
                  <path d="M3.6 6.8 12 13.2l8.4-6.4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                </svg>
              </span>
              <span class="chan__body">
                <small>邮件</small>
                <strong>{{ brand.email }}</strong>
              </span>
              <span class="chan__go" aria-hidden="true">
                <svg viewBox="0 0 24 12">
                  <path d="M1 6h20M16 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </a>

            <a class="chan" :href="`tel:${tel}`">
              <span class="chan__ico" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M6.6 3.5h2l1.4 3.6-1.8 1.2a11 11 0 0 0 5.5 5.5l1.2-1.8 3.6 1.4v2a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <span class="chan__body">
                <small>电话</small>
                <strong>{{ brand.phone }}</strong>
              </span>
              <span class="chan__go" aria-hidden="true">
                <svg viewBox="0 0 24 12">
                  <path d="M1 6h20M16 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </a>

            <div class="chan">
              <span class="chan__ico" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 21s6.8-6 6.8-10.8A6.8 6.8 0 1 0 5.2 10.2C5.2 15 12 21 12 21Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                  <circle cx="12" cy="10.2" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5" />
                </svg>
              </span>
              <span class="chan__body">
                <small>地址</small>
                <strong>{{ brand.address }}</strong>
              </span>
            </div>

            <dl class="contact__hours">
              <div>
                <dt>办公时间</dt>
                <dd>周一至周五 9:00 – 18:00</dd>
              </div>
              <div>
                <dt>媒体与投资人</dt>
                <dd>请注明来意，我们会安排对应团队对接</dd>
              </div>
            </dl>
          </div>

          <div class="contact__form-card card" data-reveal>
            <Transition name="form" mode="out-in">
              <div v-if="submitted" class="contact__success">
                <span class="contact__success-ico" aria-hidden="true">
                  <svg viewBox="0 0 32 32">
                    <path d="M7 16.5 13.5 23 25 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
                <h3 class="contact__success-title">感谢您的咨询</h3>
                <p class="contact__success-text">
                  我们已经收到您的信息，团队将尽快与您取得联系。
                </p>
                <button type="button" class="btn btn--outline" @click="submitted = false">
                  再提交一条咨询
                </button>
              </div>

              <form v-else class="contact__form" @submit.prevent="submit">
                <div class="contact__form-head">
                  <p class="contact__form-title">合作咨询</p>
                  <p class="contact__form-note">带 * 为必填项，我们会在两个工作日内回复。</p>
                </div>

                <div class="contact__form-row">
                  <label class="field">
                    <span>姓名 *</span>
                    <input v-model="form.name" required placeholder="您的姓名">
                  </label>
                  <label class="field">
                    <span>公司 / 机构</span>
                    <input v-model="form.company" placeholder="公司或机构名称">
                  </label>
                </div>

                <div class="contact__form-row">
                  <label class="field">
                    <span>邮箱 *</span>
                    <input v-model="form.email" required type="email" placeholder="name@company.com">
                  </label>
                  <label class="field">
                    <span>咨询类型</span>
                    <select v-model="form.topic">
                      <option>联合开发</option>
                      <option>授权合作</option>
                      <option>投资与融资</option>
                      <option>学术合作</option>
                      <option>媒体与招聘</option>
                      <option>其他</option>
                    </select>
                  </label>
                </div>

                <label class="field">
                  <span>留言内容 *</span>
                  <textarea v-model="form.message" required rows="4" placeholder="请简要描述您的需求与合作方向" />
                </label>

                <button type="submit" class="btn btn--primary contact__submit">
                  提交咨询
                  <span class="btn__ico" aria-hidden="true">
                    <svg viewBox="0 0 24 12" width="14" height="10">
                      <path d="M1 6h20M16 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                </button>
              </form>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= access (white) ================= -->
    <section id="access" class="contact__access section section--white">
      <div class="container">
        <div class="contact__access-head" data-reveal>
          <SectionHead en="Access" zh="到访我们" />
          <p class="contact__access-note">
            研发中心位于 {{ brand.address }}。来访前请提前预约，我们会安排对应的团队接待；公共交通与停车信息，会在预约确认后一并提供。
          </p>
        </div>

        <div class="contact__map frame frame--lg" data-reveal>
          <ArtPanel variant="map" />

          <div class="contact__pin">
            <span class="contact__pin-dot" aria-hidden="true" />
            <div class="contact__pin-body">
              <p class="contact__pin-name">{{ brand.name }} · 研发中心</p>
              <p class="contact__pin-addr">{{ brand.address }}</p>
              <p class="contact__pin-time">工作日 9:00–18:00</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <SectionAnchor :items="anchorItems" />
  </div>
</template>

<style scoped>
/* ================= talk (blue) ================= */
.contact__talk {
  position: relative;
  background: var(--c-cream);
}

.contact__talk-body {
  position: relative;
  padding: 78px 0 96px;
  background: var(--c-primary);
  color: var(--c-white);
  overflow: hidden;
}

.contact__talk-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 0.88fr);
  gap: clamp(40px, 6vw, 90px);
  align-items: center;
}

.contact__talk-title {
  color: var(--c-white);
  font-size: clamp(26px, 3vw, 38px);
  font-weight: 500;
  line-height: 1.7;
  letter-spacing: 0.08em;
}

.contact__talk-note {
  max-width: 440px;
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 15px;
  line-height: 2.1;
  letter-spacing: 0.06em;
}

.contact__talk-line {
  width: 200px;
  height: 24px;
  margin-top: 30px;
  color: rgba(255, 255, 255, 0.5);
}

.contact__tel-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.16em;
}

.contact__tel {
  display: inline-block;
  margin-top: 4px;
  color: var(--c-white);
  font-family: var(--font-en);
  font-size: clamp(28px, 3.2vw, 42px);
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 0.03em;
  transition: opacity 0.25s var(--ease);
}

.contact__tel:hover {
  opacity: 0.8;
}

.contact__tel-time {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  letter-spacing: 0.08em;
}

.contact__btns {
  display: flex;
  margin-top: 26px;
  gap: 12px;
  flex-wrap: wrap;
}

.contact__meta {
  display: flex;
  margin-top: 24px;
  gap: 8px 24px;
  flex-wrap: wrap;
  color: rgba(255, 255, 255, 0.66);
  font-size: 12px;
  letter-spacing: 0.06em;
}

.contact__meta a {
  transition: color 0.25s var(--ease);
}

.contact__meta a:hover {
  color: var(--c-white);
}

/* ================= enquiry (cream) ================= */
.contact__enquiry {
  position: relative;
  background: var(--c-cream);
}

.contact__head {
  position: relative;
}

.contact__head .head01 {
  margin-bottom: 0;
}

.contact__head-line {
  position: absolute;
  top: 6px;
  right: 0;
  width: 200px;
  height: 26px;
  color: var(--c-primary-400);
  opacity: 0.8;
}

.contact__grid {
  display: grid;
  margin-top: 56px;
  grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
  gap: clamp(30px, 4vw, 64px);
  align-items: start;
}

.contact__channels {
  display: grid;
  gap: 14px;
}

.contact__channels-lead {
  margin-bottom: 8px;
  color: var(--c-muted);
  font-size: 14px;
  line-height: 2.1;
  letter-spacing: 0.06em;
}

.chan {
  display: flex;
  padding: 20px 22px;
  align-items: center;
  gap: 16px;
  border: 1px solid var(--c-line);
  border-radius: var(--r-md);
  background: var(--c-white);
  box-shadow: var(--shadow-card);
  transition: transform 0.35s var(--ease), border-color 0.35s var(--ease);
}

a.chan:hover {
  border-color: var(--c-primary-200);
  transform: translateX(4px);
}

.chan__ico {
  display: grid;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 14px;
  background: rgba(25, 118, 210, 0.08);
  color: var(--c-primary);
}

.chan__ico svg {
  width: 22px;
  height: 22px;
}

.chan__body {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.chan__body small {
  color: var(--c-muted);
  font-size: 11px;
  letter-spacing: 0.14em;
}

.chan__body strong {
  overflow-wrap: anywhere;
  color: var(--c-ink);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.7;
  letter-spacing: 0.04em;
}

.chan__go {
  display: grid;
  width: 34px;
  height: 24px;
  margin-left: auto;
  flex-shrink: 0;
  place-items: center;
  border-radius: var(--r-pill);
  background: rgba(25, 118, 210, 0.08);
  color: var(--c-primary);
  transition: background 0.3s var(--ease), color 0.3s var(--ease), transform 0.3s var(--ease);
}

.chan__go svg {
  width: 16px;
  height: 10px;
}

a.chan:hover .chan__go {
  background: var(--c-primary);
  color: var(--c-white);
  transform: translateX(4px);
}

.contact__hours {
  display: grid;
  margin-top: 14px;
  gap: 0;
  border-top: 1px solid var(--c-line);
}

.contact__hours > div {
  display: grid;
  padding: 14px 0;
  gap: 4px;
  border-bottom: 1px solid var(--c-line);
}

.contact__hours dt {
  color: var(--c-primary);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
}

.contact__hours dd {
  color: var(--c-muted);
  font-size: 13px;
  line-height: 1.9;
  letter-spacing: 0.04em;
}

/* form card */
.contact__form-card {
  padding: 38px 40px 34px;
}

.contact__form {
  display: grid;
  gap: 20px;
}

.contact__form-head {
  display: grid;
  margin-bottom: 4px;
  gap: 6px;
}

.contact__form-title {
  color: var(--c-ink);
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.08em;
}

.contact__form-note {
  color: var(--c-muted);
  font-size: 12px;
  line-height: 1.9;
  letter-spacing: 0.04em;
}

.contact__form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.contact__submit {
  width: 100%;
  margin-top: 4px;
}

.contact__success {
  display: flex;
  min-height: 500px;
  padding: 20px 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
}

.contact__success-ico {
  display: grid;
  width: 68px;
  height: 68px;
  margin-bottom: 14px;
  place-items: center;
  border-radius: 50%;
  background: rgba(25, 118, 210, 0.1);
  color: var(--c-primary);
}

.contact__success-ico svg {
  width: 30px;
  height: 30px;
}

.contact__success-title {
  color: var(--c-ink);
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 0.08em;
}

.contact__success-text {
  max-width: 320px;
  margin-bottom: 20px;
  color: var(--c-muted);
  font-size: 14px;
  line-height: 2;
  letter-spacing: 0.06em;
}

/* ================= access (white) ================= */
.contact__access {
  position: relative;
  background: var(--c-white);
  overflow: hidden;
}

.contact__access-head {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 40px;
  align-items: end;
}

.contact__access-head .head01 {
  margin-bottom: 0;
}

.contact__access-note {
  max-width: 400px;
  padding-bottom: 6px;
  justify-self: end;
  color: var(--c-muted);
  font-size: 14px;
  line-height: 2.1;
  letter-spacing: 0.06em;
}

.contact__map {
  position: relative;
  z-index: 2;
  height: clamp(320px, 36vw, 480px);
  margin-top: 44px;
}

.contact__pin {
  position: absolute;
  bottom: 32px;
  left: 32px;
  display: flex;
  max-width: 360px;
  padding: 22px 26px;
  align-items: flex-start;
  gap: 14px;
  border-radius: var(--r-md);
  background: var(--c-white);
  box-shadow: var(--shadow-soft);
}

.contact__pin-dot {
  width: 9px;
  height: 9px;
  margin-top: 7px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--c-primary);
  box-shadow: 0 0 0 5px rgba(25, 118, 210, 0.14);
}

.contact__pin-body {
  display: grid;
  gap: 5px;
}

.contact__pin-name {
  color: var(--c-ink);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.06em;
}

.contact__pin-addr {
  color: var(--c-muted);
  font-size: 13px;
  line-height: 1.8;
  letter-spacing: 0.04em;
}

.contact__pin-time {
  margin-top: 2px;
  color: var(--c-primary);
  font-size: 12px;
  letter-spacing: 0.08em;
}

/* form transition */
.form-enter-active,
.form-leave-active {
  transition: opacity 0.25s var(--ease), transform 0.25s var(--ease);
}

.form-enter-from,
.form-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* ================= responsive ================= */
@media (max-width: 1100px) {
  .contact__talk-grid {
    grid-template-columns: minmax(0, 1fr) minmax(320px, 0.9fr);
  }

  .contact__form-card {
    padding: 32px 30px 28px;
  }

  .contact__access-head {
    gap: 28px;
  }
}

@media (max-width: 900px) {
  .contact__talk-grid,
  .contact__grid {
    grid-template-columns: 1fr;
  }

  .contact__talk-body {
    padding: 56px 0 70px;
  }

  .contact__talk-title {
    margin-top: 4px;
  }

  .contact__head-line {
    display: none;
  }

  .contact__grid {
    margin-top: 40px;
    gap: 34px;
  }

  .contact__access-head {
    grid-template-columns: 1fr;
    align-items: start;
    gap: 18px;
  }

  .contact__access-note {
    justify-self: start;
    padding-bottom: 0;
  }
}

@media (max-width: 768px) {
  .contact__form-card {
    padding: 26px 22px 24px;
  }

  .contact__form-row {
    grid-template-columns: 1fr;
  }

  .contact__success {
    min-height: 380px;
  }

  .contact__map {
    height: 340px;
    margin-top: 32px;
  }

  .contact__btns {
    gap: 10px;
  }

  .contact__btns .btn {
    min-height: 50px;
    padding: 0 20px;
    font-size: 13px;
    letter-spacing: 0.06em;
  }

  .contact__pin {
    right: 16px;
    bottom: 16px;
    left: 16px;
    max-width: none;
    padding: 16px 18px;
  }

  .contact__enquiry {
    padding-bottom: 76px;
  }

  .chan {
    padding: 16px 18px;
    gap: 14px;
  }
}
.contact__info {
  padding: 16px 0 48px;
}

.contact__info-head {
  display: flex;
  margin-bottom: 32px;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.contact__info-note {
  color: var(--c-muted);
  font-size: 13px;
  letter-spacing: 0.06em;
}

.contact__info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--c-line-strong);
}

.contact__info-item {
  display: grid;
  padding: 22px 24px 22px 0;
  gap: 8px;
  border-bottom: 1px solid var(--c-line);
}

.contact__info-item dt {
  color: var(--c-muted);
  font-size: 12px;
  letter-spacing: 0.14em;
}

.contact__info-item dd {
  margin: 0;
  color: var(--c-ink);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.8;
  letter-spacing: 0.05em;
}

.contact__info-item dd a {
  border-bottom: 1px solid var(--c-line-strong);
  transition: color 0.25s var(--ease), border-color 0.25s var(--ease);
}

.contact__info-item dd a:hover {
  color: var(--c-primary);
  border-color: var(--c-primary);
}

@media (max-width: 900px) {
  .contact__info {
    padding: 64px 0 24px;
  }

  .contact__info-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .contact__info-grid {
    grid-template-columns: 1fr;
  }

  .contact__info-item {
    padding-right: 0;
  }
}
</style>
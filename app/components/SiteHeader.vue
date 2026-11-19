<script setup lang="ts">
import { siteConfig } from '~/config/site'

const route = useRoute()
const scrolled = ref(false)
const menuOpen = ref(false)

const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))

let scrollQueued = false

const measure = () => {
  scrollQueued = false
  const next = window.scrollY > 8
  if (next !== scrolled.value) scrolled.value = next
}

// Coalesce scroll events into one measurement per frame.
const onScroll = () => {
  if (scrollQueued) return
  scrollQueued = true
  requestAnimationFrame(measure)
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

watch(
  () => route.path,
  () => {
    menuOpen.value = false
  },
)

watch(menuOpen, (open) => {
  if (import.meta.client) {
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }
})
</script>

<template>
  <header class="hd" :class="{ 'hd--scrolled': scrolled, 'hd--open': menuOpen }">
    <div class="hd__inner">
      <NuxtLink to="/" class="hd__brand" aria-label="返回首页">
        <span v-if="siteConfig.brand.logo" class="hd__mark hd__mark--image">
          <img :src="siteConfig.brand.logo" alt="" />
        </span>
        <span v-else class="hd__mark" aria-hidden="true">
          <svg viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" stroke-width="1.2" />
            <path
              d="M11 24c2.4-7.4 6.6-11 9-11s6.6 3.6 9 11"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
            <path
              d="M13.6 27.4c1.6-4 4-6 6.4-6s4.8 2 6.4 6"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
            <circle cx="20" cy="10.4" r="1.7" fill="currentColor" />
          </svg>
        </span>
        <span class="hd__brand-text">
          <span class="hd__name">{{ siteConfig.brand.name }}</span>
          <span class="hd__name-en">{{ siteConfig.brand.nameEn }}</span>
        </span>
      </NuxtLink>

      <nav class="hd__nav" aria-label="主导航">
        <NuxtLink
          v-for="item in siteConfig.nav"
          :key="item.to"
          :to="item.to"
          class="hd__link"
          :class="{ 'hd__link--active': isActive(item.to) }"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <button
        class="hd__burger"
        type="button"
        :aria-expanded="menuOpen"
        aria-label="打开菜单"
        @click="menuOpen = !menuOpen"
      >
        <span /><span /><span />
      </button>
    </div>

    <Transition name="drawer">
      <div v-if="menuOpen" class="drawer">
        <nav class="drawer__nav" aria-label="移动端导航">
          <NuxtLink v-for="item in siteConfig.nav" :key="item.to" :to="item.to" class="drawer__link">
            <span>{{ item.label }}</span>
            <small>{{ item.labelEn }}</small>
          </NuxtLink>
        </nav>
        <div class="drawer__foot">
          <a :href="`tel:${siteConfig.brand.phone.replace(/\s/g, '')}`">{{ siteConfig.brand.phone }}</a>
          <a :href="`mailto:${siteConfig.brand.email}`">{{ siteConfig.brand.email }}</a>
          <p>{{ siteConfig.brand.address }}</p>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.hd {
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  left: 0;
  background: var(--c-primary);
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s var(--ease), box-shadow 0.3s var(--ease);
}

.hd--scrolled {
  border-bottom-color: rgba(255, 255, 255, 0.14);
  box-shadow: 0 8px 24px rgba(13, 71, 161, 0.18);
}

.hd__inner {
  display: flex;
  width: 100%;
  height: var(--header-h);
  padding: 0 var(--container-pad);
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.hd__brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  flex-shrink: 0;
}

.hd__mark {
  display: block;
  width: 36px;
  height: 36px;
  color: #fff;
}

.hd__mark svg {
  width: 100%;
  height: 100%;
}

.hd__mark--image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.hd__brand-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  line-height: 1.15;
}

.hd__name {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.18em;
}

.hd__name-en {
  color: rgba(255, 255, 255, 0.68);
  font-family: var(--font-en);
  font-size: 9.5px;
  font-weight: 400;
  letter-spacing: 0.16em;
}

.hd__nav {
  display: flex;
  margin-left: auto;
  align-items: center;
  gap: clamp(18px, 2.2vw, 34px);
}

.hd__link {
  position: relative;
  padding: 6px 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14.5px;
  font-weight: 500;
  letter-spacing: 0.1em;
  transition: color 0.25s var(--ease);
}

.hd__link::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 1px;
  background: currentColor;
  content: '';
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s var(--ease);
}

.hd__link:hover,
.hd__link--active {
  color: #fff;
}

.hd__link:hover::after,
.hd__link--active::after {
  transform: scaleX(1);
}

.hd__burger {
  display: none;
  width: 42px;
  height: 34px;
  padding: 8px 2px;
  flex-direction: column;
  justify-content: space-between;
}

.hd__burger span {
  display: block;
  width: 100%;
  height: 1.5px;
  border-radius: 2px;
  background: #fff;
  transition: transform 0.3s var(--ease), opacity 0.3s var(--ease);
}

.hd--open .hd__burger span:nth-child(1) {
  transform: translateY(8.5px) rotate(45deg);
}

.hd--open .hd__burger span:nth-child(2) {
  opacity: 0;
}

.hd--open .hd__burger span:nth-child(3) {
  transform: translateY(-8.5px) rotate(-45deg);
}

/* drawer */
.drawer {
  position: fixed;
  z-index: 1;
  inset: 0;
  display: flex;
  padding: calc(var(--header-h) + 16px) var(--container-pad) 40px;
  flex-direction: column;
  justify-content: space-between;
  background: var(--c-cream);
  overflow-y: auto;
}

.drawer__nav {
  display: grid;
}

.drawer__link {
  display: flex;
  padding: 18px 0;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: 1px solid var(--c-line);
  color: var(--c-ink);
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.1em;
}

.drawer__link small {
  color: var(--c-primary);
  font-family: var(--font-en);
  font-size: 12px;
  letter-spacing: 0.1em;
}

.drawer__foot {
  display: flex;
  margin-top: 36px;
  flex-direction: column;
  gap: 6px;
  color: var(--c-muted);
  font-size: 14px;
}

.drawer__foot p {
  margin-top: 4px;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.28s var(--ease), transform 0.28s var(--ease);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 1100px) {
  .hd__nav {
    gap: 16px;
  }

  .hd__link {
    font-size: 13px;
  }
}

@media (max-width: 900px) {
  .hd__nav {
    display: none;
  }

  .hd__burger {
    display: flex;
  }
}
</style>

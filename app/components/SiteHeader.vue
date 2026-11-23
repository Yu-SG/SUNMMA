<script setup lang="ts">
import { computed, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { siteConfig } from '~/config/site'

const route = useRoute()
const { mdAndUp } = useDisplay()

const drawer = ref(false)

const nav = computed(() => siteConfig.nav)
const utilityLinks = computed(() => siteConfig.site.utilityLinks)
const phone = computed(() => siteConfig.site.phone || siteConfig.brand.phone)
const phoneHref = computed(() => `tel:${phone.value.replace(/[^\d+]/g, '')}`)

const barHeight = computed(() => (mdAndUp.value ? 108 : 64))
const logoSize = computed(() => (mdAndUp.value ? 56 : 48))

const isActive = (to: string) => {
  const path = to.split('?')[0] || '/'
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}

/**
 * 子菜单里多个链接可能共用同一个路径（如 /news?category=…），
 * 只用路径判断会全部高亮，所以这里连查询参数一起比对。
 */
const isChildActive = (to: string) => {
  const [path, search = ''] = to.split('?')
  if (route.path !== path) return false

  const expected = new URLSearchParams(search)
  const expectedKeys = [...expected.keys()]

  if (!expectedKeys.length) return Object.keys(route.query).length === 0

  return expectedKeys.every((key) => String(route.query[key] ?? '') === expected.get(key))
}

watch(
  () => route.fullPath,
  () => {
    drawer.value = false
  },
)

watch(mdAndUp, (desktop) => {
  if (desktop) drawer.value = false
})
</script>

<template>
  <v-app-bar app flat color="surface" :height="barHeight" class="site-appbar" scroll-behavior="elevate">
    <div class="site-header">
      <div v-if="mdAndUp" class="utility">
        <div class="utility__inner">
          <NuxtLink
            v-for="link in utilityLinks"
            :key="link.to"
            :to="link.to"
            class="utility__link"
          >
            <v-icon icon="mdi-shield-check-outline" size="15" class="mr-1" />
            {{ link.label }}
          </NuxtLink>
          <a v-if="phone" class="utility__link" :href="phoneHref">
            <v-icon icon="mdi-phone-outline" size="15" class="mr-1" />
            {{ phone }}
          </a>
        </div>
      </div>

      <div class="nav-row">
        <SiteLogo :size="logoSize" />

        <nav class="nav-links" aria-label="主导航">
          <template v-for="item in nav" :key="item.label">
            <v-menu
              v-if="item.children?.length"
              open-on-hover
              open-delay="60"
              close-delay="120"
              location="bottom"
              :offset="10"
            >
              <template #activator="{ props: menuProps }">
                <v-btn
                  v-bind="menuProps"
                  :to="item.to"
                  variant="text"
                  class="nav-link"
                  :class="{ 'nav-link--active': isActive(item.to) }"
                >
                  {{ item.label }}
                  <v-icon icon="mdi-chevron-down" size="14" class="ml-1" />
                </v-btn>
              </template>

              <v-list class="nav-menu" density="comfortable" elevation="8">
                <v-list-item
                  v-for="child in item.children"
                  :key="child.to"
                  :to="child.to"
                  :class="{ 'is-current': isChildActive(child.to) }"
                  :title="child.label"
                  color="primary"
                >
                  <template #append>
                    <v-icon icon="mdi-chevron-right" size="15" opacity="0.45" />
                  </template>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-btn
              v-else
              :to="item.to"
              variant="text"
              class="nav-link"
              :class="{ 'nav-link--active': isActive(item.to) }"
            >
              {{ item.label }}
            </v-btn>
          </template>
        </nav>

        <v-btn
          class="d-md-none"
          icon="mdi-menu"
          variant="text"
          aria-label="打开菜单"
          @click="drawer = true"
        />
      </div>
    </div>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary location="right" width="320" class="mobile-drawer">
    <div class="mobile-drawer__head">
      <v-btn icon="mdi-close" variant="text" aria-label="关闭菜单" @click="drawer = false" />
    </div>
    <v-divider />

    <v-list nav density="comfortable" class="mobile-drawer__list">
      <template v-for="item in nav" :key="item.label">
        <v-list-group v-if="item.children?.length" :value="item.label">
          <template #activator="{ props: groupProps }">
            <v-list-item
              v-bind="groupProps"
              :title="item.label"
              :subtitle="item.labelEn"
              class="mobile-drawer__parent"
            />
          </template>
          <v-list-item
            :to="item.to"
            :class="{ 'is-current': isChildActive(item.to) }"
            :title="`全部${item.label}`"
            @click="drawer = false"
          />
          <v-list-item
            v-for="child in item.children"
            :key="child.to"
            :to="child.to"
            :class="{ 'is-current': isChildActive(child.to) }"
            :title="child.label"
            @click="drawer = false"
          />
        </v-list-group>

        <v-list-item
          v-else
          :to="item.to"
          :title="item.label"
          :subtitle="item.labelEn"
          @click="drawer = false"
        />
      </template>
    </v-list>

    <div class="mobile-drawer__foot">
      <a v-if="phone" :href="phoneHref">
        <v-icon icon="mdi-phone-outline" size="17" />
        {{ phone }}
      </a>
      <a v-if="siteConfig.brand.email" :href="`mailto:${siteConfig.brand.email}`">
        <v-icon icon="mdi-email-outline" size="17" />
        {{ siteConfig.brand.email }}
      </a>
      <p>
        <v-icon icon="mdi-map-marker-outline" size="17" />
        {{ siteConfig.brand.address }}
      </p>
    </div>
  </v-navigation-drawer>
</template>

<style scoped>
.site-appbar {
  border-bottom: 1px solid rgba(16, 35, 58, 0.08);
}

.site-appbar :deep(.v-toolbar__content) {
  height: 100%;
  padding: 0;
}

.site-header {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
}

.utility {
  display: flex;
  height: 36px;
  flex-shrink: 0;
  align-items: center;
  background: #0d47a1;
  color: rgba(255, 255, 255, 0.88);
}

.utility__inner,
.nav-row {
  display: flex;
  width: 100%;
  max-width: 1240px;
  margin-inline: auto;
  padding-inline: 24px;
  align-items: center;
}

.utility__inner {
  gap: 28px;
  font-size: 12.5px;
  letter-spacing: 0.04em;
}

.utility__link {
  display: inline-flex;
  align-items: center;
  color: inherit;
  transition: color 0.2s var(--ease);
}

.utility__link:hover {
  color: #fff;
}

.nav-row {
  height: 72px;
  gap: 20px;
  justify-content: space-between;
}

.nav-links {
  display: flex;
  margin-left: auto;
  align-items: center;
  gap: 2px;
}

.nav-link {
  padding-inline: 13px;
  color: #33414b;
  font-size: 14.5px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: none;
  transition: color 0.2s var(--ease), background-color 0.2s var(--ease);
}

.nav-link:hover {
  color: #1976d2;
  background: rgba(25, 118, 210, 0.06);
}

.nav-link--active {
  color: #1976d2;
  background: rgba(25, 118, 210, 0.09);
}

.mobile-drawer__head {
  display: flex;
  padding: 14px 16px;
  align-items: center;
  justify-content: flex-end;
}

.mobile-drawer__list {
  padding-top: 8px;
}

.mobile-drawer__list :deep(.v-list-item-title) {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.04em;
}

.mobile-drawer__list :deep(.v-list-item-subtitle) {
  font-family: var(--font-en);
  font-size: 10px;
  letter-spacing: 0.12em;
  opacity: 0.5;
}

.mobile-drawer__foot {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  padding: 20px;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid rgba(16, 35, 58, 0.08);
  color: #5b6472;
  font-size: 13px;
}

.mobile-drawer__foot a,
.mobile-drawer__foot p {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mobile-drawer__foot a:hover {
  color: #1976d2;
}

@media (max-width: 1279px) {
  .utility__inner,
  .nav-row {
    padding-inline: 24px;
  }

  .nav-link {
    padding-inline: 9px;
    font-size: 13.5px;
  }
}

@media (max-width: 959px) {
  .nav-links {
    display: none;
  }

  .nav-row {
    height: 64px;
    padding-inline: 24px;
  }

  .utility {
    display: none;
  }
}

@media (max-width: 600px) {
  .nav-row {
    padding-inline: 16px;
  }
}

/* 移动端抽屉里的子菜单同样只保留一个高亮 */
.mobile-drawer__list :deep(.v-list-group__items .v-list-item--active:not(.is-current)) {
  color: inherit;
  background: transparent;
}

.mobile-drawer__list :deep(.v-list-group__items .v-list-item.is-current) {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.08);
}
</style>

<style>
.nav-menu {
  min-width: 184px;
  border: 1px solid rgba(16, 35, 58, 0.08);
  padding: 6px;
}

.nav-menu .v-list-item {
  min-height: 42px;
  border-radius: 10px;
}

.nav-menu .v-list-item-title {
  font-size: 14px;
  letter-spacing: 0.04em;
}

/*
 * 子菜单里的多个链接可能共用同一路径（/news?category=…），
 * Vue Router 会按路径把它们全部标记为 active，这里只让 is-current 生效。
 */
.nav-menu .v-list-item--active:not(.is-current) {
  color: inherit;
  background: transparent;
}

.nav-menu .v-list-item.is-current {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.08);
}
</style>

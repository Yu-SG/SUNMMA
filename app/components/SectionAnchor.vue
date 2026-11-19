<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    items: Array<{ id: string; label: string }>
    label?: string
  }>(),
  { label: '页面锚点' },
)

const active = ref(props.items[0]?.id ?? '')
const shown = ref(false)
let observer: IntersectionObserver | null = null

let scrollQueued = false

const measure = () => {
  scrollQueued = false
  const next = window.scrollY > window.innerHeight * 0.55
  if (next !== shown.value) shown.value = next
}

// Coalesce scroll events into one measurement per frame.
const onScroll = () => {
  if (scrollQueued) return
  scrollQueued = true
  requestAnimationFrame(measure)
}

let animationFrame = 0

const restoreScrollBehavior = () => {
  document.documentElement.style.scrollBehavior = ''
}

const cancelAnimation = () => {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  animationFrame = 0
  window.removeEventListener('wheel', cancelAnimation, { passive: true } as EventListenerOptions)
  window.removeEventListener('touchstart', cancelAnimation)
  window.removeEventListener('keydown', cancelAnimation)
  restoreScrollBehavior()
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * Native `scrollIntoView({ behavior: 'smooth' })` runs for well over a second
 * on this long page, and every frame re-rasterises large photos — which makes
 * anchor jumps feel sluggish. A short, capped tween keeps them snappy.
 */
const go = (id: string) => {
  const target = document.getElementById(id)
  if (!target) return

  active.value = id
  cancelAnimation()

  const headerHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 84
  const marginTop = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || headerHeight + 24
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const targetY = Math.min(
    Math.max(0, target.getBoundingClientRect().top + window.scrollY - marginTop),
    Math.max(0, maxScroll),
  )
  const startY = window.scrollY
  const distance = targetY - startY

  if (import.meta.client) {
    history.replaceState(history.state, '', `#${id}`)
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || Math.abs(distance) < 8) {
    document.documentElement.style.scrollBehavior = 'auto'
    window.scrollTo({ top: targetY, behavior: 'auto' })
    restoreScrollBehavior()
    return
  }

  // `html { scroll-behavior: smooth }` would turn every tween frame into a new
  // smooth animation; switch it off while we drive the scroll ourselves.
  document.documentElement.style.scrollBehavior = 'auto'

  const duration = Math.min(620, Math.max(300, Math.abs(distance) * 0.14))
  const startedAt = performance.now()

  window.addEventListener('wheel', cancelAnimation, { passive: true })
  window.addEventListener('touchstart', cancelAnimation)
  window.addEventListener('keydown', cancelAnimation)

  const step = (now: number) => {
    const progress = Math.min(1, (now - startedAt) / duration)
    window.scrollTo({ top: startY + distance * easeInOutCubic(progress), behavior: 'auto' })

    if (progress < 1) {
      animationFrame = requestAnimationFrame(step)
    } else {
      animationFrame = 0
      cancelAnimation()
    }
  }

  animationFrame = requestAnimationFrame(step)
}

onBeforeUnmount(cancelAnimation)

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  const sections = props.items
    .map((item) => document.getElementById(item.id))
    .filter((el): el is HTMLElement => Boolean(el))

  if (!sections.length) return

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      if (visible[0]) active.value = visible[0].target.id
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.6, 1] },
  )

  sections.forEach((section) => observer?.observe(section))
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <nav class="anchor" :class="{ 'anchor--shown': shown }" :aria-label="label">
    <ul class="anchor__list">
      <li v-for="item in items" :key="item.id" class="anchor__item">
        <a
          :href="`#${item.id}`"
          class="anchor__link"
          :class="{ 'is-active': active === item.id }"
          :aria-current="active === item.id ? 'true' : undefined"
          @click.prevent="go(item.id)"
        >
          <span class="anchor__label">{{ item.label }}</span>
          <span class="anchor__dot" aria-hidden="true" />
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.anchor {
  position: fixed;
  z-index: 60;
  top: 50%;
  right: clamp(10px, 1.2vw, 22px);
  opacity: 0;
  transform: translateY(-50%) translateX(10px);
  pointer-events: none;
  transition: opacity 0.4s var(--ease), transform 0.4s var(--ease);
}

.anchor--shown {
  opacity: 1;
  transform: translateY(-50%);
  pointer-events: auto;
}

.anchor__list {
  display: grid;
  padding: 10px 7px;
  gap: 2px;
  border-radius: var(--r-pill);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 10px 28px rgba(13, 71, 161, 0.12);
}

.anchor__link {
  position: relative;
  display: flex;
  padding: 7px 4px;
  align-items: center;
  justify-content: center;
  border-radius: var(--r-pill);
}

.anchor__label {
  position: absolute;
  top: 50%;
  right: calc(100% + 8px);
  padding: 5px 12px;
  border-radius: var(--r-pill);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 6px 16px rgba(13, 71, 161, 0.12);
  color: var(--c-primary);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(-50%) translateX(6px);
  transition: opacity 0.3s var(--ease), transform 0.3s var(--ease);
  pointer-events: none;
}

.anchor__link:hover .anchor__label {
  opacity: 1;
  transform: translateY(-50%);
}

.anchor__dot {
  width: 7px;
  height: 7px;
  flex-shrink: 0;
  border-radius: var(--r-pill);
  background: rgba(25, 118, 210, 0.32);
  transition: width 0.3s var(--ease), background 0.3s var(--ease);
}

.anchor__link:hover .anchor__dot {
  background: var(--c-primary-400);
}

.anchor__link.is-active .anchor__dot {
  width: 20px;
  background: var(--c-primary);
}

@media (max-width: 1200px) {
  .anchor {
    display: none;
  }
}
</style>

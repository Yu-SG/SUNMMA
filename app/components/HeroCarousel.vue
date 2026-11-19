<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    slides: Array<{ src: string; alt: string; position?: string }>
    interval?: number
  }>(),
  { interval: 6000 },
)

// Ignore slides whose image was cleared in the admin studio.
const visibleSlides = computed(() => props.slides.filter((slide) => Boolean(slide.src?.trim())))

const active = ref(0)
const paused = ref(false)
let timer: ReturnType<typeof setInterval> | null = null
let touchX = 0

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const go = (index: number) => {
  const total = visibleSlides.value.length
  active.value = (index + total) % total
  restart()
}

const next = () => go(active.value + 1)
const prev = () => go(active.value - 1)

const stop = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const restart = () => {
  stop()
  if (reduceMotion() || visibleSlides.value.length < 2) return
  timer = setInterval(() => {
    if (!paused.value) next()
  }, props.interval)
}

const onTouchStart = (event: TouchEvent) => {
  touchX = event.changedTouches[0].clientX
}

const onTouchEnd = (event: TouchEvent) => {
  const delta = event.changedTouches[0].clientX - touchX
  if (Math.abs(delta) < 45) return
  delta < 0 ? next() : prev()
}

onMounted(restart)
onBeforeUnmount(stop)
</script>

<template>
  <section
    class="carousel"
    role="region"
    aria-roledescription="轮播"
    aria-label="首页横幅"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <div class="carousel__track">
      <figure
        v-for="(slide, i) in visibleSlides"
        :key="slide.src"
        class="carousel__slide"
        :class="{ 'is-active': i === active }"
        :aria-hidden="i !== active"
      >
        <img
          :src="slide.src"
          :alt="slide.alt"
          :style="slide.position ? { objectPosition: slide.position } : undefined"
          :loading="i === 0 ? 'eager' : 'lazy'"
          :fetchpriority="i === 0 ? 'high' : 'auto'"
          decoding="async"
        />
      </figure>
    </div>

    <span class="carousel__shade" aria-hidden="true" />

    <slot />

    <button
      v-if="visibleSlides.length > 1"
      class="carousel__arrow carousel__arrow--prev"
      type="button"
      aria-label="上一张"
      @click="prev"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <button
      v-if="visibleSlides.length > 1"
      class="carousel__arrow carousel__arrow--next"
      type="button"
      aria-label="下一张"
      @click="next"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <div v-if="visibleSlides.length > 1" class="carousel__dots">
      <button
        v-for="(slide, i) in visibleSlides"
        :key="`dot-${slide.src}`"
        class="carousel__dot"
        :class="{ 'is-active': i === active }"
        type="button"
        :aria-label="`第 ${i + 1} 张`"
        :aria-current="i === active"
        @click="go(i)"
      />
    </div>
  </section>
</template>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  height: clamp(300px, 58vw, 880px);
  overflow: hidden;
  background: var(--c-primary-100);
}

.carousel__track {
  position: absolute;
  inset: 0;
}

.carousel__slide {
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  transition: opacity 1.1s var(--ease);
}

.carousel__slide.is-active {
  opacity: 1;
}

.carousel__slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.06);
  transition: transform 9s linear;
}

.carousel__slide.is-active img {
  transform: scale(1);
}

.carousel__shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(13, 71, 161, 0.16) 0%, rgba(13, 71, 161, 0) 38%, rgba(29, 43, 54, 0.24) 100%);
  pointer-events: none;
}

.carousel__arrow {
  position: absolute;
  z-index: 4;
  top: 50%;
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  backdrop-filter: blur(6px);
  transform: translateY(-50%);
  transition: background 0.25s var(--ease), border-color 0.25s var(--ease);
}

.carousel__arrow:hover {
  background: rgba(255, 255, 255, 0.92);
  border-color: #fff;
  color: var(--c-primary);
}

.carousel__arrow svg {
  width: 22px;
  height: 22px;
}

.carousel__arrow--prev {
  left: clamp(12px, 3vw, 40px);
}

.carousel__arrow--next {
  right: clamp(12px, 3vw, 40px);
}

.carousel__dots {
  position: absolute;
  z-index: 3;
  bottom: 24px;
  left: 50%;
  display: flex;
  gap: 10px;
  transform: translateX(-50%);
}

.carousel__dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border-radius: var(--r-pill);
  background: rgba(255, 255, 255, 0.55);
  transition: width 0.35s var(--ease), background 0.35s var(--ease);
}

.carousel__dot.is-active {
  width: 26px;
  background: #fff;
}

@media (max-width: 900px) {
  .carousel__arrow {
    display: none;
  }

  .carousel__dots {
    bottom: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .carousel__slide,
  .carousel__slide img {
    transition: none;
  }
}
</style>

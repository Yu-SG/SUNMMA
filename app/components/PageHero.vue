<script setup lang="ts">
withDefaults(
  defineProps<{
    en: string
    zh: string
    title?: string[]
    lead?: string
    art?: string
  }>(),
  { title: () => [], lead: '', art: '' },
)
</script>

<template>
  <section class="page-hero">
    <div class="page-hero__curve" aria-hidden="true">
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
          d="M120 300C420 300 560 150 760 96c140-38 300-40 460-26"
          fill="none"
          stroke="var(--c-primary)"
          stroke-width="1.2"
          stroke-linecap="round"
        />
      </svg>
      <span class="page-hero__script font-script">Hello, Science!</span>
    </div>

    <div class="container">
      <div class="page-hero__head">
        <div class="page-hero__labels">
          <p class="page-hero__en">{{ en }}</p>
          <p class="page-hero__zh">{{ zh }}</p>
        </div>
        <h1 v-if="title.length" class="page-hero__title">
          <template v-for="(line, i) in title" :key="i">
            {{ line }}<br v-if="i < title.length - 1">
          </template>
        </h1>
        <p v-if="lead" class="page-hero__lead">{{ lead }}</p>
      </div>

      <div v-if="art" class="page-hero__media frame frame--lg">
        <ArtPanel :variant="art" />
      </div>

      <slot />
    </div>
  </section>
</template>

<style scoped>
.page-hero {
  position: relative;
  padding: calc(var(--header-h) + 96px) 0 68px;
  background: var(--c-cream);
  overflow: hidden;
}

.page-hero__curve {
  position: absolute;
  top: 60px;
  right: 0;
  width: 70%;
  height: 320px;
  color: var(--c-primary);
  pointer-events: none;
}

.page-hero__curve svg {
  width: 100%;
  height: 100%;
}

.page-hero__script {
  position: absolute;
  top: 40px;
  right: 12%;
  color: var(--c-primary);
  font-size: clamp(30px, 3.4vw, 52px);
  transform: rotate(-4deg);
}

.page-hero__head {
  position: relative;
  z-index: 2;
  max-width: 760px;
}

.page-hero__labels {
  display: flex;
  align-items: baseline;
  gap: 16px;
}

.page-hero__en {
  color: var(--c-primary);
  font-family: var(--font-en);
  font-size: clamp(38px, 5vw, 64px);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: 0.02em;
}

.page-hero__zh {
  color: var(--c-primary);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.16em;
}

.page-hero__title {
  margin-top: 26px;
  color: var(--c-ink);
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 500;
  line-height: 1.85;
  letter-spacing: 0.08em;
}

.page-hero__lead {
  max-width: 560px;
  margin-top: 20px;
  color: var(--c-muted);
  font-size: 15px;
  line-height: 2.1;
  letter-spacing: 0.06em;
}

.page-hero__media {
  position: relative;
  z-index: 1;
  height: clamp(240px, 30vw, 420px);
  margin-top: 52px;
}

@media (max-width: 768px) {
  .page-hero {
    padding: calc(var(--header-h) + 64px) 0 64px;
  }

  .page-hero__curve {
    display: none;
  }

  .page-hero__media {
    margin-top: 36px;
  }
}
</style>

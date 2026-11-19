<script setup lang="ts">
withDefaults(
  defineProps<{
    /** English eyebrow, e.g. "News" */
    en: string
    /** Chinese heading, e.g. "新闻动态" */
    zh: string
    /** Optional supporting sentence under the heading. */
    desc?: string
    /** Optional "MORE" target. */
    to?: string
    linkText?: string
    /** Light text for dark/blue sections. */
    light?: boolean
    align?: 'left' | 'center'
  }>(),
  { light: false, align: 'left', linkText: 'MORE' },
)
</script>

<template>
  <div class="section-head" :class="[`section-head--${align}`, { 'section-head--light': light }]">
    <div class="section-head__text">
      <p class="section-head__en font-en">{{ en }}</p>
      <h2 class="section-head__zh">{{ zh }}</h2>
      <p v-if="desc" class="section-head__desc">{{ desc }}</p>
    </div>

    <slot name="action">
      <v-btn
        v-if="to"
        :to="to"
        variant="text"
        color="primary"
        class="section-head__more"
        append-icon="mdi-arrow-right"
      >
        {{ linkText }}
      </v-btn>
    </slot>
  </div>
</template>

<style scoped>
.section-head {
  display: flex;
  margin-bottom: 36px;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.section-head__en {
  color: #1976d2;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

.section-head__zh {
  margin-top: 6px;
  color: #10233a;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.3;
}

.section-head__desc {
  max-width: 620px;
  margin-top: 12px;
  color: #5b6472;
  font-size: 14.5px;
  line-height: 1.9;
}

.section-head__more {
  margin-bottom: 4px;
  flex-shrink: 0;
  font-family: var(--font-en);
  font-size: 12.5px;
  letter-spacing: 0.16em;
}

.section-head--center {
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.section-head--center .section-head__desc {
  margin-inline: auto;
}

.section-head--light .section-head__zh,
.section-head--light .section-head__en,
.section-head--light .section-head__desc {
  color: #fff;
}

@media (max-width: 700px) {
  .section-head {
    margin-bottom: 26px;
    align-items: flex-start;
  }

  .section-head__zh {
    font-size: 24px;
  }

  .section-head__desc {
    font-size: 13.5px;
  }
}
</style>

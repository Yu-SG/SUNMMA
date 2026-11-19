<script setup lang="ts">
defineProps<{
  items: Array<{
    date: string
    category: string
    title: string
    excerpt?: string
    body: string[]
  }>
}>()
</script>

<template>
  <div class="news-list">
    <details v-for="item in items" :key="item.title" class="news-item">
      <summary class="news-item__summary">
        <span class="news-item__meta">
          <span class="news-item__date">{{ item.date }}</span>
          <span class="news-item__cat">{{ item.category }}</span>
          <span class="news-item__title">{{ item.title }}</span>
        </span>
        <span class="news-item__plus" aria-hidden="true"><i /><i /></span>
      </summary>
      <div class="news-item__body">
        <div class="news-item__inner">
          <p v-for="(p, i) in item.body" :key="i">{{ p }}</p>
        </div>
      </div>
    </details>
  </div>
</template>

<style scoped>
.news-list {
  border-top: 1px solid var(--c-line-strong);
}

.news-item {
  border-bottom: 1px solid var(--c-line-strong);
}

.news-item__summary {
  display: flex;
  padding: 24px 0;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  cursor: pointer;
  list-style: none;
}

.news-item__summary::-webkit-details-marker {
  display: none;
}

.news-item__meta {
  display: grid;
  gap: 6px;
}

.news-item__date {
  color: var(--c-primary);
  font-family: var(--font-en);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.06em;
}

.news-item__cat {
  display: none;
  color: var(--c-primary);
  font-size: 11px;
  letter-spacing: 0.14em;
}

.news-item__title {
  color: var(--c-ink);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.07em;
  transition: color 0.25s var(--ease);
}

.news-item__summary:hover .news-item__title {
  color: var(--c-primary);
}

.news-item__plus {
  position: relative;
  display: grid;
  width: 38px;
  height: 26px;
  flex-shrink: 0;
  place-items: center;
  border-radius: var(--r-pill);
  background: var(--c-white);
  box-shadow: 0 4px 12px rgba(13, 71, 161, 0.08);
  transition: background 0.25s var(--ease);
}

.news-item__plus i {
  position: absolute;
  width: 11px;
  height: 1.2px;
  background: var(--c-primary);
  transition: transform 0.3s var(--ease);
}

.news-item__plus i:last-child {
  transform: rotate(90deg);
}

.news-item[open] .news-item__plus {
  background: var(--c-primary);
}

.news-item[open] .news-item__plus i {
  background: var(--c-white);
}

.news-item[open] .news-item__plus i:last-child {
  transform: rotate(0deg);
}

.news-item__body {
  padding-bottom: 26px;
}

.news-item__inner {
  padding: 24px 28px;
  border-radius: var(--r-sm);
  background: var(--c-white);
  color: var(--c-text);
  font-size: 14px;
  line-height: 2;
  letter-spacing: 0.06em;
}

.news-item__inner p + p {
  margin-top: 1.1em;
}

@media (max-width: 768px) {
  .news-item__cat {
    display: block;
  }

  .news-item__summary {
    padding: 20px 0;
    align-items: flex-start;
  }

  .news-item__title {
    font-size: 14px;
  }

  .news-item__inner {
    padding: 20px;
  }
}
</style>

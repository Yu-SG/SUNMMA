<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { siteConfig } from '~/config/site'

const route = useRoute()
const router = useRouter()

const page = siteConfig.pages.jobs
const ALL = '全部'
const activeType = ref(ALL)

const types = computed(() => [ALL, ...new Set(page.items.map((item) => item.type))])
const filtered = computed(() =>
  activeType.value === ALL ? page.items : page.items.filter((item) => item.type === activeType.value),
)

const selectType = (value: unknown) => {
  const next = typeof value === 'string' ? value : ALL
  if (next === activeType.value) return
  activeType.value = next
  const query: Record<string, string> = {}
  if (next !== ALL) query.type = next
  router.replace({ path: '/jobs', query })
}

watch(
  () => route.query.type,
  (value) => {
    const requested = typeof value === 'string' && types.value.includes(value) ? value : ALL
    if (requested !== activeType.value) activeType.value = requested
  },
  { immediate: true },
)

const applyHref = (title: string) =>
  `mailto:hr@xxx.com?subject=${encodeURIComponent(`应聘：${title}`)}`

useSeoMeta({
  title: `加入我们｜${siteConfig.brand.name} 制药`,
  description: page.intro[0] || `${siteConfig.brand.name} 制药招聘`,
  ogTitle: `加入我们｜${siteConfig.brand.name} 制药`,
  ogDescription: page.intro[0] || '',
})
</script>

<template>
  <div class="jobs-page">
    <SitePageHead :title="page.title" :subtitle="page.subtitle" :intro="page.intro" />

    <section class="section">
      <v-container>
        <div class="jobs-head">
          <div>
            <p class="jobs-head__label font-en">OPEN POSITIONS</p>
            <h2 class="jobs-head__title">在招岗位</h2>
            <p class="jobs-head__text">共 {{ filtered.length }} 个岗位 · 简历请发送至 hr@xxx.com</p>
          </div>

          <v-chip-group
            :model-value="activeType"
            mandatory
            selected-class="job-chip--active"
            class="job-chips"
            @update:model-value="selectType"
          >
            <v-chip
              v-for="type in types"
              :key="type"
              :value="type"
              variant="outlined"
              filter
              class="job-chip"
            >
              {{ type }}
            </v-chip>
          </v-chip-group>
        </div>

        <div class="job-list">
          <v-card v-for="job in filtered" :key="job.id" class="job-card">
            <div class="job-card__head">
              <div>
                <p class="job-card__dept font-en">{{ job.department }}</p>
                <h3 class="job-card__title">{{ job.title }}</h3>
              </div>
              <v-chip size="small" color="primary" variant="tonal">{{ job.type }}</v-chip>
            </div>

            <div class="job-card__meta">
              <span>
                <v-icon icon="mdi-office-building-outline" size="16" />
                {{ job.department }}
              </span>
              <span>
                <v-icon icon="mdi-map-marker-outline" size="16" />
                {{ job.location }}
              </span>
              <span>
                <v-icon icon="mdi-account-multiple-outline" size="16" />
                招聘 {{ job.headcount }}
              </span>
            </div>

            <v-row class="job-card__cols">
              <v-col cols="12" md="6">
                <h4 class="job-card__subtitle">岗位职责</h4>
                <p class="job-card__text">{{ job.description }}</p>
              </v-col>
              <v-col cols="12" md="6">
                <h4 class="job-card__subtitle">任职要求</h4>
                <ul class="job-card__requirements">
                  <li v-for="(requirement, index) in job.requirements" :key="index">
                    {{ requirement }}
                  </li>
                </ul>
              </v-col>
            </v-row>

            <div class="job-card__foot">
              <span class="job-card__email">
                <v-icon icon="mdi-email-outline" size="16" />
                投递邮箱：hr@xxx.com
              </span>
              <v-btn color="primary" :href="applyHref(job.title)" append-icon="mdi-send-outline">
                投递简历
              </v-btn>
            </div>
          </v-card>

          <v-alert
            v-if="!filtered.length"
            type="info"
            variant="tonal"
            rounded="xl"
            class="mt-6"
          >
            当前分类暂无在招岗位，欢迎发送简历至 hr@xxx.com，我们会主动与你联系。
          </v-alert>
        </div>

        <div class="process">
          <SectionHead en="Hiring Process" zh="招聘流程" desc="从投递到入职，我们希望每一步都坦诚、高效。" />
          <v-row>
            <v-col v-for="(step, index) in ['简历投递', '面试评估', '录用入职']" :key="step" cols="12" md="4">
              <v-card class="process-card">
                <span class="process-card__num font-en">0{{ index + 1 }}</span>
                <h3 class="process-card__title">{{ step }}</h3>
                <p class="process-card__text">
                  {{ index === 0 ? '通过邮箱投递简历，我们会在 5 个工作日内完成初筛并回复。' : index === 1 ? '业务与 HR 共同参与，围绕专业能力与协作方式充分沟通。' : '发放录用通知，协助完成背景调查与入职准备。' }}
                </p>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>
  </div>
</template>

<style scoped>
.section {
  padding: 52px 0 80px;
  background: #fff;
}

.jobs-head {
  display: flex;
  padding-bottom: 20px;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid rgba(16, 35, 58, 0.1);
}

.jobs-head__label {
  color: #1976d2;
  font-size: 10.5px;
  letter-spacing: 0.24em;
}

.jobs-head__title {
  margin-top: 6px;
  color: #10233a;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.jobs-head__text {
  margin-top: 8px;
  color: #7b8794;
  font-size: 13px;
}

.job-chips {
  flex-shrink: 0;
}

.job-chip {
  letter-spacing: 0.02em;
}

.job-chip--active {
  border-color: #1976d2 !important;
  background: #1976d2 !important;
  color: #fff !important;
}

.job-list {
  display: flex;
  margin-top: 26px;
  flex-direction: column;
  gap: 20px;
}

.job-card {
  padding: 28px 30px 24px;
  border: 1px solid rgba(16, 35, 58, 0.09);
  background: #fff;
  transition: border-color 0.2s var(--ease), box-shadow 0.2s var(--ease);
}

.job-card:hover {
  border-color: rgba(25, 118, 210, 0.4);
  box-shadow: 0 16px 38px rgba(13, 71, 161, 0.08);
}

.job-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.job-card__dept {
  color: #8b98a6;
  font-size: 10.5px;
  letter-spacing: 0.16em;
}

.job-card__title {
  margin-top: 6px;
  color: #10233a;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.job-card__meta {
  display: flex;
  margin-top: 14px;
  flex-wrap: wrap;
  gap: 10px 22px;
  color: #6b7c8f;
  font-size: 13px;
}

.job-card__meta span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.job-card__cols {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px dashed rgba(16, 35, 58, 0.13);
}

.job-card__subtitle {
  color: #10233a;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.job-card__text {
  margin-top: 8px;
  color: #5b6472;
  font-size: 13.5px;
  line-height: 1.95;
}

.job-card__requirements {
  display: flex;
  padding: 0;
  margin: 8px 0 0;
  flex-direction: column;
  gap: 6px;
  list-style: none;
  color: #5b6472;
  font-size: 13.5px;
  line-height: 1.9;
}

.job-card__requirements li {
  position: relative;
  padding-left: 14px;
}

.job-card__requirements li::before {
  position: absolute;
  top: 0.75em;
  left: 0;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #1976d2;
  content: '';
}

.job-card__foot {
  display: flex;
  margin-top: 22px;
  padding-top: 16px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid rgba(16, 35, 58, 0.08);
}

.job-card__email {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #7b8794;
  font-size: 13px;
}

.process {
  margin-top: 64px;
}

.process-card {
  height: 100%;
  padding: 24px;
  border: 1px solid rgba(16, 35, 58, 0.08);
  background: #f8fafc;
}

.process-card__num {
  color: rgba(25, 118, 210, 0.32);
  font-size: 26px;
  font-weight: 600;
}

.process-card__title {
  margin-top: 10px;
  color: #10233a;
  font-size: 18px;
  font-weight: 600;
}

.process-card__text {
  margin-top: 8px;
  color: #6b7c8f;
  font-size: 13px;
  line-height: 1.9;
}

@media (max-width: 700px) {
  .section {
    padding: 36px 0 56px;
  }

  .jobs-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .jobs-head__title {
    font-size: 24px;
  }

  .job-card {
    padding: 22px 18px 18px;
  }

  .job-card__title {
    font-size: 19px;
  }

  .process {
    margin-top: 44px;
  }
}
</style>

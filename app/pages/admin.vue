<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import type { SiteConfig, SiteFormField, SiteFormsPage } from '#shared/site'
import AdminImageField from '~/components/admin/AdminImageField.vue'
import AdminLinesField from '~/components/admin/AdminLinesField.vue'
import StudioGroupHead from '~/components/admin/StudioGroupHead.vue'
import StudioRepeaterItem from '~/components/admin/StudioRepeaterItem.vue'
import StudioSectionCard from '~/components/admin/StudioSectionCard.vue'

type AdminMeta = { updatedAt: string | null; dbPath: string }
type Revision = { id: number; created_at: string }
type AdminPayload = { content: SiteConfig; meta: AdminMeta; revisions: Revision[] }
type SessionPayload = { authenticated: boolean; meta: AdminMeta }

type Banner = { src: string; alt: string; position?: string }
type DraftConfig = Omit<SiteConfig, 'banners'> & { banners: Banner[] }

type SectionId =
  | 'dash'
  | 'brand'
  | 'banners'
  | 'products'
  | 'news'
  | 'about'
  | 'academic'
  | 'investor'
  | 'jobs'
  | 'copy'
  | 'contact'
  | 'pv'
  | 'site'
  | 'json'
type SectionMeta = {
  id: SectionId
  label: string
  en: string
  icon: string
  note: string
  count?: boolean
  unit?: string
}

const FALLBACK_META: AdminMeta = { updatedAt: null, dbPath: '' }

import type { EChartsOption } from 'echarts'
import {
  applyDocumentTheme,
  loadStudioTheme,
  saveStudioTheme,
  themePresets,
} from '~/utils/studio-theme'

definePageMeta({ layout: 'admin' })

useSeoMeta({
  title: '内容管理 | Content Studio',
  robots: 'noindex, nofollow',
})

/* ------------------------------------------------------------------ *
 * 数据加载
 * ------------------------------------------------------------------ */

const requestFetch = useRequestFetch()

const { data: bootstrap } = await useAsyncData(
  'admin-bootstrap',
  async () => {
    const session = await requestFetch<SessionPayload>('/api/admin/session').catch(() => null)
    if (!session?.authenticated) {
      return { authenticated: false, meta: session?.meta ?? FALLBACK_META, payload: null as AdminPayload | null }
    }
    const payload = await requestFetch<AdminPayload>('/api/admin/content').catch(() => null)
    if (!payload) {
      return { authenticated: false, meta: session.meta ?? FALLBACK_META, payload: null as AdminPayload | null }
    }
    return { authenticated: true, meta: payload.meta ?? FALLBACK_META, payload }
  },
  { default: () => ({ authenticated: false, meta: FALLBACK_META, payload: null as AdminPayload | null }) },
)

const authenticated = ref(bootstrap.value?.authenticated ?? false)
const meta = ref<AdminMeta>({ ...(bootstrap.value?.meta ?? FALLBACK_META) })
const content = ref<SiteConfig | null>(null)
const draft = ref<DraftConfig | null>(null)
const revisions = ref<Revision[]>([])
const savedSnapshot = ref('')

const password = ref('')
const loginError = ref('')
const loggingIn = ref(false)

const saving = ref(false)
const restoringId = ref<number | null>(null)

const active = ref<SectionId>('dash')

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const rawText = ref('')
const rawSnapshot = ref('')
const rawError = ref('')

const pendingRestore = ref<Revision | null>(null)
const restoreDialog = ref(false)

const { width, smAndUp, mdAndUp } = useDisplay()

const studioTheme = useTheme()

/** Applies the studio palette + light/dark mode through Vuetify's theme instance. */
const applyThemePrefs = (prefs: { primary: string; dark: boolean }) => {
  for (const name of Object.keys(studioTheme.themes.value)) {
    const definition = studioTheme.themes.value[name]
    if (definition?.colors) definition.colors.primary = prefs.primary
  }
  studioTheme.change(prefs.dark ? 'dark' : 'light')
}

const themePrefs = ref(loadStudioTheme())
const darkMode = computed({
  get: () => themePrefs.value.dark,
  set: (value: boolean) => {
    themePrefs.value = { ...themePrefs.value, dark: value }
  },
})

const setPrimaryColor = (primary: string) => {
  themePrefs.value = { ...themePrefs.value, primary }
}

watch(
  themePrefs,
  (prefs) => {
    if (!import.meta.client) return
    applyDocumentTheme(prefs)
    applyThemePrefs(prefs)
    saveStudioTheme(prefs)
  },
  { deep: true, immediate: true },
)
const drawer = ref(false)

// The studio shell switches at 1280px, independent of Vuetify's `lg` threshold.
const isDesktop = computed(() => width.value >= 1280)

watch(
  isDesktop,
  (value) => {
    drawer.value = value
  },
  { immediate: true },
)

/* ------------------------------------------------------------------ *
 * 分区 / 工具
 * ------------------------------------------------------------------ */

const sections: SectionMeta[] = [
  {
    id: 'dash',
    label: '站点概览',
    en: 'Dash',
    icon: 'mdi-view-dashboard-outline',
    note: '站点概况、内容数量、SEO 检查与快捷入口。',
  },
  {
    id: 'brand',
    label: '品牌信息',
    en: 'Brand',
    icon: 'mdi-domain',
    note: '页头、页脚与联系信息都读取这里，修改后全站同步生效。',
  },
  {
    id: 'banners',
    label: '首页横幅',
    en: 'Banners',
    icon: 'mdi-image-multiple-outline',
    note: '顺序即轮播顺序。焦点位置用于裁切取景，例如 50% 55%。',
    count: true,
    unit: '张',
  },
  {
    id: 'products',
    label: '产品中心',
    en: 'Products',
    icon: 'mdi-package-variant-closed',
    note: '顺序即展示顺序。药品分类、治疗领域、剂型、规格、适应症、持有人用于产品详情弹窗。',
    count: true,
    unit: '个',
  },
  {
    id: 'news',
    label: '新闻中心',
    en: 'News',
    icon: 'mdi-newspaper-variant-outline',
    note: '正文一行一段；分类建议用 企业动态 / 政策法规。',
    count: true,
    unit: '篇',
  },
  {
    id: 'about',
    label: '关于我们',
    en: 'About',
    icon: 'mdi-office-building-outline',
    note: '页面标题、引言、公司简介分段与发展历程时间线；前三组依次对应「公司简介 / 研发与质量 / 企业文化」。',
    count: true,
    unit: '项',
  },
  {
    id: 'academic',
    label: '学术交流',
    en: 'Academic',
    icon: 'mdi-school-outline',
    note: '页面引言、论文与活动列表；标签用逗号分隔，合作方向一行一项。',
    count: true,
    unit: '项',
  },
  {
    id: 'investor',
    label: '投资者关系',
    en: 'Investors',
    icon: 'mdi-chart-line',
    note: '公告按列表顺序展示；类型提供 临时公告 / 定期报告 / 投资者关系活动，也可自定义。',
    count: true,
    unit: '条',
  },
  {
    id: 'jobs',
    label: '加入我们',
    en: 'Careers',
    icon: 'mdi-account-tie-outline',
    note: '在招岗位按列表顺序展示；类型建议用 社会招聘 / 校园招聘。',
    count: true,
    unit: '个',
  },
  {
    id: 'copy',
    label: '首页文案',
    en: 'Copy',
    icon: 'mdi-text-box-outline',
    note: '首屏标题、品牌寄语与数据条；多行文本框均为「一行一条」。',
    count: true,
    unit: '条',
  },
  {
    id: 'contact',
    label: '联系我们',
    en: 'Contact',
    icon: 'mdi-map-marker-outline',
    note: '页面文案与表单字段；字段顺序即前台表单顺序。',
    count: true,
    unit: '项',
  },
  {
    id: 'pv',
    label: '药物警戒',
    en: 'PV',
    icon: 'mdi-shield-check-outline',
    note: '不良反应报告页的文案与表单字段，与「联系我们」共用同一套字段结构。',
    count: true,
    unit: '项',
  },
  {
    id: 'site',
    label: '站点信息',
    en: 'Site',
    icon: 'mdi-cog-outline',
    note: '页脚、顶部工具链接与备案信息，修改后全站同步生效。',
    count: true,
    unit: '条',
  },
  {
    id: 'json',
    label: '原始 JSON',
    en: 'Raw',
    icon: 'mdi-code-json',
    note: '覆盖站点文档的全部字段，包括上方表单没有单独列出的部分。修改后先「校验并应用」，再点顶部「保存」。',
  },
]

const activeMeta = computed(() => sections.find((section) => section.id === active.value) ?? sections[0]!)

const sectionSearch = ref('')
const historyDialog = ref(false)

const navGroups = computed(() => {
  const groups: Array<{ title: string; ids: SectionId[] }> = [
    { title: '概览', ids: ['dash'] },
    {
      title: '内容',
      ids: ['brand', 'banners', 'products', 'news', 'about', 'academic', 'investor', 'jobs', 'copy'],
    },
    { title: '页面', ids: ['contact', 'pv', 'site'] },
    { title: '工具', ids: ['json'] },
  ]
  const query = sectionSearch.value.trim().toLowerCase()

  return groups
    .map((group) => ({
      title: group.title,
      items: group.ids
        .map((id) => sections.find((section) => section.id === id))
        .filter((section): section is SectionMeta => Boolean(section))
        .filter(
          (section) =>
            !query ||
            section.label.toLowerCase().includes(query) ||
            section.en.toLowerCase().includes(query),
        ),
    }))
    .filter((group) => group.items.length)
})

const dashStats = computed(() => {
  const d = draft.value
  if (!d) return []
  return [
    { label: '产品', en: 'Products', value: d.products.length, unit: '个', icon: 'mdi-package-variant-closed', to: 'products' as SectionId },
    { label: '新闻', en: 'News', value: d.news.length, unit: '篇', icon: 'mdi-newspaper-variant-outline', to: 'news' as SectionId },
    { label: '投资者公告', en: 'Announcements', value: d.pages.investor.items.length, unit: '条', icon: 'mdi-chart-line', to: 'investor' as SectionId },
    { label: '招聘岗位', en: 'Jobs', value: d.pages.jobs.items.length, unit: '个', icon: 'mdi-account-tie-outline', to: 'jobs' as SectionId },
    { label: '首页横幅', en: 'Banners', value: d.banners.length, unit: '张', icon: 'mdi-image-multiple-outline', to: 'banners' as SectionId },
    { label: '学术成果', en: 'Papers', value: d.academic.papers.length, unit: '篇', icon: 'mdi-file-document-outline', to: 'academic' as SectionId },
  ]
})

const publicPages = [
  { to: '/', label: '首页', en: 'Home', icon: 'mdi-home-variant-outline' },
  { to: '/about', label: '关于我们', en: 'About', icon: 'mdi-domain' },
  { to: '/products', label: '产品中心', en: 'Products', icon: 'mdi-package-variant-closed' },
  { to: '/news', label: '新闻动态', en: 'News', icon: 'mdi-newspaper-variant-outline' },
  { to: '/investor', label: '投资者关系', en: 'Investors', icon: 'mdi-chart-line' },
  { to: '/jobs', label: '加入我们', en: 'Careers', icon: 'mdi-account-tie-outline' },
  { to: '/contact', label: '联系我们', en: 'Contact', icon: 'mdi-map-marker-outline' },
  { to: '/pharmacovigilance', label: '药物警戒', en: 'PV', icon: 'mdi-shield-check-outline' },
]

const seoChecks = computed(() => {
  const d = draft.value
  if (!d) return []
  return [
    {
      label: '站点标题',
      ok: Boolean(d.brand.name && d.brand.tagline),
      value: `${d.brand.name}｜${d.brand.tagline}`,
    },
    {
      label: '首页描述',
      ok: d.brand.description.length >= 40,
      value: `${d.brand.description.length} 字（建议 60 字以上）`,
    },
    { label: '产品内容', ok: d.products.length > 0, value: `${d.products.length} 个产品` },
    { label: '新闻内容', ok: d.news.length > 0, value: `${d.news.length} 篇动态` },
    {
      label: '联系信息',
      ok: Boolean(d.brand.phone && d.brand.email && d.brand.address),
      value: `${d.brand.phone} · ${d.brand.email}`,
    },
  ]
})

const dashContentTotal = computed(() => {
  const d = draft.value
  if (!d) return 0
  return (
    d.products.length +
    d.news.length +
    d.banners.length +
    d.academic.papers.length +
    d.academic.events.length +
    d.academic.collab.length +
    d.pages.investor.items.length +
    d.pages.jobs.items.length +
    d.pages.about.milestones.length
  )
})
const seoScore = computed(() => {
  const checks = seoChecks.value
  if (!checks.length) return 0
  return Math.round((checks.filter((check) => check.ok).length / checks.length) * 100)
})
const chartPalette = ['#1976d2', '#00bcd4', '#5c6bc0', '#26a69a', '#ffb300', '#ef5350']

const chartAxisStyles = computed(() => {
  const dark = darkMode.value
  return {
    axisLine: { lineStyle: { color: dark ? '#2b3546' : '#e3e8ef' } },
    axisTick: { show: false },
    axisLabel: { color: dark ? '#8f9bb0' : '#8a93a3', fontSize: 10 },
  }
})

const chartGridColor = computed(() => (darkMode.value ? '#252f3f' : '#eef1f6'))
const chartSurface = computed(() => (darkMode.value ? '#1a2230' : '#ffffff'))
const chartTextColor = computed(() => (darkMode.value ? '#9aa7bd' : '#131a26'))

const gaugeOption = computed<EChartsOption>(() => ({
  series: [
    {
      type: 'gauge',
      startAngle: 210,
      endAngle: -30,
      min: 0,
      max: 100,
      radius: '92%',
      center: ['50%', '60%'],
      progress: { show: true, width: 13, itemStyle: { color: '#1976d2' } },
      axisLine: { lineStyle: { width: 13, color: [[1, darkMode.value ? '#262f3d' : '#e9eff7']] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      pointer: { show: false },
      anchor: { show: false },
      detail: {
        valueAnimation: true,
        fontSize: 26,
        fontWeight: 600,
        color: chartTextColor.value,
        offsetCenter: [0, '4%'],
        formatter: '{value}%',
      },
      title: { offsetCenter: [0, '42%'], color: chartTextColor.value, fontSize: 11 },
      data: [{ value: seoScore.value, name: 'SEO 完整度' }],
    },
  ],
}))

const compositionOption = computed<EChartsOption>(() => {
  const d = draft.value
  const data = d
    ? [
        { name: '产品', value: d.products.length },
        { name: '新闻', value: d.news.length },
        { name: '公告', value: d.pages.investor.items.length },
        { name: '岗位', value: d.pages.jobs.items.length },
        { name: '横幅', value: d.banners.length },
        { name: '论文', value: d.academic.papers.length },
        { name: '活动', value: d.academic.events.length },
        { name: '合作', value: d.academic.collab.length },
      ].filter((item) => item.value > 0)
    : []

  return {
    color: chartPalette,
    tooltip: { trigger: 'item', confine: true },
    legend: {
      bottom: 0,
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { fontSize: 11, color: darkMode.value ? '#9aa7bd' : '#6b7688' },
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '72%'],
        center: ['50%', '44%'],
        itemStyle: { borderColor: chartSurface.value, borderWidth: 3, borderRadius: 6 },
        label: { show: false },
        emphasis: { scaleSize: 6 },
        data,
      },
    ],
  }
})

const saveTrendOption = computed<EChartsOption>(() => {
  const buckets = new Map<string, number>()
  const days = 7

  for (let i = days - 1; i >= 0; i--) {
    const day = new Date()
    day.setHours(0, 0, 0, 0)
    day.setDate(day.getDate() - i)
    buckets.set(day.toISOString().slice(0, 10), 0)
  }

  for (const revision of revisions.value) {
    const key = String(revision.created_at || '').slice(0, 10)
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1)
  }

  const labels = [...buckets.keys()].map((key) => key.slice(5).replace('-', '/'))
  const values = [...buckets.values()]

  return {
    grid: { left: 6, right: 14, top: 26, bottom: 6, containLabel: true },
    tooltip: { trigger: 'axis', confine: true },
    xAxis: { type: 'category', boundaryGap: false, data: labels, ...chartAxisStyles.value },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { color: chartGridColor.value } },
      axisLabel: { color: chartAxisStyles.value.axisLabel.color, fontSize: 10 },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: values,
        lineStyle: { width: 2.5, color: '#1976d2' },
        itemStyle: { color: '#1976d2' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(25, 118, 210, 0.28)' },
              { offset: 1, color: 'rgba(25, 118, 210, 0.02)' },
            ],
          },
        },
      },
    ],
  }
})

const yearsOption = computed<EChartsOption>(() => {
  const d = draft.value
  const counts = new Map<string, number>()
  d?.academic.papers.forEach((paper) => {
    counts.set(paper.year, (counts.get(paper.year) ?? 0) + 1)
  })

  const years = [...counts.keys()].sort()

  return {
    grid: { left: 6, right: 10, top: 20, bottom: 6, containLabel: true },
    tooltip: { trigger: 'axis', confine: true },
    xAxis: { type: 'category', data: years, ...chartAxisStyles.value },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { color: chartGridColor.value } },
      axisLabel: { color: chartAxisStyles.value.axisLabel.color, fontSize: 10 },
    },
    series: [
      {
        type: 'bar',
        barWidth: 20,
        data: years.map((year) => counts.get(year)),
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#00bcd4' },
              { offset: 1, color: '#7fdcf0' },
            ],
          },
        },
      },
    ],
  }
})

const timeFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Shanghai',
})

const clockFormatter = new Intl.DateTimeFormat('zh-CN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Shanghai',
})

const timeText = (iso: string | null | undefined) => {
  if (!iso) return '尚未记录'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '时间未知'
  return timeFormatter.format(date)
}

const clockText = (iso: string | null | undefined) => {
  if (!iso) return '--:--'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '--:--'
  return clockFormatter.format(date)
}

const pad2 = (value: number) => String(value).padStart(2, '0')

const toLines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

const statusOf = (error: unknown) => {
  if (error && typeof error === 'object') {
    const value = error as { status?: number; statusCode?: number; response?: { status?: number } }
    return value.status ?? value.statusCode ?? value.response?.status ?? 0
  }
  return 0
}

const moveItem = (list: unknown[], index: number, offset: -1 | 1) => {
  const next = index + offset
  if (next < 0 || next >= list.length) return
  const [item] = list.splice(index, 1)
  if (item !== undefined) list.splice(next, 0, item)
}

const removeItem = (list: unknown[], index: number) => {
  list.splice(index, 1)
}

const countFor = (id: SectionId): number | null => {
  if (!draft.value) return null
  switch (id) {
    case 'banners':
      return draft.value.banners.length
    case 'products':
      return draft.value.products.length
    case 'news':
      return draft.value.news.length
    case 'about':
      return draft.value.pages.about.sections.length + draft.value.pages.about.milestones.length
    case 'academic':
      return draft.value.academic.papers.length + draft.value.academic.events.length
    case 'investor':
      return draft.value.pages.investor.items.length
    case 'jobs':
      return draft.value.pages.jobs.items.length
    case 'contact':
      return draft.value.pages.contact.fields.length
    case 'pv':
      return draft.value.pages.pharmacovigilance.fields.length
    case 'site':
      return draft.value.site.utilityLinks.length + draft.value.site.footerLinks.length
    case 'copy':
      return draft.value.company.length + draft.value.stats.length
    default:
      return null
  }
}

const investorTypeOptions = ['临时公告', '定期报告', '投资者关系活动']
const jobTypeOptions = ['社会招聘', '校园招聘']
const formFieldTypeOptions = [
  { title: '单行文本', value: 'text' },
  { title: '电话号码', value: 'tel' },
  { title: '电子邮箱', value: 'email' },
  { title: '多行文本', value: 'textarea' },
  { title: '下拉选择', value: 'select' },
]

/** 下拉切换字段类型时补上 options，避免 AdminLinesField 收到 undefined。 */
const changeFieldType = (field: SiteFormField, value: unknown) => {
  field.type = (typeof value === 'string' ? value : 'text') as SiteFormField['type']
  if (field.type === 'select' && !Array.isArray(field.options)) field.options = []
}

const productCategoryOptions = computed(() => {
  const base = draft.value?.pages.products.categories ?? ['制剂产品', '原料药']
  const used = (draft.value?.products ?? []).map((product) => product.category).filter(Boolean)
  return [...new Set([...base, ...used])]
})

const productGroupOptions = computed(() => {
  const base = draft.value?.pages.products.groups ?? []
  const used = (draft.value?.products ?? [])
    .map((product) => product.group)
    .filter((group): group is string => Boolean(group))
  return [...new Set([...base, ...used])]
})

/** 「联系我们」「药物警戒」共用同一套页面元信息 + 表单字段编辑界面。 */
const formPages = computed(() => {
  const d = draft.value
  if (!d) return []
  return [
    {
      id: 'contact' as SectionId,
      label: '联系我们',
      en: 'Contact',
      icon: 'mdi-map-marker-outline',
      note: '页面文案与表单字段；字段顺序即前台表单顺序。',
      page: d.pages.contact as SiteFormsPage,
    },
    {
      id: 'pv' as SectionId,
      label: '药物警戒',
      en: 'PV',
      icon: 'mdi-shield-check-outline',
      note: '不良反应报告页的文案与表单字段；字段顺序即前台表单顺序。',
      page: d.pages.pharmacovigilance as SiteFormsPage,
    },
  ]
})

const notify = (message: string, color: 'success' | 'error' | 'info' = 'success') => {
  snackbarText.value = message
  snackbarColor.value = color
  snackbar.value = true
}

const selectSection = (id: SectionId) => {
  active.value = id
  if (!isDesktop.value) drawer.value = false
  window.scrollTo({ top: 0, behavior: 'auto' })
  if (import.meta.client) {
    const hash = id === 'dash' ? '' : `#${id}`
    history.replaceState(history.state, '', `${location.pathname}${location.search}${hash}`)
  }
}

/* ------------------------------------------------------------------ *
 * 状态同步
 * ------------------------------------------------------------------ */

const syncRaw = () => {
  rawText.value = JSON.stringify(draft.value, null, 2)
  rawSnapshot.value = JSON.stringify(draft.value)
  rawError.value = ''
}

const applyPayload = (payload: AdminPayload) => {
  const saved = payload.content
  content.value = saved
  if (payload.meta) meta.value = payload.meta
  revisions.value = Array.isArray(payload.revisions) ? payload.revisions : []

  const next = JSON.parse(JSON.stringify(saved)) as DraftConfig
  draft.value = next
  savedSnapshot.value = JSON.stringify(next)
  rawText.value = JSON.stringify(next, null, 2)
  rawSnapshot.value = JSON.stringify(next)
  rawError.value = ''
}

const dirty = computed(() => !!draft.value && JSON.stringify(draft.value) !== savedSnapshot.value)

const savedSize = computed(() => (content.value ? JSON.stringify(content.value).length : 0))

const draftSize = computed(() => (draft.value ? JSON.stringify(draft.value).length : 0))

if (bootstrap.value?.payload) {
  applyPayload(bootstrap.value.payload)
}

/* ------------------------------------------------------------------ *
 * 登录 / 登出
 * ------------------------------------------------------------------ */

const login = async () => {
  if (loggingIn.value) return
  loginError.value = ''
  if (!password.value) {
    loginError.value = '请输入管理密码。'
    return
  }

  loggingIn.value = true
  try {
    await $fetch('/api/admin/login', { method: 'POST', body: { password: password.value } })
    const payload = await $fetch<AdminPayload>('/api/admin/content')
    applyPayload(payload)
    authenticated.value = true
    password.value = ''
    drawer.value = isDesktop.value
    notify('已登录，可以开始编辑内容。')
  } catch (error) {
    const status = statusOf(error)
    loginError.value =
      status === 401
        ? '密码不正确，请重试。'
        : status
          ? `登录失败（${status}），请稍后再试。`
          : '登录失败，请检查网络后重试。'
  } finally {
    loggingIn.value = false
  }
}

const logout = async () => {
  if (dirty.value && !window.confirm('还有未保存的修改，确认退出登录？')) return
  try {
    await $fetch('/api/admin/logout', { method: 'POST' })
  } catch {
    /* 忽略登出接口错误，本地状态照常清空 */
  }
  snackbar.value = false
  authenticated.value = false
  content.value = null
  draft.value = null
  revisions.value = []
  savedSnapshot.value = ''
  password.value = ''
  loginError.value = ''
  rawText.value = ''
  rawSnapshot.value = ''
  rawError.value = ''
  restoreDialog.value = false
  pendingRestore.value = null
}

const handleExpired = () => {
  authenticated.value = false
  loginError.value = '登录已过期，请重新登录。'
  snackbar.value = false
  restoreDialog.value = false
  pendingRestore.value = null
  rawError.value = ''
}

/* ------------------------------------------------------------------ *
 * 保存 / 版本恢复 / JSON
 * ------------------------------------------------------------------ */

const save = async () => {
  if (!draft.value || saving.value || !dirty.value) return
  saving.value = true
  try {
    const payload = await $fetch<AdminPayload>('/api/admin/content', {
      method: 'PUT',
      body: { content: draft.value },
    })
    applyPayload(payload)
    notify(`已保存 · ${clockText(payload.meta?.updatedAt)}`)
  } catch (error) {
    const status = statusOf(error)
    if (status === 401) {
      handleExpired()
    } else {
      notify(`保存失败${status ? `（${status}）` : ''}，请重试。`, 'error')
    }
  } finally {
    saving.value = false
  }
}

const openRestore = (revision: Revision) => {
  pendingRestore.value = revision
  restoreDialog.value = true
}

const cancelRestore = () => {
  if (restoringId.value !== null) return
  restoreDialog.value = false
  pendingRestore.value = null
}

const restore = async (id: number) => {
  if (restoringId.value !== null) return
  restoringId.value = id
  try {
    const payload = await $fetch<AdminPayload>(`/api/admin/revisions/${id}/restore`, { method: 'POST' })
    applyPayload(payload)
    notify(`已恢复到版本 #${id}`)
  } catch (error) {
    const status = statusOf(error)
    if (status === 401) {
      handleExpired()
    } else {
      notify(`恢复失败${status ? `（${status}）` : ''}，请重试。`, 'error')
    }
  } finally {
    restoringId.value = null
  }
}

const confirmRestore = async () => {
  const target = pendingRestore.value
  if (!target || restoringId.value !== null) return
  await restore(target.id)
  restoreDialog.value = false
  pendingRestore.value = null
}

const applyRaw = () => {
  rawError.value = ''
  let parsed: unknown
  try {
    parsed = JSON.parse(rawText.value)
  } catch (error) {
    rawError.value = `JSON 解析失败：${(error as Error).message}`
    return
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    rawError.value = '顶层内容必须是一个对象（以 { 开始、以 } 结束）。'
    return
  }
  draft.value = JSON.parse(JSON.stringify(parsed)) as DraftConfig
  rawSnapshot.value = JSON.stringify(draft.value)
  notify('JSON 已应用到当前草稿，点击顶部「保存」才会写入数据库。', 'info')
}

watch(active, (next) => {
  if (next !== 'json') return
  rawError.value = ''
  if (JSON.stringify(draft.value) !== rawSnapshot.value) syncRaw()
})

/* ------------------------------------------------------------------ *
 * 各分区的添加
 * ------------------------------------------------------------------ */

const addBanner = () => draft.value?.banners.push({ src: '', alt: '', position: '50% 50%' })
const addProduct = () =>
  draft.value?.products.push({
    code: '',
    name: '',
    category: '制剂产品',
    group: '',
    form: '',
    spec: '',
    tag: '',
    description: '',
    image: '',
    indication: '',
    holder: '',
    detail: '',
  })
const addNews = () =>
  draft.value?.news.push({
    id: `n-${Date.now().toString(36)}`,
    date: '',
    category: '企业动态',
    title: '',
    excerpt: '',
    body: [],
    cover: '',
    sourceUrl: '',
  })
const addPaper = () => draft.value?.academic.papers.push({ year: '', title: '', journal: '', tags: [] })
const addEvent = () => draft.value?.academic.events.push({ date: '', name: '', place: '', role: '' })
const addCompany = () => draft.value?.company.push({ label: '', value: '' })
const addStat = () => draft.value?.stats.push({ value: '', label: '', labelEn: '' })

const addAboutSection = () =>
  draft.value?.pages.about.sections.push({ title: '', paragraphs: [] })
const addMilestone = () =>
  draft.value?.pages.about.milestones.push({ period: '', title: '', text: '' })
const addInvestorItem = () =>
  draft.value?.pages.investor.items.push({
    date: '',
    type: '临时公告',
    title: '',
    url: '',
    summary: '',
    body: [],
  })
const addJob = () =>
  draft.value?.pages.jobs.items.push({
    id: `job-${Date.now().toString(36)}`,
    type: '社会招聘',
    title: '',
    department: '',
    location: '',
    headcount: '',
    description: '',
    requirements: [],
  })
const addUtilityLink = () => draft.value?.site.utilityLinks.push({ label: '', to: '' })
const addFooterLink = () => draft.value?.site.footerLinks.push({ label: '', url: '' })
const addFormField = (page: SiteFormsPage) =>
  page.fields.push({ name: '', label: '', type: 'text', required: false, placeholder: '' })

/* ------------------------------------------------------------------ *
 * 未保存离开提醒
 * ------------------------------------------------------------------ */

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (!dirty.value) return
  event.preventDefault()
  event.returnValue = ''
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)

  const hash = location.hash.replace('#', '') as SectionId
  if (hash && sections.some((section) => section.id === hash)) {
    active.value = hash
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<template>
  <v-app class="studio-app">
    <!-- ============================ 未登录 ============================ -->
    <div v-if="!authenticated" class="login-shell">
      <v-card class="login-card" elevation="8">
        <v-card-text class="pa-7 pa-sm-9">
          <v-avatar color="primary" rounded="lg" size="56" class="mb-5">
            <v-icon icon="mdi-dna" size="30" />
          </v-avatar>

          <p class="text-overline text-primary mb-1">Content Studio</p>
          <h1 class="text-h4 font-weight-medium mb-3">内容管理</h1>
          <p class="text-body-2 text-medium-emphasis mb-6">
            登录后可编辑官网站点的品牌信息、首页横幅、产品、新闻、关于、投资者、招聘与页面内容。
          </p>

          <v-form @submit.prevent="login">
            <v-text-field
              v-model="password"
              type="password"
              name="password"
              label="管理密码"
              placeholder="请输入管理密码"
              prepend-inner-icon="mdi-lock-outline"
              autocomplete="current-password"
              :disabled="loggingIn"
              :error="!!loginError"
              hide-details="auto"
              class="mb-4"
            />

            <v-alert v-if="loginError" type="error" variant="tonal" density="comfortable" class="mb-4" role="alert">
              {{ loginError }}
            </v-alert>

            <v-btn type="submit" color="primary" block height="46" :loading="loggingIn" :disabled="loggingIn || !password">
              登录
            </v-btn>
          </v-form>

          <v-divider class="my-6" />

          <p class="text-caption text-medium-emphasis mb-0">
            密码来自服务端环境变量 <code>ADMIN_PASSWORD</code>，开发环境默认密码见项目说明。
          </p>
        </v-card-text>
      </v-card>
    </div>

    <!-- ============================ 已登录 ============================ -->
    <template v-else-if="draft">
      <!-- 左侧导航 -->
      <v-navigation-drawer
        v-model="drawer"
        :permanent="isDesktop"
        :temporary="!isDesktop"
        :width="280"
        order="-1"
        class="lux-drawer"
        color="surface"
        elevation="0"
      >
        <div class="lux-brand">
          <v-avatar color="primary" rounded="lg" size="36">
            <v-icon icon="mdi-dna" size="20" />
          </v-avatar>
          <div class="min-w-0">
            <div class="lux-brand-title">{{ draft?.brand.shortName || 'XXX' }} Studio</div>
            <div class="lux-brand-sub">Content Studio</div>
          </div>
        </div>

        <v-list nav density="comfortable" class="lux-nav">
          <template v-for="group in navGroups" :key="group.title">
            <v-list-subheader class="lux-nav-group">{{ group.title }}</v-list-subheader>

            <v-list-item
              v-for="item in group.items"
              :key="item.id"
              :active="active === item.id"
              rounded="lg"
              class="lux-nav-item mb-1"
              @click="selectSection(item.id)"
            >
              <template #prepend>
                <v-icon :icon="item.icon" size="20" />
              </template>

              <v-list-item-title class="text-body-2">{{ item.label }}</v-list-item-title>

              <template #append>
                <span v-if="item.count" class="text-caption text-medium-emphasis">{{ countFor(item.id) }}</span>
              </template>
            </v-list-item>
          </template>
        </v-list>

        <template #append>
          <div class="pa-3">
            <div class="lux-promo">
              <v-avatar color="white" size="34" class="mb-3">
                <v-icon icon="mdi-dna" color="primary" size="18" />
              </v-avatar>
              <div class="text-body-2 font-weight-medium text-white">官网内容</div>
              <div class="lux-promo-sub mb-3">保存后即刻生效</div>
              <v-btn
                block
                size="small"
                variant="outlined"
                color="white"
                rounded="lg"
                prepend-icon="mdi-open-in-new"
                href="/"
                target="_blank"
                rel="noopener noreferrer"
              >
                查看官网
              </v-btn>
            </div>
          </div>
        </template>
      </v-navigation-drawer>

      <!-- 顶部工具栏 -->
      <v-app-bar flat height="64" color="surface" class="lux-appbar">
        <v-app-bar-nav-icon v-if="!isDesktop" aria-label="打开导航" @click="drawer = !drawer" />

        <v-text-field
          v-model="sectionSearch"
          class="lux-search"
          density="compact"
          variant="solo"
          flat
          rounded="lg"
          :bg-color="darkMode ? 'surface-variant' : 'grey-lighten-4'"
          placeholder="搜索分区"
          prepend-inner-icon="mdi-magnify"
          hide-details
          single-line
        />

        <v-spacer />

        <v-chip
          class="d-none d-lg-flex mr-1"
          size="small"
          variant="text"
          prepend-icon="mdi-clock-outline"
        >
          {{ timeText(meta.updatedAt) }}
        </v-chip>

        <v-chip
          class="d-none d-sm-flex mr-2"
          size="small"
          variant="tonal"
          :color="dirty ? 'warning' : 'success'"
        >
          {{ dirty ? '未保存' : '已保存' }}
        </v-chip>

        <v-icon
          v-if="!smAndUp"
          class="mr-1"
          :color="dirty ? 'warning' : 'success'"
          :icon="dirty ? 'mdi-alert-circle-outline' : 'mdi-check-circle-outline'"
          size="18"
        />

        <v-menu location="bottom end" :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon="mdi-palette-outline" variant="text" title="外观设置" aria-label="外观设置" />
          </template>

          <v-card class="theme-menu pa-4" rounded="lg" elevation="6" min-width="248">
            <div class="text-caption text-medium-emphasis mb-2">主题色</div>
            <div class="d-flex flex-wrap ga-2">
              <button
                v-for="preset in themePresets"
                :key="preset.value"
                type="button"
                class="theme-swatch"
                :class="{ 'theme-swatch--active': themePrefs.primary === preset.value }"
                :style="{ background: preset.value }"
                :title="preset.name"
                :aria-label="preset.name"
                @click="setPrimaryColor(preset.value)"
              >
                <v-icon
                  v-if="themePrefs.primary === preset.value"
                  icon="mdi-check"
                  size="15"
                  color="white"
                />
              </button>
            </div>

            <v-divider class="my-3" />

            <v-switch
              v-model="darkMode"
              label="深色模式"
              color="primary"
              density="compact"
              hide-details
              inset
            />

            <p class="text-caption text-medium-emphasis mt-2 mb-0">设置保存在本机浏览器，刷新后保持。</p>
          </v-card>
        </v-menu>

        <v-btn icon="mdi-history" variant="text" title="版本历史" aria-label="版本历史" @click="historyDialog = true" />
        <v-btn icon="mdi-open-in-new" variant="text" href="/" target="_blank" rel="noopener noreferrer" title="查看官网" aria-label="查看官网" />

        <v-btn
          class="ml-1"
          color="primary"
          prepend-icon="mdi-content-save"
          :disabled="saving || !dirty"
          :loading="saving"
          @click="save"
        >
          <span class="d-none d-sm-inline">保存</span>
        </v-btn>

        <v-menu location="bottom end">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon="mdi-account-circle-outline" variant="text" class="ml-1" title="账号" aria-label="账号" />
          </template>
          <v-list density="compact" rounded="lg" elevation="3">
            <v-list-item prepend-icon="mdi-logout" title="退出登录" @click="logout" />
          </v-list>
        </v-menu>
      </v-app-bar>

      <!-- 版本历史 -->
      <v-dialog v-model="historyDialog" max-width="520">
        <v-card rounded="xl">
          <v-card-item>
            <v-card-title class="text-subtitle-1">版本历史</v-card-title>
            <v-card-subtitle>每次保存都会生成一个版本，最多保留 20 个。</v-card-subtitle>
          </v-card-item>
          <v-divider />
          <v-list density="comfortable" max-height="420" class="overflow-y-auto">
            <v-list-item v-for="revision in revisions" :key="`history-${revision.id}`">
              <template #prepend>
                <v-avatar size="34" variant="tonal" color="primary">
                  <span class="text-caption">#{{ revision.id }}</span>
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-2">{{ timeText(revision.created_at) }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">版本 #{{ revision.id }}</v-list-item-subtitle>
              <template #append>
                <v-btn size="small" variant="tonal" color="primary" :disabled="restoringId !== null" @click="openRestore(revision)">
                  恢复
                </v-btn>
              </template>
            </v-list-item>
            <v-list-item v-if="!revisions.length" title="暂无历史版本" subtitle="首次保存后会生成。" />
          </v-list>
        </v-card>
      </v-dialog>

      <!-- 内容区 -->
      <v-main class="lux-main">
        <div class="lux-content pa-4 pa-md-6">
            <!-- ======================= 站点概览 ======================= -->
            <div v-show="active === 'dash'" id="dash" class="dash-board">
              <v-row density="compact">
                <v-col cols="12" md="8">
                  <v-card class="dash-hero" rounded="xl">
                    <div class="d-flex align-start justify-space-between">
                      <div>
                        <div class="dash-hero-label">站点概况</div>
                        <div class="dash-hero-sub">{{ draft.brand.name }} · {{ draft.brand.nameEn }}</div>
                      </div>
                      <v-chip size="small" variant="flat" class="dash-hero-chip">内容 {{ dashContentTotal }} 条</v-chip>
                    </div>

                    <div class="dash-hero-number">{{ dashContentTotal }}</div>
                    <div class="dash-hero-caption">{{ draft.brand.tagline }}</div>

                    <div class="d-flex flex-wrap ga-2 dash-hero-links">
                      <v-chip
                        v-for="item in publicPages"
                        :key="`hero-${item.to}`"
                        size="x-small"
                        variant="outlined"
                        class="dash-hero-link"
                        :to="item.to"
                        target="_blank"
                      >
                        {{ item.label }}
                      </v-chip>
                    </div>

                    <svg class="dash-hero-wave" viewBox="0 0 600 70" preserveAspectRatio="none" aria-hidden="true">
                      <path
                        d="M0 56C90 56 140 20 230 18s130 24 210 18 160-18 160-18"
                        fill="none"
                        stroke="rgba(94, 234, 212, 0.7)"
                        stroke-width="1.4"
                      />
                      <path
                        d="M0 66C100 66 170 42 260 40s140 14 200 10 140-10 140-10"
                        fill="none"
                        stroke="rgba(94, 234, 212, 0.28)"
                        stroke-width="1.2"
                      />
                    </svg>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card class="h-100" rounded="xl">
                    <v-card-item>
                      <v-card-title>内容完整度</v-card-title>
                      <v-card-subtitle>SEO 基础项通过率</v-card-subtitle>
                    </v-card-item>
                    <v-card-text class="pt-0 pb-2">
                      <AdminChart :option="gaugeOption" :height="196" />
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-row density="compact">
                <v-col v-for="stat in dashStats" :key="stat.label" cols="6" md="3">
                  <v-card class="dash-stat" rounded="xl" @click="selectSection(stat.to)">
                    <div class="dash-stat-head">
                      <v-avatar size="32" color="primary" variant="tonal" rounded="lg">
                        <v-icon :icon="stat.icon" size="17" />
                      </v-avatar>
                      <v-icon icon="mdi-arrow-top-right" size="15" class="dash-stat-arrow" />
                    </div>
                    <div class="dash-stat-value">
                      {{ stat.value }}<span class="dash-stat-unit">{{ stat.unit }}</span>
                    </div>
                    <div class="dash-stat-label">{{ stat.label }}</div>
                  </v-card>
                </v-col>
              </v-row>

              <v-row density="compact">
                <v-col cols="12" md="8">
                  <v-card class="h-100" rounded="xl">
                    <v-card-item>
                      <v-card-title>保存活动</v-card-title>
                      <v-card-subtitle>最近 7 天的内容保存次数</v-card-subtitle>
                    </v-card-item>
                    <v-card-text class="pt-1">
                      <AdminChart :option="saveTrendOption" :height="236" />
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card class="h-100" rounded="xl">
                    <v-card-item>
                      <v-card-title>内容构成</v-card-title>
                      <v-card-subtitle>各分区条目占比</v-card-subtitle>
                    </v-card-item>
                    <v-card-text class="pt-1">
                      <AdminChart :option="compositionOption" :height="236" />
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-row density="compact">
                <v-col cols="12" md="4">
                  <v-card class="h-100" rounded="xl">
                    <v-card-item>
                      <v-card-title>论文年份分布</v-card-title>
                      <v-card-subtitle>学术成果按年份</v-card-subtitle>
                    </v-card-item>
                    <v-card-text class="pt-1">
                      <AdminChart :option="yearsOption" :height="210" />
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card class="h-100" rounded="xl">
                    <v-card-item>
                      <v-card-title>站点信息</v-card-title>
                      <v-card-subtitle>内容与数据库状态</v-card-subtitle>
                    </v-card-item>
                    <v-divider />
                    <v-card-text class="pt-3">
                      <v-list density="compact" class="bg-transparent pa-0">
                        <v-list-item title="品牌名称" :subtitle="`${draft.brand.name} · ${draft.brand.nameEn}`" />
                        <v-list-item title="联系方式" :subtitle="`${draft.brand.phone} · ${draft.brand.email}`" />
                        <v-list-item title="公司地址" :subtitle="draft.brand.address" />
                        <v-list-item title="数据库更新时间" :subtitle="timeText(meta.updatedAt)" />
                        <v-list-item title="数据库文件" :subtitle="meta.dbPath || '—'" />
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card class="h-100" rounded="xl">
                    <v-card-item>
                      <v-card-title>最近保存</v-card-title>
                      <v-card-subtitle>共 {{ revisions.length }} 个版本</v-card-subtitle>
                    </v-card-item>
                    <v-divider />
                    <v-card-text class="pt-3">
                      <v-table density="compact" class="dash-table">
                        <tbody>
                          <tr v-for="rev in revisions.slice(0, 5)" :key="`dash-rev-${rev.id}`">
                            <td style="width: 64px">#{{ rev.id }}</td>
                            <td>{{ timeText(rev.created_at) }}</td>
                            <td class="text-right">
                              <v-btn size="x-small" variant="text" color="primary" :disabled="restoringId !== null" @click="openRestore(rev)">
                                恢复
                              </v-btn>
                            </td>
                          </tr>
                          <tr v-if="!revisions.length">
                            <td class="text-medium-emphasis">暂无保存记录</td>
                          </tr>
                        </tbody>
                      </v-table>

                      <div class="d-flex flex-wrap ga-2 mt-4">
                        <v-btn size="small" variant="tonal" color="primary" prepend-icon="mdi-domain" @click="selectSection('brand')">品牌</v-btn>
                        <v-btn size="small" variant="tonal" color="primary" prepend-icon="mdi-image-multiple-outline" @click="selectSection('banners')">横幅</v-btn>
                        <v-btn size="small" variant="tonal" color="primary" prepend-icon="mdi-code-json" @click="selectSection('json')">JSON</v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>
<!-- ======================= 品牌信息 ======================= -->
            <StudioSectionCard
              v-show="active === 'brand'"
              id="brand"
              title="品牌信息"
              en="Brand"
              icon="mdi-domain"
              note="页头、页脚与联系信息都读取这里，修改后全站同步生效。"
            >
              <StudioGroupHead title="基础信息" icon="mdi-card-account-details-outline" />

              <v-row density="compact">
                <v-col cols="12" md="6">
                  <v-text-field v-model="draft.brand.name" label="品牌名称" hide-details="auto" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="draft.brand.shortName" label="简称" hide-details="auto" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="draft.brand.nameEn" label="英文名称" hide-details="auto" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field v-model="draft.brand.founded" label="成立年份" hide-details="auto" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="draft.brand.tagline" label="品牌主张" hide-details="auto" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="draft.brand.taglineEn" label="英文主张" hide-details="auto" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="draft.brand.email" type="email" label="联系邮箱" hide-details="auto" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="draft.brand.phone" label="联系电话" hide-details="auto" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="draft.brand.address" label="公司地址" hide-details="auto" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="draft.brand.wechat" label="微信号" hide-details="auto" />
                </v-col>
                <v-col cols="12">
                  <AdminImageField
                    v-model="draft.brand.logo"
                    label="Logo 图片"
                    placeholder="留空则使用内置图标"
                    hint="留空使用内置图标；建议上传透明底 PNG / SVG，显示尺寸 36–40px"
                    @error="notify($event, 'error')"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="draft.brand.description"
                    label="品牌简介"
                    :rows="4"
                    hint="显示在页面描述与页脚，建议 60–120 字。"
                    persistent-hint
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
            </StudioSectionCard>

            <!-- ======================= 首页横幅 ======================= -->
            <StudioSectionCard
              v-show="active === 'banners'"
              id="banners"
              title="首页横幅"
              en="Banners"
              icon="mdi-image-multiple-outline"
              note="顺序即轮播顺序。焦点位置用于裁切取景，例如 50% 55%。"
              :count="draft.banners.length"
              unit="张"
            >
              <v-alert v-if="!draft.banners.length" type="info" variant="tonal" density="comfortable" class="mb-4">
                还没有横幅图片，点击下方「添加一项」开始。
              </v-alert>

              <StudioRepeaterItem
                v-for="(banner, index) in draft.banners"
                :key="`banner-${index}`"
                :index="index"
                :title="banner.alt || '未命名横幅'"
                :subtitle="banner.src"
                :image="banner.src"
                :can-move-up="index > 0"
                :can-move-down="index < draft.banners.length - 1"
                @up="moveItem(draft.banners, index, -1)"
                @down="moveItem(draft.banners, index, 1)"
                @remove="removeItem(draft.banners, index)"
              >
                <v-row density="compact">
                  <v-col cols="12">
                    <AdminImageField
                      v-model="banner.src"
                      label="图片路径"
                      placeholder="/images/banner-1.jpg"
                      hint="可上传、拖拽或从图片库选择；支持 JPG/PNG/WebP，单张 ≤ 8MB"
                      @error="notify($event, 'error')"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="banner.alt" label="替代文字" placeholder="描述画面内容" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="banner.position"
                      label="焦点位置（可选）"
                      placeholder="50% 55%"
                      hint="用于裁切取景，例如 50% 55%"
                      persistent-hint
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </StudioRepeaterItem>

              <v-btn variant="tonal" color="primary" prepend-icon="mdi-plus" class="mt-1" @click="addBanner">
                添加一项
              </v-btn>
            </StudioSectionCard>

            <!-- ======================= 产品中心 ======================= -->
            <StudioSectionCard
              v-show="active === 'products'"
              id="products"
              title="产品中心"
              en="Products"
              icon="mdi-package-variant-closed"
              note="顺序即展示顺序。药品分类、治疗领域、剂型、规格、适应症、持有人用于产品详情弹窗。"
              :count="draft.products.length"
              unit="个"
            >
              <v-alert v-if="!draft.products.length" type="info" variant="tonal" density="comfortable" class="mb-4">
                还没有产品，点击下方「添加一项」开始。
              </v-alert>

              <StudioRepeaterItem
                v-for="(product, index) in draft.products"
                :key="`product-${index}`"
                :index="index"
                :title="product.name || '未命名产品'"
                :subtitle="[product.code, product.category, product.tag].filter(Boolean).join(' · ')"
                :image="product.image"
                :can-move-up="index > 0"
                :can-move-down="index < draft.products.length - 1"
                @up="moveItem(draft.products, index, -1)"
                @down="moveItem(draft.products, index, 1)"
                @remove="removeItem(draft.products, index)"
              >
                <v-row density="compact">
                  <v-col cols="12" md="6">
                    <v-text-field v-model="product.code" label="产品编号" placeholder="P-01" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="product.name" label="产品名称" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="product.category"
                      :items="productCategoryOptions"
                      label="药品分类"
                      hint="制剂产品 / 原料药"
                      persistent-hint
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="product.group"
                      :items="productGroupOptions"
                      label="治疗领域"
                      hint="对应「产品中心」的治疗领域筛选"
                      persistent-hint
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="product.tag" label="标签" placeholder="医保乙类" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="product.form" label="剂型" placeholder="注射剂" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="product.spec" label="规格" placeholder="2ml:4mg" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="product.holder" label="持有人" placeholder="XXX 制药有限公司" hide-details="auto" />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="product.indication"
                      label="适应症"
                      :rows="3"
                      hide-details="auto"
                      placeholder="用于……"
                    />
                  </v-col>
                  <v-col cols="12">
                    <AdminImageField
                      v-model="product.image"
                      label="产品图片（列表卡片与详情弹窗大图）"
                      placeholder="/images/product-1.svg"
                      hint="可上传、拖拽或从图片库选择"
                      @error="notify($event, 'error')"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="product.description"
                      label="产品描述（列表卡片摘要）"
                      :rows="3"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="product.detail"
                      label="产品说明（详情弹窗正文）"
                      :rows="4"
                      hint="详情弹窗中的完整说明；留空时前台回退显示「产品描述」。"
                      persistent-hint
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </StudioRepeaterItem>

              <v-btn variant="tonal" color="primary" prepend-icon="mdi-plus" class="mt-1" @click="addProduct">
                添加一项
              </v-btn>
            </StudioSectionCard>

            <!-- ======================= 新闻中心 ======================= -->
            <StudioSectionCard
              v-show="active === 'news'"
              id="news"
              title="新闻中心"
              en="News"
              icon="mdi-newspaper-variant-outline"
              note="正文一行一段；分类建议用 企业动态 / 政策法规。"
              :count="draft.news.length"
              unit="篇"
            >
              <v-alert v-if="!draft.news.length" type="info" variant="tonal" density="comfortable" class="mb-4">
                还没有新闻，点击下方「添加一项」开始。
              </v-alert>

              <StudioRepeaterItem
                v-for="(item, index) in draft.news"
                :key="`news-${index}`"
                :index="index"
                :title="item.title || '未命名新闻'"
                :subtitle="[item.date, item.category].filter(Boolean).join(' · ')"
                :can-move-up="index > 0"
                :can-move-down="index < draft.news.length - 1"
                @up="moveItem(draft.news, index, -1)"
                @down="moveItem(draft.news, index, 1)"
                @remove="removeItem(draft.news, index)"
              >
                <v-row density="compact">
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="item.id"
                      label="新闻 ID（可选）"
                      placeholder="n-2026-07"
                      hint="详情页路由 /news/{id}，请保持唯一；新增时自动生成，可修改。"
                      persistent-hint
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="item.date" label="日期" placeholder="2026.10.18" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="item.category"
                      label="分类"
                      placeholder="企业动态 / 政策法规"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="item.sourceUrl"
                      label="原文链接（可选）"
                      placeholder="https://..."
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="item.title" label="标题" hide-details="auto" />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="item.excerpt" label="摘要" :rows="2" hide-details="auto" />
                  </v-col>
                  <v-col cols="12">
                    <AdminImageField
                      :model-value="item.cover ?? ''"
                      label="封面图"
                      placeholder="/images/news-1.svg"
                      hint="显示在新闻列表与详情页顶部"
                      @update:model-value="item.cover = $event"
                      @error="notify($event, 'error')"
                    />
                  </v-col>
                  <v-col cols="12">
                    <AdminLinesField v-model="item.body" label="正文" :rows="5" hint="一行一段，空行会被忽略。" />
                  </v-col>
                </v-row>
              </StudioRepeaterItem>

              <v-btn variant="tonal" color="primary" prepend-icon="mdi-plus" class="mt-1" @click="addNews">
                添加一项
              </v-btn>
            </StudioSectionCard>

            <!-- ======================= 关于我们 ======================= -->
            <StudioSectionCard
              v-show="active === 'about'"
              id="about"
              title="关于我们"
              en="About"
              icon="mdi-office-building-outline"
              note="页面标题、引言、公司简介分段与发展历程时间线；前三组依次对应「公司简介 / 研发与质量 / 企业文化」。"
              :count="draft.pages.about.sections.length + draft.pages.about.milestones.length"
              unit="项"
            >
              <StudioGroupHead title="页面信息" icon="mdi-page-layout-header" />

              <v-row density="compact">
                <v-col cols="12" md="6">
                  <v-text-field v-model="draft.pages.about.title" label="页面标题" hide-details="auto" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="draft.pages.about.subtitle" label="副标题" hide-details="auto" />
                </v-col>
                <v-col cols="12">
                  <AdminLinesField
                    v-model="draft.pages.about.intro"
                    label="引言"
                    :rows="4"
                    hint="一行一段，显示在页面头部与「公司简介」正文。"
                  />
                </v-col>
              </v-row>

              <StudioGroupHead
                title="公司简介分段"
                icon="mdi-text-box-outline"
                :count="draft.pages.about.sections.length"
                unit="组"
              />

              <v-alert v-if="!draft.pages.about.sections.length" type="info" variant="tonal" density="comfortable" class="mb-4">
                还没有简介分段。
              </v-alert>

              <StudioRepeaterItem
                v-for="(block, index) in draft.pages.about.sections"
                :key="`about-section-${index}`"
                :index="index"
                :title="block.title || '未命名分段'"
                :subtitle="`${block.paragraphs.length} 段正文`"
                :can-move-up="index > 0"
                :can-move-down="index < draft.pages.about.sections.length - 1"
                @up="moveItem(draft.pages.about.sections, index, -1)"
                @down="moveItem(draft.pages.about.sections, index, 1)"
                @remove="removeItem(draft.pages.about.sections, index)"
              >
                <v-row density="compact">
                  <v-col cols="12">
                    <v-text-field v-model="block.title" label="小标题" hide-details="auto" />
                  </v-col>
                  <v-col cols="12">
                    <AdminLinesField
                      v-model="block.paragraphs"
                      label="段落"
                      :rows="4"
                      hint="一行一段，空行会被忽略。"
                    />
                  </v-col>
                </v-row>
              </StudioRepeaterItem>

              <v-btn variant="tonal" color="primary" prepend-icon="mdi-plus" class="mt-1" @click="addAboutSection">
                添加分段
              </v-btn>

              <StudioGroupHead
                title="发展历程"
                icon="mdi-timeline-clock-outline"
                :count="draft.pages.about.milestones.length"
                unit="个"
              />

              <v-alert v-if="!draft.pages.about.milestones.length" type="info" variant="tonal" density="comfortable" class="mb-4">
                还没有发展历程节点。
              </v-alert>

              <StudioRepeaterItem
                v-for="(milestone, index) in draft.pages.about.milestones"
                :key="`milestone-${index}`"
                :index="index"
                :title="milestone.title || '未命名节点'"
                :subtitle="milestone.period"
                :can-move-up="index > 0"
                :can-move-down="index < draft.pages.about.milestones.length - 1"
                @up="moveItem(draft.pages.about.milestones, index, -1)"
                @down="moveItem(draft.pages.about.milestones, index, 1)"
                @remove="removeItem(draft.pages.about.milestones, index)"
              >
                <v-row density="compact">
                  <v-col cols="12" md="6">
                    <v-text-field v-model="milestone.period" label="时间段" placeholder="2015—2017" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="milestone.title" label="标题" hide-details="auto" />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="milestone.text" label="说明" :rows="3" hide-details="auto" />
                  </v-col>
                </v-row>
              </StudioRepeaterItem>

              <v-btn variant="tonal" color="primary" prepend-icon="mdi-plus" class="mt-1" @click="addMilestone">
                添加节点
              </v-btn>
            </StudioSectionCard>

            <!-- ======================= 学术交流 ======================= -->
            <StudioSectionCard
              v-show="active === 'academic'"
              id="academic"
              title="学术交流"
              en="Academic"
              icon="mdi-school-outline"
              note="页面引言、论文与活动列表；标签用逗号分隔，合作方向一行一项。"
              :count="draft.academic.papers.length + draft.academic.events.length"
              unit="项"
            >
              <StudioGroupHead title="页面引言" icon="mdi-text-box-outline" />

              <v-row density="compact">
                <v-col cols="12">
                  <v-textarea v-model="draft.academic.intro" label="页面引言" :rows="3" hide-details="auto" />
                </v-col>
              </v-row>

              <StudioGroupHead title="论文" icon="mdi-file-document-outline" :count="draft.academic.papers.length" unit="篇" />

              <v-alert v-if="!draft.academic.papers.length" type="info" variant="tonal" density="comfortable" class="mb-4">
                还没有论文。
              </v-alert>

              <StudioRepeaterItem
                v-for="(paper, index) in draft.academic.papers"
                :key="`paper-${index}`"
                :index="index"
                :title="paper.title || '未命名论文'"
                :subtitle="[paper.year, paper.journal].filter(Boolean).join(' · ')"
                :can-move-up="index > 0"
                :can-move-down="index < draft.academic.papers.length - 1"
                @up="moveItem(draft.academic.papers, index, -1)"
                @down="moveItem(draft.academic.papers, index, 1)"
                @remove="removeItem(draft.academic.papers, index)"
              >
                <v-row density="compact">
                  <v-col cols="12" md="6">
                    <v-text-field v-model="paper.year" label="年份" placeholder="2026" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="paper.journal" label="期刊" hide-details="auto" />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="paper.title" label="标题" hide-details="auto" />
                  </v-col>
                  <v-col cols="12">
                    <AdminLinesField
                      v-model="paper.tags"
                      mode="tags"
                      label="标签"
                      placeholder="屏障修护, 配方研究"
                      hint="逗号分隔，例如：屏障修护, 配方研究。"
                    />
                  </v-col>
                </v-row>
              </StudioRepeaterItem>

              <v-btn variant="tonal" color="primary" prepend-icon="mdi-plus" class="mt-1" @click="addPaper">
                添加一项
              </v-btn>

              <StudioGroupHead title="活动" icon="mdi-calendar-blank-outline" :count="draft.academic.events.length" unit="场" />

              <v-alert v-if="!draft.academic.events.length" type="info" variant="tonal" density="comfortable" class="mb-4">
                还没有活动。
              </v-alert>

              <StudioRepeaterItem
                v-for="(event, index) in draft.academic.events"
                :key="`event-${index}`"
                :index="index"
                :title="event.name || '未命名活动'"
                :subtitle="[event.date, event.place, event.role].filter(Boolean).join(' · ')"
                :can-move-up="index > 0"
                :can-move-down="index < draft.academic.events.length - 1"
                @up="moveItem(draft.academic.events, index, -1)"
                @down="moveItem(draft.academic.events, index, 1)"
                @remove="removeItem(draft.academic.events, index)"
              >
                <v-row density="compact">
                  <v-col cols="12" md="6">
                    <v-text-field v-model="event.date" label="日期" placeholder="2026.11" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="event.place" label="地点" placeholder="上海" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="event.name" label="活动名称" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="event.role" label="参与方式" placeholder="特邀报告" hide-details="auto" />
                  </v-col>
                </v-row>
              </StudioRepeaterItem>

              <v-btn variant="tonal" color="primary" prepend-icon="mdi-plus" class="mt-1" @click="addEvent">
                添加一项
              </v-btn>

              <StudioGroupHead title="合作方向" icon="mdi-handshake-outline" :count="draft.academic.collab.length" unit="项" />

              <AdminLinesField
                v-model="draft.academic.collab"
                label="合作方向"
                :rows="4"
                hint="一行一项，空行会被忽略。"
              />
            </StudioSectionCard>

            <!-- ======================= 投资者关系 ======================= -->
            <StudioSectionCard
              v-show="active === 'investor'"
              id="investor"
              title="投资者关系"
              en="Investors"
              icon="mdi-chart-line"
              note="公告按列表顺序展示；类型提供 临时公告 / 定期报告 / 投资者关系活动，也可自定义。"
              :count="draft.pages.investor.items.length"
              unit="条"
            >
              <StudioGroupHead title="页面信息" icon="mdi-page-layout-header" />

              <v-row density="compact">
                <v-col cols="12" md="6">
                  <v-text-field v-model="draft.pages.investor.title" label="页面标题" hide-details="auto" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="draft.pages.investor.subtitle" label="副标题" hide-details="auto" />
                </v-col>
                <v-col cols="12">
                  <AdminLinesField
                    v-model="draft.pages.investor.intro"
                    label="引言"
                    :rows="3"
                    hint="一行一段，显示在页面头部。"
                  />
                </v-col>
              </v-row>

              <StudioGroupHead
                title="公告与信息披露"
                icon="mdi-file-document-multiple-outline"
                :count="draft.pages.investor.items.length"
                unit="条"
              />

              <v-alert v-if="!draft.pages.investor.items.length" type="info" variant="tonal" density="comfortable" class="mb-4">
                还没有公告，点击下方「添加一项」开始。
              </v-alert>

              <StudioRepeaterItem
                v-for="(item, index) in draft.pages.investor.items"
                :key="`investor-${index}`"
                :index="index"
                :title="item.title || '未命名公告'"
                :subtitle="[item.date, item.type].filter(Boolean).join(' · ')"
                :can-move-up="index > 0"
                :can-move-down="index < draft.pages.investor.items.length - 1"
                @up="moveItem(draft.pages.investor.items, index, -1)"
                @down="moveItem(draft.pages.investor.items, index, 1)"
                @remove="removeItem(draft.pages.investor.items, index)"
              >
                <v-row density="compact">
                  <v-col cols="12" md="6">
                    <v-text-field v-model="item.date" label="日期" placeholder="2026-10-18" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-combobox
                      v-model="item.type"
                      :items="investorTypeOptions"
                      label="类型"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      color="primary"
                      hide-details="auto"
                      hint="可选择预设类型，也可输入自定义类型。"
                      persistent-hint
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="item.title" label="标题" hide-details="auto" />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="item.url"
                      label="原文链接（可选）"
                      placeholder="https://..."
                      hint="填写后详情弹窗显示「查看原文」。"
                      persistent-hint
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="item.summary" label="摘要" :rows="3" hide-details="auto" />
                  </v-col>
                  <v-col cols="12">
                    <AdminLinesField
                      :model-value="item.body ?? []"
                      label="正文"
                      :rows="4"
                      hint="一行一段，显示在公告详情弹窗。"
                      @update:model-value="item.body = $event"
                    />
                  </v-col>
                </v-row>
              </StudioRepeaterItem>

              <v-btn variant="tonal" color="primary" prepend-icon="mdi-plus" class="mt-1" @click="addInvestorItem">
                添加一项
              </v-btn>
            </StudioSectionCard>

            <!-- ======================= 加入我们 ======================= -->
            <StudioSectionCard
              v-show="active === 'jobs'"
              id="jobs"
              title="加入我们"
              en="Careers"
              icon="mdi-account-tie-outline"
              note="在招岗位按列表顺序展示；类型建议用 社会招聘 / 校园招聘。"
              :count="draft.pages.jobs.items.length"
              unit="个"
            >
              <StudioGroupHead title="页面信息" icon="mdi-page-layout-header" />

              <v-row density="compact">
                <v-col cols="12" md="6">
                  <v-text-field v-model="draft.pages.jobs.title" label="页面标题" hide-details="auto" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="draft.pages.jobs.subtitle" label="副标题" hide-details="auto" />
                </v-col>
                <v-col cols="12">
                  <AdminLinesField
                    v-model="draft.pages.jobs.intro"
                    label="引言"
                    :rows="3"
                    hint="一行一段，显示在页面头部。"
                  />
                </v-col>
              </v-row>

              <StudioGroupHead
                title="在招岗位"
                icon="mdi-badge-account-outline"
                :count="draft.pages.jobs.items.length"
                unit="个"
              />

              <v-alert v-if="!draft.pages.jobs.items.length" type="info" variant="tonal" density="comfortable" class="mb-4">
                还没有岗位，点击下方「添加一项」开始。
              </v-alert>

              <StudioRepeaterItem
                v-for="(job, index) in draft.pages.jobs.items"
                :key="`job-${index}`"
                :index="index"
                :title="job.title || '未命名岗位'"
                :subtitle="[job.type, job.department, job.location].filter(Boolean).join(' · ')"
                :can-move-up="index > 0"
                :can-move-down="index < draft.pages.jobs.items.length - 1"
                @up="moveItem(draft.pages.jobs.items, index, -1)"
                @down="moveItem(draft.pages.jobs.items, index, 1)"
                @remove="removeItem(draft.pages.jobs.items, index)"
              >
                <v-row density="compact">
                  <v-col cols="12" md="6">
                    <v-select v-model="job.type" :items="jobTypeOptions" label="招聘类型" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="job.title" label="岗位名称" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="job.department" label="所属部门" placeholder="研发中心 · 制剂部" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="job.location" label="工作地点" placeholder="上海" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="job.headcount" label="招聘人数" placeholder="3 人" hide-details="auto" />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="job.description" label="岗位职责" :rows="3" hide-details="auto" />
                  </v-col>
                  <v-col cols="12">
                    <AdminLinesField
                      v-model="job.requirements"
                      label="任职要求"
                      :rows="4"
                      hint="一行一条，空行会被忽略。"
                    />
                  </v-col>
                </v-row>
              </StudioRepeaterItem>

              <v-btn variant="tonal" color="primary" prepend-icon="mdi-plus" class="mt-1" @click="addJob">
                添加一项
              </v-btn>
            </StudioSectionCard>

            <!-- ======================= 首页文案 ======================= -->
            <StudioSectionCard
              v-show="active === 'copy'"
              id="copy"
              title="首页文案"
              en="Copy"
              icon="mdi-text-box-outline"
              note="首屏标题、品牌寄语与数据条；多行文本框均为「一行一条」。"
              :count="draft.company.length + draft.stats.length"
              unit="条"
            >
              <StudioGroupHead title="首屏" icon="mdi-monitor-dashboard" />

              <v-row density="compact">
                <v-col cols="12">
                  <AdminLinesField
                    v-model="draft.hero.heading"
                    label="大标题"
                    :rows="3"
                    hint="一行一句，按顺序换行展示。"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="draft.hero.script" label="手写体短句" placeholder="Hello, Science!" hide-details="auto" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-textarea v-model="draft.hero.side" label="副文案" :rows="3" hide-details="auto" />
                </v-col>
              </v-row>

              <StudioGroupHead title="品牌寄语" icon="mdi-format-quote-close" />

              <v-row density="compact">
                <v-col cols="12">
                  <AdminLinesField v-model="draft.message.title" label="标题" :rows="2" hint="一行一句。" />
                </v-col>
                <v-col cols="12">
                  <AdminLinesField v-model="draft.message.paragraphs" label="段落" :rows="8" hint="一行一段。" />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="draft.message.link" label="链接文字" placeholder="合作从这里开始" hide-details="auto" />
                </v-col>
              </v-row>

              <StudioGroupHead title="公司信息" icon="mdi-office-building-outline" :count="draft.company.length" unit="条" />

              <v-alert v-if="!draft.company.length" type="info" variant="tonal" density="comfortable" class="mb-4">
                还没有公司信息条目。
              </v-alert>

              <StudioRepeaterItem
                v-for="(entry, index) in draft.company"
                :key="`company-${index}`"
                :index="index"
                :title="entry.label || '未命名条目'"
                :subtitle="entry.value"
                :can-move-up="index > 0"
                :can-move-down="index < draft.company.length - 1"
                @up="moveItem(draft.company, index, -1)"
                @down="moveItem(draft.company, index, 1)"
                @remove="removeItem(draft.company, index)"
              >
                <v-row density="compact">
                  <v-col cols="12" md="6">
                    <v-text-field v-model="entry.label" label="标签" placeholder="成立时间" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="entry.value" label="内容" placeholder="2016" hide-details="auto" />
                  </v-col>
                </v-row>
              </StudioRepeaterItem>

              <v-btn variant="tonal" color="primary" prepend-icon="mdi-plus" class="mt-1" @click="addCompany">
                添加一项
              </v-btn>

              <StudioGroupHead title="数据指标" icon="mdi-chart-bar" :count="draft.stats.length" unit="条" />

              <v-alert v-if="!draft.stats.length" type="info" variant="tonal" density="comfortable" class="mb-4">
                还没有数据条目。
              </v-alert>

              <StudioRepeaterItem
                v-for="(stat, index) in draft.stats"
                :key="`stat-${index}`"
                :index="index"
                :title="stat.label || '未命名数据'"
                :subtitle="[stat.value, stat.labelEn].filter(Boolean).join(' · ')"
                :can-move-up="index > 0"
                :can-move-down="index < draft.stats.length - 1"
                @up="moveItem(draft.stats, index, -1)"
                @down="moveItem(draft.stats, index, 1)"
                @remove="removeItem(draft.stats, index)"
              >
                <v-row density="compact">
                  <v-col cols="12" md="6">
                    <v-text-field v-model="stat.value" label="数值" placeholder="18+" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="stat.label" label="中文说明" placeholder="项自主专利" hide-details="auto" />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="stat.labelEn" label="英文说明" placeholder="Patents Granted" hide-details="auto" />
                  </v-col>
                </v-row>
              </StudioRepeaterItem>

              <v-btn variant="tonal" color="primary" prepend-icon="mdi-plus" class="mt-1" @click="addStat">
                添加一项
              </v-btn>
            </StudioSectionCard>

            <!-- ======================= 联系我们 / 药物警戒 ======================= -->
            <StudioSectionCard
              v-for="formPage in formPages"
              :key="formPage.id"
              v-show="active === formPage.id"
              :id="formPage.id"
              :title="formPage.label"
              :en="formPage.en"
              :icon="formPage.icon"
              :note="formPage.note"
              :count="formPage.page.fields.length"
              unit="项"
            >
              <StudioGroupHead title="页面信息" icon="mdi-page-layout-header" />

              <v-row density="compact">
                <v-col cols="12" md="6">
                  <v-text-field v-model="formPage.page.title" label="页面标题" hide-details="auto" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="formPage.page.subtitle" label="副标题" hide-details="auto" />
                </v-col>
                <v-col cols="12">
                  <AdminLinesField
                    v-model="formPage.page.intro"
                    label="引言"
                    :rows="3"
                    hint="一行一段，显示在页面头部。"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="formPage.page.note" label="页面备注" :rows="2" hide-details="auto" />
                </v-col>
              </v-row>

              <StudioGroupHead
                title="表单字段"
                icon="mdi-form-textbox"
                :count="formPage.page.fields.length"
                unit="项"
              />

              <v-alert v-if="!formPage.page.fields.length" type="info" variant="tonal" density="comfortable" class="mb-4">
                还没有表单字段，点击下方「添加字段」开始。
              </v-alert>

              <StudioRepeaterItem
                v-for="(field, index) in formPage.page.fields"
                :key="`${formPage.id}-field-${index}`"
                :index="index"
                :title="field.label || '未命名字段'"
                :subtitle="[field.name, field.type, field.required ? '必填' : ''].filter(Boolean).join(' · ')"
                :can-move-up="index > 0"
                :can-move-down="index < formPage.page.fields.length - 1"
                @up="moveItem(formPage.page.fields, index, -1)"
                @down="moveItem(formPage.page.fields, index, 1)"
                @remove="removeItem(formPage.page.fields, index)"
              >
                <v-row density="compact">
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="field.name"
                      label="字段标识"
                      placeholder="name"
                      hint="提交到后端的字段名，建议用英文小驼峰。"
                      persistent-hint
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="field.label" label="显示名称" placeholder="姓名" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      :model-value="field.type"
                      :items="formFieldTypeOptions"
                      label="字段类型"
                      hide-details="auto"
                      @update:model-value="changeFieldType(field, $event)"
                    />
                  </v-col>
                  <v-col cols="12" md="6" class="d-flex align-center">
                    <v-switch
                      v-model="field.required"
                      label="必填"
                      color="primary"
                      density="compact"
                      hide-details
                      inset
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="field.placeholder" label="占位提示" hide-details="auto" />
                  </v-col>
                  <v-col v-if="field.type === 'select'" cols="12">
                    <AdminLinesField
                      v-if="field.options"
                      v-model="field.options"
                      label="下拉选项"
                      :rows="3"
                      hint="一行一个选项，空行会被忽略。"
                    />
                  </v-col>
                </v-row>
              </StudioRepeaterItem>

              <v-btn
                variant="tonal"
                color="primary"
                prepend-icon="mdi-plus"
                class="mt-1"
                @click="addFormField(formPage.page)"
              >
                添加字段
              </v-btn>
            </StudioSectionCard>

            <!-- ======================= 站点信息 ======================= -->
            <StudioSectionCard
              v-show="active === 'site'"
              id="site"
              title="站点信息"
              en="Site"
              icon="mdi-cog-outline"
              note="页脚、顶部工具链接与备案信息，修改后全站同步生效。"
              :count="draft.site.utilityLinks.length + draft.site.footerLinks.length"
              unit="条"
            >
              <StudioGroupHead title="基础信息" icon="mdi-phone-outline" />

              <v-row density="compact">
                <v-col cols="12" md="6">
                  <v-text-field v-model="draft.site.phone" label="站点电话" placeholder="400-820-2026" hide-details="auto" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="draft.site.icp" label="ICP 备案号" hide-details="auto" />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="draft.site.license" label="互联网药品信息服务资格证书" hide-details="auto" />
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="draft.site.disclaimer" label="页脚免责声明" :rows="3" hide-details="auto" />
                </v-col>
              </v-row>

              <StudioGroupHead
                title="顶部工具链接"
                icon="mdi-link-variant"
                :count="draft.site.utilityLinks.length"
                unit="条"
              />

              <v-alert v-if="!draft.site.utilityLinks.length" type="info" variant="tonal" density="comfortable" class="mb-4">
                还没有顶部工具链接。
              </v-alert>

              <StudioRepeaterItem
                v-for="(link, index) in draft.site.utilityLinks"
                :key="`utility-link-${index}`"
                :index="index"
                :title="link.label || '未命名链接'"
                :subtitle="link.to"
                :can-move-up="index > 0"
                :can-move-down="index < draft.site.utilityLinks.length - 1"
                @up="moveItem(draft.site.utilityLinks, index, -1)"
                @down="moveItem(draft.site.utilityLinks, index, 1)"
                @remove="removeItem(draft.site.utilityLinks, index)"
              >
                <v-row density="compact">
                  <v-col cols="12" md="6">
                    <v-text-field v-model="link.label" label="链接文字" placeholder="药物警戒" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="link.to" label="站内路径" placeholder="/pharmacovigilance" hide-details="auto" />
                  </v-col>
                </v-row>
              </StudioRepeaterItem>

              <v-btn variant="tonal" color="primary" prepend-icon="mdi-plus" class="mt-1" @click="addUtilityLink">
                添加链接
              </v-btn>

              <StudioGroupHead
                title="页脚链接"
                icon="mdi-link-box-variant-outline"
                :count="draft.site.footerLinks.length"
                unit="条"
              />

              <v-alert v-if="!draft.site.footerLinks.length" type="info" variant="tonal" density="comfortable" class="mb-4">
                还没有页脚链接。
              </v-alert>

              <StudioRepeaterItem
                v-for="(link, index) in draft.site.footerLinks"
                :key="`footer-link-${index}`"
                :index="index"
                :title="link.label || '未命名链接'"
                :subtitle="link.url"
                :can-move-up="index > 0"
                :can-move-down="index < draft.site.footerLinks.length - 1"
                @up="moveItem(draft.site.footerLinks, index, -1)"
                @down="moveItem(draft.site.footerLinks, index, 1)"
                @remove="removeItem(draft.site.footerLinks, index)"
              >
                <v-row density="compact">
                  <v-col cols="12" md="6">
                    <v-text-field v-model="link.label" label="链接文字" placeholder="国家药品监督管理局" hide-details="auto" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="link.url" label="外部链接" placeholder="https://www.nmpa.gov.cn" hide-details="auto" />
                  </v-col>
                </v-row>
              </StudioRepeaterItem>

              <v-btn variant="tonal" color="primary" prepend-icon="mdi-plus" class="mt-1" @click="addFooterLink">
                添加链接
              </v-btn>
            </StudioSectionCard>

            <!-- ======================= 原始 JSON ======================= -->
            <StudioSectionCard
              v-show="active === 'json'"
              id="json"
              title="原始 JSON"
              en="Raw"
              icon="mdi-code-json"
              note="这里覆盖站点文档的全部字段，包括上方表单没有单独列出的 nav、social、aboutStory、capabilities、pillars、pipeline、greeting、facility、partners 等。修改后先「校验并应用」，再点顶部「保存」。"
            >
              <v-textarea
                v-model="rawText"
                class="json-area"
                :rows="20"
                spellcheck="false"
                hide-details
                aria-label="站点内容 JSON"
              />

              <v-alert v-if="rawError" type="error" variant="tonal" density="comfortable" class="mt-3" role="alert">
                {{ rawError }}
              </v-alert>

              <div class="d-flex flex-wrap align-center ga-3 mt-4">
                <v-btn color="primary" prepend-icon="mdi-check-decagram" @click="applyRaw">校验并应用</v-btn>
                <v-btn variant="outlined" prepend-icon="mdi-refresh" @click="syncRaw">重新读取草稿</v-btn>
                <span class="text-caption text-medium-emphasis">
                  已保存版本 {{ savedSize }} 字符 · 当前草稿 {{ draftSize }} 字符
                </span>
              </div>
            </StudioSectionCard>
        </div>
      </v-main>

      <!-- 版本恢复确认 -->
      <v-dialog v-model="restoreDialog" max-width="440" persistent>
        <v-card elevation="8">
          <v-card-item>
            <template #prepend>
              <v-avatar color="warning" variant="tonal" rounded="lg" size="44">
                <v-icon icon="mdi-history" size="22" />
              </v-avatar>
            </template>
            <v-card-title class="text-subtitle-1 font-weight-medium">恢复历史版本</v-card-title>
            <v-card-subtitle class="text-caption">用该版本覆盖当前内容，并生成一条新的历史记录。</v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <v-alert type="warning" variant="tonal" density="comfortable" class="mb-0">
              确认恢复到版本 <strong>#{{ pendingRestore?.id }}</strong>（{{ timeText(pendingRestore?.created_at) }}）？
              当前未保存的修改将丢失。
            </v-alert>
          </v-card-text>

          <v-card-actions class="px-4 pb-4">
            <v-spacer />
            <v-btn variant="text" :disabled="restoringId !== null" @click="cancelRestore">取消</v-btn>
            <v-btn color="primary" :loading="restoringId !== null" @click="confirmRestore">确认恢复</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 操作提示 -->
      <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3400" location="bottom right" rounded="lg">
        <div class="d-flex align-center ga-2">
          <v-icon
            :icon="
              snackbarColor === 'success'
                ? 'mdi-check-circle-outline'
                : snackbarColor === 'error'
                  ? 'mdi-alert-circle-outline'
                  : 'mdi-information-outline'
            "
            size="18"
          />
          <span>{{ snackbarText }}</span>
        </div>

        <template #actions>
          <v-btn variant="text" size="small" @click="snackbar = false">关闭</v-btn>
        </template>
      </v-snackbar>
    </template>

    <!-- ============================ 载入中 ============================ -->
    <div v-else class="login-shell">
      <div class="d-flex flex-column align-center ga-3">
        <v-progress-circular indeterminate color="primary" size="40" width="3" />
        <p class="text-body-2 text-medium-emphasis mb-0">正在载入内容…</p>
      </div>
    </div>
  </v-app>
</template>

<style scoped>
.studio-app {
  font-family: var(--font-base);
  background: rgb(var(--v-theme-background));
}

/* ============================ 登录 ============================ */

.login-shell {
  display: grid;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 40px 20px 56px;
  place-items: center;
  background:
    radial-gradient(1100px 620px at 8% -12%, rgba(var(--v-theme-primary), 0.16), transparent 60%),
    radial-gradient(900px 520px at 102% 104%, rgba(var(--v-theme-accent), 0.14), transparent 60%),
    linear-gradient(165deg, rgb(var(--v-theme-surface)) 0%, rgb(var(--v-theme-surface-variant)) 100%);
}

.login-card {
  width: 100%;
  max-width: 420px;
}

/* ============================ 抽屉 ============================ */

.lux-drawer {
  border-right: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.lux-brand {
  display: flex;
  padding: 18px 18px 14px;
  align-items: center;
  gap: 10px;
}

.lux-brand-title {
  color: rgb(var(--v-theme-on-surface));
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.2;
}

.lux-brand-sub {
  margin-top: 2px;
  color: rgba(var(--v-theme-on-surface), 0.5);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.lux-nav {
  padding: 0 10px;
}

.lux-nav-group {
  margin-top: 10px;
  color: rgba(var(--v-theme-on-surface), 0.45);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.lux-nav-item {
  color: rgba(var(--v-theme-on-surface), 0.74);
  font-weight: 500;
}

.lux-nav-item:hover {
  background: rgba(var(--v-theme-on-surface), 0.05);
  color: rgb(var(--v-theme-on-surface));
}

.lux-nav-item.v-list-item--active {
  background: rgba(var(--v-theme-primary), 0.12);
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}

.lux-promo {
  padding: 16px;
  border-radius: 16px;
  background: linear-gradient(160deg, #1b2a46 0%, #22334f 55%, #2b3f5e 100%);
}

.lux-promo-sub {
  color: rgba(255, 255, 255, 0.68);
  font-size: 11.5px;
}

/* ============================ 顶栏 ============================ */

.lux-appbar {
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  box-shadow: none !important;
}

.lux-search {
  max-width: 320px;
  margin-left: 4px;
}

.lux-search :deep(.v-field) {
  border-radius: 12px;
  box-shadow: none;
}

.lux-search :deep(.v-field__input) {
  min-height: 40px;
  padding-top: 0;
  padding-bottom: 0;
  font-size: 13px;
}

/* ============================ 外观设置 ============================ */

.theme-menu {
  background: rgb(var(--v-theme-surface));
}

.theme-swatch {
  display: grid;
  width: 26px;
  height: 26px;
  padding: 0;
  place-items: center;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.theme-swatch:hover {
  transform: scale(1.08);
}

.theme-swatch--active {
  box-shadow: 0 0 0 2px rgb(var(--v-theme-surface)), 0 0 0 4px rgba(var(--v-theme-on-surface), 0.3);
}

/* ============================ 内容区 ============================ */

.lux-main {
  background: rgb(var(--v-theme-background));
}

.lux-content {
  max-width: none;
}

.lux-content :deep(.v-card:not(.dash-hero)) {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.lux-content :deep(.v-card-title) {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

/* ============================ 概览 ============================ */

.dash-hero {
  position: relative;
  padding: 26px 28px 0;
  overflow: hidden;
  background: linear-gradient(158deg, #16263f 0%, #1d3050 48%, #274060 100%);
  color: #fff;
}

.dash-hero-label {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.dash-hero-sub {
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 12px;
}

.dash-hero-chip {
  background: rgba(255, 255, 255, 0.12) !important;
  color: rgba(255, 255, 255, 0.9);
  font-size: 11.5px;
}

.dash-hero-number {
  margin-top: 22px;
  font-size: 40px;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1;
}

.dash-hero-caption {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
}

.dash-hero-links {
  margin-top: 14px;
}

.dash-hero-link {
  border-color: rgba(255, 255, 255, 0.32) !important;
  color: rgba(255, 255, 255, 0.86) !important;
}

.dash-hero-wave {
  display: block;
  width: calc(100% + 56px);
  height: 74px;
  margin: 16px -28px 0;
}

.dash-stat {
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-content: flex-start;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.dash-stat:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.dash-stat-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dash-stat-arrow {
  color: rgba(var(--v-theme-on-surface), 0.35);
}

.dash-stat-value {
  margin-top: 12px;
  color: rgb(var(--v-theme-on-surface));
  font-size: 26px;
  font-weight: 600;
  line-height: 1.1;
}

.dash-stat-unit {
  margin-left: 3px;
  color: rgba(var(--v-theme-on-surface), 0.5);
  font-size: 12px;
  font-weight: 500;
}

.dash-stat-label {
  margin-top: 4px;
  color: rgba(var(--v-theme-on-surface), 0.62);
  font-size: 12.5px;
}

.dash-table :deep(th),
.dash-table :deep(td) {
  border: 0;
  font-size: 12.5px;
}

.dash-table :deep(tbody tr + tr td) {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

/* ============================ 原始 JSON ============================ */

.json-area :deep(textarea) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
  font-size: 12.5px;
  line-height: 1.65;
  letter-spacing: 0;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: auto;
}
</style>
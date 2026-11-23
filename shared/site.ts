export interface SiteBrand {
  name: string
  shortName: string
  nameEn: string
  logo: string
  tagline: string
  taglineEn: string
  description: string
  email: string
  phone: string
  address: string
  wechat: string
  founded: string
}

export interface SiteNavItem {
  label: string
  labelEn: string
  to: string
  children?: Array<{ label: string; to: string }>
}

export interface SiteFormField {
  name: string
  label: string
  type: 'text' | 'tel' | 'email' | 'textarea' | 'select'
  required?: boolean
  placeholder?: string
  options?: string[]
}

export interface SiteJobItem {
  id: string
  type: string
  title: string
  department: string
  location: string
  headcount: string
  description: string
  requirements: string[]
}

export interface SiteInvestorItem {
  date: string
  type: string
  title: string
  url: string
  summary?: string
  body?: string[]
}

export interface SiteMilestone {
  period: string
  title: string
  text: string
}

export interface SitePageMeta {
  title: string
  subtitle: string
  intro: string[]
}

export interface SiteFormsPage extends SitePageMeta {
  fields: SiteFormField[]
  note: string
}

export type ArtVariant =
  | 'lab'
  | 'cell'
  | 'helix'
  | 'portrait'
  | 'facility'
  | 'molecule'
  | 'plate'
  | 'team'

export interface SiteConfig {
  brand: SiteBrand
  hero: {
    heading: string[]
    script: string
    side: string
  }
  banners: Array<{ src: string; alt: string; position?: string }>
  products: Array<{
    code: string
    name: string
    category: string
    tag: string
    description: string
    image: string
    group?: string
    form?: string
    spec?: string
    indication?: string
    holder?: string
    detail?: string
  }>
  academic: {
    intro: string
    papers: Array<{ year: string; title: string; journal: string; tags: string[] }>
    events: Array<{ date: string; name: string; place: string; role: string }>
    collab: string[]
  }
  nav: SiteNavItem[]
  social: {
    wechat: string
    linkedin: string
    email: string
  }
  stats: Array<{
    value: string
    label: string
    labelEn: string
  }>
  message: {
    title: string[]
    paragraphs: string[]
    link: string
  }
  aboutStory: Array<{
    no: string
    title: string[]
    text: string
    art: ArtVariant
  }>
  capabilities: Array<{
    index: string
    icon: string
    title: string
    titleEn: string
    description: string
  }>
  pillars: Array<{
    index: string
    title: string
    titleEn: string
    description: string
    image: ArtVariant
  }>
  pipeline: Array<{
    code: string
    name: string
    category: string
    phase: string
    progress: number
    indication: string
    art: ArtVariant
  }>
  news: Array<{
    id?: string
    date: string
    category: string
    title: string
    excerpt: string
    body: string[]
    cover?: string
    sourceUrl?: string
  }>

  /** 站点级信息：顶部条、页脚、备案等 */
  site: {
    phone: string
    utilityLinks: Array<{ label: string; to: string }>
    footerLinks: Array<{ label: string; url: string }>
    icp: string
    license: string
    disclaimer: string
  }

  /** 各栏目的列表页元信息与内容 */
  pages: {
    about: SitePageMeta & { sections: Array<{ title: string; paragraphs: string[] }>; milestones: SiteMilestone[] }
    news: SitePageMeta & { categories: string[] }
    products: SitePageMeta & { groups: string[]; categories: string[] }
    investor: SitePageMeta & { items: SiteInvestorItem[] }
    jobs: SitePageMeta & { items: SiteJobItem[] }
    contact: SiteFormsPage
    pharmacovigilance: SiteFormsPage
  }
  greeting: {
    title: string
    name: string
    nameEn: string
    role: string
    message: string[]
    career: string[]
    art: ArtVariant
  }
  facility: Array<{
    no: string
    label: string
    text: string
    art: ArtVariant
  }>
  company: Array<{
    label: string
    value: string
  }>
  partners: string[]
}

export const defaultContent: SiteConfig = {
  brand: {
    name: '舒美奇',
    shortName: '舒美奇',
    nameEn: 'SUMAZ',
    logo: '/images/brand/logo.png',
    tagline: '药品研发与上市许可持有人专业企业',
    taglineEn: 'MAH · R&D · Quality',
    description:
      '舒美奇成都生物科技有限公司成立于 2016 年，坐落于四川省成都市高新区天府生命科技园，主要从事化学药制剂和中药新药的研发，为药品上市许可持有人，履行药品上市放行责任，对其取得药品注册证书的药品质量负责。',
    email: '',
    phone: '',
    address: '四川省成都市高新区天府生命科技园（注册地址：成都高新区科园南路 88 号 12 栋 9 层 902、903、904 号）',
    wechat: '',
    founded: '2016',
  },

  hero: {
    heading: ['舒美奇', '成都生物科技有限公司'],
    script: 'SUMAZ · SINCE 2016',
    side: '舒美奇成都生物科技有限公司成立于 2016 年，位于成都高新区天府生命科技园，专注化学药制剂与中药新药研发。作为药品上市许可持有人，我们对每一个取得注册证书的品种履行上市放行与质量责任。',
  },

  banners: [
    { src: '/images/banners/sumaz-park.jpg', alt: '舒美奇位于天府生命科技园的办公与研发场所', position: '50% 45%' },
    { src: '/images/banners/sumaz-team.jpg', alt: '舒美奇团队工作与会议现场', position: '50% 50%' },
    { src: '/images/banners/sumaz-products.jpg', alt: '舒美奇已上市品种', position: '50% 50%' },
    { src: '/images/banners/sumaz-office.jpg', alt: '舒美奇办公与培训现场', position: '50% 50%' },
  ],

  nav: [
    { label: '首页', labelEn: 'Home', to: '/' },
    { label: '关于我们', labelEn: 'About', to: '/about' },
    {
      label: '产品中心',
      labelEn: 'Products',
      to: '/products',
      children: [
        { label: '已上市品种', to: '/products?category=已上市' },
        { label: '在研与申报', to: '/products?category=在研与申报' },
      ],
    },
    { label: '质量管理', labelEn: 'Quality', to: '/quality' },
    {
      label: '新闻动态',
      labelEn: 'News',
      to: '/news',
      children: [
        { label: '企业动态', to: '/news?category=企业动态' },
        { label: '政策法规', to: '/news?category=政策法规' },
      ],
    },
    { label: '加入我们', labelEn: 'Careers', to: '/jobs' },
    { label: '联系我们', labelEn: 'Contact', to: '/contact' },
    { label: '药物警戒', labelEn: 'Pharmacovigilance', to: '/pharmacovigilance' },
  ],

  products: [
    {
      code: 'SMQ-01',
      name: '注射用阿奇霉素',
      category: '已上市',
      group: '抗感染',
      tag: '全国集采中标 · 第一顺位',
      form: '注射剂（冻干粉针）',
      spec: '0.5g',
      indication: '用于敏感菌株引起的呼吸道、皮肤软组织等感染，静脉滴注给药。',
      holder: '舒美奇成都生物科技有限公司',
      description: '大环内酯类抗生素，化学药品 4 类，2021 年 6 月取得药品注册证书。',
      detail:
        '本品为化学药品 4 类，属大环内酯类抗生素，冻干粉针剂，规格 0.5g。受托生产企业为成都通德药业、四川宏明博思药业。2021 年 6 月 1 日取得药品注册证书；全国集采中标，第一顺位。',
      image: '/images/products/azithromycin.jpg',
    },
    {
      code: 'SMQ-02',
      name: '盐酸纳洛酮注射液',
      category: '已上市',
      group: '神经系统',
      tag: '已上市',
      form: '注射剂',
      spec: '1ml:0.4mg、1ml:1mg、2ml:2mg、10ml:4mg',
      indication:
        '用于拮抗阿片类药物导致的呼吸抑制（术后、药物过量），解救急性乙醇中毒，也可用于急性阿片类药物过量的诊断。',
      holder: '舒美奇成都生物科技有限公司',
      description: '吗啡拮抗药，化学药品 3 类，2022 年 11 月取得药品注册证书。',
      detail:
        '本品为化学药品 3 类，属吗啡拮抗药。受托生产企业为四川美大康佳乐药业，2022 年 11 月 15 日取得药品注册证书，2023 年 8 月通过上市前 GMP 符合性检查。',
      image: '/images/products/naloxone.jpg',
    },
    {
      code: 'SMQ-03',
      name: '盐酸去氧肾上腺素注射液',
      category: '已上市',
      group: '心血管',
      tag: '全国集采中标',
      form: '注射剂',
      spec: '1ml:10mg、5ml:0.5mg',
      indication:
        '用于防治椎管内阻滞麻醉时发生的急性低血压；也可用于因出血、药物过敏、手术并发症及脑外伤或脑肿瘤合并休克而发生的低血压的辅助性对症治疗；还可用于控制阵发性室上性心动过速。',
      holder: '舒美奇成都生物科技有限公司',
      description: '用于治疗麻醉过程中血管舒张引起的低血压，全国集采中标。',
      detail:
        '本品为化学药品 4 类。规格 1ml:10mg、5ml:0.5mg。受托生产企业为四川美大康佳乐药业。全国集采中标品种。',
      image: '/images/products/phenylephrine.jpg',
    },
    {
      code: 'SMQ-04',
      name: '拉考沙胺注射液',
      category: '已上市',
      group: '神经系统',
      tag: '已上市',
      form: '注射剂',
      spec: '10ml:0.1g、20ml:0.2g',
      indication:
        '1. 部分发作性癫痫发作，用于治疗 4 岁及以上患者的部分发作；2. 原发性全身性强直-阵挛性癫痫发作，用于 4 岁及以上患者原发性全身性强直-阵挛性癫痫发作的辅助治疗。',
      holder: '舒美奇成都生物科技有限公司',
      description: '抗癫痫药物，化学药品 4 类，受托生产于四川美大康佳乐药业。',
      detail:
        '本品为化学药品 4 类。规格 10ml:0.1g、20ml:0.2g。受托生产企业为四川美大康佳乐药业。',
      image: '/images/products/lacosamide.jpg',
    },
    {
      code: 'SMQ-05',
      name: '左卡尼汀口服溶液',
      category: '已上市',
      group: '营养与代谢',
      tag: '接续集采中标',
      form: '口服溶液剂',
      spec: '10ml:1g、10ml:2g',
      indication:
        '1. 用于治疗原发性全身性肉碱缺乏症；2. 用于治疗先天性代谢障碍导致继发性肉碱缺乏症患者的急性和慢性治疗。',
      holder: '舒美奇成都生物科技有限公司',
      description: '化学药品 4 类，接续集采中标品种。',
      detail:
        '本品为化学药品 4 类。规格 10ml:1g、10ml:2g。受托生产企业为亚宝药业四川公司。接续集采中标品种。',
      image: '/images/products/levocarnitine-oral.jpg',
    },
    {
      code: 'SMQ-06',
      name: '左卡尼汀注射液',
      category: '已上市',
      group: '营养与代谢',
      tag: '已上市',
      form: '注射剂',
      spec: '5ml:1g、5ml:2g',
      indication:
        '1. 用于治疗原发性全身性肉碱缺乏症；2. 用于治疗先天性代谢障碍导致继发性肉碱缺乏症患者的急性和慢性治疗。',
      holder: '舒美奇成都生物科技有限公司',
      description: '化学药品 4 类，舒美奇为药品上市许可持有人。',
      detail:
        '本品为化学药品 4 类。本项目由舒美奇担任药品上市许可持有人，受托生产企业为四川美大康佳乐药业。',
      image: '/images/products/levocarnitine-inj.jpg',
    },
    {
      code: 'SMQ-07',
      name: '注射用头孢唑肟钠',
      category: '已上市',
      group: '抗感染',
      tag: '已上市',
      form: '注射剂',
      spec: '按批准规格执行',
      indication:
        '用于敏感菌所致的下呼吸道感染、尿路感染、腹腔感染、盆腔感染、败血症、皮肤软组织感染、骨和关节感染、肺炎链球菌或流感嗜血杆菌所致脑膜炎和单纯性淋病。',
      holder: '舒美奇成都生物科技有限公司',
      description: '第三代头孢菌素类抗生素，化学药品 4 类。',
      detail: '本品为化学药品 4 类。受托生产企业为四川制药。',
      image: '/images/products/ceftizoxime.jpg',
    },
    {
      code: 'SMQ-08',
      name: '注射用盐酸地尔硫䓬',
      category: '已上市',
      group: '心血管',
      tag: '已上市',
      form: '注射剂',
      spec: '10mg',
      indication: '1. 高血压急症；2. 不稳定型心绞痛。',
      holder: '舒美奇成都生物科技有限公司',
      description: '化学药品 4 类，用于高血压急症与不稳定型心绞痛。',
      detail: '本品为化学药品 4 类。规格 10mg。受托生产企业为峨眉山通惠制药。',
      image: '/images/products/diltiazem.jpg',
    },
    {
      code: 'SMQ-09',
      name: '腺苷钴胺胶囊',
      category: '已上市',
      group: '营养与代谢',
      tag: '已上市',
      form: '胶囊剂',
      spec: '0.5mg',
      indication:
        '巨幼红细胞性贫血、营养不良性贫血、妊娠期贫血、多发性神经炎、神经根炎、三叉神经痛、坐骨神经痛、神经麻痹、营养性疾患、放射线/药物致白细胞减少症的辅助治疗。',
      holder: '舒美奇成都生物科技有限公司',
      description: '化学药品 4 类，受托生产于成都通德药业。',
      detail: '本品为化学药品 4 类。规格 0.5mg。受托生产企业为成都通德药业。',
      image: '/images/products/adenosylcobalamin.jpg',
    },
    {
      code: 'SMQ-10',
      name: '米库氯铵注射液',
      category: '已上市',
      group: '麻醉与围术期',
      tag: '已上市',
      form: '注射剂',
      spec: '5ml:10mg',
      indication:
        '米库氯铵是高选择性且唯一一款无需抗胆碱酯酶药拮抗的非去极化神经肌肉阻滞剂，同时也是国内唯一一款短效肌松药，具有起效迅速、作用可靠、恢复迅速、无心血管不良反应、无蓄积等优点。',
      holder: '舒美奇成都生物科技有限公司',
      description: '短效非去极化肌松药，化学药品 4 类，受托生产于成都天台山制药。',
      detail: '本品为化学药品 4 类。规格 5ml:10mg。受托生产企业为成都天台山制药。',
      image: '/images/products/placeholder-mivacurium.jpg',
    },
    {
      code: 'SMQ-11',
      name: '乙酰半胱氨酸口服溶液',
      category: '已上市',
      group: '呼吸系统',
      tag: '全国首家 · 2026 年 11 月获批',
      form: '口服溶液剂',
      spec: '100ml:2g',
      indication: '适用于慢性支气管炎等咳嗽有粘痰而不易咳出的患者。',
      holder: '舒美奇成都生物科技有限公司',
      description: '化学药品 3 类，2026 年 11 月获得生产批件，全国首家。',
      detail:
        '本品为化学药品 3 类。规格 100ml:2g。2026 年 11 月获得生产批件，为全国首家。受托生产企业为成都硕德药业。',
      image: '/images/products/acetylcysteine-oral.jpg',
    },
    {
      code: 'SMQ-12',
      name: '磷苯妥英钠注射用浓溶液',
      category: '已上市',
      group: '神经系统',
      tag: '国谈品种 · 全国独家',
      form: '注射剂（浓溶液）',
      spec: '2ml:100mg、10ml:0.5g',
      indication: '1. 预防颅脑手术癫痫的发生；2. 治疗癫痫。',
      holder: '舒美奇成都生物科技有限公司',
      description: '化学药品 2.2 类，全国独家专利产品，2025 年国谈进入医保。',
      detail:
        '本品为化学药品 2.2 类，独家、专利产品，专利 2036 年到期。国药准字 H20233274、H20233275。规格 2ml:100mg、10ml:0.5g。2025 年底通过国谈进入医保。受托生产企业为成都通德药业；2026 年 12 月起舒美奇为该品种药品上市许可持有人。预计 2027—2029 年销售额分别为 0.6 亿元、1.2 亿元、2.2 亿元，毛利预计为 800 万元、4000 万元、6000 万元。',
      image: '/images/products/fosphenytoin.jpg',
    },
    {
      code: 'SMQ-13',
      name: '盐酸利多卡因凝胶',
      category: '在研与申报',
      group: '泌尿与局部麻醉',
      tag: '预计 2026 年内获批',
      form: '凝胶剂',
      spec: '2%',
      indication:
        '用于经尿道施行检查和治疗时的局部麻醉，如膀胱镜检查、尿道扩张、留置导尿等操作的尿道黏膜表面麻醉。',
      holder: '舒美奇成都生物科技有限公司',
      description: '化学药品 4 类，局部麻醉药，预计 2026 年内获得生产批件。',
      detail: '本品为化学药品 4 类，局麻药，规格 2%。受托生产企业为成都海通药业。预计 2026 年内获得生产批件。',
      image: '/images/products/placeholder-lidocaine.jpg',
    },
    {
      code: 'SMQ-14',
      name: '注射用琥珀酸甲泼尼龙',
      category: '在研与申报',
      group: '激素与急危重症',
      tag: '预计 2026 年内获批',
      form: '注射剂',
      spec: '20mg、40mg',
      indication:
        '用于危重疾病的急救，如严重过敏反应、休克、严重哮喘、神经系统急症、风湿免疫疾病急性发作、严重皮肤疾病、器官移植抗排异等，作为对症短期治疗。',
      holder: '舒美奇成都生物科技有限公司',
      description: '糖皮质激素类药物，化学药品 4 类，预计 2026 年内获得生产批件。',
      detail: '本品为化学药品 4 类，糖皮质激素类药物。规格 20mg、40mg。受托生产企业为成都天台山药业。预计 2026 年内获得生产批件。',
      image: '/images/products/placeholder-methylprednisolone.jpg',
    },
    {
      code: 'SMQ-15',
      name: '乙酰半胱氨酸注射液',
      category: '在研与申报',
      group: '呼吸系统',
      tag: '预计 2026 年内获批',
      form: '注射剂',
      spec: '3ml:0.3g',
      indication: '详见产品说明书。',
      holder: '舒美奇成都生物科技有限公司',
      description: '化学药品 4 类，预计 2026 年内获得生产批件。',
      detail: '本品为化学药品 4 类。规格 3ml:0.3g。受托生产企业为美大康佳乐药业。预计 2026 年内获得生产批件。',
      image: '/images/products/placeholder-acetylcysteine.jpg',
    },
  ],

  academic: {
    intro:
      '公司开发项目主要依托自有技术团队，同时加强与科研院所、研发单位的制剂开发合作，推进复杂制剂与创新药布局。',
    papers: [],
    events: [],
    collab: [
      '北京协和',
      '上海复旦',
      '复杂制剂联合开发（注射乳剂、凝胶剂、眼用制剂）',
      '创新药合作（抗骨质疏松、镇痛方向）',
    ],
  },

  social: {
    wechat: '',
    linkedin: '',
    email: '',
  },

  stats: [
    { value: '12', label: '个已上市品种', labelEn: 'Marketed Products' },
    { value: '8', label: '个申报或在研品种', labelEn: 'In Registration' },
    { value: '3', label: '个在研新药', labelEn: 'New Drugs' },
    { value: '24', label: '家受托生产与供应伙伴', labelEn: 'Partners' },
  ],

  message: {
    title: ['能用众力，则无敌于天下；', '能用众智，则无畏于圣人。'],
    paragraphs: [
      '舒美奇相信，唯有合作，才能创造价值。',
      '在药品持有人委托生产、制剂开发与创新药布局上，我们与合作伙伴共同承担、共同成长。',
      '欢迎药品生产企业、研发机构与供应商与我们联系。',
    ],
    link: '合作从这里开始',
  },

  aboutStory: [
    {
      no: '01',
      title: ['2016 年成立，', '专注化学药制剂', '与中药新药研发'],
      text: '公司坐落于四川省成都市高新区天府生命科技园孵化楼，从成立起即聚焦化学药制剂和中药新药的研发。',
      art: 'lab',
    },
    {
      no: '02',
      title: ['以持有人身份，', '对药品质量', '负全责'],
      text: '舒美奇为药品上市许可持有人，履行药品上市放行责任，对其取得药品注册证书的药品质量负责。',
      art: 'cell',
    },
    {
      no: '03',
      title: ['14 章体系文件，', '覆盖药品', '全生命周期'],
      text: '从药品研制、生产经营到上市后研究与不良反应监测，质量管理体系覆盖产品全生命周期。',
      art: 'molecule',
    },
  ],

  capabilities: [
    {
      index: '01',
      icon: 'mdi-pill',
      title: '制剂研发与剂型专长',
      titleEn: 'Formulation R&D',
      description:
        '依托自有技术团队，专长于注射剂、口服液和口服固体制剂的研究开发，覆盖冻干针剂、粉针剂、水针剂、胶囊剂、口服溶液剂等剂型。',
    },
    {
      index: '02',
      icon: 'mdi-flask-outline',
      title: '复杂制剂平台',
      titleEn: 'Complex Formulations',
      description:
        '加强与有技术实力的研发单位合作，发展复杂制剂，包括注射乳剂、凝胶剂、眼用制剂等，持续拓展公司产品线。',
    },
    {
      index: '03',
      icon: 'mdi-shield-check-outline',
      title: '质量管理与上市放行',
      titleEn: 'Quality & Release',
      description:
        '按 14 个章节建立质量管理体系，受托方质量受权人负责药品出厂放行，我司质量受权人负责上市放行。',
    },
  ],

  pillars: [
    {
      index: '01',
      title: '质量方针',
      titleEn: 'Quality Policy',
      description:
        '我们承诺提供高质量的产品，持续改进质量管理体系的有效性，并遵守所有相关法规要求。持续改进质量是我们的责任。',
      image: 'portrait',
    },
    {
      index: '02',
      title: '机构和人员',
      titleEn: 'Organization & People',
      description:
        '建立员工培训管理规程，开展上岗前培训与继续培训，对员工进行相关法规、岗位职责和技能培训。',
      image: 'helix',
    },
    {
      index: '03',
      title: '全生命周期管理',
      titleEn: 'Lifecycle Management',
      description:
        '体系覆盖药品研制、药品生产经营、上市后研究、不良反应监测及报告等全生命周期环节。',
      image: 'team',
    },
    {
      index: '04',
      title: 'MAH 制度践行者',
      titleEn: 'MAH Practice',
      description:
        '作为药品上市许可持有人，履行药品上市放行责任，对取得药品注册证书的药品质量负责。',
      image: 'facility',
    },
  ],

  pipeline: [
    {
      code: 'SMQ-P01',
      name: '磷苯妥英钠注射液',
      category: '神经系统',
      phase: '申报中',
      progress: 70,
      indication: '抗癫痫治疗',
      art: 'molecule',
    },
    {
      code: 'SMQ-P02',
      name: '维生素 D3 软胶囊',
      category: '营养与代谢',
      phase: '在研',
      progress: 45,
      indication: '维生素 D 缺乏相关疾病',
      art: 'cell',
    },
    {
      code: 'SMQ-P03',
      name: '异甘草酸镁注射液',
      category: '肝病治疗',
      phase: '待申报',
      progress: 35,
      indication: '肝脏疾病辅助治疗',
      art: 'helix',
    },
    {
      code: 'SMQ-P04',
      name: '依达拉奉右莰醇注射液',
      category: '神经系统',
      phase: '待申报',
      progress: 32,
      indication: '缺血性卒中',
      art: 'plate',
    },
    {
      code: 'SMQ-P05',
      name: '注射用头孢罗膦',
      category: '抗感染',
      phase: '在研',
      progress: 28,
      indication: '细菌感染',
      art: 'molecule',
    },
    {
      code: 'QF03',
      name: 'QF03 酶抑制剂',
      category: '新药',
      phase: '临床前',
      progress: 18,
      indication: '酶抑制剂类新药',
      art: 'cell',
    },
    {
      code: 'QF06',
      name: 'QF06 镇痛',
      category: '新药',
      phase: '临床前',
      progress: 16,
      indication: '镇痛方向新药',
      art: 'helix',
    },
    {
      code: 'QF08',
      name: 'QF08 骨质疏松和防脱发',
      category: '新药',
      phase: '临床前',
      progress: 14,
      indication: '抗骨质疏松与防脱发方向新药',
      art: 'plate',
    },
  ],

  news: [],

  site: {
    phone: '',
    utilityLinks: [{ label: '药物警戒', to: '/pharmacovigilance' }],
    footerLinks: [
      { label: '国家药品监督管理局', url: 'https://www.nmpa.gov.cn' },
      { label: '国家医疗保障局', url: 'https://www.nhsa.gov.cn' },
      { label: '四川省药品监督管理局', url: 'https://yjj.sc.gov.cn' },
      { label: '中国医药企业管理协会', url: 'https://www.cpema.org' },
    ],
    icp: '',
    license: '',
    disclaimer:
      '本网站未发布麻醉药品、精神药品、医疗用毒性药品、放射性药品、戒毒药品和医疗机构制剂的产品信息。',
  },

  pages: {
    about: {
      title: '关于我们',
      subtitle: '药品上市许可持有人 · 质量责任主体',
      intro: [
        '舒美奇成都生物科技有限公司（简称“舒美奇”）成立于 2016 年，坐落于四川省成都市高新区天府生命科技园孵化楼，主要从事化学药制剂和中药新药的研发。',
        '公司为药品上市许可持有人，履行药品上市放行责任，对其取得药品注册证书的药品质量负责。',
      ],
      sections: [
        {
          title: '我们是谁',
          paragraphs: [
            '公司为高新技术企业、四川省「专精特新」中小企业（2023 年 11 月—2026 年 10 月）、瞪羚企业、创新型企业、科技型中小企业，以科技研发驱动发展，是 MAH 制度的践行者。现有 12 个已上市品种、8 个申报或在研品种，并布局 3 个在研新药，覆盖抗感染、心血管、神经系统、麻醉与围术期、营养与代谢、呼吸系统等治疗领域。',
            '公司注册地址为成都高新区科园南路 88 号 12 栋 9 层 902、903、904 号，办公与研发场地位于成都高新技术产业开发区天府生命科技园。',
          ],
        },
        {
          title: '研发、质量与发展规划',
          paragraphs: [
            '公司开发项目主要依托自有技术团队，专长于注射剂、口服液和口服固体制剂的研究开发。同时加强与有技术实力的研发单位合作，发展复杂制剂，包括注射乳剂、凝胶剂、眼用制剂等，持续拓展产品线。',
            '公司按 14 个章节建立质量管理体系，涵盖总则、质量管理、机构与人员、设备、物料与产品、确认与验证、文件管理、生产管理、质量控制与质量保证、委托生产与委托检验、产品发运与召回、自检、药物警戒等内容，覆盖药品研制、生产经营、上市后研究、不良反应监测及报告全生命周期。',
            '未来 5—10 年，公司将结合行业与自身发展要求、市场情况，通过资产重组、收购兼并、股权投资、协作经营等多种方式，整合与现有产品结构、企业文化相匹配的医药企业，完善产品结构、扩大市场份额、提高核心竞争力。',
          ],
        },
        {
          title: '委托生产与对外合作',
          paragraphs: [
            '在药品持有人委托生产方面，公司合作的剂型包括冻干针剂、粉针剂、乳剂、水针剂、胶囊剂、散剂、颗粒剂、凝胶剂、口服液等。受托生产企业包括成都通德药业、四川制药、成都天台山制药、峨眉山通惠制药、宏明博思、深圳立健、沈阳双鼎、成都硕德、成都海通药业、美大康佳乐、大连美创、亚宝药业等。',
            '合作的供货商包括浙江国邦药业、石药欧意、山东力诺、沧州四星、山东药玻、湖北华强、湖南尔康、葛店人福、湖南华纳、河北华荣、宁夏金维、苏州盛达等。成品的检验、留样均由受托方完成，受托方质量受权人负责药品出厂放行，我司质量受权人负责上市放行。',
          ],
        },
      ],
      milestones: [
        {
          period: '2016',
          title: '公司成立',
          text: '舒美奇成都生物科技有限公司成立，落户四川省成都市高新区天府生命科技园孵化楼，聚焦化学药制剂与中药新药研发。',
        },
        {
          period: '2021.06',
          title: '首个制剂品种获批',
          text: '注射用阿奇霉素取得药品注册证书，受托生产企业为成都通德药业、四川宏明博思药业；后全国集采中标，第一顺位。',
        },
        {
          period: '2022.11',
          title: '盐酸纳洛酮注射液获批',
          text: '盐酸纳洛酮注射液取得药品注册证书，受托生产企业为四川美大康佳乐药业。',
        },
        {
          period: '2025',
          title: '磷苯妥英钠进入医保',
          text: '全国独家专利产品“磷苯妥英钠注射用浓溶液”通过国谈进入医保，专利 2036 年到期。',
        },
        {
          period: '2026',
          title: '品种与身份双突破',
          text: '乙酰半胱氨酸口服溶液 2026 年 11 月获得生产批件（全国首家）；2026 年 12 月起舒美奇成为磷苯妥英钠注射用浓溶液的药品上市许可持有人。',
        },
      ],
    },

    news: {
      title: '新闻动态',
      subtitle: '最新动态一站知晓',
      intro: ['企业动态与政策法规信息整理中，敬请期待。'],
      categories: ['企业动态', '政策法规'],
    },

    products: {
      title: '产品中心',
      subtitle: '12 个已上市品种 · 8 个申报或在研品种 · 3 个在研新药',
      intro: [
        '公司已上市品种覆盖抗感染、心血管、神经系统、麻醉与围术期、营养与代谢、呼吸系统等治疗领域；另有多个品种处于申报或在研阶段。',
        '点击产品卡片可查看剂型、规格、适应症、持有人与受托生产企业等完整信息。',
      ],
      groups: [
        '抗感染',
        '心血管',
        '神经系统',
        '麻醉与围术期',
        '营养与代谢',
        '呼吸系统',
        '激素与急危重症',
        '泌尿与局部麻醉',
        '在研',
      ],
      categories: ['已上市', '在研与申报'],
    },

    investor: {
      title: '投资者关系',
      subtitle: '公开 · 透明 · 长期主义',
      intro: ['公司公告、定期报告与投资者交流信息整理中，敬请期待。'],
      items: [],
    },

    jobs: {
      title: '加入我们',
      subtitle: '与优秀的人，做有难度的事',
      intro: ['岗位信息整理中，欢迎通过「联系我们」与我们沟通。'],
      items: [],
    },

    contact: {
      title: '联系我们',
      subtitle: '药品上市许可持有人 · 成都高新区',
      intro: [
        '无论是产品合作、委托生产、研发合作，还是供应商合作，都欢迎与我们联系。',
        '电话、邮箱与微信公众号信息整理中，请先通过下方表单留言。',
      ],
      fields: [
        { name: 'name', label: '姓名', type: 'text', required: true, placeholder: '请输入您的姓名' },
        { name: 'phone', label: '联系电话', type: 'tel', required: true, placeholder: '手机号或固定电话' },
        { name: 'company', label: '公司 / 机构', type: 'text', placeholder: '请输入公司或机构名称（选填）' },
        { name: 'email', label: '电子邮箱', type: 'email', required: true, placeholder: 'name@example.com' },
        {
          name: 'topic',
          label: '咨询类型',
          type: 'select',
          placeholder: '请选择咨询类型',
          options: ['产品合作', '委托生产', '研发合作', '供应链合作', '其他'],
        },
        {
          name: 'message',
          label: '留言内容',
          type: 'textarea',
          required: true,
          placeholder: '请简要描述您的需求，我们会在 2 个工作日内回复。',
        },
      ],
      note: '我们承诺仅在回复咨询的必要范围内使用你的信息，不会向第三方披露。',
    },

    pharmacovigilance: {
      title: '药物警戒',
      subtitle: '守护每一次用药安全',
      intro: [
        '如你在使用舒美奇持有品种期间出现任何可疑不良反应，请通过以下表单告诉我们。',
        '你的每一份报告都会进入我们的药物警戒体系，用于持续评估药品的风险与获益。',
      ],
      fields: [
        { name: 'name', label: '报告人姓名', type: 'text', required: true, placeholder: '请输入报告人姓名' },
        { name: 'phone', label: '联系电话', type: 'tel', required: true, placeholder: '便于我们与你核实信息' },
        { name: 'email', label: '电子邮箱', type: 'email', placeholder: 'name@example.com（选填）' },
        {
          name: 'reporter',
          label: '报告人身份',
          type: 'select',
          placeholder: '请选择报告人身份',
          options: ['患者本人', '患者家属', '医务人员', '经销商', '其他'],
        },
        {
          name: 'drugName',
          label: '药品名称',
          type: 'text',
          required: true,
          placeholder: '例如：注射用阿奇霉素',
        },
        {
          name: 'reaction',
          label: '不良反应描述',
          type: 'textarea',
          required: true,
          placeholder: '请描述用药时间、症状、处理经过与转归',
        },
      ],
      note: '如情况紧急，请立即就医。本表单不替代医疗诊断与治疗。',
    },
  },

  greeting: {
    title: '企业寄语',
    name: '舒美奇',
    nameEn: 'SUMAZ',
    role: '药品上市许可持有人',
    message: [
      '舒美奇成立于 2016 年，选择了一条不轻松的路：以药品上市许可持有人的身份，对药品质量负全责。',
      '从第一个品种获批，到 12 个品种上市、8 个品种申报或在研，我们始终把质量放在速度之前。',
      '药品是特殊商品，容不得半点侥幸。我们愿意把每一步都做扎实，也愿意与合作伙伴一起把产品做好。',
    ],
    career: [
      '化学药制剂研发',
      '中药新药研发',
      '药品上市许可持有人管理',
      '受托生产与质量管理',
    ],
    art: 'portrait',
  },

  facility: [
    {
      no: '01',
      label: '研发与办公',
      text: '位于成都高新区天府生命科技园孵化楼，开展化学药制剂与中药新药研发。',
      art: 'lab',
    },
    {
      no: '02',
      label: '剂型专长',
      text: '专长于注射剂、口服液和口服固体制剂的研究开发，合作剂型覆盖冻干针剂、粉针剂、水针剂、胶囊剂、口服溶液剂等。',
      art: 'plate',
    },
    {
      no: '03',
      label: '质量管理体系',
      text: '按 14 个章节建立体系文件，覆盖药品研制、生产经营、上市后研究与不良反应监测。',
      art: 'facility',
    },
    {
      no: '04',
      label: '委托生产网络',
      text: '与成都通德药业、四川制药、成都天台山制药、峨眉山通惠制药等 12 家受托生产企业合作。',
      art: 'team',
    },
  ],

  company: [
    { label: '成立时间', value: '2016 年' },
    { label: '所在地', value: '四川省成都市高新区天府生命科技园' },
    { label: '企业身份', value: '药品上市许可持有人（MAH）' },
    { label: '业务范围', value: '化学药制剂 · 中药新药研发' },
  ],

  partners: [
    '成都通德药业',
    '四川制药',
    '成都天台山制药',
    '峨眉山通惠制药',
    '宏明博思',
    '深圳立健',
    '沈阳双鼎',
    '成都硕德',
    '成都海通药业',
    '美大康佳乐',
    '大连美创',
    '亚宝药业',
    '浙江国邦药业',
    '石药欧意',
    '山东力诺',
    '沧州四星',
    '山东药玻',
    '湖北华强',
  ],
}

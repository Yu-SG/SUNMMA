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
  banners: Array<{ src: string; alt: string }>
  products: Array<{
    code: string
    name: string
    category: string
    tag: string
    description: string
    image: string
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
    date: string
    category: string
    title: string
    excerpt: string
    body: string[]
  }>
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
    name: 'XXX',
    shortName: 'XXX',
    nameEn: 'XXX BioTechnology',
    logo: '',
    tagline: '让科学成为可及的疗法',
    taglineEn: 'Turning science into accessible therapies',
    description:
      'XXX 生物科技致力于以工程化细胞、基因编辑与智能递送技术，连接基础研究与临床应用，为全球患者提供更精准、更可及的创新治疗方案。',
    email: 'partner@xxx.com',
    phone: '+86 400-820-2026',
    address: 'xxx',
    wechat: 'XXX',
    founded: '2016',
  },

  hero: {
    heading: ['让科学，', '成为「可及」', '的疗法。'],
    script: 'Hello, Science!',
    side: '我们是一家专注工程化细胞、基因编辑与智能递送的临床阶段生物科技公司。从实验室到病床，让每一次研究都指向真实的获益。',
  },

  banners: [
    { src: '/images/banner-2.jpg', alt: '彩妆与花朵静物', position: '50% 55%' },
    { src: '/images/banner-4.jpg', alt: '护肤品瓶身与绿植', position: '50% 62%' },
    { src: '/images/banner-3.jpg', alt: '化妆刷与蓝色粉末', position: '50% 55%' },
    { src: '/images/banner-1.jpg', alt: '化妆刷与大理石台面', position: '50% 45%' },
  ],

  nav: [
    { label: '首页', labelEn: 'Home', to: '/' },
    { label: '产品中心', labelEn: 'Products', to: '/products' },
    { label: '新闻中心', labelEn: 'News', to: '/news' },
    { label: '学术交流', labelEn: 'Academic', to: '/academic' },
    { label: '联系我们', labelEn: 'Contact', to: '/contact' },
  ],

  products: [
    {
      code: 'P-01',
      name: '屏障修护系列',
      category: '面部护理',
      tag: '敏感肌适用',
      description: '以神经酰胺与重组胶原为核心，重建角质层结构，缓解泛红与干痒。',
      image: '/images/banner-4.jpg',
    },
    {
      code: 'P-02',
      name: '光感精华系列',
      category: '功效精华',
      tag: '提亮 · 抗氧',
      description: '多重抗氧化复配，从源头抑制暗沉，配合温和促渗体系提升吸收率。',
      image: '/images/banner-2.jpg',
    },
    {
      code: 'P-03',
      name: '柔润身体护理',
      category: '身体护理',
      tag: '全家可用',
      description: '低刺激表活与植物油脂复配，洗后不紧绷，适合每日使用。',
      image: '/images/banner-1.jpg',
    },
    {
      code: 'P-04',
      name: '定制造物礼盒',
      category: '礼盒定制',
      tag: '企业 / 节日',
      description: '可定制配方、香型与包装，支持企业礼赠与节日限定系列。',
      image: '/images/banner-3.jpg',
    },
  ],

  academic: {
    intro:
      '我们与高校、医院及研究机构保持长期合作，把实验室里的发现变成可验证的产品。以下为部分学术成果与交流活动。',
    papers: [
      { year: '2026', title: '皮肤屏障修复中神经酰胺配比的体外评价', journal: '中国化妆品科学', tags: ['屏障修护', '配方研究'] },
      { year: '2025', title: '重组胶原蛋白在敏感肌人群中的耐受性研究', journal: '日用化学工业', tags: ['临床评价', '安全性'] },
      { year: '2025', title: '多组学方法在功效成分筛选中的应用', journal: '生物技术进展', tags: ['组学', '筛选平台'] },
      { year: '2024', title: '温和表活体系对皮肤微生态的影响', journal: '精细化工', tags: ['表活', '微生态'] },
    ],
    events: [
      { date: '2026.11', name: '中国国际化妆品学术研讨会', place: '上海', role: '特邀报告' },
      { date: '2026.06', name: '皮肤科学青年学者论坛', place: '杭州', role: '圆桌嘉宾' },
      { date: '2026.03', name: '功效评价与法规合规工作坊', place: '广州', role: '联合主办' },
    ],
    collab: ['高校联合实验室', '医院临床评价合作', '第三方检测与功效验证', '原料与配方共同开发'],
  },

  social: {
    wechat: 'XXX',
    linkedin: 'xxx-biotechnology',
    email: 'partner@xxx.com',
  },

  stats: [
    { value: '18+', label: '项自主专利', labelEn: 'Patents Granted' },
    { value: '32', label: '个候选药物进入临床前或临床阶段', labelEn: 'Programs in Development' },
    { value: '120+', label: '家全球合作伙伴', labelEn: 'Global Partners' },
    { value: '15', label: '个国家与地区开展业务', labelEn: 'Countries & Regions' },
  ],

  message: {
    title: ['先把问题聊清楚，', '再谈解决方案。'],
    paragraphs: [
      '新的疗法从不是一蹴而就，\n最初的一步，往往也是最难迈出的一步。',
      '所以我们更愿意花时间，\n把科学问题、临床需求与商业化路径一次讲透。',
      '一次坦诚的对话，\n胜过十页漂亮的方案。',
      '希望这里成为你愿意反复回来的地方，\n也愿意把最难的问题交给我们。',
    ],
    link: '合作从这里开始',
  },

  aboutStory: [
    {
      no: '01',
      title: ['十年积累，', '一家临床阶段', '生物科技公司的新起点'],
      text: '从一间基础研究实验室起步，我们把细胞工程、基因编辑与递送技术整合在同一平台，让前沿科学真正走进临床。',
      art: 'lab',
    },
    {
      no: '02',
      title: ['以科学为依据，', '做出可验证的', '判断'],
      text: '严谨的数据、透明的机制与可重复的实验。我们相信，清楚的证据比响亮的口号更值得被信任。',
      art: 'cell',
    },
    {
      no: '03',
      title: ['与伙伴一起，', '把速度带给', '创新'],
      text: '开放平台、共享能力，与药企、医院和学术机构共同推进项目，也共同承担创新的风险与回报。',
      art: 'molecule',
    },
  ],

  capabilities: [
    {
      index: '01',
      icon: 'mdi-dna',
      title: '工程化细胞疗法',
      titleEn: 'Engineered Cell Therapy',
      description:
        '围绕 T 细胞与 NK 细胞的下一代工程化改造，构建兼具精准识别、可控激活与持久杀伤能力的多模态治疗平台。',
    },
    {
      index: '02',
      icon: 'mdi-omega',
      title: '基因编辑与递送',
      titleEn: 'Gene Editing & Delivery',
      description:
        '自主开发 LNP、病毒载体与外泌体递送系统，让基因编辑工具精准抵达目标组织，并建立高效、可扩展的 CMC 工艺。',
    },
    {
      index: '03',
      icon: 'mdi-chart-timeline-variant',
      title: '生物信息与数据平台',
      titleEn: 'Bioinformatics Platform',
      description:
        '构建多组学与 AI 驱动的药物发现平台，从靶点验证、分子设计到临床生物标志物，持续缩短创新周期。',
    },
  ],

  pillars: [
    {
      index: '01',
      title: '以病人为中心',
      titleEn: 'Patient-Centric',
      description: '从真实临床需求出发定义产品，用可量化的指标回答「什么对患者有意义」。',
      image: 'portrait',
    },
    {
      index: '02',
      title: '以科学为依据',
      titleEn: 'Science-First',
      description: '严谨的数据、透明的机制与可重复的实验，让每一个判断都经得起验证。',
      image: 'helix',
    },
    {
      index: '03',
      title: '以协作为加速',
      titleEn: 'Built to Collaborate',
      description: '与药企、学术机构与产业伙伴共享能力，让创新资源更高效地汇聚。',
      image: 'team',
    },
    {
      index: '04',
      title: '以长期主义为尺度',
      titleEn: 'Long-Term Thinking',
      description: '尊重生命科学规律，允许失败，但不允许对严谨和品质的妥协。',
      image: 'facility',
    },
  ],

  pipeline: [
    {
      code: 'XX-101',
      name: 'XXX CAR-T',
      category: '细胞疗法',
      phase: 'Phase II',
      progress: 68,
      indication: '复发难治性多发性骨髓瘤',
      art: 'cell',
    },
    {
      code: 'XX-204',
      name: 'Gene-Edit NK',
      category: '工程化细胞',
      phase: 'Phase I',
      progress: 42,
      indication: '实体瘤',
      art: 'helix',
    },
    {
      code: 'XX-318',
      name: 'LNP-mRNA',
      category: '核酸药物',
      phase: 'IND',
      progress: 26,
      indication: '遗传代谢疾病',
      art: 'molecule',
    },
    {
      code: 'XX-402',
      name: 'AI Bispecific',
      category: '抗体药物',
      phase: 'Preclinical',
      progress: 18,
      indication: '自身免疫疾病',
      art: 'plate',
    },
  ],

  news: [
    {
      date: '2026.10.18',
      category: '公司动态',
      title: 'XXX 生物完成新一轮战略融资，加速下一代细胞疗法产业化',
      excerpt: '本轮资金将主要用于 XXX CAR-T 的临床推进、下一代递送平台建设以及研发中心升级。',
      body: [
        'XXX 生物今日宣布完成新一轮战略融资。本轮融资由多家长期关注生命科学的产业基金共同参与，资金将主要用于核心产品的临床推进与产业化能力建设。',
        '公司同步启动上海研发中心的扩建计划，新增细胞制备、分析检测与临床样品管理空间，进一步缩短从工艺开发到临床供样的周期。',
        '感谢所有合作伙伴的信任。我们会继续把资源投向真正有临床价值的方向，让创新更早抵达患者。',
      ],
    },
    {
      date: '2026.08.06',
      category: '研发进展',
      title: 'XX-101 获准开展关键性临床研究，布局多发性骨髓瘤适应症',
      excerpt: '基于前期临床结果，公司进一步优化了产品设计与生产工艺，为患者提供更稳定、持久的疗效。',
      body: [
        'XX-101 是一款靶向 BCMA 的自体 CAR-T 产品。基于前期研究者发起的临床数据，产品在复发难治性多发性骨髓瘤患者中展现出可管理的安全性与持续的缓解深度。',
        '本次关键性临床研究将在多中心同步开展，主要终点为总体缓解率与缓解持续时间。公司已完成工艺放大与质量体系验证，具备稳定的临床供样能力。',
      ],
    },
    {
      date: '2026.05.22',
      category: '合作交流',
      title: 'XXX 生物与全球头部药企达成联合开发战略合作',
      excerpt: '双方将围绕工程化细胞平台与下一代递送技术开展联合研究，加速候选产品的全球开发。',
      body: [
        '根据协议，双方将围绕工程化细胞平台与下一代递送技术开展联合研究，并在特定适应症上共同推进候选产品的全球开发与商业化。',
        '合作将结合双方在靶点发现、临床开发与全球注册方面的能力，探索更高效的转化路径。',
      ],
    },
  ],

  greeting: {
    title: '创始人寄语',
    name: 'XXX',
    nameEn: 'XXX',
    role: '创始人 · 首席执行官',
    message: [
      '创办 XXX 之前，我在实验室里待了很多年。那时最常被问到的问题是：这项研究，什么时候才能真正帮到人？',
      '这个问题后来成了公司的起点。我们不想只做漂亮的论文，也不满足于把技术停在概念阶段。我们要做的，是让科学一步一步走到床边。',
      '这条路很长，也一定会有失败。但只要方向是对的，慢一点没有关系。',
      '如果你也在为同样的问题寻找答案，欢迎来和我们聊聊。',
    ],
    career: [
      '分子生物学与细胞工程方向博士',
      '十余年细胞治疗与基因编辑研发经验',
      '主导多项候选药物从发现到临床阶段',
      '参与多项国家级科研项目与产业标准制定',
    ],
    art: 'portrait',
  },

  facility: [
    {
      no: '01',
      label: '细胞制备中心',
      text: '符合 GMP 规范的细胞制备空间，支持自体细胞产品的全流程生产。',
      art: 'facility',
    },
    {
      no: '02',
      label: '分析检测实验室',
      text: '流式、分子与微生物检测能力内建，样品周转以小时计。',
      art: 'plate',
    },
    {
      no: '03',
      label: '低温样本库',
      text: '从 -80℃ 到液氮的分级存储，保证每一个样本的可追溯。',
      art: 'lab',
    },
    {
      no: '04',
      label: '开放协作区',
      text: '与合作伙伴共用的讨论空间，让问题被更快地摆到桌面上。',
      art: 'team',
    },
  ],

  company: [
    { label: '成立时间', value: '2016' },
    { label: '研发中心', value: 'xxx' },
    { label: '团队规模', value: '160 人' },
    { label: '业务覆盖', value: '15 个国家与地区' },
  ],

  partners: [
    'KAIFENG PHARMA',
    'NOVA THERAPEUTICS',
    'HELIX GENOMICS',
    'ORIENT BIO',
    'VANTAGE LABS',
    'SINO PHARMA',
  ],
}

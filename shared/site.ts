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
    name: 'XXX',
    shortName: 'XXX',
    nameEn: 'XXX PHARMACEUTICAL',
    logo: '',
    tagline: '让科学成为可及的疗法',
    taglineEn: 'Turning science into accessible therapies',
    description:
      'XXX 是一家以研发为驱动的制药企业，聚焦呼吸、心血管、神经、代谢等治疗领域，构建「制剂 + 原料药 + 技术服务」的一体化能力，为患者提供可及、可负担的优质药品。',
    email: 'partner@xxx.com',
    phone: '400-820-2026',
    address: 'xxx',
    wechat: 'XXX',
    founded: '2000',
  },

  hero: {
    heading: ['让科学，', '成为「可及」', '的疗法。'],
    script: 'Hello, Science!',
    side: '我们是一家以研发为驱动的制药企业，专注呼吸、心血管、神经与代谢等治疗领域。从原料药到制剂，从实验室到临床，让每一次研究都指向真实的获益。',
  },

  banners: [
    { src: '/images/hero-1.svg', alt: 'XXX 研发中心与分子结构', position: '50% 50%' },
    { src: '/images/hero-2.svg', alt: 'XXX 制剂生产线', position: '50% 50%' },
    { src: '/images/hero-3.svg', alt: 'XXX 质量分析与检测', position: '50% 50%' },
    { src: '/images/hero-4.svg', alt: 'XXX 研发团队协作', position: '50% 50%' },
  ],

  nav: [
    { label: '首页', labelEn: 'Home', to: '/' },
    { label: '关于我们', labelEn: 'About', to: '/about' },
    {
      label: '新闻动态',
      labelEn: 'News',
      to: '/news',
      children: [
        { label: '企业动态', to: '/news?category=企业动态' },
        { label: '政策法规', to: '/news?category=政策法规' },
      ],
    },
    {
      label: '产品中心',
      labelEn: 'Products',
      to: '/products',
      children: [
        { label: '制剂产品', to: '/products?category=制剂产品' },
        { label: '原料药', to: '/products?category=原料药' },
      ],
    },
    { label: '投资者关系', labelEn: 'Investors', to: '/investor' },
    {
      label: '加入我们',
      labelEn: 'Careers',
      to: '/jobs',
      children: [
        { label: '社会招聘', to: '/jobs?type=社会招聘' },
        { label: '校园招聘', to: '/jobs?type=校园招聘' },
      ],
    },
    { label: '联系我们', labelEn: 'Contact', to: '/contact' },
    { label: '药物警戒', labelEn: 'Pharmacovigilance', to: '/pharmacovigilance' },
  ],

  products: [
    {
      code: 'XX-101',
      name: '盐酸溴己新注射液',
      category: '制剂产品',
      group: '呼吸系统类',
      tag: '医保乙类',
      form: '注射剂',
      spec: '2ml:4mg',
      indication: '用于慢性支气管炎、支气管扩张等伴有痰液黏稠不易咳出者，帮助痰液排出、改善通气。',
      holder: 'XXX 制药有限公司',
      description: '经典祛痰药物，适用于痰液黏稠、咳痰困难的患者，临床使用广泛。',
      detail:
        '盐酸溴己新可直接作用于支气管腺体，促使黏液分泌细胞的溶酶体释出，使痰中的黏多糖纤维化断裂，从而降低痰液黏度；同时促进呼吸道黏膜纤毛运动，利于痰液排出。本品为无菌注射液，需在医务人员指导下使用。',
      image: '/images/product-1.svg',
    },
    {
      code: 'XX-102',
      name: '甲磺酸酚妥拉明注射液',
      category: '制剂产品',
      group: '心血管系统类',
      tag: '医保甲类',
      form: '注射剂',
      spec: '1ml:10mg',
      indication: '用于血管痉挛性疾病、感染性休克及嗜铬细胞瘤诊断试验等临床场景。',
      holder: 'XXX 制药有限公司',
      description: 'α 受体阻滞剂，起效迅速，是急诊与围术期常用的血管活性药物。',
      detail:
        '甲磺酸酚妥拉明为短效 α 肾上腺素受体阻滞剂，可扩张外周血管、降低外周阻力、改善微循环。临床常用于血管痉挛性疾病、感染性休克辅助治疗及嗜铬细胞瘤的诊治。使用时应监测血压与心率，并由专业医务人员根据病情调整剂量。',
      image: '/images/product-2.svg',
    },
    {
      code: 'XX-103',
      name: '甲硫酸新斯的明注射液',
      category: '制剂产品',
      group: '神经系统类',
      tag: '医保甲类',
      form: '注射剂',
      spec: '1ml:0.5mg',
      indication: '用于重症肌无力、术后腹胀与尿潴留，以及竞争性肌松药过量时的拮抗。',
      holder: 'XXX 制药有限公司',
      description: '抗胆碱酯酶药，作用明确，是围术期与神经科常用基础用药。',
      detail:
        '甲硫酸新斯的明通过抑制胆碱酯酶，增加乙酰胆碱在神经肌肉接头处的浓度，从而改善骨骼肌收缩力。可用于重症肌无力的对症治疗、腹部手术后肠胀气与尿潴留，以及非去极化肌松药作用后的拮抗。应用时需注意胆碱能危象等不良反应。',
      image: '/images/product-3.svg',
    },
    {
      code: 'XX-104',
      name: '罗库溴铵注射液',
      category: '制剂产品',
      group: '肌肉-骨骼系统类',
      tag: '医保乙类',
      form: '注射剂',
      spec: '5ml:50mg',
      indication: '用于全身麻醉辅助，提供骨骼肌松弛，便于气管插管与手术操作。',
      holder: 'XXX 制药有限公司',
      description: '中时效非去极化肌松药，起效快、可控性好，适用于多种手术场景。',
      detail:
        '罗库溴铵为氨基甾类非去极化神经肌肉阻滞剂，起效迅速，作用时间中等，可用于常规诱导插管及维持肌松。临床应在具备气道管理与肌松监测条件的机构使用，并根据手术时长与患者情况个体化给药。',
      image: '/images/product-4.svg',
    },
    {
      code: 'XX-105',
      name: '盐酸替罗非班氯化钠注射液',
      category: '制剂产品',
      group: '血液和造血器官类',
      tag: '医保乙类',
      form: '注射剂',
      spec: '100ml:5mg',
      indication: '用于急性冠脉综合征患者，降低血栓性心血管事件风险。',
      holder: 'XXX 制药有限公司',
      description: '血小板糖蛋白 IIb/IIIa 受体拮抗剂，与抗凝、抗血小板治疗联合使用。',
      detail:
        '盐酸替罗非班通过阻断血小板糖蛋白 IIb/IIIa 受体，抑制血小板聚集，是急性冠脉综合征介入治疗中的重要辅助用药。使用期间应评估出血风险，密切监测血小板计数与临床出血征象。',
      image: '/images/product-5.svg',
    },
    {
      code: 'XX-106',
      name: '盐酸帕洛诺司琼注射液',
      category: '制剂产品',
      group: '消化道和代谢类',
      tag: '医保乙类',
      form: '注射剂',
      spec: '5ml:0.25mg',
      indication: '用于预防中高度致吐性化疗引起的急性和延迟性恶心、呕吐。',
      holder: 'XXX 制药有限公司',
      description: '第二代 5-HT3 受体拮抗剂，半衰期长，对延迟性呕吐控制更优。',
      detail:
        '盐酸帕洛诺司琼为高选择性 5-HT3 受体拮抗剂，与第一代药物相比具有更长的半衰期和更高的受体亲和力，可同时覆盖化疗后的急性与延迟性恶心呕吐。通常于化疗前单次静脉给药，具体方案由临床医生制定。',
      image: '/images/product-6.svg',
    },
    {
      code: 'XX-201',
      name: '盐酸溴己新（原料药）',
      category: '原料药',
      group: '呼吸系统类',
      tag: 'CEP / DMF',
      form: '原料药',
      spec: 'USP / EP / CP',
      indication: '用于盐酸溴己新注射液、片剂等制剂的生产。',
      holder: 'XXX 制药有限公司',
      description: '采用绿色合成工艺，杂质谱清晰，可支持国内外制剂注册申报。',
      detail:
        '盐酸溴己新原料药在符合 GMP 规范的原料药车间生产，具备完整的起始物料控制、工艺验证与杂质研究资料。产品可提供 USP、EP、CP 质量标准，支持 CEP / DMF 文件申报与客户现场审计。',
      image: '/images/product-7.svg',
    },
    {
      code: 'XX-202',
      name: '甲硫酸新斯的明（原料药）',
      category: '原料药',
      group: '神经系统类',
      tag: 'DMF',
      form: '原料药',
      spec: 'CP / EP',
      indication: '用于甲硫酸新斯的明注射液等制剂的生产。',
      holder: 'XXX 制药有限公司',
      description: '成熟的产业化工艺与稳定的供应链，批间质量一致性良好。',
      detail:
        '甲硫酸新斯的明原料药由公司原料药事业部生产，工艺路线成熟、关键质量属性控制完善。公司可提供批检验报告、稳定性数据与注册支持文件，并配合客户完成供应商审计与变更评估。',
      image: '/images/product-8.svg',
    },
  ],

  academic: {
    intro:
      '我们与高校、医院及研究机构保持长期合作，把实验室里的发现变成可验证的产品。以下为部分学术成果与交流活动。',
    papers: [
      { year: '2026', title: '盐酸溴己新注射液雾化吸入给药的一致性评价', journal: '中国新药与临床杂志', tags: ['一致性评价', '呼吸'] },
      { year: '2025', title: '替罗非班在急性冠脉综合征围术期中的应用观察', journal: '中国临床药学杂志', tags: ['心血管', '真实世界'] },
      { year: '2025', title: '原料药绿色合成工艺的杂质控制策略', journal: '中国医药工业杂志', tags: ['原料药', '质量研究'] },
      { year: '2024', title: '帕洛诺司琼预防化疗相关恶心呕吐的临床研究', journal: '肿瘤药学', tags: ['消化道', '临床评价'] },
    ],
    events: [
      { date: '2026.10', name: '中国医药工业发展大会', place: '上海', role: '主题报告' },
      { date: '2026.06', name: '呼吸系统疾病合理用药论坛', place: '杭州', role: '圆桌嘉宾' },
      { date: '2026.03', name: '药品上市许可持有人制度研讨会', place: '北京', role: '联合主办' },
    ],
    collab: ['高校联合实验室', '医院临床研究合作', '第三方质量研究与验证', '原料药与制剂一体化开发'],
  },

  social: {
    wechat: 'XXX',
    linkedin: 'xxx-pharmaceutical',
    email: 'partner@xxx.com',
  },

  stats: [
    { value: '60+', label: '个药品批准文号', labelEn: 'Approved Products' },
    { value: '8', label: '个治疗领域覆盖', labelEn: 'Therapeutic Areas' },
    { value: '120+', label: '家国内外合作伙伴', labelEn: 'Global Partners' },
    { value: '15', label: '个国家和地区业务覆盖', labelEn: 'Countries & Regions' },
  ],

  message: {
    title: ['先把问题聊清楚，', '再谈解决方案。'],
    paragraphs: [
      '一款好药从不是一蹴而就，\n最初的一步，往往也是最难迈出的一步。',
      '所以我们更愿意花时间，\n把临床需求、质量要求与商业化路径一次讲透。',
      '一次坦诚的对话，\n胜过十页漂亮的方案。',
      '希望这里成为你愿意反复回来的地方，\n也愿意把最难的问题交给我们。',
    ],
    link: '合作从这里开始',
  },

  aboutStory: [
    {
      no: '01',
      title: ['二十余年积累，', '一家研发驱动', '制药企业的新起点'],
      text: '从药品研发技术服务起步，我们把化学合成、制剂工艺与质量研究整合在同一平台，让好药真正走进临床。',
      art: 'lab',
    },
    {
      no: '02',
      title: ['以科学为依据，', '做出可验证的', '判断'],
      text: '严谨的数据、透明的机制与可重复的工艺。我们相信，清楚的证据比响亮的口号更值得被信任。',
      art: 'cell',
    },
    {
      no: '03',
      title: ['与伙伴一起，', '把速度带给', '好药'],
      text: '开放平台、共享能力，与药企、医院和学术机构共同推进项目，也共同承担创新的风险与回报。',
      art: 'molecule',
    },
  ],

  capabilities: [
    {
      index: '01',
      icon: 'mdi-pill',
      title: '复杂制剂平台',
      titleEn: 'Complex Formulations',
      description:
        '覆盖注射剂、口服溶液剂等剂型的处方开发与产业化放大，围绕一致性评价建立从实验室到商业批的完整工艺与质量标准。',
    },
    {
      index: '02',
      icon: 'mdi-flask-outline',
      title: '原料药绿色工艺',
      titleEn: 'Green API Synthesis',
      description:
        '自主开发绿色合成路线与杂质控制策略，关键中间体自供，形成原料药与制剂一体化成本与质量优势。',
    },
    {
      index: '03',
      icon: 'mdi-shield-check-outline',
      title: '质量与注册体系',
      titleEn: 'Quality & Regulatory',
      description:
        '符合 GMP 的质量管理体系，具备国内外注册申报、现场核查与供应商审计的完整经验，保障产品持续合规供应。',
    },
  ],

  pillars: [
    {
      index: '01',
      title: '以患者为中心',
      titleEn: 'Patient-Centric',
      description: '从真实临床需求出发定义产品，用可量化的指标回答「什么对患者有意义」。',
      image: 'portrait',
    },
    {
      index: '02',
      title: '以质量为准绳',
      titleEn: 'Quality-First',
      description: '质量不是检验出来的，而是设计与生产出来的。每一个批次都要经得起追溯。',
      image: 'helix',
    },
    {
      index: '03',
      title: '以创新为驱动',
      titleEn: 'Driven by Innovation',
      description: '在工艺、剂型与递送上持续投入，让成熟产品更稳定，让在研项目更接近临床。',
      image: 'team',
    },
    {
      index: '04',
      title: '以长期主义为尺度',
      titleEn: 'Long-Term Thinking',
      description: '尊重医药产业规律，允许试错，但不允许对严谨和品质的妥协。',
      image: 'facility',
    },
  ],

  pipeline: [
    {
      code: 'XX-101',
      name: '盐酸溴己新注射液',
      category: '呼吸系统',
      phase: '已上市',
      progress: 100,
      indication: '慢性支气管炎、支气管扩张',
      art: 'molecule',
    },
    {
      code: 'XX-105',
      name: '盐酸替罗非班氯化钠注射液',
      category: '心血管',
      phase: '已上市',
      progress: 100,
      indication: '急性冠脉综合征',
      art: 'cell',
    },
    {
      code: 'XX-301',
      name: '吸入用盐酸溴己新溶液',
      category: '呼吸系统',
      phase: '临床',
      progress: 58,
      indication: '慢性阻塞性肺疾病',
      art: 'helix',
    },
    {
      code: 'XX-402',
      name: '长效帕洛诺司琼注射液',
      category: '消化道和代谢',
      phase: '临床前',
      progress: 24,
      indication: '化疗相关恶心呕吐',
      art: 'plate',
    },
  ],

  news: [
    {
      id: 'n-2026-01',
      date: '2026.10.18',
      category: '企业动态',
      title: 'XXX 制药完成新一轮战略融资，加速制剂与原料药一体化布局',
      excerpt: '本轮资金将主要用于呼吸与心血管领域重点产品的产能扩建、研发中心升级以及国际注册推进。',
      cover: '/images/news-1.svg',
      body: [
        'XXX 制药今日宣布完成新一轮战略融资。本轮融资由多家长期关注医药产业的机构共同参与，资金将主要用于重点产品的产能扩建、研发中心升级与国际注册推进。',
        '公司同步启动制剂生产基地的扩建计划，新增注射剂生产线与质量分析实验室，进一步缩短从工艺开发到商业批供货的周期。',
        '感谢所有合作伙伴的信任。我们会继续把资源投向真正有临床价值的方向，让优质药品更早抵达患者。',
      ],
    },
    {
      id: 'n-2026-02',
      date: '2026.08.06',
      category: '企业动态',
      title: '盐酸溴己新注射液通过一致性评价，临床可及性进一步提升',
      excerpt: '产品在质量与疗效上与原研药保持一致，为呼吸系统疾病患者提供更多可及选择。',
      cover: '/images/news-2.svg',
      body: [
        '近日，公司重点产品盐酸溴己新注射液通过仿制药质量和疗效一致性评价。研究结果显示，产品在质量与疗效上与原研药保持一致。',
        '公司已完成工艺放大与质量体系验证，具备稳定的商业化供货能力。该产品将进一步完善公司在呼吸系统治疗领域的产品组合。',
        '未来，公司将持续推进重点品种的一致性评价与国际化注册，提升优质药品的可及性。',
      ],
    },
    {
      id: 'n-2026-03',
      date: '2026.05.22',
      category: '企业动态',
      title: 'XXX 制药与国内头部医院达成临床研究合作',
      excerpt: '双方将围绕呼吸与心血管领域开展真实世界研究，共同探索更优的临床用药方案。',
      cover: '/images/news-3.svg',
      body: [
        '根据合作协议，双方将围绕呼吸与心血管领域开展真实世界研究，共同探索更优的临床用药方案与患者管理路径。',
        '合作将结合医院在临床诊疗与数据积累方面的优势，以及公司在药物研发、质量研究方面的能力，探索更高效的转化路径。',
        '公司始终重视循证医学证据的建设，希望通过扎实的研究让产品价值被更准确地理解。',
      ],
    },
    {
      id: 'n-2025-04',
      date: '2025.12.09',
      category: '政策法规',
      title: '国家药监局发布《药品上市许可持有人落实药品质量安全主体责任监督管理规定》',
      excerpt: '进一步明确持有人关键岗位职责、质量体系要求与年度报告义务，强化全生命周期管理。',
      cover: '/images/news-4.svg',
      body: [
        '国家药品监督管理局发布相关监督管理规定，进一步明确药品上市许可持有人关键岗位职责、质量管理体系要求与年度报告义务。',
        '规定强调持有人应当建立覆盖药品全生命周期的质量管理体系，对受托生产、委托销售等环节履行管理责任。',
        '公司已完成内部制度对照梳理，并将持续完善持有人质量管理体系，确保生产经营活动合规。',
      ],
    },
    {
      id: 'n-2025-05',
      date: '2025.09.15',
      category: '政策法规',
      title: '《药品生产质量管理规范》附录更新，无菌药品生产要求进一步细化',
      excerpt: '新版附录对洁净区监测、污染控制策略与数据完整性提出更高要求。',
      cover: '/images/news-5.svg',
      body: [
        '新版 GMP 附录对无菌药品生产的洁净区监测、污染控制策略与数据完整性提出更高要求，进一步与国际通行标准接轨。',
        '公司质量部门已组织专项培训与差距分析，针对关键工序完成风险评估与整改计划。',
        '无菌保障能力是注射剂企业的核心竞争力，公司将持续投入厂房设施与人员能力建设。',
      ],
    },
    {
      id: 'n-2025-06',
      date: '2025.06.20',
      category: '政策法规',
      title: '国家医保局公布新一批医保药品目录调整结果',
      excerpt: '目录调整继续向临床价值明确、患者获益显著的药品倾斜，支持创新与可及并重。',
      cover: '/images/news-6.svg',
      body: [
        '国家医保局公布新一批医保药品目录调整结果，目录调整继续向临床价值明确、患者获益显著的药品倾斜。',
        '公司多个重点产品保持在保状态，另有新品通过谈判纳入目录，进一步提升患者可及性。',
        '公司将持续关注政策变化，做好医保准入与供应保障工作。',
      ],
    },
  ],

  site: {
    phone: '400-820-2026',
    utilityLinks: [{ label: '药物警戒', to: '/pharmacovigilance' }],
    footerLinks: [
      { label: '国家药品监督管理局', url: 'https://www.nmpa.gov.cn' },
      { label: '国家医疗保障局', url: 'https://www.nhsa.gov.cn' },
      { label: '中国医药企业管理协会', url: 'https://www.cpema.org' },
      { label: '百度', url: 'https://www.baidu.com' },
    ],
    icp: '沪ICP备XXXXXXXX号',
    license: '沪（备）-非经营性-2024-0186号',
    disclaimer:
      '本网站未发布麻醉药品、精神药品、医疗用毒性药品、放射性药品、戒毒药品和医疗机构制剂的产品信息。',
  },

  pages: {
    about: {
      title: '关于我们',
      subtitle: '以终为始 守正出奇',
      intro: [
        'XXX 是一家以研发为驱动的制药企业。二十余年来，我们从药品研发技术服务起步，逐步构建起「制剂 + 原料药 + 技术服务」的一体化能力。',
        '我们相信，好的药品来自对科学的敬畏、对质量的坚持，以及对患者真实需求的理解。',
      ],
      sections: [
        {
          title: '我们是谁',
          paragraphs: [
            'XXX 制药成立于 2000 年，总部位于上海，在浙江设有原料药生产基地。公司聚焦呼吸系统、心血管系统、神经系统、肌肉-骨骼系统、血液和造血器官、消化道和代谢等治疗领域，形成了覆盖原料药与制剂的一体化产品组合。',
            '公司拥有符合 GMP 规范的生产基地与质量分析中心，具备从工艺开发、质量研究、注册申报到商业化供货的完整能力，产品覆盖国内主要省市并出口多个国家和地区。',
          ],
        },
        {
          title: '研发与质量',
          paragraphs: [
            '公司持续投入研发，围绕复杂制剂、绿色合成工艺与杂质控制建立技术平台。我们以临床价值为导向，推进重点品种的一致性评价与改良型新药研究，让成熟产品更稳定、让在研项目更接近临床。',
            '质量是制药企业的生命线。公司建立了覆盖药品全生命周期的质量管理体系，从起始物料、生产过程到上市后监测，每一个环节都可追溯、可验证。',
          ],
        },
        {
          title: '企业文化',
          paragraphs: [
            '「以终为始」提醒我们始终从患者获益出发倒推每一个决策；「守正出奇」要求我们守住合规与质量的底线，同时在技术与效率上不断寻找更优解。',
            '我们尊重医药产业的客观规律，允许试错，但不允许对严谨和品质的妥协。欢迎志同道合的人加入我们，一起把难而正确的事做下去。',
          ],
        },
      ],
      milestones: [
        {
          period: '2000—2015',
          title: '技术服务起步',
          text: '公司以药品研发、生产与成果转化技术服务为主，为医药企业和科研机构提供从处方工艺到注册申报的全流程支持，积累了扎实的研发与质量研究能力。',
        },
        {
          period: '2015—2017',
          title: '「技术服务 + 原料药」双轮驱动',
          text: '在技术服务基础上，公司布局化学原料药及医药中间体业务，形成完整的原料药研发体系与成熟生产工艺，关键中间体实现自主供应。',
        },
        {
          period: '2017—至今',
          title: '「制剂 + 原料药 + 技术服务」一体化',
          text: '把握药品上市许可持有人制度机遇，公司以持有人身份推进制剂业务，依托原料药供应与研发优势，形成原料药与制剂一体化的发展格局。',
        },
      ],
    },

    news: {
      title: '新闻动态',
      subtitle: '最新动态一站知晓',
      intro: [
        '在这里，你可以第一时间了解 XXX 的研发进展、合作动态，以及医药行业的政策法规变化。',
      ],
      categories: ['企业动态', '政策法规'],
    },

    products: {
      title: '产品中心',
      subtitle: '覆盖多治疗领域的药品组合',
      intro: [
        '公司产品覆盖呼吸系统、心血管系统、神经系统、肌肉-骨骼系统、血液和造血器官、消化道和代谢等治疗领域，并持续推进在研项目。',
        '点击产品卡片可查看剂型、规格、适应症、持有人等完整信息。',
      ],
      groups: [
        '呼吸系统类',
        '心血管系统类',
        '神经系统类',
        '肌肉-骨骼系统类',
        '血液和造血器官类',
        '消化道和代谢类',
        '在研',
      ],
      categories: ['制剂产品', '原料药'],
    },

    investor: {
      title: '投资者关系',
      subtitle: '公开 · 透明 · 长期主义',
      intro: [
        '我们坚持以公开、透明的态度与投资者沟通，及时披露公司经营与重大事项信息，与股东共享企业长期成长的价值。',
      ],
      items: [
        {
          date: '2026-10-18',
          type: '临时公告',
          title: '关于完成新一轮战略融资的公告',
          url: '/investor#notice-1',
        },
        {
          date: '2026-08-26',
          type: '定期报告',
          title: '2026 年半年度报告',
          url: '/investor#notice-2',
        },
        {
          date: '2026-06-12',
          type: '投资者关系活动',
          title: '2026 年投资者交流会纪要',
          url: '/investor#notice-3',
        },
        {
          date: '2026-04-28',
          type: '定期报告',
          title: '2025 年年度报告',
          url: '/investor#notice-4',
        },
      ],
    },

    jobs: {
      title: '加入我们',
      subtitle: '与优秀的人，做有难度的事',
      intro: [
        '我们正在寻找对医药行业抱有长期热情的人。无论你专注研发、质量、注册还是商业化，这里都有值得投入的问题。',
      ],
      items: [
        {
          id: 'job-001',
          type: '社会招聘',
          title: '制剂研发工程师',
          department: '研发中心 · 制剂部',
          location: '上海',
          headcount: '3 人',
          description:
            '负责注射剂与口服溶液剂的处方工艺开发、放大与工艺验证；参与一致性评价项目的处方筛选、稳定性研究与申报资料撰写；与生产、质量部门协同完成技术转移。',
          requirements: [
            '药学、药剂学或相关专业硕士及以上学历，3 年以上制剂研发经验；',
            '熟悉注射剂或口服液体制剂的开发流程与 GMP 要求；',
            '具备一致性评价或仿制药申报经验者优先；',
            '良好的文献检索、实验设计与跨部门沟通能力。',
          ],
        },
        {
          id: 'job-002',
          type: '社会招聘',
          title: '药品注册专员',
          department: '注册事务部',
          location: '上海',
          headcount: '2 人',
          description:
            '负责国内药品注册申报资料的整理、撰写与递交，跟踪审评进度并回复问询；参与国际注册（CEP / DMF）文件准备；维护与监管机构的沟通。',
          requirements: [
            '药学、化学或相关专业本科及以上学历；',
            '2 年以上药品注册或质量研究相关经验，熟悉 CTD 格式；',
            '英语读写熟练，能够独立阅读法规与技术文件；',
            '细致、耐心，具备较强的时间管理与文档管理能力。',
          ],
        },
        {
          id: 'job-101',
          type: '校园招聘',
          title: '质量分析培训生',
          department: '质量管理部',
          location: '上海',
          headcount: '5 人',
          description:
            '在轮岗中学习色谱、光谱等分析技术在药品质量控制中的应用；参与方法开发、验证与稳定性研究；协助完成批检验与实验室偏差调查。',
          requirements: [
            '2027 届药学、分析化学、药物分析等相关专业本科及以上学历；',
            '熟悉 HPLC、GC 等常见分析仪器的基本原理；',
            '具备良好的实验记录习惯与数据完整性意识；',
            '愿意在质量领域长期发展，接受轮岗培养。',
          ],
        },
        {
          id: 'job-102',
          type: '校园招聘',
          title: '原料药工艺培训生',
          department: '原料药事业部',
          location: '浙江 · 台州',
          headcount: '4 人',
          description:
            '参与原料药合成工艺的开发、优化与放大；协助完成工艺验证、清洁验证与生产技术支持；学习 GMP 体系下的工艺文件管理。',
          requirements: [
            '2027 届化学、应用化学、制药工程等相关专业本科及以上学历；',
            '具备有机合成实验基础，了解常见单元操作；',
            '安全意识强，能够适应生产基地的工作节奏；',
            '有工艺开发或中试放大项目经历者优先。',
          ],
        },
      ],
    },

    contact: {
      title: '联系我们',
      subtitle: '一次坦诚的对话，胜过十页漂亮的方案',
      intro: [
        '无论你是医生、患者、合作伙伴，还是正在寻找下一站的候选人，我们都愿意听你说。',
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
          options: ['产品合作', '临床研究', '供应链合作', '媒体与品牌', '其他'],
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
        '如你在使用 XXX 产品期间出现任何可疑不良反应，请通过以下表单告诉我们。',
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
          placeholder: '例如：盐酸溴己新注射液',
        },
        {
          name: 'reaction',
          label: '不良反应描述',
          type: 'textarea',
          required: true,
          placeholder: '请描述用药时间、症状、处理经过与转归',
        },
      ],
      note: '如情况紧急，请立即就医，并拨打药物警戒热线 400-820-2026 转 3。',
    },
  },

  greeting: {
    title: '创始人寄语',
    name: 'XXX',
    nameEn: 'XXX',
    role: '创始人 · 董事长',
    message: [
      '创办 XXX 之前，我在实验室里待了很多年。那时最常被问到的问题是：这项研究，什么时候才能真正帮到人？',
      '这个问题后来成了公司的起点。我们不想只做漂亮的论文，也不满足于把技术停在概念阶段。我们要做的，是让好药一步一步走到床边。',
      '这条路很长，也一定会有失败。但只要方向是对的，慢一点没有关系。',
      '如果你也在为同样的问题寻找答案，欢迎来和我们聊聊。',
    ],
    career: [
      '药物化学与制剂方向博士',
      '二十余年医药研发与产业化经验',
      '主导多个品种从研发到商业化落地',
      '参与多项行业标准与产业政策研讨',
    ],
    art: 'portrait',
  },

  facility: [
    {
      no: '01',
      label: '制剂生产基地',
      text: '符合 GMP 规范的注射剂与口服制剂生产线，支持从临床样品到商业批的稳定供货。',
      art: 'facility',
    },
    {
      no: '02',
      label: '原料药车间',
      text: '绿色合成工艺与关键中间体自供，形成原料药与制剂一体化优势。',
      art: 'molecule',
    },
    {
      no: '03',
      label: '质量分析中心',
      text: '色谱、光谱与微生物检测能力内建，覆盖方法开发、验证与稳定性研究。',
      art: 'plate',
    },
    {
      no: '04',
      label: '研发中心',
      text: '处方工艺、质量研究与注册申报团队协同办公，让问题被更快地摆到桌面上。',
      art: 'team',
    },
  ],

  company: [
    { label: '成立时间', value: '2000' },
    { label: '总部', value: 'xxx' },
    { label: '团队规模', value: '600 人' },
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

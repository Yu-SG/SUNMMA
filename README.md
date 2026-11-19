# XXX BioTechnology — 官网 + 内容后台

一个 **Nuxt 4 全栈单体**：同一个项目、一次构建、一个 Node 进程同时承载

- **官网**（SSR 页面，给访客和搜索引擎看）
- **后台管理** `/admin`（给管理员写内容）
- **Nitro API**（`/api/*`）与 **SQLite 数据库**（内容的唯一事实来源）

SEO 不是独立系统，而是公开页面按数据库内容渲染后自然产出的结果（标题、描述、OG、结构化数据都在页面里）。

## 快速开始

```bash
cp .env.example .env      # 配置后台密码与会话密钥
yarn install              # 或 npm install / pnpm install
yarn dev                  # 开发服务器 → http://localhost:3070
yarn build && yarn preview# 生产构建与本地预览
```

默认后台地址：`http://localhost:3070/admin`，密码取自 `ADMIN_PASSWORD`（未配置时为 `admin123`）。

## 架构

```
浏览器 / 搜索引擎
       │
       ▼
  Nuxt 页面（SSR）                 ← SEO 由这里的渲染产出
       │  plugins/content.ts 启动时拉取
       ▼
  /api/content  ·  /api/admin/*   ← Nitro（同一进程）
       │
       ▼
  server/utils/db.ts → SQLite（.data/content.db）
```

- 内容是一份 JSON 文档（`SiteConfig`），存在 `content` 表里；每次保存写入 `content_revisions`（保留最近 20 版，可在后台一键恢复）。
- 公开页面通过 `app/plugins/content.ts` 在渲染前把数据库内容水合到 `siteConfig`（`app/config/site.ts` 中的响应式对象），所以所有组件仍然按 `siteConfig.xxx` 读取，无需改动模板。
- 保存后刷新页面即可看到变化（SSR 每次请求都读数据库，无缓存延迟）。

## 目录结构

```
shared/site.ts              # 内容类型 + 默认内容（app 与 server 共用）
app/
├─ config/site.ts           # 由默认内容生成的响应式站点配置（含 hydrateSiteConfig）
├─ plugins/content.ts       # 启动时从 /api/content 水合内容
├─ app.vue                  # 站点骨架（/admin 下不渲染 Header/Footer）
├─ assets/css/main.css      # 设计系统：色板、字号、按钮、卡片、表单
├─ components/              # Header / Footer / HeroCarousel / PageHero / ContactBlock …
├─ pages/                   # index / products / academic / news / contact / about / admin
└─ plugins/reveal.client.ts # 滚动入场动画
app/utils/vuetify.ts        # 后台专用的 Vuetify 延迟加载与主题
app/middleware/vuetify-admin.global.ts  # 进入 /admin 前加载 Vuetify
server/
├─ api/content.get.ts       # 公开内容接口
├─ api/admin/*              # 登录、内容读写、版本恢复（Cookie 会话鉴权）
└─ utils/                   # db.ts（SQLite）、auth.ts（密码 + 签名会话）
public/                     # 图片、robots.txt、sitemap.xml
```

## 后台（Vuetify / lux-ui 风格）

`/admin` 是客户端渲染（`routeRules` 里 `ssr: false`）的应用，界面仿照 [lux-ui](https://github.com/yangjiakai/lux-ui) 的 Vuetify 4 管理台：左侧白色抽屉（品牌块 + 分组导航 + 官网入口卡片）、顶部 App Bar（分区搜索、更新时间、保存状态、历史/官网/保存/账号图标按钮）、内容区 100% 铺满、卡片式表单。

- **Vuetify 只在 `/admin` 加载**：`app/middleware/vuetify-admin.global.ts` 在进入后台前调用 `app/utils/vuetify.ts` 动态导入 Vuetify 运行时与样式，官网页面不会下载这些资源（构建产物里是独立 chunk）。
- **站点概览（Dash）** 是默认首页，图表用 **ECharts 6**（`app/components/admin/AdminChart.vue`，按需动态加载）：内容完整度仪表盘、保存活动折线（近 7 天）、内容构成环形图、论文年份柱状图，外加内容数量 KPI 卡片、站点信息、官网入口与最近保存。
- **表单样式**：输入框使用 Vuetify `filled` 变体（浅底色、无描边），分区内按「基础信息 / 联系 / 内容」分组；列表项是可折叠卡片，头部显示序号、缩略图、标题与摘要（如日期·分类、年份·期刊），可上移/下移/删除/收起。
- **外观设置**：顶栏调色板图标可切换主题色（7 个预设）与深色模式；选择写入 `localStorage`（`studio:theme`），刷新后保持。为避免深色模式白闪，`nuxt.config.ts` 在 `<head>` 里内联了一段脚本，在首帧前先把文档背景涂成深色；Vuetify 的主题在创建实例时就按已存偏好初始化。
- 分区可通过 URL hash 直达，例如 `/admin#brand`、`/admin#products`；`/admin` 默认概览。

## 图片上传

首页横幅与产品图片支持直接上传，不必手填路径：

| 接口 | 说明 |
|---|---|
| `POST /api/admin/upload` | multipart 字段 `file`，仅 JPG/PNG/WebP/GIF/AVIF，单张 ≤ 8MB，返回 `{ url: "/uploads/<name>" }` |
| `DELETE /api/admin/upload` | body `{ url }`，只删除后台上传的文件（`/uploads/...`），仓库里的 `/images/*` 不会被删 |
| `GET /uploads/<name>` | 读取上传文件，带一年强缓存 |
| `GET /api/admin/media` | 图片库列表：后台上传（读 `.data/uploads`）+ 内置素材（`public/images`），返回文件名、大小、时间、来源 |

图片字段左侧的图片图标会打开**图片库**：网格预览、按名称搜索、「全部 / 后台上传 / 内置素材」分类、点击即选用；库里也能直接上传，后台上传的图片可在这里删除（内置素材只读）。

文件存放在 `.data/uploads/`（可用 `UPLOAD_DIR` 覆盖），随数据库一起在部署时持久化；后台管理页的图片字段支持点上传、拖拽上传，以及一键移除（同时删掉文件）。横幅图片被清空时前台轮播会自动跳过该张，不会出现空白幻灯片。

## 后台能改什么

`/admin` 分为若干分区，保存后立即生效：

| 分区 | 覆盖内容 |
|---|---|
| 站点概览（Dash） | 内容数量、更新时间、数据库路径、SEO 检查、官网入口（只读） |
| 品牌信息 | 公司名、简称、英文名、Logo 图片（上传/图片库，留空用内置图标）、标语、简介、邮箱、电话、地址、微信、成立年份 |
| 首页横幅 | 轮播图（图片路径、alt、焦点位置），支持增删与排序 |
| 产品中心 | 产品编码、名称、分类、卖点标签、描述、配图 |
| 新闻中心 | 日期、分类、标题、摘要、正文段落 |
| 学术交流 | 简介、论文列表、学术活动、合作方向 |
| 首页文案 | 主标题分行、手写体、公司信息表、数据指标 |
| 原始 JSON | 整份内容文档（用于改任何未做成表单的字段） |

> 数据库是唯一事实来源；`shared/site.ts` 里的默认值只在首次启动建库和字段兜底时使用。

## 环境变量

| 变量 | 说明 |
|---|---|
| `ADMIN_PASSWORD` | 后台登录密码，默认 `admin123` |
| `ADMIN_SECRET` | 会话签名密钥，生产环境请改成随机长字符串 |
| `CONTENT_DB_PATH` | 可选，SQLite 文件路径，默认 `.data/content.db`（已在 `.gitignore` 中） |

## 部署

单进程即可，不需要额外的数据库或服务：

```bash
yarn build
ADMIN_PASSWORD=... ADMIN_SECRET=... node .output/server/index.mjs
```

SQLite 文件默认写在项目根目录 `.data/`，部署时挂载一个可写目录或把 `CONTENT_DB_PATH` 指过去即可。

## 其他说明

- 图片放在 `public/images/`，后台填写 `/images/xxx.jpg` 即可引用；现有 banner 图片来自 Burst（Shopify），Burst License 可免费商用、无需署名。
- 首页轮播组件 `HeroCarousel.vue`：6 秒自动切换、左右箭头、圆点、触摸滑动，悬停暂停，`prefers-reduced-motion` 下不自动播。
- 颜色与圆角改 `app/assets/css/main.css` 顶部的 `:root` 变量即可全站生效。
- `robots.txt` 与 `sitemap.xml` 是静态文件，正式上线前把域名 `https://xxx.com` 换成真实域名。

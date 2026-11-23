export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  devServer: {
    port: 3070,
  },

  modules: ['vuetify-nuxt-module'],

  runtimeConfig: {
    public: {
      // 站点根地址，用于 canonical / sitemap / og:url；部署时用 NUXT_PUBLIC_SITE_URL 覆盖
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://demo2.lcwlzx.site',
    },
  },

  css: ['~/assets/css/main.css'],

  vuetify: {
    moduleOptions: {
      importComposables: true,
      // Nuxt already provides `useLayout` for page layouts; keep Vuetify's
      // version under the prefixed name to avoid the auto-import collision.
      prefixComposables: ['useLayout'],
    },
    vuetifyOptions: {
      icons: {
        defaultSet: 'mdi',
        sets: ['mdi'],
      },
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            colors: {
              background: '#f5f7fa',
              surface: '#ffffff',
              'surface-variant': '#eaf1f9',
              primary: '#1976d2',
              'primary-darken-1': '#0d47a1',
              secondary: '#0f766e',
              'secondary-darken-1': '#115e59',
              accent: '#00acc1',
              error: '#d32f2f',
              info: '#0288d1',
              success: '#2e7d32',
              warning: '#ed6c02',
              'on-surface-variant': '#5b6472',
              footer: '#0b1f33',
              'footer-muted': '#9fb3c8',
            },
          },
          dark: {
            dark: true,
            colors: {
              background: '#11161f',
              surface: '#1a2230',
              'surface-variant': '#222c3c',
              primary: '#1976d2',
              'primary-darken-1': '#0d47a1',
              secondary: '#4db6ac',
              'secondary-darken-1': '#26a69a',
              accent: '#26c6da',
              error: '#ef5350',
              info: '#42a5f5',
              success: '#66bb6a',
              warning: '#ffca28',
              'on-surface-variant': '#aab6c8',
              footer: '#0b1f33',
              'footer-muted': '#9fb3c8',
            },
          },
        },
      },
      defaults: {
        VBtn: { rounded: 'lg', elevation: 0, height: 40 },
        VCard: { rounded: 'xl', elevation: 0 },
        VChip: { rounded: 'lg' },
        VList: { rounded: 'lg' },
        VTextField: {
          variant: 'outlined',
          density: 'comfortable',
          rounded: 'lg',
          color: 'primary',
        },
        VTextarea: {
          variant: 'outlined',
          density: 'comfortable',
          rounded: 'lg',
          color: 'primary',
        },
        VSelect: {
          variant: 'outlined',
          density: 'comfortable',
          rounded: 'lg',
          color: 'primary',
        },
      },
    },
  },

  routeRules: {
    '/pipeline': { redirect: { to: '/products', statusCode: 301 } },
    '/admin': { ssr: false },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: '舒美奇｜药品研发与上市许可持有人专业企业',
      meta: [
        { name: 'theme-color', content: '#1976d2' },
        { name: 'author', content: '舒美奇成都生物科技有限公司' },
        { name: 'format-detection', content: 'telephone=no' },
        {
          name: 'description',
          content:
            '舒美奇成都生物科技有限公司成立于 2016 年，位于成都高新区天府生命科技园，专注化学药制剂与中药新药研发，是药品上市许可持有人。',
        },
        { name: 'robots', content: 'index, follow, max-image-preview:large' },
        { property: 'og:site_name', content: 'SUMAZ' },
        { property: 'og:locale', content: 'zh_CN' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      script: [
        {
          tagPosition: 'head',
          innerHTML:
            "(function(){try{var p=JSON.parse(localStorage.getItem('studio:theme')||'{}');if(p&&p.dark&&location.pathname.indexOf('/admin')===0){var r=document.documentElement;r.dataset.studioTheme='dark';r.style.backgroundColor='#11161f';}}catch(e){}})();",
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Noto+Sans+SC:wght@400;500;700&display=swap',
        },
      ],
    },
  },
})

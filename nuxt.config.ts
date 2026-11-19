export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  devServer: {
    port: 3070,
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/pipeline': { redirect: { to: '/products', statusCode: 301 } },
    '/admin': { ssr: false },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: 'XXX BioTechnology｜让科学成为可及的疗法',
      meta: [
        { name: 'theme-color', content: '#1976d2' },
        { name: 'author', content: 'XXX' },
        { name: 'format-detection', content: 'telephone=no' },
        {
          name: 'description',
          content:
            'XXX 生物科技：生物科技 × 美妆的配方研发与产品制造，提供面部护理、功效精华、身体护理与定制礼盒。',
        },
        { name: 'robots', content: 'index, follow, max-image-preview:large' },
        { property: 'og:site_name', content: 'XXX BioTechnology' },
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
          href: 'https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Outfit:wght@300;400;500;600&family=Caveat:wght@400;500&family=Noto+Sans+SC:wght@400;500;700&display=swap',
        },
      ],
    },
  },
})

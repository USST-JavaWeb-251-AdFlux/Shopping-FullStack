export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      meta: [{
        name: 'adflux-verification',
        content: 'verify-9319d96c557e715bdc1e14ae4f64bf00',
      }],
      script: [{
        src: 'https://adflux.bobliu.tech/ads/main.js',
        type: 'module',
        tagPosition: 'bodyClose',
      }],
    },
  },
  modules: ['@pinia/nuxt', '@element-plus/nuxt'],
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'adflux-slot'
    }
  }
})

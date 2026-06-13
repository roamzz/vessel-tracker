// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/ui", "@pinia/nuxt"],

  runtimeConfig: {
    public: {
      apiBaseUrl: '' // overridden by NUXT_PUBLIC_API_BASE_URL in .env
    }
  },

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },

  devtools: {
    enabled: true
  },

  css: ["~/assets/css/main.css"],

  compatibilityDate: "2025-01-15"
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/ui", "@pinia/nuxt"],

  runtimeConfig: {
    public: {
      aisBaseUrl: ''  // overridden by NUXT_PUBLIC_AIS_BASE_URL in .env
    }
  },

  devtools: {
    enabled: true
  },

  css: ["~/assets/css/main.css"],

  compatibilityDate: "2025-01-15"
})

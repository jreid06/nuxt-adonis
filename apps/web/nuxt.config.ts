import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      // The AdonisJS API's base URL. Override with NUXT_PUBLIC_API_BASE
      // in .env for staging/production.
      apiBase: 'http://localhost:3333',
    },
  },
})

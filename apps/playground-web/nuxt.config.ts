export default defineNuxtConfig({
  modules: [
    '@booking/nuxt',
    '@nuxt/ui',
    '@pinia/nuxt',
  ],

  booking: {
    apiBase: 'http://localhost:3001',
    publicPrefix: '/booking',
    adminPrefix: '/admin',
  },

  devtools: { enabled: true },
})

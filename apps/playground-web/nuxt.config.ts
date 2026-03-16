export default defineNuxtConfig({
  modules: [
    '@booking/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
  ],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  booking: {
    apiBase: 'http://localhost:3001',
    publicPrefix: '/booking',
    adminPrefix: '/admin',
  },

  devtools: { enabled: true },
})

import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { useAuthStore } from '../stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const bookingConfig = config.public.booking as {
    apiBase: string
    publicPrefix: string
    adminPrefix: string
  }

  // Instance $bookingApi — utilisée par tous les composables
  const $bookingApi = $fetch.create({
    baseURL: bookingConfig.apiBase,
    onRequest({ options }) {
      // Injecter le token JWT si disponible
      const authStore = useAuthStore()
      if (authStore.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.token}`,
        }
      }
    },
    onResponseError({ response }) {
      // Rediriger vers login si 401
      if (response.status === 401) {
        const authStore = useAuthStore()
        authStore.logout()
        navigateTo(`${bookingConfig.adminPrefix}/login`)
      }
    },
  })

  return {
    provide: {
      bookingApi: $bookingApi,
    },
  }
})

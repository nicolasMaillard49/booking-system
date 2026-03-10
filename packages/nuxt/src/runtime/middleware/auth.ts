import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from '#app'
import { useAuthStore } from '../stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  const adminPrefix = (config.public.booking as any).adminPrefix

  // Hydrater le store depuis localStorage au premier chargement
  authStore.hydrate()

  // Si la route est admin et que l'user n'est pas connecté → login
  if (to.path.startsWith(adminPrefix) && !to.path.endsWith('/login')) {
    if (!authStore.isAuthenticated) {
      return navigateTo(`${adminPrefix}/login`)
    }
  }

  // Si déjà connecté et on va sur login → rediriger vers dashboard
  if (to.path.endsWith('/login') && authStore.isAuthenticated) {
    return navigateTo(adminPrefix)
  }
})

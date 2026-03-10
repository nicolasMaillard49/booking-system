import { useBookingApi } from './useBookingApi'
import { useAuthStore } from '../stores/auth'
import { navigateTo, useRuntimeConfig } from '#app'

export const useAuth = () => {
  const api = useBookingApi()
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  const adminPrefix = (config.public.booking as any).adminPrefix

  async function login(email: string, password: string) {
    const response = await api<{ accessToken: string; user: any }>(
      '/admin/auth/login',
      { method: 'POST', body: { email, password } },
    )
    authStore.setAuth(response.accessToken, response.user)
    await navigateTo(adminPrefix)
  }

  async function logout() {
    authStore.logout()
    await navigateTo(`${adminPrefix}/login`)
  }

  return { login, logout, authStore }
}

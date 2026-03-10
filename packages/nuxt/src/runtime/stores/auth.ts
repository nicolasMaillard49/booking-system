import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export const useAuthStore = defineStore('booking-auth', () => {
  const token = ref<string | null>(null)
  const user = ref<AuthUser | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isSuperAdmin = computed(() => user.value?.role === 'superadmin')

  function setAuth(accessToken: string, userData: AuthUser) {
    token.value = accessToken
    user.value = userData

    // Persister dans localStorage
    if (import.meta.client) {
      localStorage.setItem('booking_token', accessToken)
      localStorage.setItem('booking_user', JSON.stringify(userData))
    }
  }

  function logout() {
    token.value = null
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem('booking_token')
      localStorage.removeItem('booking_user')
    }
  }

  function hydrate() {
    if (import.meta.client) {
      const storedToken = localStorage.getItem('booking_token')
      const storedUser = localStorage.getItem('booking_user')
      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      }
    }
  }

  return { token, user, isAuthenticated, isSuperAdmin, setAuth, logout, hydrate }
})

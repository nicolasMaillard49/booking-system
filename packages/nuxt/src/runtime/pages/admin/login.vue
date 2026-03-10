<template>
  <div class="min-h-screen flex bg-white">
    <!-- Left Panel - Branding -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 items-center justify-center relative overflow-hidden p-12">
      <!-- Decorative elements -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div class="absolute bottom-20 left-20 w-96 h-96 bg-zinc-700 rounded-full blur-3xl" />
      </div>

      <!-- Content -->
      <div class="relative z-10 max-w-sm">
        <div class="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-8">
          <UIcon name="i-heroicons-calendar-days" class="w-6 h-6 text-white" />
        </div>
        <h1 class="text-4xl font-bold text-white mb-4 leading-tight">
          Gérez vos réservations
        </h1>
        <p class="text-lg text-zinc-300 leading-relaxed">
          Planification fluide, confirmations automatiques, gestion complète de votre agenda en un seul endroit.
        </p>
      </div>
    </div>

    <!-- Right Panel - Form -->
    <div class="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div class="w-full max-w-sm">
        <!-- Mobile Logo -->
        <div class="lg:hidden mb-10">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center">
              <UIcon name="i-heroicons-calendar-days" class="w-6 h-6 text-white" />
            </div>
            <span class="text-xl font-bold text-zinc-900">Booking System</span>
          </div>
        </div>

        <!-- Form Header -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-zinc-900">Connexion</h2>
          <p class="text-zinc-500 mt-2">Accédez à votre tableau de bord administrateur</p>
        </div>

        <!-- Form -->
        <form class="space-y-5" @submit.prevent="onLogin">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-zinc-700 mb-2">Email</label>
            <div class="relative">
              <UIcon name="i-heroicons-envelope" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                v-model="email"
                type="email"
                placeholder="admin@example.com"
                class="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-zinc-700 mb-2">Mot de passe</label>
            <div class="relative">
              <UIcon name="i-heroicons-lock-closed" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Votre mot de passe"
                class="w-full pl-10 pr-10 py-3 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Error Alert -->
          <Transition name="fade">
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
              <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5 text-red-500 flex-shrink-0" />
              <p class="text-sm text-red-700">{{ error }}</p>
            </div>
          </Transition>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="!email || !password || loading"
            class="w-full py-3 bg-zinc-900 text-white font-semibold rounded-lg hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <template v-else>
              <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5" />
              Se connecter
            </template>
          </button>
        </form>

        <!-- Footer -->
        <p class="text-center text-sm text-zinc-500 mt-8">
          Besoin d'aide? <a href="#" class="text-zinc-900 hover:underline font-medium">Contactez le support</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'

const { login } = useAuth()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

async function onLogin() {
  if (!email.value || !password.value) return
  loading.value = true
  error.value = null
  try {
    await login(email.value, password.value)
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Identifiants invalides'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
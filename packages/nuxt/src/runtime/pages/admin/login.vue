<template>
  <div class="min-h-screen flex">
    <!-- Left branding panel -->
    <div class="hidden lg:flex lg:w-[480px] bg-black items-center justify-center relative overflow-hidden">
      <div class="relative z-10 max-w-xs px-12">
        <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-8">
          <UIcon name="i-heroicons-calendar-days" class="text-black text-xl" />
        </div>
        <h1 class="text-[28px] font-semibold text-white mb-3 leading-tight tracking-[-0.02em]">
          Gérez vos rendez-vous en toute simplicité
        </h1>
        <p class="text-[15px] text-neutral-400 leading-relaxed">
          Planification, confirmation, rappels automatiques. Tout votre agenda au même endroit.
        </p>
      </div>
    </div>

    <!-- Right form panel -->
    <div class="flex-1 flex items-center justify-center bg-white px-6">
      <div class="w-full max-w-[360px]">
        <!-- Mobile logo -->
        <div class="lg:hidden flex items-center gap-3 mb-10">
          <div class="w-9 h-9 rounded-lg bg-black flex items-center justify-center">
            <UIcon name="i-heroicons-calendar-days" class="text-white text-lg" />
          </div>
          <span class="text-lg font-semibold text-black tracking-[-0.01em]">Booking</span>
        </div>

        <div class="mb-8">
          <h2 class="text-[22px] font-semibold text-black tracking-[-0.02em]">Connexion</h2>
          <p class="text-neutral-500 mt-1.5 text-[14px]">Accédez à votre espace d'administration</p>
        </div>

        <form class="space-y-5" @submit.prevent="onLogin">
          <UFormGroup label="Adresse email">
            <UInput
              v-model="email"
              type="email"
              placeholder="admin@example.com"
              size="lg"
              icon="i-heroicons-envelope"
            />
          </UFormGroup>

          <UFormGroup label="Mot de passe">
            <UInput
              v-model="password"
              type="password"
              placeholder="Votre mot de passe"
              size="lg"
              icon="i-heroicons-lock-closed"
            />
          </UFormGroup>

          <UAlert v-if="error" color="red" variant="soft" icon="i-heroicons-exclamation-circle" :title="error" />

          <UButton
            type="submit"
            block
            size="lg"
            color="black"
            :loading="loading"
          >
            Se connecter
          </UButton>
        </form>
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

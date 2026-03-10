<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h1 class="text-xl font-bold text-center">Administration</h1>
      </template>

      <div class="space-y-4">
        <UFormGroup label="Email">
          <UInput v-model="email" type="email" placeholder="admin@example.com" />
        </UFormGroup>

        <UFormGroup label="Mot de passe">
          <UInput v-model="password" type="password" placeholder="••••••••" />
        </UFormGroup>

        <UAlert v-if="error" color="red" :title="error" />

        <UButton block :loading="loading" @click="onLogin">
          Se connecter
        </UButton>
      </div>
    </UCard>
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

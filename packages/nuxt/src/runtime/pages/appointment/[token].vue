<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 class="font-semibold text-gray-900 dark:text-gray-100">Votre rendez-vous</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">Gérez votre réservation</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-8 h-8 border-2 border-gray-200 dark:border-gray-600 border-t-gray-900 dark:border-t-brand-500 rounded-full animate-spin" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <svg class="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-700 dark:text-red-300">{{ error }}</p>
      </div>

      <!-- Appointment Card -->
      <div v-else-if="appointment">
        <BookingAppointmentCard
          :appointment="appointment"
          :loading="actionLoading"
          :error="actionError"
          @cancel="onCancel"
          @modify="onModify"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <p class="text-gray-600 dark:text-gray-400">Rendez-vous introuvable</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const token = route.params.token as string
const { appointment, loading, error, fetchByToken, cancelByToken, updateByToken } = useAppointment()
const actionLoading = ref(false)
const actionError = ref<string | null>(null)

async function onCancel() {
  actionLoading.value = true
  actionError.value = null
  try {
    await cancelByToken(token)
  } catch (e: any) {
    actionError.value = e?.data?.message ?? 'Erreur lors de l\'annulation'
  } finally {
    actionLoading.value = false
  }
}

async function onModify(data: any) {
  actionLoading.value = true
  actionError.value = null
  try {
    await updateByToken(token, data)
  } catch (e: any) {
    actionError.value = e?.data?.message ?? 'Erreur lors de la modification'
  } finally {
    actionLoading.value = false
  }
}

onMounted(() => fetchByToken(token))
</script>

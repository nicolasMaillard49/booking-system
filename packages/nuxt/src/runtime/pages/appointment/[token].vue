<template>
  <div class="min-h-screen bg-zinc-50">
    <!-- Header -->
    <div class="bg-white border-b border-zinc-200">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-zinc-600" />
          </div>
          <div>
            <h1 class="font-semibold text-zinc-900">Votre rendez-vous</h1>
            <p class="text-sm text-zinc-500">Gérez votre réservation</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-8 h-8 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <UIcon name="i-heroicons-exclamation-circle" class="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p class="text-red-700">{{ error }}</p>
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
        <UIcon name="i-heroicons-calendar-x-mark" class="w-16 h-16 text-zinc-300 mx-auto mb-4" />
        <p class="text-zinc-600">Rendez-vous introuvable</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAppointment } from '../../composables/useAppointment'

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
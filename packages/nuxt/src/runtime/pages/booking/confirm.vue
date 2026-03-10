<template>
  <div class="min-h-screen bg-zinc-50">
    <!-- Header -->
    <div class="bg-white border-b border-zinc-200 sticky top-0 z-10">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 py-4">
        <button
          class="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          @click="bookingStore.goBack()"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          Retour
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <!-- Step Indicator -->
      <div class="flex items-center gap-2 mb-8">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-semibold">✓</div>
          <span class="text-sm font-medium text-zinc-900">Prestation</span>
        </div>
        <div class="flex-1 h-px bg-zinc-900" />
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-semibold">✓</div>
          <span class="text-sm font-medium text-zinc-900">Créneau</span>
        </div>
        <div class="flex-1 h-px bg-zinc-900" />
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-semibold">3</div>
          <span class="text-sm font-medium text-zinc-900">Confirmation</span>
        </div>
      </div>

      <h1 class="text-2xl font-bold text-zinc-900 mb-6">Vos informations</h1>

      <BookingBookingForm
        :service="bookingStore.selectedService!"
        :slot="bookingStore.selectedSlot!"
        :loading="loading"
        :error="error"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBookingStore } from '../../stores/booking'
import { useBookingApi } from '../../composables/useBookingApi'
import { useRuntimeConfig, navigateTo } from '#app'

const bookingStore = useBookingStore()
const api = useBookingApi()
const config = useRuntimeConfig()
const publicPrefix = (config.public.booking as any).publicPrefix
const loading = ref(false)
const error = ref<string | null>(null)

async function onSubmit(formData: any) {
  loading.value = true
  error.value = null
  try {
    const result = await api<{ id: string; status: string; magicToken: string }>(
      '/booking/appointments',
      {
        method: 'POST',
        body: {
          serviceId: bookingStore.selectedService!.id,
          startAt: bookingStore.selectedSlot,
          ...formData,
        },
      },
    )
    bookingStore.setSuccess(result.id, result.magicToken, result.status)
    await navigateTo(`${publicPrefix}/success`)
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}
</script>
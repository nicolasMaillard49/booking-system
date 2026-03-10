<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-xl mx-auto py-10 px-5">
      <button
        class="flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 hover:text-black transition-colors mb-8 cursor-pointer"
        @click="bookingStore.goBack()"
      >
        <UIcon name="i-heroicons-arrow-left" class="text-sm" />
        Retour
      </button>

      <h1 class="text-[22px] font-semibold text-black tracking-[-0.02em] mb-8">Vos informations</h1>

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

<template>
  <div class="max-w-2xl mx-auto py-12 px-4">
    <UButton variant="ghost" icon="i-heroicons-arrow-left" class="mb-6" @click="bookingStore.goBack()">
      Retour
    </UButton>

    <h1 class="text-xl font-bold mb-8">Vos informations</h1>

    <BookingBookingForm
      :service="bookingStore.selectedService!"
      :slot="bookingStore.selectedSlot!"
      :loading="loading"
      :error="error"
      @submit="onSubmit"
    />
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
    bookingStore.setSuccess(result.id, result.magicToken)
    await navigateTo(`${publicPrefix}/success`)
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}
</script>

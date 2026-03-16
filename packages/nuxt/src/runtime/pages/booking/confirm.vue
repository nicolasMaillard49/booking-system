<template>
  <div class="min-h-screen bg-neutral-50 transition-colors dark:bg-black">
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-emerald-200 to-cyan-100 opacity-15 blur-[100px] dark:from-emerald-900 dark:to-cyan-900 dark:opacity-[0.06]" />
    </div>

    <header class="glass sticky top-0 z-40 border-b border-black/5 dark:border-white/5">
      <div class="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
        <button class="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors" @click="bookingStore.goBack()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Retour
        </button>
        <BookingThemeToggle />
      </div>
    </header>

    <div class="relative mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <!-- Step Indicator -->
      <div class="mb-12 flex items-center gap-3">
        <div class="flex flex-col items-center">
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-medium">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
          </div>
          <span class="text-xs text-neutral-500 dark:text-neutral-400 mt-2 hidden sm:block">Prestation</span>
        </div>
        <div class="flex-1 h-px bg-gradient-to-r from-neutral-900 to-neutral-400 dark:from-white dark:to-neutral-600" />
        <div class="flex flex-col items-center">
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-medium">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
          </div>
          <span class="text-xs text-neutral-500 dark:text-neutral-400 mt-2 hidden sm:block">Créneau</span>
        </div>
        <div class="flex-1 h-px bg-gradient-to-r from-neutral-900 to-neutral-400 dark:from-white dark:to-neutral-600" />
        <div class="flex flex-col items-center">
          <div class="flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-neutral-900 dark:ring-white text-neutral-900 dark:text-white text-xs font-semibold">3</div>
          <span class="text-xs font-medium text-neutral-900 dark:text-white mt-2 hidden sm:block">Confirmation</span>
        </div>
      </div>

      <h1 class="mb-8 text-2xl font-bold text-neutral-900 dark:text-white">Vos informations</h1>
      <BookingReservationForm :service="bookingStore.selectedService!" :slot="bookingStore.selectedSlot!" :loading="loading" :error="error" @submit="onSubmit" />
    </div>
    <BookingToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBookingStore } from '../../stores/booking'
import { useRuntimeConfig, navigateTo } from '#app'
const bookingStore = useBookingStore()
const api = useBookingApi()
const config = useRuntimeConfig()
const publicPrefix = (config.public.booking as any).publicPrefix
const loading = ref(false)
const error = ref<string | null>(null)
async function onSubmit(formData: any) {
  loading.value = true; error.value = null
  try {
    const result = await api<{ id: string; status: string; magicToken: string }>('/booking/appointments', { method: 'POST', body: { serviceId: bookingStore.selectedService!.id, startAt: bookingStore.selectedSlot, ...formData } })
    bookingStore.setSuccess(result.id, result.magicToken, result.status)
    await navigateTo(`${publicPrefix}/success`)
  } catch (e: any) { error.value = e?.data?.message ?? 'Une erreur est survenue' } finally { loading.value = false }
}
</script>

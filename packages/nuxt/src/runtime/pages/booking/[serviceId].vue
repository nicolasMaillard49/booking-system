<template>
  <div class="min-h-screen bg-neutral-50 transition-colors dark:bg-black">
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-br from-violet-200 to-blue-100 opacity-15 blur-[120px] dark:from-violet-900 dark:to-blue-900 dark:opacity-[0.06]" />
    </div>

    <header class="glass sticky top-0 z-40 border-b border-black/5 dark:border-white/5">
      <div class="mx-auto flex h-16 max-w-2xl items-center justify-between px-4 sm:px-6">
        <button class="flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white" @click="goBack">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Retour
        </button>
        <BookingThemeToggle />
      </div>
    </header>

    <div class="relative mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div v-if="!bookingStore.selectedService" class="py-20 text-center">
        <p class="text-neutral-400 dark:text-neutral-500 text-sm mb-3">Veuillez d'abord choisir une prestation</p>
        <button class="text-neutral-900 dark:text-white text-sm underline hover:no-underline" @click="goBack">Retourner aux prestations</button>
      </div>

      <div v-else>
        <div class="glass-card mb-10 rounded-2xl p-6">
          <h1 class="text-xl font-bold text-neutral-900 dark:text-white mb-2">{{ bookingStore.selectedService.name }}</h1>
          <div class="flex gap-4">
            <span class="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {{ bookingStore.selectedService.duration }} min
            </span>
            <span v-if="bookingStore.selectedService.isPriceVisible && bookingStore.selectedService.price" class="text-sm text-neutral-500 dark:text-neutral-400">
              {{ formatPrice(bookingStore.selectedService.price) }}
            </span>
          </div>
        </div>
        <BookingSlotPicker :service-id="bookingStore.selectedService.id" @select="onSelectSlot" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBookingStore } from '../../stores/booking'
import { useRuntimeConfig, navigateTo } from '#app'
const bookingStore = useBookingStore()
const config = useRuntimeConfig()
const publicPrefix = (config.public.booking as any).publicPrefix
async function onSelectSlot(slot: string) { bookingStore.selectSlot(slot); await navigateTo(`${publicPrefix}/${bookingStore.selectedService!.id}/confirm`) }
async function goBack() { await navigateTo(publicPrefix) }
function formatPrice(price: number): string { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price) }
</script>

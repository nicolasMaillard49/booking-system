<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <div class="sticky top-0 z-40 bg-white border-b border-gray-200 backdrop-blur-sm">
      <div class="container flex items-center justify-between h-16">
        <button
          class="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          @click="goBack"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux prestations
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container py-12">
      <!-- Error State -->
      <div v-if="!bookingStore.selectedService" class="text-center py-20">
        <div class="w-16 h-16 rounded-xl bg-gray-100 mx-auto mb-4 flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Sélection requise</h2>
        <p class="text-gray-600 mb-6">Veuillez d'abord choisir une prestation</p>
        <button class="btn btn-primary" @click="goBack">
          Choisir une prestation
        </button>
      </div>

      <!-- Booking Flow -->
      <div v-else class="max-w-2xl mx-auto">
        <!-- Service Summary -->
        <div class="mb-10">
          <div class="card p-6 border-2 border-blue-500 bg-blue-50">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ bookingStore.selectedService.name }}</h1>
                <div class="flex gap-4 mt-3 text-sm text-gray-600">
                  <span>{{ bookingStore.selectedService.duration }} min</span>
                  <span v-if="bookingStore.selectedService.isPriceVisible && bookingStore.selectedService.price">
                    {{ formatPrice(bookingStore.selectedService.price) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Slot Picker -->
        <BookingSlotPicker
          :service-id="bookingStore.selectedService.id"
          @select="onSelectSlot"
        />
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

async function onSelectSlot(slot: string) {
  bookingStore.selectSlot(slot)
  await navigateTo(`${publicPrefix}/${bookingStore.selectedService!.id}/confirm`)
}

async function goBack() {
  await navigateTo(publicPrefix)
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}
</script>

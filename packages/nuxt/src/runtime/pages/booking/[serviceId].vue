<template>
  <div class="max-w-2xl mx-auto py-12 px-4">
    <UButton
      variant="ghost"
      icon="i-heroicons-arrow-left"
      class="mb-6"
      @click="goBack"
    >
      Retour
    </UButton>

    <div v-if="!bookingStore.selectedService">
      <UAlert color="orange" title="Veuillez d'abord choisir une prestation" />
    </div>

    <div v-else>
      <h1 class="text-xl font-bold mb-1">{{ bookingStore.selectedService.name }}</h1>
      <p class="text-gray-500 text-sm mb-8">
        Durée : {{ bookingStore.selectedService.duration }} min
      </p>

      <BookingSlotPicker
        :service-id="bookingStore.selectedService.id"
        @select="onSelectSlot"
      />
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
</script>

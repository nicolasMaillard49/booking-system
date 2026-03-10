<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-xl mx-auto py-10 px-5">
      <button
        class="flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 hover:text-black transition-colors mb-8 cursor-pointer"
        @click="goBack"
      >
        <UIcon name="i-heroicons-arrow-left" class="text-sm" />
        Retour aux prestations
      </button>

      <div v-if="!bookingStore.selectedService">
        <UAlert color="orange" variant="soft" icon="i-heroicons-exclamation-triangle" title="Veuillez d'abord choisir une prestation" />
      </div>

      <div v-else>
        <!-- Service info -->
        <div class="mb-8">
          <h1 class="text-[22px] font-semibold text-black tracking-[-0.02em] mb-1.5">{{ bookingStore.selectedService.name }}</h1>
          <div class="flex items-center gap-3 text-[13px] text-neutral-500">
            <span class="flex items-center gap-1.5">
              <UIcon name="i-heroicons-clock" class="text-sm" />
              {{ bookingStore.selectedService.duration }} min
            </span>
            <span v-if="bookingStore.selectedService.isPriceVisible && bookingStore.selectedService.price" class="flex items-center gap-1.5">
              {{ formatPrice(bookingStore.selectedService.price) }}
            </span>
          </div>
        </div>

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

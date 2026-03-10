<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <div class="border-b border-neutral-200">
      <div class="max-w-xl mx-auto px-5 py-10 sm:py-14">
        <div v-if="loading" class="animate-pulse">
          <div class="h-6 w-44 bg-neutral-100 rounded mb-3" />
          <div class="h-4 w-64 bg-neutral-50 rounded" />
        </div>
        <div v-else>
          <h1 class="text-[24px] sm:text-[28px] font-semibold text-black tracking-[-0.02em]">
            {{ settings?.businessName ?? 'Réservation' }}
          </h1>
          <p v-if="settings?.description" class="text-[15px] text-neutral-500 mt-2 leading-relaxed max-w-lg">
            {{ settings.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-xl mx-auto px-5 py-8">
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="bg-white border border-neutral-200 rounded-lg p-5 animate-pulse">
          <div class="h-4 w-36 bg-neutral-100 rounded mb-2" />
          <div class="h-3 w-56 bg-neutral-50 rounded" />
        </div>
      </div>

      <div v-else-if="error">
        <UAlert color="red" variant="soft" :title="error" />
      </div>

      <div v-else>
        <!-- Instructions -->
        <div v-if="settings?.instructions" class="mb-6 p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
          <div class="flex gap-3">
            <UIcon name="i-heroicons-information-circle" class="text-neutral-400 text-lg shrink-0 mt-0.5" />
            <p class="text-[13px] text-neutral-600 leading-relaxed">{{ settings.instructions }}</p>
          </div>
        </div>

        <h2 class="text-[12px] font-medium text-neutral-400 uppercase tracking-wider mb-4">
          Choisissez une prestation
        </h2>

        <div class="space-y-3">
          <BookingServiceCard
            v-for="service in services"
            :key="service.id"
            :service="service"
            @select="onSelectService"
          />
        </div>

        <div v-if="services.length === 0" class="text-center py-16">
          <p class="text-[14px] text-neutral-400">Aucune prestation disponible pour le moment.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useServices } from '../../composables/useServices'
import { useBookingStore } from '../../stores/booking'
import { useBookingApi } from '../../composables/useBookingApi'
import { useRuntimeConfig, navigateTo } from '#app'

const { services, loading, error, fetchServices } = useServices()
const bookingStore = useBookingStore()
const api = useBookingApi()
const config = useRuntimeConfig()
const publicPrefix = (config.public.booking as any).publicPrefix

const settings = ref<any>(null)

async function loadSettings() {
  try {
    settings.value = await api('/booking/settings/public')
  } catch {}
}

async function onSelectService(service: any) {
  bookingStore.selectService(service)
  await navigateTo(`${publicPrefix}/${service.id}`)
}

onMounted(async () => {
  await Promise.all([fetchServices(), loadSettings()])
})
</script>

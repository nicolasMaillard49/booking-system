<template>
  <div class="max-w-2xl mx-auto py-12 px-4">
    <div v-if="loading" class="flex justify-center">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl" />
    </div>

    <div v-else-if="error">
      <UAlert color="red" :title="error" />
    </div>

    <div v-else>
      <h1 class="text-2xl font-bold mb-2">{{ settings?.businessName }}</h1>
      <p v-if="settings?.description" class="text-gray-500 mb-8">
        {{ settings.description }}
      </p>

      <h2 class="text-lg font-semibold mb-4">Choisissez une prestation</h2>

      <div class="space-y-3">
        <BookingServiceCard
          v-for="service in services"
          :key="service.id"
          :service="service"
          @select="onSelectService"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
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

<template>
  <div class="min-h-screen bg-white transition-colors dark:bg-neutral-950">
    <div class="mx-auto max-w-[1176px] px-4 sm:px-6">
      <!-- Business Header -->
      <BookingV2BusinessHeader v-if="fullSettings" :settings="fullSettings" />

      <!-- Tab Bar -->
      <BookingV2TabBar v-model="activeTab" />

      <!-- Tab Content -->
      <div class="py-6" role="tabpanel">
        <BookingV2ServiceList
          v-if="activeTab === 'rdv'"
          :services="services"
          :loading="loading"
          :error="error"
          @select="onSelectService"
        />
        <BookingV2ReviewsTab v-else-if="activeTab === 'avis'" />
        <BookingV2AboutTab v-else-if="activeTab === 'apropos'" :settings="fullSettings" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBookingStore } from '../../stores/booking'
import { useRuntimeConfig, navigateTo } from '#app'

interface PublicSettings {
  businessName?: string
  address?: string | null
  phone?: string | null
  email?: string | null
  description?: string | null
  instructions?: string | null
  autoConfirm?: boolean
  timezone?: string
}

interface ServiceInfo {
  id: string
  name: string
  description: string | null
  duration: number
  price: number | null
  isPriceVisible: boolean
}

const { services, loading, error, fetchServices } = useServices()
const bookingStore = useBookingStore()
const api = useBookingApi()
const config = useRuntimeConfig()
const publicPrefix = (config.public.booking as any).publicPrefix

const activeTab = ref('rdv')
const fullSettings = ref<PublicSettings | null>(null)

async function loadSettings() {
  try {
    fullSettings.value = await api('/booking/settings/public')
  } catch {}
}

async function onSelectService(service: ServiceInfo) {
  bookingStore.selectService(service)
  await navigateTo(`${publicPrefix}/${service.id}`)
}

onMounted(async () => {
  await Promise.all([fetchServices(), loadSettings()])
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative py-20 md:py-32 overflow-hidden">
      <!-- Subtle Background Gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 pointer-events-none" />
      
      <!-- Content -->
      <div class="container relative z-10">
        <div class="max-w-2xl">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 mb-8 animate-fade">
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Prendre rendez-vous</span>
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>

          <!-- Title -->
          <h1 class="text-4xl md:text-5xl font-bold mb-6 animate-in" :style="{ animationDelay: '50ms' }">
            {{ settings?.businessName ?? 'Votre rendez-vous en quelques clics' }}
          </h1>

          <!-- Description -->
          <p v-if="settings?.description" class="text-lg text-gray-600 mb-10 max-w-xl leading-relaxed animate-in" :style="{ animationDelay: '100ms' }">
            {{ settings.description }}
          </p>
          <p v-else class="text-lg text-gray-600 mb-10 max-w-xl leading-relaxed animate-in" :style="{ animationDelay: '100ms' }">
            Découvrez nos prestations et réservez le créneau qui vous convient.
          </p>

          <!-- CTA -->
          <button 
            v-if="services.length > 0"
            @click="document.querySelector('#services').scrollIntoView({ behavior: 'smooth' })"
            class="btn btn-primary animate-in"
            :style="{ animationDelay: '150ms' }"
          >
            Découvrir nos services
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Instructions -->
    <section v-if="settings?.instructions" class="py-12 bg-gray-50 border-b border-gray-200">
      <div class="container max-w-2xl">
        <div class="flex gap-4">
          <div class="w-6 h-6 rounded-lg bg-blue-100 flex-shrink-0 flex items-center justify-center mt-1">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 mb-1">À savoir</h3>
            <p class="text-sm text-gray-600 leading-relaxed">{{ settings.instructions }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-20 md:py-32">
      <div class="container">
        <!-- Section Header -->
        <div class="mb-16 max-w-2xl">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Nos prestations</h2>
          <p class="text-lg text-gray-600">Choisissez la prestation qui répond à vos besoins</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 3" :key="i" class="card h-32 bg-gray-100 animate-pulse" />
        </div>

        <!-- Services Grid -->
        <div v-else-if="services.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <BookingServiceCard
            v-for="(service, index) in services"
            :key="service.id"
            :service="service"
            :data-index="index"
            class="animate-in"
            @select="onSelectService"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div class="w-16 h-16 rounded-lg bg-gray-100 mx-auto mb-4 flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4" />
            </svg>
          </div>
          <p class="text-gray-600">Aucune prestation n'est actuellement disponible.</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section v-if="services.length > 0" class="py-20 bg-gray-50 border-t border-gray-200">
      <div class="container max-w-2xl text-center">
        <h3 class="text-2xl font-bold mb-4">Vous avez des questions ?</h3>
        <p class="text-gray-600 mb-8">Contactez-nous directement pour plus d'informations sur nos prestations.</p>
        <!-- Contact info would go here -->
      </div>
    </section>
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

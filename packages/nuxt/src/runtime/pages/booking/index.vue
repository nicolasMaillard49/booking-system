<template>
  <div class="min-h-screen bg-neutral-50 transition-colors dark:bg-black">
    <!-- Ambient gradient orbs -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-violet-200 to-pink-100 opacity-20 blur-[100px] dark:from-violet-900 dark:to-pink-900 dark:opacity-[0.07]" />
      <div class="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-tr from-blue-200 to-cyan-100 opacity-20 blur-[100px] dark:from-blue-900 dark:to-cyan-900 dark:opacity-[0.07]" />
    </div>

    <!-- Header -->
    <header class="glass sticky top-0 z-40 border-b border-black/5 dark:border-white/5">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <span class="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white">
          {{ settings?.businessName ?? 'Réservation' }}
        </span>
        <BookingThemeToggle />
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative py-24 md:py-36">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="max-w-2xl">
          <div class="mb-6 h-1 w-16 rounded-full bg-gradient-to-r from-neutral-900 to-neutral-400 dark:from-white dark:to-neutral-600" />
          <h1 class="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-5xl lg:text-6xl">
            {{ settings?.businessName ?? 'Votre rendez-vous en quelques clics' }}
          </h1>
          <p class="mt-6 max-w-xl text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
            {{ settings?.description ?? 'Découvrez nos prestations et réservez le créneau qui vous convient.' }}
          </p>
          <button
            v-if="services.length > 0"
            class="btn-premium mt-10 inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-semibold"
            @click="scrollToServices"
          >
            Découvrir nos services
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Instructions -->
    <section v-if="settings?.instructions" class="relative border-t border-black/5 py-10 dark:border-white/5">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="glass-card rounded-2xl p-6">
          <div class="flex gap-4">
            <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-white/5">
              <svg class="h-4 w-4 text-neutral-600 dark:text-neutral-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-neutral-900 dark:text-white">À savoir</h3>
              <p class="mt-1.5 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{{ settings.instructions }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="relative py-20 md:py-32">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="mb-14">
          <div class="mb-4 h-1 w-16 rounded-full bg-gradient-to-r from-neutral-900 to-neutral-400 dark:from-white dark:to-neutral-600" />
          <h2 class="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Nos prestations</h2>
        </div>

        <div v-if="error" class="glass-card rounded-2xl p-5">
          <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <div v-else-if="loading" class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 3" :key="i" class="h-36 animate-pulse rounded-2xl bg-neutral-100 dark:bg-white/5" />
        </div>

        <div v-else-if="services.length > 0" class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <BookingServiceCard
            v-for="service in services"
            :key="service.id"
            :service="service"
            @select="onSelectService"
          />
        </div>

        <div v-else class="py-20 text-center">
          <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-white/5">
            <svg class="h-6 w-6 text-neutral-400 dark:text-neutral-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4" />
            </svg>
          </div>
          <p class="text-sm text-neutral-500">Aucune prestation disponible.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBookingStore } from '../../stores/booking'
import { useRuntimeConfig, navigateTo } from '#app'

const { services, loading, error, fetchServices } = useServices()
const bookingStore = useBookingStore()
const api = useBookingApi()
const config = useRuntimeConfig()
const publicPrefix = (config.public.booking as any).publicPrefix
const settings = ref<any>(null)

async function loadSettings() {
  try { settings.value = await api('/booking/settings/public') } catch {}
}

async function onSelectService(service: any) {
  bookingStore.selectService(service)
  await navigateTo(`${publicPrefix}/${service.id}`)
}

function scrollToServices() {
  document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(async () => {
  await Promise.all([fetchServices(), loadSettings()])
})
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 transition-colors dark:from-black dark:via-neutral-950 dark:to-indigo-950/20">

    <!-- Animated morphing orbs background -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="orb animate-morph animate-float absolute -top-32 -right-32 h-[500px] w-[500px] bg-gradient-to-br from-violet-300/50 to-fuchsia-200/40 dark:from-violet-800/20 dark:to-fuchsia-900/15" />
      <div class="orb animate-morph animate-float-delayed absolute -bottom-40 -left-32 h-[450px] w-[450px] bg-gradient-to-tr from-sky-300/40 to-cyan-200/30 dark:from-sky-800/15 dark:to-cyan-900/10" />
      <div class="orb animate-morph animate-float-slow absolute top-1/2 left-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-indigo-200/30 to-purple-200/20 dark:from-indigo-900/10 dark:to-purple-900/8" />
    </div>

    <!-- Header — Liquid Glass Navbar -->
    <header class="liquid-glass sticky top-0 z-40">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div class="flex items-center gap-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20">
            <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white">
            {{ settings?.businessName ?? 'Réservation' }}
          </span>
        </div>
        <BookingThemeToggle />
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative py-24 md:py-36">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="max-w-2xl">
          <!-- Animated accent line -->
          <div class="mb-6 flex items-center gap-3">
            <div class="h-1 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
            <span class="text-xs font-medium uppercase tracking-widest text-indigo-500 dark:text-indigo-400">Booking</span>
          </div>

          <h1 class="animate-fade-in text-4xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-5xl lg:text-6xl">
            {{ settings?.businessName ?? 'Votre rendez-vous en quelques clics' }}
          </h1>

          <p class="mt-6 max-w-xl animate-fade-in-up text-base leading-relaxed text-neutral-500 dark:text-neutral-400" style="animation-delay: 100ms">
            {{ settings?.description ?? 'Découvrez nos prestations et réservez le créneau qui vous convient.' }}
          </p>

          <div class="mt-10 flex flex-wrap items-center gap-4 animate-fade-in-up" style="animation-delay: 200ms">
            <button
              v-if="services.length > 0"
              class="btn-premium inline-flex items-center gap-2.5 rounded-2xl px-8 py-4 text-sm font-semibold"
              @click="scrollToServices"
            >
              Découvrir nos services
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            <!-- Floating glass stat -->
            <div v-if="services.length > 0" class="liquid-glass rounded-2xl px-5 py-3">
              <p class="text-xs text-neutral-500 dark:text-neutral-400">
                <span class="font-semibold text-neutral-900 dark:text-white">{{ services.length }}</span>
                {{ services.length > 1 ? 'prestations' : 'prestation' }} disponible{{ services.length > 1 ? 's' : '' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Decorative floating glass element -->
      <div class="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block" aria-hidden="true">
        <div class="liquid-glass animate-float h-64 w-64 rounded-[2rem] p-6 opacity-60">
          <div class="h-full w-full rounded-2xl bg-gradient-to-br from-indigo-100/50 to-violet-100/50 dark:from-indigo-900/20 dark:to-violet-900/20" />
        </div>
      </div>
    </section>

    <!-- Instructions -->
    <section v-if="settings?.instructions" class="relative py-6">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="glass-card glass-iridescent rounded-2xl p-6">
          <div class="relative z-10 flex gap-4">
            <div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
              <svg class="h-4 w-4 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
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
    <section id="services" class="relative py-20 md:py-28">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="mb-14">
          <div class="mb-4 flex items-center gap-3">
            <div class="h-1 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
            <span class="text-xs font-medium uppercase tracking-widest text-indigo-500 dark:text-indigo-400">Services</span>
          </div>
          <h2 class="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Nos prestations</h2>
        </div>

        <div class="liquid-glass rounded-3xl p-6 sm:p-8">
          <div v-if="error" class="rounded-2xl bg-red-50/50 p-5 dark:bg-red-500/5">
            <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
          </div>

          <div v-else-if="loading" class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="i in 3" :key="i" class="h-40 animate-pulse rounded-2xl bg-white/40 dark:bg-white/5" />
          </div>

          <div v-else-if="services.length > 0" class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <BookingServiceCard
              v-for="(service, index) in services"
              :key="service.id"
              :service="service"
              :style="{ animationDelay: `${index * 80}ms` }"
              class="animate-fade-in-up"
              @select="onSelectService"
            />
          </div>

          <div v-else class="py-16 text-center">
            <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10">
              <svg class="h-6 w-6 text-indigo-400 dark:text-indigo-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4" />
              </svg>
            </div>
            <p class="text-sm text-neutral-500">Aucune prestation disponible.</p>
          </div>
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

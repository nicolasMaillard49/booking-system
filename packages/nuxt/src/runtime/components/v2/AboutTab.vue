<template>
  <div class="flex flex-col gap-8">
    <!-- Section 1: Où nous trouver (only if address exists) -->
    <section v-if="settings?.address">
      <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">
        Où nous trouver
      </h2>

      <!-- Google Maps iframe -->
      <iframe
        :src="`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`"
        class="mt-4 h-[300px] w-full rounded-xl border border-neutral-200 sm:h-[400px] dark:border-neutral-700"
        title="Localisation"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
      />

      <!-- Contact info -->
      <div class="mt-4 flex items-center gap-3">
        <svg class="h-4 w-4 flex-shrink-0 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        <span class="text-sm text-neutral-600 dark:text-neutral-400">{{ settings.address }}</span>
      </div>

      <div v-if="settings.phone" class="mt-2 flex items-center gap-3">
        <svg class="h-4 w-4 flex-shrink-0 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
        <a :href="`tel:${settings.phone}`" class="text-sm text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">
          {{ settings.phone }}
        </a>
      </div>

      <div v-if="settings.email" class="mt-2 flex items-center gap-3">
        <svg class="h-4 w-4 flex-shrink-0 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
        <a :href="`mailto:${settings.email}`" class="text-sm text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200">
          {{ settings.email }}
        </a>
      </div>
    </section>

    <!-- Section 2: Horaires d'ouverture -->
    <section>
      <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">
        Horaires d'ouverture
      </h2>

      <div v-if="loading" class="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
        Chargement...
      </div>

      <div v-else class="mt-4">
        <div
          v-for="day in 7"
          :key="day - 1"
          class="flex justify-between py-2.5"
          :class="day < 7 ? 'border-b border-neutral-100 dark:border-neutral-800' : ''"
        >
          <span class="text-sm text-neutral-600 dark:text-neutral-400">
            {{ formatDay(day - 1) }}
          </span>
          <span
            class="text-sm font-medium"
            :class="getDaySchedule(day - 1) === 'Fermé'
              ? 'text-neutral-400'
              : 'text-neutral-900 dark:text-white'"
          >
            {{ getDaySchedule(day - 1) }}
          </span>
        </div>
      </div>
    </section>

    <!-- Section 3: Présentation (only if description exists) -->
    <section v-if="settings?.description">
      <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">
        Présentation
      </h2>
      <p class="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {{ settings.description }}
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  settings: {
    businessName?: string
    address?: string | null
    phone?: string | null
    email?: string | null
    description?: string | null
  } | null
}>()

const { loading, fetchHours, formatDay, getDaySchedule } = useAvailabilityHours()

onMounted(() => {
  fetchHours()
})
</script>

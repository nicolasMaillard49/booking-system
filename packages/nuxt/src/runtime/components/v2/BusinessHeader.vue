<template>
  <header class="pt-8 pb-6">
    <!-- Top row: business name + theme toggle -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-neutral-900 dark:text-white">
        {{ settings.businessName }}
      </h1>
      <BookingThemeToggle />
    </div>

    <!-- Address -->
    <div v-if="settings.address" class="mt-3 flex items-center gap-1.5">
      <svg class="h-4 w-4 flex-shrink-0 text-neutral-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
      <span class="text-sm text-neutral-500 dark:text-neutral-400">{{ settings.address }}</span>
    </div>

    <!-- Phone -->
    <div v-if="settings.phone" class="mt-1.5 flex items-center gap-1.5">
      <svg class="h-4 w-4 flex-shrink-0 text-neutral-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
      <a :href="`tel:${settings.phone}`" class="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200">
        {{ settings.phone }}
      </a>
    </div>

    <!-- Description -->
    <p v-if="settings.description" class="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
      {{ settings.description }}
    </p>

    <!-- Subtitle badge -->
    <div class="mt-4">
      <span
        class="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs dark:bg-neutral-800"
      >
        <span
          class="h-1.5 w-1.5 rounded-full"
          :class="settings.autoConfirm ? 'bg-green-500' : 'bg-orange-500'"
        />
        <span class="text-neutral-600 dark:text-neutral-300">
          {{ settings.autoConfirm
            ? 'Réservation en ligne - Confirmation immédiate'
            : 'Réservation en ligne - Confirmation sous 24h'
          }}
        </span>
      </span>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  settings: {
    businessName: string
    address?: string
    phone?: string
    email?: string
    description?: string
    autoConfirm: boolean
  }
}>()
</script>

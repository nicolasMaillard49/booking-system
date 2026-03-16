<template>
  <div>
    <!-- Error state -->
    <div
      v-if="error"
      class="rounded-xl bg-red-50 p-4 dark:bg-red-500/10"
    >
      <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <!-- Loading state -->
    <div v-else-if="loading" class="flex flex-col gap-4">
      <div
        v-for="i in 3"
        :key="i"
        class="h-20 animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-800"
      />
    </div>

    <!-- Empty state -->
    <div v-else-if="services.length === 0" class="py-16 text-center">
      <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center">
        <svg
          class="h-10 w-10 text-neutral-300 dark:text-neutral-600"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
        >
          <!-- Calendar body -->
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
          <!-- X mark -->
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10 14l4 4m0-4l-4 4"
          />
        </svg>
      </div>
      <p class="text-sm text-neutral-500">Aucune prestation disponible.</p>
    </div>

    <!-- Service cards -->
    <div v-else class="flex flex-col gap-4">
      <BookingV2ServiceCardV2
        v-for="(service, index) in services"
        :key="service.id"
        :service="service"
        :style="{ animationDelay: `${index * 60}ms` }"
        class="animate-fade-in-up"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  services: Array<{
    id: string
    name: string
    description: string | null
    duration: number
    price: number | null
    isPriceVisible: boolean
  }>
  loading: boolean
  error: string | null
}>()

defineEmits<{ select: [service: any] }>()
</script>

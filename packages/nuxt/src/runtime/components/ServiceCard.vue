<template>
  <div
    class="glass-card group cursor-pointer rounded-2xl p-6"
    @click="$emit('select', service)"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0 flex-1">
        <h3 class="text-[15px] font-semibold tracking-tight text-neutral-900 dark:text-white">
          {{ service.name }}
        </h3>
        <p v-if="service.description" class="mt-2 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
          {{ service.description }}
        </p>
        <div class="mt-4 flex items-center gap-3">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 dark:bg-white/5 dark:text-neutral-400">
            <svg class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ service.duration }} min
          </span>
          <span v-if="service.isPriceVisible && service.price" class="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 dark:bg-white/5 dark:text-neutral-400">
            {{ formatPrice(service.price) }}
          </span>
        </div>
      </div>
      <div class="flex flex-shrink-0 items-center">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 transition-all duration-300 group-hover:bg-neutral-900 dark:bg-white/5 dark:group-hover:bg-white">
          <svg class="h-4 w-4 text-neutral-400 transition-all duration-300 group-hover:text-white dark:text-neutral-500 dark:group-hover:text-black" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  service: {
    id: string
    name: string
    description: string | null
    duration: number
    price: number | null
    isPriceVisible: boolean
  }
}>()

defineEmits<{ select: [service: any] }>()

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}
</script>

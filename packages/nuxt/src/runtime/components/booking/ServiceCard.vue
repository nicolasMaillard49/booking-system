<template>
  <div
    class="card group cursor-pointer border-2 transition-all hover:border-blue-500 hover:shadow-lg"
    @click="$emit('select', service)"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1">
        <!-- Service Name -->
        <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {{ service.name }}
        </h3>

        <!-- Description -->
        <p v-if="service.description" class="text-sm text-gray-600 mt-2 line-clamp-2">
          {{ service.description }}
        </p>

        <!-- Meta Info -->
        <div class="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
          <span class="flex items-center gap-1.5 font-medium">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ service.duration }} min
          </span>
          <span v-if="service.isPriceVisible && service.price" class="font-semibold text-gray-900">
            {{ formatPrice(service.price) }}
          </span>
        </div>
      </div>

      <!-- Arrow -->
      <div class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:border-blue-600 group-hover:bg-blue-600 transition-all">
        <svg class="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
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

defineEmits<{
  select: [service: any]
}>()

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}
</script>

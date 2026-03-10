<template>
  <div
    class="border rounded-xl p-4 cursor-pointer hover:border-primary-500 hover:shadow-sm transition-all"
    @click="$emit('select', service)"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1">
        <h3 class="font-semibold text-gray-900">{{ service.name }}</h3>
        <p v-if="service.description" class="text-sm text-gray-500 mt-1">
          {{ service.description }}
        </p>
      </div>

      <div class="text-right shrink-0">
        <div class="text-sm text-gray-500">{{ service.duration }} min</div>
        <div v-if="service.isPriceVisible && service.price" class="font-semibold mt-1">
          {{ formatPrice(service.price) }}
        </div>
      </div>
    </div>

    <div class="flex justify-end mt-3">
      <UIcon name="i-heroicons-arrow-right" class="text-primary-500" />
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

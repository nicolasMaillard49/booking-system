<template>
  <div
    class="border border-neutral-200 rounded-lg p-5 cursor-pointer hover:border-black transition-colors duration-200 group"
    @click="$emit('select', service)"
  >
    <div class="flex items-center justify-between gap-4">
      <div class="flex-1 min-w-0">
        <h3 class="text-[14px] font-semibold text-black group-hover:text-black">
          {{ service.name }}
        </h3>
        <p v-if="service.description" class="text-[13px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
          {{ service.description }}
        </p>
        <div class="flex items-center gap-3 mt-3">
          <span class="text-[12px] font-medium text-neutral-500">
            {{ service.duration }} min
          </span>
          <span
            v-if="service.isPriceVisible && service.price"
            class="text-[12px] font-semibold text-black"
          >
            {{ formatPrice(service.price) }}
          </span>
        </div>
      </div>

      <div class="w-8 h-8 rounded-full border border-neutral-200 group-hover:border-black group-hover:bg-black flex items-center justify-center shrink-0 transition-all duration-200">
        <UIcon name="i-heroicons-chevron-right" class="text-neutral-400 group-hover:text-white text-sm transition-colors duration-200" />
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

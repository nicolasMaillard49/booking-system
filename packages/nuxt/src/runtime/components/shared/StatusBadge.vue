<template>
  <span
    class="inline-flex items-center font-medium rounded-full transition-colors"
    :class="[sizeClasses, colorClasses]"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AppointmentStatus } from '@booking/shared'

const props = defineProps<{
  status: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}>()

const config: Record<string, { label: string; bg: string; text: string }> = {
  [AppointmentStatus.PENDING]: { label: 'En attente', bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' },
  [AppointmentStatus.CONFIRMED]: { label: 'Confirmé', bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300' },
  [AppointmentStatus.CANCELLED]: { label: 'Annulé', bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-500 dark:text-gray-400' },
  [AppointmentStatus.REJECTED]: { label: 'Refusé', bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
  [AppointmentStatus.COMPLETED]: { label: 'Terminé', bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  [AppointmentStatus.NO_SHOW]: { label: 'No show', bg: 'bg-orange-50 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' },
}

const sizeMap: Record<string, string> = {
  xs: 'text-[11px] px-2 py-0.5',
  sm: 'text-[12px] px-2.5 py-0.5',
  md: 'text-[13px] px-3 py-1',
  lg: 'text-[14px] px-3.5 py-1',
}

const label = computed(() => config[props.status]?.label ?? props.status)
const colorClasses = computed(() => {
  const c = config[props.status]
  return c ? `${c.bg} ${c.text}` : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
})
const sizeClasses = computed(() => sizeMap[props.size ?? 'sm'])
</script>

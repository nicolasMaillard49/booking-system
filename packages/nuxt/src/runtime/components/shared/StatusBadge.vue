<template>
  <span
    class="inline-flex items-center font-medium rounded-full"
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
  [AppointmentStatus.PENDING]: { label: 'En attente', bg: 'bg-amber-50', text: 'text-amber-700' },
  [AppointmentStatus.CONFIRMED]: { label: 'Confirmé', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  [AppointmentStatus.CANCELLED]: { label: 'Annulé', bg: 'bg-neutral-100', text: 'text-neutral-500' },
  [AppointmentStatus.REJECTED]: { label: 'Refusé', bg: 'bg-red-50', text: 'text-red-600' },
  [AppointmentStatus.COMPLETED]: { label: 'Terminé', bg: 'bg-blue-50', text: 'text-blue-700' },
  [AppointmentStatus.NO_SHOW]: { label: 'No show', bg: 'bg-orange-50', text: 'text-orange-700' },
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
  return c ? `${c.bg} ${c.text}` : 'bg-neutral-100 text-neutral-500'
})
const sizeClasses = computed(() => sizeMap[props.size ?? 'sm'])
</script>

<template>
  <UBadge :color="color" :size="size">
    {{ label }}
  </UBadge>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AppointmentStatus } from '@booking/shared'

const props = defineProps<{
  status: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}>()

const config: Record<string, { label: string; color: string }> = {
  [AppointmentStatus.PENDING]: { label: 'En attente', color: 'yellow' },
  [AppointmentStatus.CONFIRMED]: { label: 'Confirmé', color: 'green' },
  [AppointmentStatus.CANCELLED]: { label: 'Annulé', color: 'gray' },
  [AppointmentStatus.REJECTED]: { label: 'Refusé', color: 'red' },
  [AppointmentStatus.COMPLETED]: { label: 'Terminé', color: 'blue' },
  [AppointmentStatus.NO_SHOW]: { label: 'No show', color: 'orange' },
}

const label = computed(() => config[props.status]?.label ?? props.status)
const color = computed(() => config[props.status]?.color ?? 'gray')
</script>

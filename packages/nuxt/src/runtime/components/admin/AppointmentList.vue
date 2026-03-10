<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b text-left text-gray-500">
          <th class="pb-3 pr-4">Client</th>
          <th class="pb-3 pr-4">Prestation</th>
          <th class="pb-3 pr-4">Date</th>
          <th class="pb-3 pr-4">Statut</th>
          <th class="pb-3"></th>
        </tr>
      </thead>
      <tbody class="divide-y">
        <tr
          v-for="appt in appointments"
          :key="appt.id"
          class="hover:bg-gray-50 cursor-pointer"
          @click="$emit('select', appt.id)"
        >
          <td class="py-3 pr-4">
            <div class="font-medium">{{ appt.clientFirstName }} {{ appt.clientLastName }}</div>
            <div class="text-gray-400 text-xs">{{ appt.clientEmail }}</div>
          </td>
          <td class="py-3 pr-4 text-gray-600">{{ appt.serviceName }}</td>
          <td class="py-3 pr-4 text-gray-600">{{ formatDateTime(appt.startAt) }}</td>
          <td class="py-3 pr-4">
            <BookingSharedStatusBadge :status="appt.status" />
          </td>
          <td class="py-3">
            <UIcon name="i-heroicons-chevron-right" class="text-gray-400" />
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="appointments.length === 0" class="text-center py-12 text-gray-400">
      Aucun rendez-vous trouvé
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AppointmentSummary } from '@booking/shared'

defineProps<{
  appointments: AppointmentSummary[]
}>()

defineEmits<{
  select: [id: string]
}>()

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}
</script>

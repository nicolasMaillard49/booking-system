<template>
  <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
    <table class="w-full text-[13px]">
      <thead>
        <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <th class="py-3 px-5 text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Client</th>
          <th class="py-3 px-5 text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Prestation</th>
          <th class="py-3 px-5 text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Date</th>
          <th class="py-3 px-5 text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Statut</th>
          <th class="py-3 px-5"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="appt in appointments"
          :key="appt.id"
          class="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          @click="$emit('select', appt.id)"
        >
          <td class="py-3.5 px-5">
            <div class="font-medium text-gray-900 dark:text-gray-100">{{ appt.clientFirstName }} {{ appt.clientLastName }}</div>
            <div class="text-gray-400 dark:text-gray-500 text-[12px]">{{ appt.clientEmail }}</div>
          </td>
          <td class="py-3.5 px-5 text-gray-600 dark:text-gray-400">{{ appt.serviceName }}</td>
          <td class="py-3.5 px-5 text-gray-600 dark:text-gray-400">{{ formatDateTime(appt.startAt) }}</td>
          <td class="py-3.5 px-5">
            <BookingSharedStatusBadge :status="appt.status" size="xs" />
          </td>
          <td class="py-3.5 px-5">
            <svg class="w-5 h-5 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="appointments.length === 0" class="text-center py-16 text-gray-400 dark:text-gray-500 text-[13px]">
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

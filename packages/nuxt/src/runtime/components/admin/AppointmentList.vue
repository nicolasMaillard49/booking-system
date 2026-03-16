<template>
  <div class="bg-white border border-neutral-200 rounded-lg overflow-hidden">
    <table class="w-full text-[13px]">
      <thead>
        <tr class="border-b border-neutral-200 bg-neutral-50">
          <th class="py-3 px-5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Client</th>
          <th class="py-3 px-5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Prestation</th>
          <th class="py-3 px-5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Date</th>
          <th class="py-3 px-5 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Statut</th>
          <th class="py-3 px-5"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="appt in appointments"
          :key="appt.id"
          class="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 cursor-pointer transition-colors"
          @click="$emit('select', appt.id)"
        >
          <td class="py-3.5 px-5">
            <div class="font-medium text-black">{{ appt.clientFirstName }} {{ appt.clientLastName }}</div>
            <div class="text-neutral-400 text-[12px]">{{ appt.clientEmail }}</div>
          </td>
          <td class="py-3.5 px-5 text-neutral-600">{{ appt.serviceName }}</td>
          <td class="py-3.5 px-5 text-neutral-600">{{ formatDateTime(appt.startAt) }}</td>
          <td class="py-3.5 px-5">
            <BookingSharedStatusBadge :status="appt.status" size="xs" />
          </td>
          <td class="py-3.5 px-5">
            <svg class="w-5 h-5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="appointments.length === 0" class="text-center py-16 text-neutral-400 text-[13px]">
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

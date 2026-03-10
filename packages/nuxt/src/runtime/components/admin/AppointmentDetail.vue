<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-[22px] font-semibold text-black tracking-[-0.02em]">
          {{ appointment.clientFirstName }} {{ appointment.clientLastName }}
        </h1>
        <p class="text-[13px] text-neutral-500 mt-1">{{ formatDateTime(appointment.startAt) }}</p>
      </div>
      <BookingSharedStatusBadge :status="appointment.status" size="md" />
    </div>

    <!-- Infos client -->
    <div class="bg-white border border-neutral-200 rounded-lg p-5">
      <h2 class="text-[13px] font-semibold text-black mb-4">Informations client</h2>
      <dl class="grid grid-cols-2 gap-4 text-[13px]">
        <div>
          <dt class="text-neutral-400 mb-0.5">Email</dt>
          <dd class="font-medium text-black">{{ appointment.clientEmail }}</dd>
        </div>
        <div>
          <dt class="text-neutral-400 mb-0.5">Téléphone</dt>
          <dd class="font-medium text-black">{{ appointment.clientPhone }}</dd>
        </div>
        <div>
          <dt class="text-neutral-400 mb-0.5">Prestation</dt>
          <dd class="font-medium text-black">{{ appointment.serviceName }}</dd>
        </div>
        <div>
          <dt class="text-neutral-400 mb-0.5">Confirmé auto</dt>
          <dd class="font-medium text-black">{{ appointment.autoConfirmed ? 'Oui' : 'Non' }}</dd>
        </div>
      </dl>
    </div>

    <!-- Notes client -->
    <div v-if="appointment.clientNotes" class="bg-white border border-neutral-200 rounded-lg p-5">
      <h2 class="text-[13px] font-semibold text-black mb-3">Notes du client</h2>
      <p class="text-[13px] text-neutral-600 leading-relaxed">{{ appointment.clientNotes }}</p>
    </div>

    <!-- Champs custom -->
    <div v-if="appointment.customFieldValues?.length" class="bg-white border border-neutral-200 rounded-lg p-5">
      <h2 class="text-[13px] font-semibold text-black mb-4">Informations complémentaires</h2>
      <dl class="space-y-3 text-[13px]">
        <div v-for="cfv in appointment.customFieldValues" :key="cfv.key">
          <dt class="text-neutral-400 mb-0.5">{{ cfv.label }}</dt>
          <dd class="font-medium text-black">{{ cfv.value }}</dd>
        </div>
      </dl>
    </div>

    <!-- Motif de refus -->
    <div v-if="appointment.rejectionReason" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-[12px] font-medium text-red-600 mb-1">Motif de refus</p>
      <p class="text-[13px] text-red-700">{{ appointment.rejectionReason }}</p>
    </div>

    <!-- Actions -->
    <div class="flex flex-wrap gap-2" v-if="canAct">
      <button
        v-if="appointment.status === 'PENDING'"
        class="px-4 py-2 text-[13px] font-medium bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
        :disabled="actionLoading"
        @click="$emit('confirm')"
      >
        Confirmer
      </button>

      <button
        v-if="appointment.status === 'PENDING'"
        class="px-4 py-2 text-[13px] font-medium border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
        :disabled="actionLoading"
        @click="showRejectModal = true"
      >
        Refuser
      </button>

      <button
        v-if="appointment.status === 'CONFIRMED'"
        class="px-4 py-2 text-[13px] font-medium border border-neutral-200 text-black rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-50"
        :disabled="actionLoading"
        @click="$emit('complete')"
      >
        Marquer terminé
      </button>

      <button
        v-if="appointment.status === 'CONFIRMED'"
        class="px-4 py-2 text-[13px] font-medium border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer disabled:opacity-50"
        :disabled="actionLoading"
        @click="$emit('no-show')"
      >
        No show
      </button>

      <button
        class="px-4 py-2 text-[13px] font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        :disabled="actionLoading"
        @click="showDeleteConfirm = true"
      >
        Supprimer
      </button>
    </div>

    <!-- Modal refus -->
    <UModal v-model="showRejectModal">
      <UCard>
        <template #header>
          <h3 class="text-[15px] font-semibold text-black">Refuser le rendez-vous</h3>
        </template>
        <div class="space-y-4">
          <UFormGroup label="Motif (optionnel)">
            <UTextarea v-model="rejectReason" placeholder="Expliquez le motif du refus..." />
          </UFormGroup>
          <UFormGroup label="Proposer un autre créneau (optionnel)">
            <UInput v-model="alternativeSlot" type="datetime-local" />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex gap-3 justify-end">
            <UButton variant="ghost" @click="showRejectModal = false">Annuler</UButton>
            <UButton color="red" @click="onReject">Confirmer le refus</UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Modal suppression -->
    <UModal v-model="showDeleteConfirm">
      <UCard>
        <template #header>
          <h3 class="text-[15px] font-semibold text-black">Supprimer le rendez-vous</h3>
        </template>
        <p class="text-[13px] text-neutral-600">Cette action est irréversible.</p>
        <template #footer>
          <div class="flex gap-3 justify-end">
            <UButton variant="ghost" @click="showDeleteConfirm = false">Annuler</UButton>
            <UButton color="red" @click="$emit('delete'); showDeleteConfirm = false">
              Supprimer
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AppointmentDetail } from '@booking/shared'

const props = defineProps<{
  appointment: AppointmentDetail
  actionLoading?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  reject: [data: { reason?: string; alternativeSlot?: string }]
  complete: []
  'no-show': []
  delete: []
}>()

const showRejectModal = ref(false)
const showDeleteConfirm = ref(false)
const rejectReason = ref('')
const alternativeSlot = ref('')

const canAct = computed(() =>
  ['PENDING', 'CONFIRMED'].includes(props.appointment.status)
)

function onReject() {
  emit('reject', {
    reason: rejectReason.value || undefined,
    alternativeSlot: alternativeSlot.value || undefined,
  })
  showRejectModal.value = false
}

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short',
  })
}
</script>

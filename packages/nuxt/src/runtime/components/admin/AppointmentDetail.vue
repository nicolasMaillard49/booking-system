<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-[22px] font-semibold text-gray-900 dark:text-gray-100 tracking-[-0.02em]">
          {{ appointment.clientFirstName }} {{ appointment.clientLastName }}
        </h1>
        <p class="text-[13px] text-neutral-500 dark:text-neutral-400 mt-1">{{ formatDateTime(appointment.startAt) }}</p>
      </div>
      <BookingSharedStatusBadge :status="appointment.status" size="md" />
    </div>

    <!-- Infos client -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
      <h2 class="text-[13px] font-semibold text-gray-900 dark:text-gray-100 mb-4">Informations client</h2>
      <dl class="grid grid-cols-2 gap-4 text-[13px]">
        <div>
          <dt class="text-neutral-400 dark:text-neutral-500 mb-0.5">Email</dt>
          <dd class="font-medium text-gray-900 dark:text-gray-100">{{ appointment.clientEmail }}</dd>
        </div>
        <div>
          <dt class="text-neutral-400 dark:text-neutral-500 mb-0.5">Téléphone</dt>
          <dd class="font-medium text-gray-900 dark:text-gray-100">{{ appointment.clientPhone }}</dd>
        </div>
        <div>
          <dt class="text-neutral-400 dark:text-neutral-500 mb-0.5">Prestation</dt>
          <dd class="font-medium text-gray-900 dark:text-gray-100">{{ appointment.serviceName }}</dd>
        </div>
        <div>
          <dt class="text-neutral-400 dark:text-neutral-500 mb-0.5">Confirmé auto</dt>
          <dd class="font-medium text-gray-900 dark:text-gray-100">{{ appointment.autoConfirmed ? 'Oui' : 'Non' }}</dd>
        </div>
      </dl>
    </div>

    <!-- Notes client -->
    <div v-if="appointment.clientNotes" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
      <h2 class="text-[13px] font-semibold text-gray-900 dark:text-gray-100 mb-3">Notes du client</h2>
      <p class="text-[13px] text-neutral-600 dark:text-neutral-400 leading-relaxed">{{ appointment.clientNotes }}</p>
    </div>

    <!-- Champs custom -->
    <div v-if="appointment.customFieldValues?.length" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
      <h2 class="text-[13px] font-semibold text-gray-900 dark:text-gray-100 mb-4">Informations complémentaires</h2>
      <dl class="space-y-3 text-[13px]">
        <div v-for="cfv in appointment.customFieldValues" :key="cfv.key">
          <dt class="text-neutral-400 dark:text-neutral-500 mb-0.5">{{ cfv.label }}</dt>
          <dd class="font-medium text-gray-900 dark:text-gray-100">{{ cfv.value }}</dd>
        </div>
      </dl>
    </div>

    <!-- Motif de refus -->
    <div v-if="appointment.rejectionReason" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <p class="text-[12px] font-medium text-red-600 dark:text-red-400 mb-1">Motif de refus</p>
      <p class="text-[13px] text-red-700 dark:text-red-300">{{ appointment.rejectionReason }}</p>
    </div>

    <!-- Actions -->
    <div class="flex flex-wrap gap-2" v-if="canAct">
      <button
        v-if="appointment.status === 'PENDING'"
        class="px-4 py-2 text-[13px] font-medium bg-gray-900 dark:bg-brand-500 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-brand-600 transition-colors cursor-pointer disabled:opacity-50"
        :disabled="actionLoading"
        @click="$emit('confirm')"
      >
        Confirmer
      </button>

      <button
        v-if="appointment.status === 'PENDING'"
        class="px-4 py-2 text-[13px] font-medium border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer disabled:opacity-50"
        :disabled="actionLoading"
        @click="showRejectModal = true"
      >
        Refuser
      </button>

      <button
        v-if="appointment.status === 'CONFIRMED'"
        class="px-4 py-2 text-[13px] font-medium border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50"
        :disabled="actionLoading"
        @click="$emit('complete')"
      >
        Marquer terminé
      </button>

      <button
        v-if="appointment.status === 'CONFIRMED'"
        class="px-4 py-2 text-[13px] font-medium border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors cursor-pointer disabled:opacity-50"
        :disabled="actionLoading"
        @click="$emit('no-show')"
      >
        No show
      </button>

      <button
        class="px-4 py-2 text-[13px] font-medium text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        :disabled="actionLoading"
        @click="showDeleteConfirm = true"
      >
        Supprimer
      </button>
    </div>

    <!-- Modal refus -->
    <BookingSharedBaseModal v-model="showRejectModal" title="Refuser le rendez-vous">
      <div class="space-y-4">
        <div>
          <label class="block text-[13px] font-medium text-gray-900 dark:text-gray-100 mb-1.5">
            Motif (optionnel)
          </label>
          <textarea
            v-model="rejectReason"
            placeholder="Expliquez le motif du refus..."
            class="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-brand-500 focus:border-transparent transition-all text-sm"
            rows="4"
          />
        </div>
        <div>
          <label class="block text-[13px] font-medium text-gray-900 dark:text-gray-100 mb-1.5">
            Proposer un autre créneau (optionnel)
          </label>
          <input
            v-model="alternativeSlot"
            type="datetime-local"
            class="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-brand-500 focus:border-transparent transition-all text-sm"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <button
            class="px-4 py-2 text-[13px] font-medium border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            @click="showRejectModal = false"
          >
            Annuler
          </button>
          <button
            class="px-4 py-2 text-[13px] font-medium bg-red-600 dark:bg-red-600 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-700 transition-colors cursor-pointer"
            @click="onReject"
          >
            Confirmer le refus
          </button>
        </div>
      </template>
    </BookingSharedBaseModal>

    <!-- Modal suppression -->
    <BookingSharedBaseModal v-model="showDeleteConfirm" title="Supprimer le rendez-vous">
      <p class="text-[13px] text-gray-600 dark:text-gray-400">Cette action est irréversible.</p>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <button
            class="px-4 py-2 text-[13px] font-medium border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            @click="showDeleteConfirm = false"
          >
            Annuler
          </button>
          <button
            class="px-4 py-2 text-[13px] font-medium bg-red-600 dark:bg-red-600 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-700 transition-colors cursor-pointer"
            @click="$emit('delete'); showDeleteConfirm = false"
          >
            Supprimer
          </button>
        </div>
      </template>
    </BookingSharedBaseModal>
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

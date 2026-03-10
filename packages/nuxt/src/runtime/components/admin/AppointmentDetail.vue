<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold">
          {{ appointment.clientFirstName }} {{ appointment.clientLastName }}
        </h1>
        <p class="text-gray-500 mt-1">{{ formatDateTime(appointment.startAt) }}</p>
      </div>
      <BookingSharedStatusBadge :status="appointment.status" size="lg" />
    </div>

    <!-- Infos client -->
    <UCard>
      <template #header>
        <h2 class="font-semibold">Informations client</h2>
      </template>
      <dl class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt class="text-gray-500">Email</dt>
          <dd class="font-medium">{{ appointment.clientEmail }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">Téléphone</dt>
          <dd class="font-medium">{{ appointment.clientPhone }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">Prestation</dt>
          <dd class="font-medium">{{ appointment.serviceName }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">Confirmé auto</dt>
          <dd class="font-medium">{{ appointment.autoConfirmed ? 'Oui' : 'Non' }}</dd>
        </div>
      </dl>
    </UCard>

    <!-- Notes client -->
    <UCard v-if="appointment.clientNotes">
      <template #header>
        <h2 class="font-semibold">Notes du client</h2>
      </template>
      <p class="text-sm text-gray-700">{{ appointment.clientNotes }}</p>
    </UCard>

    <!-- Champs custom -->
    <UCard v-if="appointment.customFieldValues?.length">
      <template #header>
        <h2 class="font-semibold">Informations complémentaires</h2>
      </template>
      <dl class="space-y-3 text-sm">
        <div v-for="cfv in appointment.customFieldValues" :key="cfv.key">
          <dt class="text-gray-500">{{ cfv.label }}</dt>
          <dd class="font-medium">{{ cfv.value }}</dd>
        </div>
      </dl>
    </UCard>

    <!-- Motif de refus -->
    <UAlert
      v-if="appointment.rejectionReason"
      color="red"
      title="Motif de refus"
      :description="appointment.rejectionReason"
    />

    <!-- Actions -->
    <div class="flex flex-wrap gap-3" v-if="canAct">
      <UButton
        v-if="appointment.status === 'PENDING'"
        color="green"
        icon="i-heroicons-check"
        :loading="actionLoading"
        @click="$emit('confirm')"
      >
        Confirmer
      </UButton>

      <UButton
        v-if="appointment.status === 'PENDING'"
        color="red"
        variant="outline"
        icon="i-heroicons-x-mark"
        :loading="actionLoading"
        @click="showRejectModal = true"
      >
        Refuser
      </UButton>

      <UButton
        v-if="appointment.status === 'CONFIRMED'"
        color="primary"
        variant="outline"
        icon="i-heroicons-check-circle"
        :loading="actionLoading"
        @click="$emit('complete')"
      >
        Marquer terminé
      </UButton>

      <UButton
        v-if="appointment.status === 'CONFIRMED'"
        color="orange"
        variant="outline"
        icon="i-heroicons-user-minus"
        :loading="actionLoading"
        @click="$emit('no-show')"
      >
        No show
      </UButton>

      <UButton
        color="red"
        variant="ghost"
        icon="i-heroicons-trash"
        :loading="actionLoading"
        @click="showDeleteConfirm = true"
      >
        Supprimer
      </UButton>
    </div>

    <!-- Modal refus -->
    <UModal v-model="showRejectModal">
      <UCard>
        <template #header>
          <h3 class="font-semibold">Refuser le rendez-vous</h3>
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
          <h3 class="font-semibold">Supprimer le rendez-vous</h3>
        </template>
        <p class="text-sm text-gray-600">Cette action est irréversible.</p>
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

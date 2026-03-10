<template>
  <div class="space-y-6">
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-xl font-bold">Votre rendez-vous</h1>
        <p class="text-gray-500 mt-1">{{ formatDateTime(appointment.startAt) }}</p>
      </div>
      <BookingSharedStatusBadge :status="appointment.status" />
    </div>

    <UCard>
      <dl class="space-y-3 text-sm">
        <div>
          <dt class="text-gray-500">Prestation</dt>
          <dd class="font-medium">{{ appointment.serviceName }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">Nom</dt>
          <dd class="font-medium">
            {{ appointment.clientFirstName }} {{ appointment.clientLastName }}
          </dd>
        </div>
        <div>
          <dt class="text-gray-500">Email</dt>
          <dd class="font-medium">{{ appointment.clientEmail }}</dd>
        </div>
      </dl>
    </UCard>

    <!-- Actions disponibles selon statut -->
    <div
      v-if="appointment.status === 'CONFIRMED' || appointment.status === 'PENDING'"
      class="space-y-3"
    >
      <UButton
        block
        variant="outline"
        icon="i-heroicons-pencil"
        @click="showModifyForm = !showModifyForm"
      >
        Modifier mon rendez-vous
      </UButton>

      <UButton
        block
        color="red"
        variant="ghost"
        icon="i-heroicons-x-mark"
        :loading="loading"
        @click="showCancelConfirm = true"
      >
        Annuler mon rendez-vous
      </UButton>
    </div>

    <!-- Formulaire de modification -->
    <div v-if="showModifyForm">
      <p class="text-sm font-medium mb-3">Choisir un nouveau créneau</p>
      <div class="mb-3">
        <input
          v-model="newDate"
          type="date"
          class="border rounded-lg px-3 py-2 text-sm w-full"
          @change="onDateChange"
        />
      </div>
      <div v-if="slots.length" class="grid grid-cols-3 gap-2 mb-4">
        <button
          v-for="slot in slots"
          :key="slot"
          class="border rounded-lg py-2 text-sm"
          :class="newSlot === slot ? 'bg-primary-500 text-white' : ''"
          @click="newSlot = slot"
        >
          {{ formatTime(slot) }}
        </button>
      </div>
      <UButton
        block
        :loading="loading"
        :disabled="!newSlot"
        @click="$emit('modify', { startAt: newSlot })"
      >
        Confirmer la modification
      </UButton>
    </div>

    <!-- Confirmation annulation -->
    <UModal v-model="showCancelConfirm">
      <UCard>
        <template #header>
          <h3 class="font-semibold">Annuler le rendez-vous</h3>
        </template>
        <p class="text-sm text-gray-600">Êtes-vous sûr de vouloir annuler ce rendez-vous ?</p>
        <template #footer>
          <div class="flex gap-3 justify-end">
            <UButton variant="ghost" @click="showCancelConfirm = false">Non</UButton>
            <UButton color="red" :loading="loading" @click="$emit('cancel'); showCancelConfirm = false">
              Oui, annuler
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <UAlert v-if="error" color="red" :title="error" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBookingSlots } from '../../composables/useSlots'
import type { AppointmentPublic } from '@booking/shared'

const props = defineProps<{
  appointment: AppointmentPublic
  loading?: boolean
  error?: string | null
}>()

defineEmits<{
  cancel: []
  modify: [data: any]
}>()

const { slots, fetchSlots } = useBookingSlots()
const showModifyForm = ref(false)
const showCancelConfirm = ref(false)
const newDate = ref('')
const newSlot = ref<string | null>(null)

async function onDateChange() {
  newSlot.value = null
  if (newDate.value && props.appointment.serviceName) {
    // On n'a pas le serviceId ici — il faudrait l'ajouter dans AppointmentPublic
    // Pour l'instant on fetch sans serviceId (à améliorer)
    await fetchSlots('', newDate.value)
  }
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
</script>

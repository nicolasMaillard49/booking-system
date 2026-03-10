<template>
  <div class="space-y-6">
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-[20px] font-semibold text-black tracking-[-0.02em]">Votre rendez-vous</h1>
        <p class="text-[13px] text-neutral-500 mt-1">{{ formatDateTime(appointment.startAt) }}</p>
      </div>
      <BookingSharedStatusBadge :status="appointment.status" />
    </div>

    <div class="bg-white border border-neutral-200 rounded-lg p-5">
      <dl class="space-y-3 text-[13px]">
        <div>
          <dt class="text-neutral-400 mb-0.5">Prestation</dt>
          <dd class="font-medium text-black">{{ appointment.serviceName }}</dd>
        </div>
        <div>
          <dt class="text-neutral-400 mb-0.5">Nom</dt>
          <dd class="font-medium text-black">
            {{ appointment.clientFirstName }} {{ appointment.clientLastName }}
          </dd>
        </div>
        <div>
          <dt class="text-neutral-400 mb-0.5">Email</dt>
          <dd class="font-medium text-black">{{ appointment.clientEmail }}</dd>
        </div>
      </dl>
    </div>

    <!-- Actions disponibles selon statut -->
    <div
      v-if="appointment.status === 'CONFIRMED' || appointment.status === 'PENDING'"
      class="space-y-2"
    >
      <button
        class="w-full py-2.5 text-[13px] font-medium border border-neutral-200 text-black rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
        @click="showModifyForm = !showModifyForm"
      >
        Modifier mon rendez-vous
      </button>

      <button
        class="w-full py-2.5 text-[13px] font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        :disabled="loading"
        @click="showCancelConfirm = true"
      >
        Annuler mon rendez-vous
      </button>
    </div>

    <!-- Formulaire de modification -->
    <div v-if="showModifyForm" class="bg-neutral-50 border border-neutral-200 rounded-lg p-5">
      <p class="text-[13px] font-medium text-black mb-3">Choisir un nouveau créneau</p>
      <div class="mb-3">
        <input
          v-model="newDate"
          type="date"
          class="border border-neutral-200 rounded-lg px-3 py-2 text-[13px] w-full focus:outline-none focus:border-black transition-colors"
          @change="onDateChange"
        />
      </div>
      <div v-if="slots.length" class="grid grid-cols-3 gap-2 mb-4">
        <button
          v-for="slot in slots"
          :key="slot"
          class="border rounded-lg py-2 text-[13px] font-medium transition-colors cursor-pointer"
          :class="newSlot === slot ? 'bg-black text-white border-black' : 'border-neutral-200 hover:border-black'"
          @click="newSlot = slot"
        >
          {{ formatTime(slot) }}
        </button>
      </div>
      <button
        class="w-full py-2.5 bg-black text-white text-[13px] font-medium rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
        :disabled="!newSlot || loading"
        @click="$emit('modify', { startAt: newSlot })"
      >
        Confirmer la modification
      </button>
    </div>

    <!-- Confirmation annulation -->
    <UModal v-model="showCancelConfirm">
      <UCard>
        <template #header>
          <h3 class="text-[15px] font-semibold text-black">Annuler le rendez-vous</h3>
        </template>
        <p class="text-[13px] text-neutral-600">Êtes-vous sûr de vouloir annuler ce rendez-vous ?</p>
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

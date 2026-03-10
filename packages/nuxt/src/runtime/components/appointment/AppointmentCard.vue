<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-zinc-900">Votre rendez-vous</h1>
        <p class="text-zinc-500 mt-1">{{ formatDateTime(appointment.startAt) }}</p>
      </div>
      <BookingSharedStatusBadge :status="appointment.status" />
    </div>

    <!-- Details Card -->
    <div class="bg-white border border-zinc-200 rounded-xl p-6 space-y-4">
      <!-- Service -->
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <UIcon name="i-heroicons-scissors" class="w-5 h-5 text-zinc-600" />
        </div>
        <div>
          <p class="text-sm text-zinc-500">Prestation</p>
          <p class="text-base font-semibold text-zinc-900">{{ appointment.serviceName }}</p>
        </div>
      </div>

      <!-- Client Name -->
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <UIcon name="i-heroicons-user" class="w-5 h-5 text-zinc-600" />
        </div>
        <div>
          <p class="text-sm text-zinc-500">Nom</p>
          <p class="text-base font-semibold text-zinc-900">
            {{ appointment.clientFirstName }} {{ appointment.clientLastName }}
          </p>
        </div>
      </div>

      <!-- Email -->
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-zinc-600" />
        </div>
        <div>
          <p class="text-sm text-zinc-500">Email</p>
          <p class="text-base font-semibold text-zinc-900">{{ appointment.clientEmail }}</p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div
      v-if="appointment.status === 'CONFIRMED' || appointment.status === 'PENDING'"
      class="space-y-3"
    >
      <button
        class="w-full py-3 px-4 bg-white border border-zinc-200 rounded-lg font-medium text-zinc-900 hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2"
        @click="showModifyForm = !showModifyForm"
      >
        <UIcon name="i-heroicons-pencil-square" class="w-5 h-5" />
        Modifier mon rendez-vous
      </button>

      <button
        class="w-full py-3 px-4 bg-red-50 border border-red-200 rounded-lg font-medium text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        :disabled="loading"
        @click="showCancelConfirm = true"
      >
        <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
        Annuler mon rendez-vous
      </button>
    </div>

    <!-- Modify Form -->
    <div v-if="showModifyForm" class="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
      <h3 class="font-semibold text-zinc-900 mb-4">Choisir un nouveau créneau</h3>

      <div class="mb-4">
        <label class="block text-sm font-medium text-zinc-700 mb-2">Date</label>
        <input
          v-model="newDate"
          type="date"
          class="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
          @change="onDateChange"
        />
      </div>

      <div v-if="slots.length" class="mb-4">
        <p class="text-sm font-medium text-zinc-700 mb-3">Créneaux disponibles</p>
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="slot in slots"
            :key="slot"
            class="py-2 px-2 rounded-lg text-sm font-medium border transition-all"
            :class="newSlot === slot ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-400'"
            @click="newSlot = slot"
          >
            {{ formatTime(slot) }}
          </button>
        </div>
      </div>

      <button
        class="w-full py-3 bg-zinc-900 text-white font-semibold rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
        :disabled="!newSlot || loading"
        @click="$emit('modify', { startAt: newSlot })"
      >
        <span v-if="loading" class="inline-block animate-spin mr-2">⟳</span>
        Confirmer la modification
      </button>
    </div>

    <!-- Cancel Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCancelConfirm" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl">
            <h3 class="text-lg font-bold text-zinc-900 mb-2">Annuler le rendez-vous</h3>
            <p class="text-zinc-600 mb-6">Êtes-vous sûr de vouloir annuler ce rendez-vous ? Cette action ne peut pas être annulée.</p>

            <div class="flex gap-3">
              <button
                class="flex-1 py-2.5 px-4 border border-zinc-200 rounded-lg font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                @click="showCancelConfirm = false"
              >
                Non, garder
              </button>
              <button
                class="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                :disabled="loading"
                @click="$emit('cancel'); showCancelConfirm = false"
              >
                Oui, annuler
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Error Alert -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
      <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5 text-red-500 flex-shrink-0" />
      <p class="text-red-700">{{ error }}</p>
    </div>
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
  return new Date(iso).toLocaleString('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short',
  })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
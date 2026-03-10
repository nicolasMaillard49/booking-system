<template>
  <div>
    <!-- Sélecteur de date -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Choisissez une date
      </label>
      <input
        v-model="selectedDate"
        type="date"
        :min="minDate"
        :max="maxDate"
        class="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
        @change="onDateChange"
      />
    </div>

    <!-- Créneaux disponibles -->
    <div v-if="selectedDate">
      <label class="block text-sm font-medium text-gray-700 mb-3">
        Créneaux disponibles
      </label>

      <div v-if="loading" class="flex justify-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl text-gray-400" />
      </div>

      <div v-else-if="error">
        <UAlert color="red" :title="error" />
      </div>

      <div v-else-if="slots.length === 0">
        <UAlert
          color="orange"
          icon="i-heroicons-calendar-x-mark"
          title="Aucun créneau disponible pour cette date"
        />
      </div>

      <div v-else class="grid grid-cols-3 sm:grid-cols-4 gap-2">
        <button
          v-for="slot in slots"
          :key="slot"
          class="border rounded-lg py-2 px-3 text-sm font-medium transition-all"
          :class="selectedSlot === slot
            ? 'bg-primary-500 text-white border-primary-500'
            : 'hover:border-primary-400 hover:text-primary-600'"
          @click="onSelectSlot(slot)"
        >
          {{ formatTime(slot) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBookingSlots } from '../../composables/useSlots'

const props = defineProps<{
  serviceId: string
}>()

const emit = defineEmits<{
  select: [slot: string]
}>()

const { slots, loading, error, fetchSlots } = useBookingSlots()
const selectedDate = ref('')
const selectedSlot = ref<string | null>(null)

const minDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
})

const maxDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 60)
  return d.toISOString().split('T')[0]
})

async function onDateChange() {
  selectedSlot.value = null
  if (selectedDate.value) {
    await fetchSlots(props.serviceId, selectedDate.value)
  }
}

function onSelectSlot(slot: string) {
  selectedSlot.value = slot
  emit('select', slot)
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="space-y-8">
    <!-- Date Picker -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 mb-3">Choisissez une date</label>
      <div class="relative">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <input
          v-model="selectedDate"
          type="date"
          :min="minDate"
          :max="maxDate"
          class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-all"
          @change="onDateChange"
        />
      </div>
    </div>

    <!-- Slots -->
    <div v-if="selectedDate" class="animate-in">
      <div class="flex items-center justify-between mb-3">
        <label class="block text-sm font-semibold text-gray-900">Créneaux disponibles</label>
        <span v-if="!loading && slots.length > 0" class="text-xs text-gray-500">
          {{ slots.length }} créneau{{ slots.length !== 1 ? 'x' : '' }}
        </span>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-4 gap-3">
        <div v-for="i in 8" :key="i" class="h-12 bg-gray-100 rounded-lg animate-pulse" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
        <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm text-red-700">{{ error }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="slots.length === 0" class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-600 font-medium">Aucun créneau disponible</p>
        <p class="text-sm text-gray-500">Essayez une autre date</p>
      </div>

      <!-- Slots Grid -->
      <div v-else class="grid grid-cols-4 gap-3">
        <button
          v-for="(slot, index) in slots"
          :key="slot"
          class="py-2.5 px-3 rounded-lg text-sm font-medium border-2 transition-all"
          :class="selectedSlot === slot
            ? 'bg-gray-900 text-white border-gray-900'
            : 'bg-white border-gray-200 text-gray-900 hover:border-blue-500 hover:bg-blue-50'"
          :data-index="index"
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

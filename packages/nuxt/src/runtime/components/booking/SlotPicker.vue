<template>
  <div>
    <!-- Date picker -->
    <div class="mb-8">
      <label class="block text-[12px] font-medium text-neutral-400 uppercase tracking-wider mb-2">
        Choisissez une date
      </label>
      <div class="relative">
        <input
          v-model="selectedDate"
          type="date"
          :min="minDate"
          :max="maxDate"
          class="w-full border border-neutral-200 rounded-lg px-4 py-3 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200"
          @change="onDateChange"
        />
      </div>
    </div>

    <!-- Slots -->
    <div v-if="selectedDate">
      <label class="block text-[12px] font-medium text-neutral-400 uppercase tracking-wider mb-3">
        Créneaux disponibles
      </label>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-3 sm:grid-cols-4 gap-2">
        <div v-for="i in 8" :key="i" class="h-11 bg-neutral-100 rounded-lg animate-pulse" />
      </div>

      <div v-else-if="error">
        <UAlert color="red" variant="soft" icon="i-heroicons-exclamation-circle" :title="error" />
      </div>

      <div v-else-if="slots.length === 0" class="text-center py-10 border border-neutral-200 rounded-lg">
        <p class="text-[13px] text-neutral-400">Aucun créneau disponible</p>
        <p class="text-[12px] text-neutral-300 mt-1">Essayez une autre date</p>
      </div>

      <div v-else class="grid grid-cols-3 sm:grid-cols-4 gap-2">
        <button
          v-for="slot in slots"
          :key="slot"
          class="rounded-lg py-2.5 px-3 text-[13px] font-medium transition-all duration-200 cursor-pointer border"
          :class="selectedSlot === slot
            ? 'bg-black text-white border-black'
            : 'bg-white border-neutral-200 text-neutral-700 hover:border-black hover:text-black'"
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

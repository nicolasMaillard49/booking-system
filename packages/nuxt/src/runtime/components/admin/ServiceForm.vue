<template>
  <div class="space-y-5">
    <!-- Nom -->
    <div>
      <label class="block text-sm font-medium text-zinc-700 mb-2">Nom *</label>
      <input
        v-model="form.name"
        type="text"
        placeholder="Ex: Coupe homme"
        class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
        :class="{ 'border-red-300 focus:ring-red-900': errors.name }"
      />
      <p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-medium text-zinc-700 mb-2">Description</label>
      <textarea
        v-model="form.description"
        placeholder="Description de la prestation..."
        rows="3"
        class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none"
      />
    </div>

    <!-- Durée et Prix -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-zinc-700 mb-2">Durée (minutes) *</label>
        <input
          v-model.number="form.duration"
          type="number"
          min="5"
          placeholder="30"
          class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
          :class="{ 'border-red-300 focus:ring-red-900': errors.duration }"
        />
        <p v-if="errors.duration" class="text-sm text-red-600 mt-1">{{ errors.duration }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-zinc-700 mb-2">Prix (€)</label>
        <input
          v-model.number="form.price"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
        />
      </div>
    </div>

    <!-- Afficher le prix -->
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium text-zinc-700">Afficher le prix</label>
      <button
        class="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-200 transition-colors cursor-pointer"
        :class="form.isPriceVisible && 'bg-zinc-900'"
        @click="form.isPriceVisible = !form.isPriceVisible"
      >
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
          :class="form.isPriceVisible && 'translate-x-5.5'
"
        />
      </button>
    </div>

    <!-- Délais -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-zinc-700 mb-2">Délai min. réservation (heures)</label>
        <input
          v-model.number="form.minBookingDelay"
          type="number"
          min="0"
          class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-zinc-700 mb-2">Délai max. réservation (jours)</label>
        <input
          v-model.number="form.maxBookingDelay"
          type="number"
          min="1"
          class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
        />
      </div>
    </div>

    <!-- Prestation active -->
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium text-zinc-700">Prestation active</label>
      <button
        class="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-200 transition-colors cursor-pointer"
        :class="form.isActive && 'bg-zinc-900'"
        @click="form.isActive = !form.isActive"
      >
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
          :class="form.isActive && 'translate-x-5.5'"
        />
      </button>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 justify-end pt-2">
      <button
        class="px-4 py-2 border border-zinc-200 text-zinc-700 font-medium rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer"
        @click="$emit('cancel')"
      >
        Annuler
      </button>
      <button
        class="px-4 py-2 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loading"
        @click="onSave"
      >
        <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        <template v-else>Enregistrer</template>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{
  service?: any
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [data: any]
  cancel: []
}>()

const form = reactive({
  name: '',
  description: '',
  duration: 30,
  price: null as number | null,
  isPriceVisible: true,
  minBookingDelay: 1,
  maxBookingDelay: 60,
  isActive: true,
})

const errors = reactive<Record<string, string>>({})

watch(() => props.service, (service) => {
  if (service) Object.assign(form, service)
}, { immediate: true })

function validate(): boolean {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.name) errors.name = 'Le nom est requis'
  if (!form.duration || form.duration < 5) errors.duration = 'Durée minimum 5 minutes'
  return Object.keys(errors).length === 0
}

function onSave() {
  if (!validate()) return
  emit('save', { ...form })
}
</script>

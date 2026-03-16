<template>
  <div class="space-y-5">
    <!-- Date -->
    <div>
      <label class="block text-sm font-medium text-zinc-700 mb-2">Date *</label>
      <input
        v-model="form.date"
        type="date"
        class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all cursor-pointer"
      />
    </div>

    <!-- Type -->
    <div>
      <label class="block text-sm font-medium text-zinc-700 mb-2">Type</label>
      <select
        v-model="form.type"
        class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all cursor-pointer"
      >
        <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <!-- Custom Hours -->
    <template v-if="form.type === 'CUSTOM_HOURS'">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-zinc-700 mb-2">Ouverture</label>
          <input
            v-model="form.openTime"
            type="time"
            class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all cursor-pointer"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-700 mb-2">Fermeture</label>
          <input
            v-model="form.closeTime"
            type="time"
            class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all cursor-pointer"
          />
        </div>
      </div>
    </template>

    <!-- Label -->
    <div>
      <label class="block text-sm font-medium text-zinc-700 mb-2">Label (optionnel)</label>
      <input
        v-model="form.label"
        type="text"
        placeholder="Ex: Noël, Vacances d'été..."
        class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
      />
    </div>

    <!-- Actions -->
    <div class="flex gap-3 justify-end">
      <button
        class="px-4 py-2 border border-zinc-200 text-zinc-700 font-medium rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer"
        @click="$emit('cancel')"
      >
        Annuler
      </button>
      <button
        class="px-4 py-2 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loading"
        @click="$emit('save', form)"
      >
        <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        <template v-else>Enregistrer</template>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

defineProps<{ loading?: boolean }>()
defineEmits<{ save: [data: any]; cancel: [] }>()

const form = reactive({
  date: '',
  type: 'CLOSED',
  openTime: '09:00',
  closeTime: '18:00',
  label: '',
})

const typeOptions = [
  { label: 'Fermé', value: 'CLOSED' },
  { label: 'Horaires modifiés', value: 'CUSTOM_HOURS' },
]
</script>

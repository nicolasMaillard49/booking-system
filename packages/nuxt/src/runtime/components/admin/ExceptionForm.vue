<template>
  <div class="space-y-5">
    <!-- Date -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date *</label>
      <input
        v-model="form.date"
        type="date"
        class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all cursor-pointer"
      />
    </div>

    <!-- Type -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
      <select
        v-model="form.type"
        class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all cursor-pointer"
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
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ouverture</label>
          <input
            v-model="form.openTime"
            type="time"
            class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all cursor-pointer"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fermeture</label>
          <input
            v-model="form.closeTime"
            type="time"
            class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all cursor-pointer"
          />
        </div>
      </div>
    </template>

    <!-- Label -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Label (optionnel)</label>
      <input
        v-model="form.label"
        type="text"
        placeholder="Ex: Noël, Vacances d'été..."
        class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
      />
    </div>

    <!-- Actions -->
    <div class="flex gap-3 justify-end">
      <button
        class="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        @click="$emit('cancel')"
      >
        Annuler
      </button>
      <button
        class="px-4 py-2 bg-gray-900 dark:bg-brand-600 hover:bg-gray-800 dark:hover:bg-brand-500 text-white font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

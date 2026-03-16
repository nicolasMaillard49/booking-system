<template>
  <div class="space-y-5">
    <!-- Clé technique -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Clé technique *</label>
      <input
        v-model="form.key"
        type="text"
        placeholder="Ex: allergies, vehicle_type"
        :disabled="!!field"
        class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        :class="{ 'border-red-300 dark:border-red-500 focus:ring-red-500': errors.key }"
      />
      <p v-if="errors.key" class="text-sm text-red-600 dark:text-red-400 mt-1">{{ errors.key }}</p>
    </div>

    <!-- Label affiché -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Label affiché *</label>
      <input
        v-model="form.label"
        type="text"
        placeholder="Ex: Allergies connues"
        class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
        :class="{ 'border-red-300 dark:border-red-500 focus:ring-red-500': errors.label }"
      />
      <p v-if="errors.label" class="text-sm text-red-600 dark:text-red-400 mt-1">{{ errors.label }}</p>
    </div>

    <!-- Type de champ -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type de champ *</label>
      <select
        v-model="form.type"
        class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all cursor-pointer"
      >
        <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <!-- Options pour SELECT/RADIO/CHECKBOX -->
    <div v-if="needsOptions">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Options</label>
      <div v-for="(opt, i) in form.options" :key="i" class="flex gap-2 mb-2">
        <input
          v-model="opt.value"
          type="text"
          placeholder="valeur"
          class="w-1/2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-sm"
        />
        <input
          v-model="opt.label"
          type="text"
          placeholder="label affiché"
          class="w-1/2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-sm"
        />
        <button
          class="w-7 h-7 rounded flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer shrink-0"
          @click="removeOption(i)"
        >
          <svg class="w-4 h-4 text-red-400 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <button
        class="flex items-center gap-1 text-[12px] text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer mt-2"
        @click="addOption"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter une option
      </button>
    </div>

    <!-- Placeholder -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Placeholder</label>
      <input
        v-model="form.placeholder"
        type="text"
        placeholder="Texte d'aide..."
        class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
      />
    </div>

    <!-- Toggles -->
    <div class="flex gap-8">
      <div class="flex items-center justify-between gap-4">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Champ requis</label>
        <button
          class="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition-colors cursor-pointer"
          :class="form.isRequired && 'bg-green-500 dark:bg-green-500'"
          @click="form.isRequired = !form.isRequired"
        >
          <span
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
            :class="form.isRequired ? 'translate-x-[22px]' : 'translate-x-0.5'"
          />
        </button>
      </div>
      <div class="flex items-center justify-between gap-4">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Champ actif</label>
        <button
          class="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition-colors cursor-pointer"
          :class="form.isActive && 'bg-green-500 dark:bg-green-500'"
          @click="form.isActive = !form.isActive"
        >
          <span
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
            :class="form.isActive ? 'translate-x-[22px]' : 'translate-x-0.5'"
          />
        </button>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 justify-end pt-2">
      <button
        class="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        @click="$emit('cancel')"
      >
        Annuler
      </button>
      <button
        class="px-4 py-2 bg-gray-900 dark:bg-brand-600 hover:bg-gray-800 dark:hover:bg-brand-500 text-white font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
import { reactive, computed, watch } from 'vue'

const props = defineProps<{
  field?: any
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [data: any]
  cancel: []
}>()

const form = reactive({
  key: '',
  label: '',
  type: 'TEXT',
  options: [] as { value: string; label: string }[],
  placeholder: '',
  isRequired: false,
  isActive: true,
})

const errors = reactive<Record<string, string>>({})

const typeOptions = [
  { label: 'Texte', value: 'TEXT' },
  { label: 'Zone de texte', value: 'TEXTAREA' },
  { label: 'Nombre', value: 'NUMBER' },
  { label: 'Date', value: 'DATE' },
  { label: 'Liste déroulante', value: 'SELECT' },
  { label: 'Boutons radio', value: 'RADIO' },
  { label: 'Cases à cocher', value: 'CHECKBOX' },
]

const needsOptions = computed(() =>
  ['SELECT', 'RADIO', 'CHECKBOX'].includes(form.type)
)

watch(() => props.field, (f) => {
  if (f) Object.assign(form, { ...f, options: f.options ?? [] })
}, { immediate: true })

function addOption() {
  form.options.push({ value: '', label: '' })
}

function removeOption(i: number) {
  form.options.splice(i, 1)
}

function onSave() {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.key) errors.key = 'La clé est requise'
  if (!form.label) errors.label = 'Le label est requis'
  if (Object.keys(errors).length) return
  emit('save', { ...form })
}
</script>

<template>
  <div class="space-y-4">
    <UFormGroup label="Clé technique *" :error="errors.key">
      <UInput v-model="form.key" placeholder="Ex: allergies, vehicle_type" :disabled="!!field" />
    </UFormGroup>

    <UFormGroup label="Label affiché *" :error="errors.label">
      <UInput v-model="form.label" placeholder="Ex: Allergies connues" />
    </UFormGroup>

    <UFormGroup label="Type de champ *">
      <USelect
        v-model="form.type"
        :options="typeOptions"
        option-attribute="label"
        value-attribute="value"
      />
    </UFormGroup>

    <!-- Options pour SELECT/RADIO/CHECKBOX -->
    <div v-if="needsOptions">
      <label class="block text-[13px] font-medium text-black mb-2">Options</label>
      <div v-for="(opt, i) in form.options" :key="i" class="flex gap-2 mb-2">
        <UInput v-model="opt.value" placeholder="valeur" class="w-1/2" />
        <UInput v-model="opt.label" placeholder="label affiché" class="w-1/2" />
        <button
          class="w-7 h-7 rounded flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer shrink-0"
          @click="removeOption(i)"
        >
          <UIcon name="i-heroicons-x-mark" class="text-red-400 text-sm" />
        </button>
      </div>
      <button
        class="flex items-center gap-1 text-[12px] text-neutral-400 hover:text-black transition-colors cursor-pointer"
        @click="addOption"
      >
        <UIcon name="i-heroicons-plus" class="text-sm" />
        Ajouter une option
      </button>
    </div>

    <UFormGroup label="Placeholder">
      <UInput v-model="form.placeholder" placeholder="Texte d'aide..." />
    </UFormGroup>

    <div class="flex gap-6">
      <UFormGroup label="Champ requis">
        <UToggle v-model="form.isRequired" />
      </UFormGroup>
      <UFormGroup label="Champ actif">
        <UToggle v-model="form.isActive" />
      </UFormGroup>
    </div>

    <div class="flex gap-3 justify-end">
      <UButton variant="ghost" @click="$emit('cancel')">Annuler</UButton>
      <UButton color="black" :loading="loading" @click="onSave">Enregistrer</UButton>
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

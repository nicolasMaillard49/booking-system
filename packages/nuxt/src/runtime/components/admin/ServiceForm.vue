<template>
  <div class="space-y-4">
    <UFormGroup label="Nom *" :error="errors.name">
      <UInput v-model="form.name" placeholder="Ex: Coupe homme" />
    </UFormGroup>

    <UFormGroup label="Description">
      <UTextarea v-model="form.description" placeholder="Description de la prestation..." :rows="3" />
    </UFormGroup>

    <div class="grid grid-cols-2 gap-4">
      <UFormGroup label="Durée (minutes) *" :error="errors.duration">
        <UInput v-model.number="form.duration" type="number" min="5" placeholder="30" />
      </UFormGroup>

      <UFormGroup label="Prix (€)">
        <UInput v-model.number="form.price" type="number" min="0" step="0.01" placeholder="0.00" />
      </UFormGroup>
    </div>

    <UFormGroup label="Afficher le prix">
      <UToggle v-model="form.isPriceVisible" />
    </UFormGroup>

    <div class="grid grid-cols-2 gap-4">
      <UFormGroup label="Délai min. réservation (heures)">
        <UInput v-model.number="form.minBookingDelay" type="number" min="0" />
      </UFormGroup>

      <UFormGroup label="Délai max. réservation (jours)">
        <UInput v-model.number="form.maxBookingDelay" type="number" min="1" />
      </UFormGroup>
    </div>

    <UFormGroup label="Prestation active">
      <UToggle v-model="form.isActive" />
    </UFormGroup>

    <div class="flex gap-3 justify-end pt-2">
      <UButton variant="ghost" @click="$emit('cancel')">Annuler</UButton>
      <UButton :loading="loading" @click="onSave">Enregistrer</UButton>
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

// Pré-remplir si édition
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

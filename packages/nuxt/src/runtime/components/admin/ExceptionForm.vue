<template>
  <div class="space-y-4">
    <UFormGroup label="Date *">
      <UInput v-model="form.date" type="date" />
    </UFormGroup>

    <UFormGroup label="Type">
      <USelect
        v-model="form.type"
        :options="typeOptions"
        option-attribute="label"
        value-attribute="value"
      />
    </UFormGroup>

    <template v-if="form.type === 'CUSTOM_HOURS'">
      <div class="grid grid-cols-2 gap-4">
        <UFormGroup label="Ouverture">
          <UInput v-model="form.openTime" type="time" />
        </UFormGroup>
        <UFormGroup label="Fermeture">
          <UInput v-model="form.closeTime" type="time" />
        </UFormGroup>
      </div>
    </template>

    <UFormGroup label="Label (optionnel)">
      <UInput v-model="form.label" placeholder="Ex: Noël, Vacances d'été..." />
    </UFormGroup>

    <div class="flex gap-3 justify-end">
      <UButton variant="ghost" @click="$emit('cancel')">Annuler</UButton>
      <UButton :loading="loading" @click="$emit('save', form)">Enregistrer</UButton>
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

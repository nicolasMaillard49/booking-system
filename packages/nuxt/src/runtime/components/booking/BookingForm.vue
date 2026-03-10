<template>
  <div class="space-y-6">
    <!-- Récapitulatif du créneau choisi -->
    <UCard>
      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-calendar-days" class="text-primary-500 text-xl" />
        <div>
          <div class="font-medium">{{ service.name }}</div>
          <div class="text-sm text-gray-500">{{ formatDateTime(slot) }}</div>
        </div>
      </div>
    </UCard>

    <!-- Champs fixes obligatoires -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <UFormGroup label="Prénom *" :error="errors.clientFirstName">
        <UInput v-model="form.clientFirstName" placeholder="Jean" />
      </UFormGroup>

      <UFormGroup label="Nom *" :error="errors.clientLastName">
        <UInput v-model="form.clientLastName" placeholder="Dupont" />
      </UFormGroup>
    </div>

    <UFormGroup label="Email *" :error="errors.clientEmail">
      <UInput v-model="form.clientEmail" type="email" placeholder="jean@example.com" />
    </UFormGroup>

    <UFormGroup label="Téléphone *" :error="errors.clientPhone">
      <UInput v-model="form.clientPhone" type="tel" placeholder="06 00 00 00 00" />
    </UFormGroup>

    <!-- Champs custom dynamiques -->
    <BookingFieldRenderer
      v-for="field in customFields"
      :key="field.key"
      :field="field"
      :model-value="form.customFields[field.key] ?? ''"
      :error="errors[field.key]"
      @update:model-value="form.customFields[field.key] = $event"
    />

    <!-- Notes libres -->
    <UFormGroup label="Notes (optionnel)">
      <UTextarea
        v-model="form.clientNotes"
        placeholder="Informations complémentaires..."
        :rows="3"
      />
    </UFormGroup>

    <UAlert v-if="error" color="red" :title="error" />

    <UButton
      block
      size="lg"
      :loading="loading"
      @click="onSubmit"
    >
      Confirmer la demande
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useBookingApi } from '../../composables/useBookingApi'
import type { CustomFieldDefinitionConfig } from '@booking/shared'

const props = defineProps<{
  service: { id: string; name: string }
  slot: string
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  submit: [data: any]
}>()

const api = useBookingApi()
const customFields = ref<CustomFieldDefinitionConfig[]>([])

const form = reactive({
  clientFirstName: '',
  clientLastName: '',
  clientEmail: '',
  clientPhone: '',
  clientNotes: '',
  customFields: {} as Record<string, string>,
})

const errors = reactive<Record<string, string>>({})

function validate(): boolean {
  Object.keys(errors).forEach(k => delete errors[k])

  if (!form.clientFirstName) errors.clientFirstName = 'Le prénom est requis'
  if (!form.clientLastName) errors.clientLastName = 'Le nom est requis'
  if (!form.clientEmail) errors.clientEmail = 'L\'email est requis'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail)) {
    errors.clientEmail = 'Email invalide'
  }
  if (!form.clientPhone) errors.clientPhone = 'Le téléphone est requis'

  // Valider les champs custom obligatoires
  for (const field of customFields.value) {
    if (field.isRequired && !form.customFields[field.key]) {
      errors[field.key] = `${field.label} est requis`
    }
  }

  return Object.keys(errors).length === 0
}

function onSubmit() {
  if (!validate()) return

  const customFieldsArray = Object.entries(form.customFields).map(([key, value]) => ({
    key,
    value,
  }))

  emit('submit', {
    clientFirstName: form.clientFirstName,
    clientLastName: form.clientLastName,
    clientEmail: form.clientEmail,
    clientPhone: form.clientPhone,
    clientNotes: form.clientNotes || undefined,
    customFields: customFieldsArray,
  })
}

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short',
  })
}

onMounted(async () => {
  try {
    customFields.value = await api<CustomFieldDefinitionConfig[]>(
      `/booking/custom-fields?serviceId=${props.service.id}`,
    )
  } catch {}
})
</script>

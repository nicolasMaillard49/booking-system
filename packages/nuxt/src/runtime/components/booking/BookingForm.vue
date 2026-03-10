<template>
  <div class="space-y-6">
    <!-- Slot summary -->
    <div class="bg-neutral-50 border border-neutral-200 rounded-lg p-4 flex items-center gap-4">
      <div class="w-10 h-10 rounded-lg bg-black flex items-center justify-center shrink-0">
        <UIcon name="i-heroicons-calendar-days" class="text-white text-lg" />
      </div>
      <div>
        <div class="text-[14px] font-semibold text-black">{{ service.name }}</div>
        <div class="text-[13px] text-neutral-500 mt-0.5">{{ formatDateTime(slot) }}</div>
      </div>
    </div>

    <!-- Contact fields -->
    <div>
      <h3 class="text-[12px] font-medium text-neutral-400 uppercase tracking-wider mb-4">Vos coordonnées</h3>
      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormGroup label="Prénom" required :error="errors.clientFirstName">
            <UInput v-model="form.clientFirstName" placeholder="Jean" icon="i-heroicons-user" />
          </UFormGroup>

          <UFormGroup label="Nom" required :error="errors.clientLastName">
            <UInput v-model="form.clientLastName" placeholder="Dupont" icon="i-heroicons-user" />
          </UFormGroup>
        </div>

        <UFormGroup label="Email" required :error="errors.clientEmail">
          <UInput v-model="form.clientEmail" type="email" placeholder="jean@example.com" icon="i-heroicons-envelope" />
        </UFormGroup>

        <UFormGroup label="Téléphone" required :error="errors.clientPhone">
          <UInput v-model="form.clientPhone" type="tel" placeholder="06 12 34 56 78" icon="i-heroicons-phone" />
        </UFormGroup>
      </div>
    </div>

    <!-- Custom fields -->
    <div v-if="customFields.length > 0">
      <h3 class="text-[12px] font-medium text-neutral-400 uppercase tracking-wider mb-4">Informations complémentaires</h3>
      <div class="space-y-4">
        <BookingFieldRenderer
          v-for="field in customFields"
          :key="field.key"
          :field="field"
          :model-value="form.customFields[field.key] ?? ''"
          :error="errors[field.key]"
          @update:model-value="form.customFields[field.key] = $event"
        />
      </div>
    </div>

    <!-- Notes -->
    <UFormGroup label="Notes (optionnel)">
      <UTextarea
        v-model="form.clientNotes"
        placeholder="Informations complémentaires pour le praticien..."
        :rows="3"
      />
    </UFormGroup>

    <UAlert v-if="error" color="red" variant="soft" icon="i-heroicons-exclamation-circle" :title="error" />

    <button
      class="w-full py-3 bg-black text-white text-[14px] font-medium rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
      :disabled="loading"
      @click="onSubmit"
    >
      <span v-if="loading">Confirmation en cours...</span>
      <span v-else>Confirmer la réservation</span>
    </button>
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

  if (!form.clientFirstName.trim()) errors.clientFirstName = 'Le prénom est requis'
  if (!form.clientLastName.trim()) errors.clientLastName = 'Le nom est requis'
  if (!form.clientEmail.trim()) errors.clientEmail = 'L\'email est requis'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail)) {
    errors.clientEmail = 'Email invalide'
  }
  if (!form.clientPhone.trim()) errors.clientPhone = 'Le téléphone est requis'

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

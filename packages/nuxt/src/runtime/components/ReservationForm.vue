<template>
  <form @submit.prevent="onSubmit" class="w-full">
    <!-- Summary Section -->
    <div class="pb-6 mb-6 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5 text-black dark:text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H4a1 1 0 110-2V4zm3 6a1 1 0 000 2h6a1 1 0 000-2H7z" />
        </svg>
        <div>
          <p class="font-semibold text-gray-900 dark:text-white">{{ props.service.name }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDateTime(props.slot) }}</p>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="props.error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <p class="text-sm text-red-600 dark:text-red-400">{{ props.error }}</p>
    </div>

    <!-- Contact Information Section -->
    <div>
      <h3 class="text-xs uppercase tracking-wider font-medium text-gray-400 dark:text-gray-500 mb-4">Coordonnées</h3>

      <div class="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prénom <span class="text-gray-300 dark:text-gray-600">*</span>
          </label>
          <input
            id="firstName"
            v-model="form.clientFirstName"
            type="text"
            placeholder="Jean"
            class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
          />
          <p v-if="errors.clientFirstName" class="mt-2 text-sm text-red-500">{{ errors.clientFirstName }}</p>
        </div>

        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nom <span class="text-gray-300 dark:text-gray-600">*</span>
          </label>
          <input
            id="lastName"
            v-model="form.clientLastName"
            type="text"
            placeholder="Dupont"
            class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
          />
          <p v-if="errors.clientLastName" class="mt-2 text-sm text-red-500">{{ errors.clientLastName }}</p>
        </div>
      </div>

      <div class="mb-6">
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email <span class="text-gray-300 dark:text-gray-600">*</span>
        </label>
        <input
          id="email"
          v-model="form.clientEmail"
          type="email"
          placeholder="jean@example.com"
          class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
        />
        <p v-if="errors.clientEmail" class="mt-2 text-sm text-red-500">{{ errors.clientEmail }}</p>
      </div>

      <div class="mb-6">
        <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Téléphone <span class="text-gray-300 dark:text-gray-600">*</span>
        </label>
        <input
          id="phone"
          v-model="form.clientPhone"
          type="tel"
          placeholder="+33 6 12 34 56 78"
          class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
        />
        <p v-if="errors.clientPhone" class="mt-2 text-sm text-red-500">{{ errors.clientPhone }}</p>
      </div>
    </div>

    <!-- Custom Fields Section -->
    <div v-if="customFields.length > 0">
      <div class="border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
        <h3 class="text-xs uppercase tracking-wider font-medium text-gray-400 dark:text-gray-500 mb-4">Informations complémentaires</h3>
        <div class="space-y-6">
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
    </div>

    <!-- Notes Section -->
    <div class="border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
      <h3 class="text-xs uppercase tracking-wider font-medium text-gray-400 dark:text-gray-500 mb-4">Notes</h3>
      <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Notes supplémentaires
      </label>
      <textarea
        id="notes"
        v-model="form.clientNotes"
        placeholder="Partagez vos demandes spéciales..."
        rows="4"
        class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white resize-none"
      />
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="props.loading"
      class="w-full py-3.5 mt-8 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium transition-colors disabled:opacity-50"
      :class="{ 'hover:bg-gray-800 dark:hover:bg-gray-100': !props.loading }"
    >
      <span v-if="!props.loading">Confirmer la réservation</span>
      <span v-else class="flex items-center justify-center gap-2">
        <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Traitement...
      </span>
    </button>

    <!-- Footer Text -->
    <p class="text-xs text-gray-400 dark:text-gray-500 text-center mt-6">
      Un email de confirmation vous sera envoyé
    </p>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
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

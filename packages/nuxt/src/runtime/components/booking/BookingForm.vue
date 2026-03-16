<template>
  <div class="space-y-6">
    <!-- Summary Card -->
    <div class="bg-zinc-900 text-white rounded-xl p-5">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-lg">{{ service.name }}</h3>
          <p class="text-zinc-300 mt-1">{{ formatDateTime(slot) }}</p>
        </div>
      </div>
    </div>

    <!-- Contact Section -->
    <div class="bg-white border border-zinc-200 rounded-xl p-5">
      <h3 class="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-5 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Vos coordonnées
      </h3>

      <div class="space-y-4">
        <!-- Name Fields -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-zinc-700 mb-1.5">
              Prénom <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                v-model="form.clientFirstName"
                type="text"
                placeholder="Jean"
                class="w-full pl-10 pr-4 py-3 border rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all"
                :class="errors.clientFirstName ? 'border-red-300 focus:ring-red-200' : 'border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900'"
              />
            </div>
            <p v-if="errors.clientFirstName" class="mt-1.5 text-sm text-red-600">{{ errors.clientFirstName }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-zinc-700 mb-1.5">
              Nom <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <input
                v-model="form.clientLastName"
                type="text"
                placeholder="Dupont"
                class="w-full pl-10 pr-4 py-3 border rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all"
                :class="errors.clientLastName ? 'border-red-300 focus:ring-red-200' : 'border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900'"
              />
            </div>
            <p v-if="errors.clientLastName" class="mt-1.5 text-sm text-red-600">{{ errors.clientLastName }}</p>
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-zinc-700 mb-1.5">
            Email <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input
              v-model="form.clientEmail"
              type="email"
              placeholder="jean@example.com"
              class="w-full pl-10 pr-4 py-3 border rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all"
              :class="errors.clientEmail ? 'border-red-300 focus:ring-red-200' : 'border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900'"
            />
          </div>
          <p v-if="errors.clientEmail" class="mt-1.5 text-sm text-red-600">{{ errors.clientEmail }}</p>
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-zinc-700 mb-1.5">
            Téléphone <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 00-.88.5l-1.54 2.7a1 1 0 00.12 1.07l2.5 2.5a10 10 0 003.57-5.77L9.88 9a1 1 0 001.07.12l2.7-1.54a1 1 0 00.5-.88V5a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <input
              v-model="form.clientPhone"
              type="tel"
              placeholder="06 12 34 56 78"
              class="w-full pl-10 pr-4 py-3 border rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all"
              :class="errors.clientPhone ? 'border-red-300 focus:ring-red-200' : 'border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900'"
            />
          </div>
          <p v-if="errors.clientPhone" class="mt-1.5 text-sm text-red-600">{{ errors.clientPhone }}</p>
        </div>
      </div>
    </div>

    <!-- Custom Fields -->
    <div v-if="customFields.length > 0" class="bg-white border border-zinc-200 rounded-xl p-5">
      <h3 class="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-5 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Informations complémentaires
      </h3>

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
    <div class="bg-white border border-zinc-200 rounded-xl p-5">
      <label class="block text-sm font-medium text-zinc-700 mb-2">
        Notes (optionnel)
      </label>
      <textarea
        v-model="form.clientNotes"
        rows="3"
        placeholder="Informations complémentaires pour le praticien..."
        class="w-full px-4 py-3 border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all resize-none"
      />
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
      <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-red-700 text-sm">{{ error }}</p>
    </div>

    <!-- Submit Button -->
    <button
      class="w-full py-4 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      :disabled="loading"
      @click="onSubmit"
    >
      <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      <template v-else>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Confirmer la réservation
      </template>
    </button>

    <p class="text-center text-sm text-zinc-500">
      Un email de confirmation vous sera envoyé
    </p>
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
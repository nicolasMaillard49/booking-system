<template>
  <div class="space-y-6">
    <div class="bg-white border border-neutral-200 rounded-lg p-5">
      <h2 class="text-[14px] font-semibold text-black mb-4">Informations générales</h2>
      <div class="space-y-4">
        <UFormGroup label="Nom du business">
          <UInput v-model="form.businessName" />
        </UFormGroup>
        <UFormGroup label="Adresse">
          <UTextarea v-model="form.address" :rows="2" />
        </UFormGroup>
        <UFormGroup label="Téléphone">
          <UInput v-model="form.phone" />
        </UFormGroup>
        <UFormGroup label="Email de contact">
          <UInput v-model="form.email" type="email" />
        </UFormGroup>
        <UFormGroup label="Description">
          <UTextarea v-model="form.description" :rows="4" />
        </UFormGroup>
        <UFormGroup label="Consignes client">
          <UTextarea v-model="form.instructions" :rows="4" />
        </UFormGroup>
      </div>
    </div>

    <div class="bg-white border border-neutral-200 rounded-lg p-5">
      <h2 class="text-[14px] font-semibold text-black mb-4">Réservations</h2>
      <div class="space-y-4">
        <UFormGroup label="Validation automatique">
          <div class="flex items-center gap-3">
            <UToggle v-model="form.autoConfirm" />
            <span class="text-[13px] text-neutral-500">
              {{ form.autoConfirm ? 'Les RDV sont confirmés automatiquement' : 'Validation manuelle requise' }}
            </span>
          </div>
        </UFormGroup>

        <div class="grid grid-cols-2 gap-4">
          <UFormGroup label="Durée des créneaux (min)">
            <UInput v-model.number="form.slotDuration" type="number" min="5" />
          </UFormGroup>
          <UFormGroup label="Buffer entre RDV (min)">
            <UInput v-model.number="form.bufferBetweenSlots" type="number" min="0" />
          </UFormGroup>
          <UFormGroup label="Réservation minimum (heures)">
            <UInput v-model.number="form.minHoursBeforeBooking" type="number" min="0" />
          </UFormGroup>
          <UFormGroup label="Réservation maximum (jours)">
            <UInput v-model.number="form.maxDaysInAdvance" type="number" min="1" />
          </UFormGroup>
          <UFormGroup label="Délai annulation (heures)">
            <UInput v-model.number="form.cancellationDeadlineHours" type="number" min="0" />
          </UFormGroup>
          <UFormGroup label="Délai modification (heures)">
            <UInput v-model.number="form.modificationDeadlineHours" type="number" min="0" />
          </UFormGroup>
        </div>

        <UFormGroup label="Timezone">
          <UInput v-model="form.timezone" placeholder="Europe/Paris" />
        </UFormGroup>
      </div>
    </div>

    <button
      class="w-full py-3 bg-black text-white text-[14px] font-medium rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
      :disabled="saving"
      @click="$emit('save', form)"
    >
      {{ saving ? 'Enregistrement...' : 'Enregistrer les paramètres' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{
  settings: any
  saving?: boolean
}>()

defineEmits<{ save: [data: any] }>()

const form = reactive({ ...props.settings })

watch(() => props.settings, (s) => Object.assign(form, s))
</script>

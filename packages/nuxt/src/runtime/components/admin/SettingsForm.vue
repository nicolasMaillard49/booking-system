<template>
  <div class="space-y-6">
    <UCard>
      <template #header><h2 class="font-semibold">Informations générales</h2></template>
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
        <UFormGroup label="Description (markdown)">
          <UTextarea v-model="form.description" :rows="4" />
        </UFormGroup>
        <UFormGroup label="Consignes client (markdown)">
          <UTextarea v-model="form.instructions" :rows="4" />
        </UFormGroup>
      </div>
    </UCard>

    <UCard>
      <template #header><h2 class="font-semibold">Réservations</h2></template>
      <div class="space-y-4">
        <UFormGroup label="Validation automatique">
          <div class="flex items-center gap-3">
            <UToggle v-model="form.autoConfirm" />
            <span class="text-sm text-gray-500">
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
    </UCard>

    <UButton block size="lg" :loading="saving" @click="$emit('save', form)">
      Enregistrer les paramètres
    </UButton>
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

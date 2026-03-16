<template>
  <div class="space-y-6">
    <!-- Informations générales -->
    <div class="bg-white border border-neutral-200 rounded-lg p-5">
      <h2 class="text-[14px] font-semibold text-black mb-4">Informations générales</h2>
      <div class="space-y-4">
        <!-- Nom du business -->
        <div>
          <label class="block text-sm font-medium text-zinc-700 mb-2">Nom du business</label>
          <input v-model="form.businessName" type="text" class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all" />
        </div>
        <!-- Adresse -->
        <div>
          <label class="block text-sm font-medium text-zinc-700 mb-2">Adresse</label>
          <textarea v-model="form.address" rows="2" class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none" />
        </div>
        <!-- Téléphone -->
        <div>
          <label class="block text-sm font-medium text-zinc-700 mb-2">Téléphone</label>
          <input v-model="form.phone" type="tel" class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all" />
        </div>
        <!-- Email de contact -->
        <div>
          <label class="block text-sm font-medium text-zinc-700 mb-2">Email de contact</label>
          <input v-model="form.email" type="email" class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all" />
        </div>
        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-zinc-700 mb-2">Description</label>
          <textarea v-model="form.description" rows="4" class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none" />
        </div>
        <!-- Consignes client -->
        <div>
          <label class="block text-sm font-medium text-zinc-700 mb-2">Consignes client</label>
          <textarea v-model="form.instructions" rows="4" class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none" />
        </div>
      </div>
    </div>

    <!-- Réservations -->
    <div class="bg-white border border-neutral-200 rounded-lg p-5">
      <h2 class="text-[14px] font-semibold text-black mb-4">Réservations</h2>
      <div class="space-y-5">
        <!-- Validation automatique -->
        <div class="flex items-center gap-3">
          <button
            class="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-200 transition-colors cursor-pointer shrink-0"
            :class="form.autoConfirm && 'bg-zinc-900'"
            @click="form.autoConfirm = !form.autoConfirm"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
              :class="form.autoConfirm && 'translate-x-5.5'"
            />
          </button>
          <label class="text-[13px] text-neutral-500 cursor-pointer">
            {{ form.autoConfirm ? 'Les RDV sont confirmés automatiquement' : 'Validation manuelle requise' }}
          </label>
        </div>

        <!-- Grid of inputs -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-zinc-700 mb-2">Durée des créneaux (min)</label>
            <input v-model.number="form.slotDuration" type="number" min="5" class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all" />
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-700 mb-2">Buffer entre RDV (min)</label>
            <input v-model.number="form.bufferBetweenSlots" type="number" min="0" class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all" />
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-700 mb-2">Réservation minimum (heures)</label>
            <input v-model.number="form.minHoursBeforeBooking" type="number" min="0" class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all" />
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-700 mb-2">Réservation maximum (jours)</label>
            <input v-model.number="form.maxDaysInAdvance" type="number" min="1" class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all" />
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-700 mb-2">Délai annulation (heures)</label>
            <input v-model.number="form.cancellationDeadlineHours" type="number" min="0" class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all" />
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-700 mb-2">Délai modification (heures)</label>
            <input v-model.number="form.modificationDeadlineHours" type="number" min="0" class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all" />
          </div>
        </div>

        <!-- Timezone -->
        <div>
          <label class="block text-sm font-medium text-zinc-700 mb-2">Timezone</label>
          <input v-model="form.timezone" type="text" placeholder="Europe/Paris" class="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all" />
        </div>
      </div>
    </div>

    <!-- Save button -->
    <button
      class="w-full py-3 bg-zinc-900 text-white text-[14px] font-medium rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      :disabled="saving"
      @click="$emit('save', form)"
    >
      <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      <template v-else>{{ saving ? 'Enregistrement...' : 'Enregistrer les paramètres' }}</template>
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

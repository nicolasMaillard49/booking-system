<template>
  <div class="space-y-3">
    <div
      v-for="(rule, index) in localRules"
      :key="rule.dayOfWeek"
      class="border rounded-xl p-4"
    >
      <div class="flex items-center gap-4">
        <!-- Jour -->
        <div class="w-24 font-medium text-sm">{{ dayLabels[rule.dayOfWeek] }}</div>

        <!-- Actif/Inactif -->
        <UToggle v-model="rule.isActive" />

        <!-- Horaires -->
        <template v-if="rule.isActive">
          <input
            v-model="rule.openTime"
            type="time"
            class="border rounded px-2 py-1 text-sm"
          />
          <span class="text-gray-400 text-sm">→</span>
          <input
            v-model="rule.closeTime"
            type="time"
            class="border rounded px-2 py-1 text-sm"
          />

          <!-- Ajouter une pause -->
          <UButton
            size="xs"
            variant="ghost"
            icon="i-heroicons-plus"
            @click="addBreak(index)"
          >
            Pause
          </UButton>
        </template>

        <span v-else class="text-sm text-gray-400">Fermé</span>
      </div>

      <!-- Pauses -->
      <div
        v-if="rule.isActive && rule.breaks?.length"
        class="mt-3 ml-28 space-y-2"
      >
        <div
          v-for="(brk, bIndex) in rule.breaks"
          :key="bIndex"
          class="flex items-center gap-2"
        >
          <span class="text-xs text-gray-500">Pause</span>
          <input v-model="brk.startTime" type="time" class="border rounded px-2 py-1 text-xs" />
          <span class="text-gray-400 text-xs">→</span>
          <input v-model="brk.endTime" type="time" class="border rounded px-2 py-1 text-xs" />
          <UButton
            size="xs"
            variant="ghost"
            color="red"
            icon="i-heroicons-x-mark"
            @click="removeBreak(index, bIndex)"
          />
        </div>
      </div>
    </div>

    <UButton block :loading="loading" @click="$emit('save', localRules)">
      Enregistrer les horaires
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  rules: any[]
  loading?: boolean
}>()

defineEmits<{
  save: [rules: any[]]
}>()

const dayLabels = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

// Initialiser les 7 jours — même si certains n'ont pas de règle en DB
const localRules = ref(
  Array.from({ length: 7 }, (_, i) => {
    const existing = props.rules.find(r => r.dayOfWeek === i)
    return existing ?? {
      dayOfWeek: i,
      openTime: '09:00',
      closeTime: '18:00',
      isActive: false,
      breaks: [],
    }
  })
)

watch(() => props.rules, (rules) => {
  localRules.value = Array.from({ length: 7 }, (_, i) => {
    const existing = rules.find(r => r.dayOfWeek === i)
    return existing ?? {
      dayOfWeek: i,
      openTime: '09:00',
      closeTime: '18:00',
      isActive: false,
      breaks: [],
    }
  })
})

function addBreak(ruleIndex: number) {
  if (!localRules.value[ruleIndex].breaks) {
    localRules.value[ruleIndex].breaks = []
  }
  localRules.value[ruleIndex].breaks.push({ startTime: '12:00', endTime: '13:00' })
}

function removeBreak(ruleIndex: number, breakIndex: number) {
  localRules.value[ruleIndex].breaks.splice(breakIndex, 1)
}
</script>

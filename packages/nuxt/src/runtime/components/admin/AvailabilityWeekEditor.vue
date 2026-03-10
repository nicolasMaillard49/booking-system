<template>
  <div class="space-y-2">
    <div
      v-for="(rule, index) in localRules"
      :key="rule.dayOfWeek"
      class="bg-white border border-neutral-200 rounded-lg p-4"
    >
      <div class="flex items-center gap-4">
        <!-- Jour -->
        <div class="w-24 text-[13px] font-medium text-black">{{ dayLabels[rule.dayOfWeek] }}</div>

        <!-- Actif/Inactif -->
        <UToggle v-model="rule.isActive" />

        <!-- Horaires -->
        <template v-if="rule.isActive">
          <input
            v-model="rule.openTime"
            type="time"
            class="border border-neutral-200 rounded-lg px-3 py-1.5 text-[13px] focus:outline-none focus:border-black transition-colors"
          />
          <span class="text-neutral-300 text-[13px]">-</span>
          <input
            v-model="rule.closeTime"
            type="time"
            class="border border-neutral-200 rounded-lg px-3 py-1.5 text-[13px] focus:outline-none focus:border-black transition-colors"
          />

          <button
            class="flex items-center gap-1 text-[12px] text-neutral-400 hover:text-black transition-colors cursor-pointer ml-2"
            @click="addBreak(index)"
          >
            <UIcon name="i-heroicons-plus" class="text-sm" />
            Pause
          </button>
        </template>

        <span v-else class="text-[13px] text-neutral-400">Fermé</span>
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
          <span class="text-[11px] text-neutral-400 w-12">Pause</span>
          <input v-model="brk.startTime" type="time" class="border border-neutral-200 rounded-lg px-2 py-1 text-[12px] focus:outline-none focus:border-black transition-colors" />
          <span class="text-neutral-300 text-[12px]">-</span>
          <input v-model="brk.endTime" type="time" class="border border-neutral-200 rounded-lg px-2 py-1 text-[12px] focus:outline-none focus:border-black transition-colors" />
          <button
            class="w-6 h-6 rounded flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer"
            @click="removeBreak(index, bIndex)"
          >
            <UIcon name="i-heroicons-x-mark" class="text-red-400 text-sm" />
          </button>
        </div>
      </div>
    </div>

    <button
      class="w-full py-3 bg-black text-white text-[14px] font-medium rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50 mt-4"
      :disabled="loading"
      @click="$emit('save', localRules)"
    >
      {{ loading ? 'Enregistrement...' : 'Enregistrer les horaires' }}
    </button>
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

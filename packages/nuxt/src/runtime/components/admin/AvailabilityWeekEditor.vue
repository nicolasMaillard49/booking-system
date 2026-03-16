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

        <!-- Actif/Inactif Toggle -->
        <button
          class="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-200 transition-colors cursor-pointer shrink-0"
          :class="rule.isActive && 'bg-zinc-900'"
          @click="rule.isActive = !rule.isActive"
        >
          <span
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
            :class="rule.isActive && 'translate-x-5.5'"
          />
        </button>

        <!-- Horaires -->
        <template v-if="rule.isActive">
          <input
            v-model="rule.openTime"
            type="time"
            class="border border-neutral-200 rounded-lg px-3 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-colors"
          />
          <span class="text-neutral-300 text-[13px]">-</span>
          <input
            v-model="rule.closeTime"
            type="time"
            class="border border-neutral-200 rounded-lg px-3 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-colors"
          />

          <button
            class="flex items-center gap-1 text-[12px] text-neutral-400 hover:text-black transition-colors cursor-pointer ml-2"
            @click="addBreak(index)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
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
          <input v-model="brk.startTime" type="time" class="border border-neutral-200 rounded-lg px-2 py-1 text-[12px] focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-colors" />
          <span class="text-neutral-300 text-[12px]">-</span>
          <input v-model="brk.endTime" type="time" class="border border-neutral-200 rounded-lg px-2 py-1 text-[12px] focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-colors" />
          <button
            class="w-6 h-6 rounded flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer shrink-0"
            @click="removeBreak(index, bIndex)"
          >
            <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
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

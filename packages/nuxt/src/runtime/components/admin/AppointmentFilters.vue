<template>
  <div class="flex flex-wrap gap-3 items-center">
    <!-- Status filter -->
    <select
      v-model="local.status"
      class="w-44 px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all cursor-pointer text-sm"
      @change="emit('change')"
    >
      <option value="">Tous les statuts</option>
      <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <!-- Search input -->
    <div class="relative w-64">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        v-model="local.search"
        type="text"
        placeholder="Rechercher un client..."
        class="w-full pl-10 pr-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all text-sm"
        @update:model-value="emit('change')"
      />
    </div>

    <!-- Date from -->
    <input
      v-model="local.dateFrom"
      type="date"
      class="w-40 px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all cursor-pointer text-sm"
      @update:model-value="emit('change')"
    />

    <!-- Date to -->
    <input
      v-model="local.dateTo"
      type="date"
      class="w-40 px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all cursor-pointer text-sm"
      @update:model-value="emit('change')"
    />

    <!-- Reset button -->
    <button
      class="flex items-center gap-1.5 text-[13px] text-neutral-400 hover:text-black transition-colors cursor-pointer"
      @click="onReset"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
      Réinitialiser
    </button>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{
  modelValue: Record<string, any>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: any]
  change: []
}>()

const local = reactive({ ...props.modelValue })

watch(local, (val) => emit('update:modelValue', val))

const statusOptions = [
  { label: 'En attente', value: 'PENDING' },
  { label: 'Confirmé', value: 'CONFIRMED' },
  { label: 'Annulé', value: 'CANCELLED' },
  { label: 'Refusé', value: 'REJECTED' },
  { label: 'Terminé', value: 'COMPLETED' },
  { label: 'No show', value: 'NO_SHOW' },
]

function onReset() {
  Object.keys(local).forEach(k => (local as any)[k] = undefined)
  emit('change')
}
</script>

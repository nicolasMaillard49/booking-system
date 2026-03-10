<template>
  <div class="flex flex-wrap gap-3 items-center">
    <USelect
      v-model="local.status"
      :options="statusOptions"
      placeholder="Tous les statuts"
      class="w-44"
      @update:model-value="emit('change')"
    />

    <UInput
      v-model="local.search"
      placeholder="Rechercher un client..."
      icon="i-heroicons-magnifying-glass"
      class="w-64"
      @update:model-value="emit('change')"
    />

    <UInput
      v-model="local.dateFrom"
      type="date"
      class="w-40"
      @update:model-value="emit('change')"
    />

    <UInput
      v-model="local.dateTo"
      type="date"
      class="w-40"
      @update:model-value="emit('change')"
    />

    <button
      class="flex items-center gap-1.5 text-[13px] text-neutral-400 hover:text-black transition-colors cursor-pointer"
      @click="onReset"
    >
      <UIcon name="i-heroicons-x-mark" class="text-sm" />
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

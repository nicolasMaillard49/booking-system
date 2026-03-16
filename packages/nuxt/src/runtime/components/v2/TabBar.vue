<template>
  <nav class="border-b border-neutral-200 dark:border-neutral-800">
    <div class="flex" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        role="tab"
        :aria-selected="modelValue === tab.id"
        class="flex-1 cursor-pointer px-4 py-3 text-center text-sm font-medium -mb-px transition-colors duration-200 sm:flex-none"
        :class="
          modelValue === tab.id
            ? 'border-b-2 border-black text-black font-semibold dark:border-white dark:text-white'
            : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
        "
        @click="$emit('update:modelValue', tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const tabs = [
  { id: 'rdv', label: 'Prendre RDV' },
  { id: 'avis', label: 'Avis' },
  { id: 'apropos', label: '\u00C0-propos' },
]
</script>

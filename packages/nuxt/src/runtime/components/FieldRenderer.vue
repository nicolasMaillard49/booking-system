<template>
  <div>
    <!-- Label -->
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ field.label }}
      <span v-if="field.isRequired" class="text-gray-300 dark:text-gray-600">*</span>
    </label>

    <!-- TEXT -->
    <input
      v-if="field.type === 'TEXT'"
      :value="modelValue"
      type="text"
      :placeholder="field.placeholder ?? ''"
      class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
      :class="error ? 'border-red-300' : ''"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <!-- TEXTAREA -->
    <textarea
      v-else-if="field.type === 'TEXTAREA'"
      :value="modelValue"
      :placeholder="field.placeholder ?? ''"
      rows="3"
      class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white resize-none"
      :class="error ? 'border-red-300' : ''"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />

    <!-- NUMBER -->
    <input
      v-else-if="field.type === 'NUMBER'"
      type="number"
      :value="modelValue"
      :placeholder="field.placeholder ?? ''"
      class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
      :class="error ? 'border-red-300' : ''"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <!-- DATE -->
    <input
      v-else-if="field.type === 'DATE'"
      type="date"
      :value="modelValue"
      class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
      :class="error ? 'border-red-300' : ''"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <!-- SELECT -->
    <select
      v-else-if="field.type === 'SELECT'"
      :value="modelValue"
      class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
      :class="error ? 'border-red-300' : ''"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">Sélectionner une option</option>
      <option v-for="option in field.options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <!-- RADIO -->
    <div v-else-if="field.type === 'RADIO'" class="space-y-2">
      <label
        v-for="option in field.options"
        :key="option.value"
        class="flex cursor-pointer items-center gap-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 rounded-lg transition-colors"
        :class="modelValue === option.value ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-800' : 'hover:border-gray-300 dark:hover:border-gray-600'"
      >
        <input
          type="radio"
          :name="field.key"
          :value="option.value"
          :checked="modelValue === option.value"
          class="h-4 w-4"
          @change="$emit('update:modelValue', option.value)"
        />
        <span class="text-sm text-gray-700 dark:text-gray-300">{{ option.label }}</span>
      </label>
    </div>

    <!-- CHECKBOX -->
    <div v-else-if="field.type === 'CHECKBOX'" class="space-y-2">
      <label
        v-for="option in field.options"
        :key="option.value"
        class="flex cursor-pointer items-center gap-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 rounded-lg transition-colors"
        :class="modelValue?.includes(option.value) ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-800' : 'hover:border-gray-300 dark:hover:border-gray-600'"
      >
        <input
          type="checkbox"
          :value="option.value"
          :checked="modelValue?.includes(option.value)"
          class="h-4 w-4 rounded"
          @change="onCheckboxChange(option.value)"
        />
        <span class="text-sm text-gray-700 dark:text-gray-300">{{ option.label }}</span>
      </label>
    </div>

    <!-- Error message -->
    <p v-if="error" class="mt-2 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import type { CustomFieldDefinitionConfig } from '@booking/shared'

const props = defineProps<{
  field: CustomFieldDefinitionConfig
  modelValue: string
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onCheckboxChange(value: string) {
  const current: string[] = props.modelValue ? JSON.parse(props.modelValue) : []
  const idx = current.indexOf(value)
  if (idx === -1) current.push(value)
  else current.splice(idx, 1)
  emit('update:modelValue', JSON.stringify(current))
}
</script>

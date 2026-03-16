<template>
  <div>
    <!-- Label -->
    <label class="block text-sm font-medium text-zinc-700 mb-2">
      {{ field.label }}{{ field.isRequired ? ' *' : '' }}
    </label>

    <!-- TEXT -->
    <input
      v-if="field.type === 'TEXT'"
      :value="modelValue"
      type="text"
      :placeholder="field.placeholder ?? ''"
      class="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
      :class="error ? 'border-red-300' : 'border-zinc-200'"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <!-- TEXTAREA -->
    <textarea
      v-else-if="field.type === 'TEXTAREA'"
      :value="modelValue"
      :placeholder="field.placeholder ?? ''"
      class="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none"
      :class="error ? 'border-red-300' : 'border-zinc-200'"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <!-- NUMBER -->
    <input
      v-else-if="field.type === 'NUMBER'"
      type="number"
      :value="modelValue"
      :placeholder="field.placeholder ?? ''"
      class="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
      :class="error ? 'border-red-300' : 'border-zinc-200'"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <!-- DATE -->
    <input
      v-else-if="field.type === 'DATE'"
      type="date"
      :value="modelValue"
      class="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all cursor-pointer"
      :class="error ? 'border-red-300' : 'border-zinc-200'"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <!-- SELECT -->
    <select
      v-else-if="field.type === 'SELECT'"
      :value="modelValue"
      class="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all cursor-pointer"
      :class="error ? 'border-red-300' : 'border-zinc-200'"
      @change="$emit('update:modelValue', $event.target.value)"
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
        class="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="radio"
          :name="field.key"
          :value="option.value"
          :checked="modelValue === option.value"
          class="accent-zinc-900"
          @change="$emit('update:modelValue', option.value)"
        />
        <span class="text-[13px] text-black">{{ option.label }}</span>
      </label>
    </div>

    <!-- CHECKBOX -->
    <div v-else-if="field.type === 'CHECKBOX'" class="space-y-2">
      <label
        v-for="option in field.options"
        :key="option.value"
        class="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="checkbox"
          :value="option.value"
          :checked="modelValue?.includes(option.value)"
          class="accent-zinc-900"
          @change="onCheckboxChange(option.value)"
        />
        <span class="text-[13px] text-black">{{ option.label }}</span>
      </label>
    </div>

    <!-- Error message -->
    <p v-if="error" class="text-sm text-red-600 mt-1">{{ error }}</p>
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

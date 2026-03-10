<template>
  <UFormGroup :label="`${field.label}${field.isRequired ? ' *' : ''}`" :error="error">
    <!-- TEXT -->
    <UInput
      v-if="field.type === 'TEXT'"
      :model-value="modelValue"
      :placeholder="field.placeholder ?? ''"
      @update:model-value="$emit('update:modelValue', $event)"
    />

    <!-- TEXTAREA -->
    <UTextarea
      v-else-if="field.type === 'TEXTAREA'"
      :model-value="modelValue"
      :placeholder="field.placeholder ?? ''"
      @update:model-value="$emit('update:modelValue', $event)"
    />

    <!-- NUMBER -->
    <UInput
      v-else-if="field.type === 'NUMBER'"
      type="number"
      :model-value="modelValue"
      :placeholder="field.placeholder ?? ''"
      @update:model-value="$emit('update:modelValue', $event)"
    />

    <!-- DATE -->
    <UInput
      v-else-if="field.type === 'DATE'"
      type="date"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    />

    <!-- SELECT -->
    <USelect
      v-else-if="field.type === 'SELECT'"
      :model-value="modelValue"
      :options="field.options ?? []"
      option-attribute="label"
      value-attribute="value"
      @update:model-value="$emit('update:modelValue', $event)"
    />

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
          class="accent-black"
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
          class="accent-black"
          @change="onCheckboxChange(option.value)"
        />
        <span class="text-[13px] text-black">{{ option.label }}</span>
      </label>
    </div>
  </UFormGroup>
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

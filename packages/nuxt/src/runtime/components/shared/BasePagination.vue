<template>
  <nav v-if="totalPages > 1" class="flex items-center justify-center gap-1" aria-label="Pagination">
    <!-- Previous -->
    <button
      type="button"
      class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
      :disabled="modelValue <= 1"
      @click="emit('update:modelValue', modelValue - 1)"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- Pages -->
    <template v-for="page in visiblePages" :key="page">
      <span v-if="page === '...'" class="flex h-9 w-9 items-center justify-center text-sm text-gray-400">...</span>
      <button
        v-else
        type="button"
        class="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors"
        :class="page === modelValue
          ? 'bg-brand-600 text-white shadow-sm dark:bg-brand-500'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'"
        @click="emit('update:modelValue', page as number)"
      >
        {{ page }}
      </button>
    </template>

    <!-- Next -->
    <button
      type="button"
      class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
      :disabled="modelValue >= totalPages"
      @click="emit('update:modelValue', modelValue + 1)"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: number
  total: number
  perPage: number
}>()

const emit = defineEmits<{
  'update:modelValue': [page: number]
}>()

const totalPages = computed(() => Math.ceil(props.total / props.perPage))

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const current = props.modelValue
  const last = totalPages.value

  if (last <= 7) {
    for (let i = 1; i <= last; i++) pages.push(i)
    return pages
  }

  pages.push(1)
  if (current > 3) pages.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(last - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (current < last - 2) pages.push('...')
  pages.push(last)

  return pages
})
</script>

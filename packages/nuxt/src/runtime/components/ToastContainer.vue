<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-300 ease-in"
        enter-from-class="opacity-0 translate-x-4"
        leave-to-class="opacity-0 translate-x-4"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm min-w-[280px]"
          :class="toast.type === 'success'
            ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/80 dark:text-green-200'
            : 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/80 dark:text-red-200'"
        >
          <svg v-if="toast.type === 'success'" class="h-5 w-5 shrink-0 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else class="h-5 w-5 shrink-0 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm font-medium">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts } = useToast()
</script>

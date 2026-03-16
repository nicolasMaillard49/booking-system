<template>
  <button
    type="button"
    class="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-black/5 bg-white/80 text-neutral-500 backdrop-blur-sm transition-all hover:bg-neutral-100 hover:text-neutral-900 dark:border-white/5 dark:bg-white/5 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
    :title="isDark ? 'Passer en mode clair' : 'Passer en mode sombre'"
    @click="toggle"
  >
    <!-- Sun icon (shown in dark mode) -->
    <svg
      v-if="isDark"
      class="h-5 w-5"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
    <!-- Moon icon (shown in light mode) -->
    <svg
      v-else
      class="h-5 w-5"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  </button>
</template>

<script setup lang="ts">
const { isDark, toggle } = useTheme()
</script>

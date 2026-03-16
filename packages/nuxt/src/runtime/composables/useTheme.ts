import { computed } from 'vue'

/**
 * Composable pour gérer le thème dark/light.
 * Utilise @nuxtjs/color-mode sous le capot.
 */
export function useTheme() {
  const colorMode = useColorMode()

  const isDark = computed(() => colorMode.value === 'dark')

  function toggle() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  function set(mode: 'light' | 'dark' | 'system') {
    colorMode.preference = mode
  }

  return {
    isDark,
    colorMode,
    toggle,
    set,
  }
}

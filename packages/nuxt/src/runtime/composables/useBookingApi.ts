import { useNuxtApp } from '#app'

// Composable central — expose $bookingApi typé
export const useBookingApi = () => {
  const { $bookingApi } = useNuxtApp()
  return $bookingApi as typeof $fetch
}

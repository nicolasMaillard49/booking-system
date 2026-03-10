import { ref } from 'vue'
import { useBookingApi } from './useBookingApi'

export const useBookingSlots = () => {
  const api = useBookingApi()
  const slots = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchSlots(serviceId: string, date: string) {
    loading.value = true
    error.value = null
    slots.value = []
    try {
      const result = await api<{ date: string; slots: string[] }>(
        `/booking/slots?serviceId=${serviceId}&date=${date}`,
      )
      slots.value = result.slots
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Erreur lors du chargement des créneaux'
    } finally {
      loading.value = false
    }
  }

  return { slots, loading, error, fetchSlots }
}

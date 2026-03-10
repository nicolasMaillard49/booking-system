import { ref } from 'vue'
import { useBookingApi } from './useBookingApi'

interface Service {
  id: string
  name: string
  description: string | null
  duration: number
  price: number | null
  isPriceVisible: boolean
  sortOrder: number
}

export const useServices = () => {
  const api = useBookingApi()
  const services = ref<Service[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchServices() {
    loading.value = true
    error.value = null
    try {
      services.value = await api<Service[]>('/booking/services')
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Erreur lors du chargement des prestations'
    } finally {
      loading.value = false
    }
  }

  return { services, loading, error, fetchServices }
}

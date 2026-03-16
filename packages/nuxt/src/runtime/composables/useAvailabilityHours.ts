import { ref } from 'vue'
import { useBookingApi } from './useBookingApi'

interface DayHours {
  dayOfWeek: number
  openTime: string
  closeTime: string
  breaks: { startTime: string; endTime: string }[]
}

const DAY_LABELS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

export const useAvailabilityHours = () => {
  const api = useBookingApi()
  const hours = ref<DayHours[]>([])
  const loading = ref(false)

  async function fetchHours() {
    loading.value = true
    try {
      hours.value = await api<DayHours[]>('/booking/availability/hours')
    } catch {
      hours.value = []
    } finally {
      loading.value = false
    }
  }

  function formatDay(dayOfWeek: number): string {
    return DAY_LABELS[dayOfWeek] ?? ''
  }

  function formatTime(time: string): string {
    return time.slice(0, 5)
  }

  function getDaySchedule(dayOfWeek: number): string {
    const rule = hours.value.find((h) => h.dayOfWeek === dayOfWeek)
    if (!rule) return 'Fermé'
    return `${formatTime(rule.openTime)} - ${formatTime(rule.closeTime)}`
  }

  return { hours, loading, fetchHours, formatDay, formatTime, getDaySchedule, DAY_LABELS }
}

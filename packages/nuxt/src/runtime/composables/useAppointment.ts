import { ref } from 'vue'
import { useBookingApi } from './useBookingApi'
import type { AppointmentPublic } from '@booking/shared'

export const useAppointment = () => {
  const api = useBookingApi()
  const appointment = ref<AppointmentPublic | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchByToken(token: string) {
    loading.value = true
    error.value = null
    try {
      appointment.value = await api<AppointmentPublic>(`/booking/appointments/${token}`)
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Lien invalide ou expiré'
    } finally {
      loading.value = false
    }
  }

  async function cancelByToken(token: string) {
    loading.value = true
    error.value = null
    try {
      await api(`/booking/appointments/${token}`, { method: 'DELETE' })
      if (appointment.value) appointment.value.status = 'CANCELLED' as any
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Erreur lors de l\'annulation'
    } finally {
      loading.value = false
    }
  }

  async function updateByToken(token: string, data: any) {
    loading.value = true
    error.value = null
    try {
      appointment.value = await api<AppointmentPublic>(
        `/booking/appointments/${token}`,
        { method: 'PATCH', body: data },
      )
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Erreur lors de la modification'
    } finally {
      loading.value = false
    }
  }

  return { appointment, loading, error, fetchByToken, cancelByToken, updateByToken }
}

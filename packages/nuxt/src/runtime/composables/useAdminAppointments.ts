import { ref } from 'vue'
import { useBookingApi } from './useBookingApi'
import type { AppointmentDetail, AppointmentSummary } from '@booking/shared'

interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

interface ListFilters {
  status?: string
  serviceId?: string
  dateFrom?: string
  dateTo?: string
  search?: string
  page?: number
  limit?: number
}

export const useAdminAppointments = () => {
  const api = useBookingApi()
  const appointments = ref<AppointmentSummary[]>([])
  const appointment = ref<AppointmentDetail | null>(null)
  const meta = ref<PaginationMeta | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(filters: ListFilters = {}) {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== '') params.append(k, String(v))
      })
      const result = await api<{ data: AppointmentSummary[]; meta: PaginationMeta }>(
        `/admin/appointments?${params.toString()}`,
      )
      appointments.value = result.data
      meta.value = result.meta
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Erreur chargement'
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: string) {
    loading.value = true
    error.value = null
    try {
      appointment.value = await api<AppointmentDetail>(`/admin/appointments/${id}`)
    } catch (e: any) {
      error.value = e?.data?.message ?? 'Rendez-vous introuvable'
    } finally {
      loading.value = false
    }
  }

  async function confirm(id: string) {
    await api(`/admin/appointments/${id}/confirm`, { method: 'PATCH' })
    await fetchOne(id)
  }

  async function reject(id: string, reason?: string, alternativeSlot?: string) {
    await api(`/admin/appointments/${id}/reject`, {
      method: 'PATCH',
      body: { reason, alternativeSlot },
    })
    await fetchOne(id)
  }

  async function complete(id: string) {
    await api(`/admin/appointments/${id}/complete`, { method: 'PATCH' })
    await fetchOne(id)
  }

  async function noShow(id: string) {
    await api(`/admin/appointments/${id}/no-show`, { method: 'PATCH' })
    await fetchOne(id)
  }

  async function remove(id: string) {
    await api(`/admin/appointments/${id}`, { method: 'DELETE' })
  }

  return {
    appointments, appointment, meta, loading, error,
    fetchAll, fetchOne, confirm, reject, complete, noShow, remove,
  }
}

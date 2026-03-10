import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CustomFieldDefinitionConfig } from '@booking/shared'

// Représente les étapes du flow de réservation
type BookingStep = 'service' | 'slot' | 'form' | 'confirm' | 'success'

interface SelectedService {
  id: string
  name: string
  description: string | null
  duration: number
  price: number | null
  isPriceVisible: boolean
}

interface BookingFormData {
  clientFirstName: string
  clientLastName: string
  clientEmail: string
  clientPhone: string
  clientNotes?: string
  customFields: Record<string, string>
}

export const useBookingStore = defineStore('booking-flow', () => {
  const step = ref<BookingStep>('service')
  const selectedService = ref<SelectedService | null>(null)
  const selectedSlot = ref<string | null>(null)
  const formData = ref<BookingFormData>({
    clientFirstName: '',
    clientLastName: '',
    clientEmail: '',
    clientPhone: '',
    customFields: {},
  })
  const customFields = ref<CustomFieldDefinitionConfig[]>([])
  const createdAppointmentId = ref<string | null>(null)
  const createdMagicToken = ref<string | null>(null)
  const createdStatus = ref<string | null>(null)

  function selectService(service: SelectedService) {
    selectedService.value = service
    step.value = 'slot'
  }

  function selectSlot(slot: string) {
    selectedSlot.value = slot
    step.value = 'form'
  }

  function goToConfirm(data: BookingFormData) {
    formData.value = data
    step.value = 'confirm'
  }

  function goBack() {
    const steps: BookingStep[] = ['service', 'slot', 'form', 'confirm']
    const currentIndex = steps.indexOf(step.value)
    if (currentIndex > 0) step.value = steps[currentIndex - 1]
  }

  function setSuccess(appointmentId: string, magicToken: string, status?: string) {
    createdAppointmentId.value = appointmentId
    createdMagicToken.value = magicToken
    createdStatus.value = status ?? null
    step.value = 'success'
  }

  function reset() {
    step.value = 'service'
    selectedService.value = null
    selectedSlot.value = null
    formData.value = {
      clientFirstName: '',
      clientLastName: '',
      clientEmail: '',
      clientPhone: '',
      customFields: {},
    }
    createdAppointmentId.value = null
    createdMagicToken.value = null
    createdStatus.value = null
  }

  return {
    step,
    selectedService,
    selectedSlot,
    formData,
    customFields,
    createdAppointmentId,
    createdMagicToken,
    createdStatus,
    selectService,
    selectSlot,
    goToConfirm,
    goBack,
    setSuccess,
    reset,
  }
})

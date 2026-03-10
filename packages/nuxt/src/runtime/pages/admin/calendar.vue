<template>
  <BookingAdminLayout title="Calendrier">
    <template #actions>
      <div class="flex items-center gap-2">
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-100 transition-colors cursor-pointer"
          @click="prevMonth"
        >
          <UIcon name="i-heroicons-chevron-left" class="text-neutral-600" />
        </button>
        <span class="font-medium w-40 text-center text-[13px] capitalize text-black">{{ monthLabel }}</span>
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-100 transition-colors cursor-pointer"
          @click="nextMonth"
        >
          <UIcon name="i-heroicons-chevron-right" class="text-neutral-600" />
        </button>
      </div>
    </template>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-5 h-5 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
    </div>

    <div v-else>
      <!-- Day headers -->
      <div class="grid grid-cols-7 mb-1">
        <div
          v-for="day in dayHeaders"
          :key="day"
          class="text-center text-[11px] font-medium text-neutral-400 uppercase tracking-wider py-3"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar grid -->
      <div class="grid grid-cols-7 gap-px bg-neutral-200 border border-neutral-200 rounded-lg overflow-hidden">
        <div v-for="n in firstDayOffset" :key="`empty-${n}`" class="bg-neutral-50 min-h-[100px]" />

        <div
          v-for="day in daysInMonth"
          :key="day"
          class="bg-white min-h-[100px] p-2 cursor-pointer hover:bg-neutral-50 transition-colors"
          @click="onDayClick(day)"
        >
          <div
            class="text-[12px] font-medium mb-1.5 w-6 h-6 flex items-center justify-center rounded-full"
            :class="isToday(day) ? 'bg-black text-white' : 'text-neutral-500'"
          >
            {{ day }}
          </div>

          <div v-if="getDayAppointments(day).length" class="space-y-0.5">
            <div
              v-for="appt in getDayAppointments(day).slice(0, 3)"
              :key="appt.id"
              class="text-[11px] rounded px-1.5 py-0.5 truncate font-medium"
              :class="statusColors[appt.status]"
            >
              {{ formatTime(appt.startAt) }} {{ appt.clientLastName }}
            </div>
            <div
              v-if="getDayAppointments(day).length > 3"
              class="text-[11px] text-neutral-400 text-center font-medium"
            >
              +{{ getDayAppointments(day).length - 3 }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Day detail modal -->
    <UModal v-model="showDayModal">
      <UCard>
        <template #header>
          <h3 class="text-[15px] font-semibold text-black">{{ selectedDayLabel }}</h3>
        </template>

        <div class="space-y-2">
          <div
            v-for="appt in selectedDayAppointments"
            :key="appt.id"
            class="flex items-center justify-between border border-neutral-200 rounded-lg p-3 cursor-pointer hover:bg-neutral-50 transition-colors"
            @click="navigateTo(`${adminPrefix}/appointments/${appt.id}`); showDayModal = false"
          >
            <div>
              <div class="text-[13px] font-medium text-black">
                {{ formatTime(appt.startAt) }} — {{ appt.clientFirstName }} {{ appt.clientLastName }}
              </div>
              <div class="text-[12px] text-neutral-400 mt-0.5">{{ appt.service?.name ?? '' }}</div>
            </div>
            <BookingSharedStatusBadge :status="appt.status" size="xs" />
          </div>

          <div v-if="!selectedDayAppointments.length" class="text-center py-8 text-neutral-400 text-[13px]">
            Aucun rendez-vous ce jour
          </div>
        </div>
      </UCard>
    </UModal>
  </BookingAdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBookingApi } from '../../composables/useBookingApi'
import { useRuntimeConfig, navigateTo } from '#app'

const api = useBookingApi()
const config = useRuntimeConfig()
const adminPrefix = (config.public.booking as any).adminPrefix

const loading = ref(false)
const appointments = ref<any[]>([])
const currentDate = ref(new Date())
const showDayModal = ref(false)
const selectedDay = ref<number | null>(null)

const dayHeaders = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  CONFIRMED: 'bg-emerald-50 text-emerald-700',
  CANCELLED: 'bg-neutral-100 text-neutral-500',
  REJECTED: 'bg-red-50 text-red-600',
  COMPLETED: 'bg-blue-50 text-blue-700',
  NO_SHOW: 'bg-orange-50 text-orange-700',
}

const monthLabel = computed(() =>
  currentDate.value.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
)

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  return new Date(year, month + 1, 0).getDate()
})

const firstDayOffset = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  return firstDay === 0 ? 6 : firstDay - 1
})

const selectedDayLabel = computed(() => {
  if (!selectedDay.value) return ''
  const d = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), selectedDay.value)
  return d.toLocaleDateString('fr-FR', { dateStyle: 'full' })
})

const selectedDayAppointments = computed(() => {
  if (!selectedDay.value) return []
  return getDayAppointments(selectedDay.value)
})

function getDayAppointments(day: number): any[] {
  const dateStr = `${currentDate.value.getFullYear()}-${String(currentDate.value.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return appointments.value.filter(a => {
    const apptDate = new Date(a.startAt).toISOString().split('T')[0]
    return apptDate === dateStr
  })
}

function isToday(day: number): boolean {
  const today = new Date()
  return (
    day === today.getDate() &&
    currentDate.value.getMonth() === today.getMonth() &&
    currentDate.value.getFullYear() === today.getFullYear()
  )
}

function onDayClick(day: number) {
  selectedDay.value = day
  showDayModal.value = true
}

async function prevMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  await fetchCalendar()
}

async function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  await fetchCalendar()
}

async function fetchCalendar() {
  loading.value = true
  try {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const dateFrom = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const lastDay = new Date(year, month + 1, 0).getDate()
    const dateTo = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

    const result = await api<any>(`/admin/appointments?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=500`)
    appointments.value = result.data ?? []
  } catch {
    appointments.value = []
  }
  loading.value = false
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

onMounted(fetchCalendar)
</script>

<template>
  <BookingAdminLayout title="Calendrier">
    <template #actions>
      <div class="flex items-center gap-2">
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          @click="prevMonth"
        >
          <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="font-medium w-40 text-center text-[13px] capitalize text-gray-900 dark:text-gray-100">{{ monthLabel }}</span>
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          @click="nextMonth"
        >
          <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </template>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-5 h-5 border-2 border-gray-200 dark:border-gray-700 border-t-gray-900 dark:border-t-brand-500 rounded-full animate-spin" />
    </div>

    <div v-else>
      <!-- Day headers -->
      <div class="grid grid-cols-7 mb-1">
        <div
          v-for="day in dayHeaders"
          :key="day"
          class="text-center text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider py-3"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar grid -->
      <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div v-for="n in firstDayOffset" :key="`empty-${n}`" class="bg-gray-50 dark:bg-gray-800 min-h-[100px]" />

        <div
          v-for="day in daysInMonth"
          :key="day"
          class="bg-white dark:bg-gray-800 min-h-[100px] p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          @click="onDayClick(day)"
        >
          <div
            class="text-[12px] font-medium mb-1.5 w-6 h-6 flex items-center justify-center rounded-full"
            :class="isToday(day) ? 'bg-gray-900 dark:bg-brand-500 text-white' : 'text-gray-500 dark:text-gray-400'"
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
              class="text-[11px] text-gray-400 dark:text-gray-500 text-center font-medium"
            >
              +{{ getDayAppointments(day).length - 3 }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Day detail modal -->
    <BookingSharedBaseModal v-model="showDayModal" :title="selectedDayLabel">
      <div class="space-y-2">
        <div
          v-for="appt in selectedDayAppointments"
          :key="appt.id"
          class="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          @click="navigateTo(`${adminPrefix}/appointments/${appt.id}`); showDayModal = false"
        >
          <div>
            <div class="text-[13px] font-medium text-gray-900 dark:text-gray-100">
              {{ formatTime(appt.startAt) }} — {{ appt.clientFirstName }} {{ appt.clientLastName }}
            </div>
            <div class="text-[12px] text-gray-400 dark:text-gray-500 mt-0.5">{{ appt.service?.name ?? '' }}</div>
          </div>
          <BookingSharedStatusBadge :status="appt.status" size="xs" />
        </div>

        <div v-if="!selectedDayAppointments.length" class="text-center py-8 text-gray-400 dark:text-gray-500 text-[13px]">
          Aucun rendez-vous ce jour
        </div>
      </div>
    </BookingSharedBaseModal>
  </BookingAdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
  PENDING: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  CONFIRMED: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
  CANCELLED: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
  REJECTED: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  COMPLETED: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
  NO_SHOW: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
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

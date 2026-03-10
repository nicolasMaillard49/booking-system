<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Calendrier</h1>

      <div class="flex items-center gap-3">
        <UButton
          variant="ghost"
          icon="i-heroicons-chevron-left"
          @click="prevMonth"
        />
        <span class="font-medium w-36 text-center">{{ monthLabel }}</span>
        <UButton
          variant="ghost"
          icon="i-heroicons-chevron-right"
          @click="nextMonth"
        />
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-3xl" />
    </div>

    <div v-else>
      <!-- En-têtes jours -->
      <div class="grid grid-cols-7 mb-2">
        <div
          v-for="day in dayHeaders"
          :key="day"
          class="text-center text-xs font-medium text-gray-500 py-2"
        >
          {{ day }}
        </div>
      </div>

      <!-- Grille calendrier -->
      <div class="grid grid-cols-7 gap-1">
        <!-- Cellules vides avant le 1er du mois -->
        <div v-for="n in firstDayOffset" :key="`empty-${n}`" />

        <!-- Jours du mois -->
        <div
          v-for="day in daysInMonth"
          :key="day"
          class="min-h-20 border rounded-lg p-1 cursor-pointer hover:bg-gray-50 transition-colors"
          :class="{
            'bg-primary-50 border-primary-200': isToday(day),
            'bg-gray-50': !getCalendarDay(day)?.count,
          }"
          @click="onDayClick(day)"
        >
          <div
            class="text-xs font-medium mb-1 text-right"
            :class="isToday(day) ? 'text-primary-600' : 'text-gray-600'"
          >
            {{ day }}
          </div>

          <div v-if="getCalendarDay(day)?.count" class="space-y-1">
            <div
              v-for="appt in getCalendarDay(day)?.appointments?.slice(0, 3)"
              :key="appt.id"
              class="text-xs rounded px-1 py-0.5 truncate"
              :class="statusColors[appt.status]"
            >
              {{ formatTime(appt.startAt) }} {{ appt.clientLastName }}
            </div>
            <div
              v-if="(getCalendarDay(day)?.count ?? 0) > 3"
              class="text-xs text-gray-400 text-center"
            >
              +{{ (getCalendarDay(day)?.count ?? 0) - 3 }} autres
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Drawer détail du jour -->
    <UModal v-model="showDayModal">
      <UCard>
        <template #header>
          <h3 class="font-semibold">{{ selectedDayLabel }}</h3>
        </template>

        <div class="space-y-3">
          <div
            v-for="appt in selectedDayAppointments"
            :key="appt.id"
            class="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
            @click="navigateTo(`${adminPrefix}/appointments/${appt.id}`)"
          >
            <div>
              <div class="text-sm font-medium">
                {{ formatTime(appt.startAt) }} — {{ appt.clientFirstName }} {{ appt.clientLastName }}
              </div>
              <div class="text-xs text-gray-500 mt-0.5">{{ appt.serviceName }}</div>
            </div>
            <BookingSharedStatusBadge :status="appt.status" size="xs" />
          </div>

          <div v-if="!selectedDayAppointments.length" class="text-center py-6 text-gray-400 text-sm">
            Aucun rendez-vous ce jour
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBookingApi } from '../../composables/useBookingApi'
import { useRuntimeConfig, navigateTo } from '#app'

const api = useBookingApi()
const config = useRuntimeConfig()
const adminPrefix = (config.public.booking as any).adminPrefix

const loading = ref(false)
const calendarData = ref<any[]>([])
const currentDate = ref(new Date())
const showDayModal = ref(false)
const selectedDay = ref<number | null>(null)

const dayHeaders = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
  REJECTED: 'bg-red-100 text-red-600',
  COMPLETED: 'bg-blue-100 text-blue-600',
  NO_SHOW: 'bg-orange-100 text-orange-600',
}

const currentMonth = computed(() =>
  `${currentDate.value.getFullYear()}-${String(currentDate.value.getMonth() + 1).padStart(2, '0')}`
)

const monthLabel = computed(() =>
  currentDate.value.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
)

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  return new Date(year, month + 1, 0).getDate()
})

// Offset pour aligner le 1er jour (0=Lundi)
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
  return getCalendarDay(selectedDay.value)?.appointments ?? []
})

function getCalendarDay(day: number) {
  const dateStr = `${currentDate.value.getFullYear()}-${String(currentDate.value.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return calendarData.value.find(d => d.date === dateStr)
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
    calendarData.value = await api(`/admin/dashboard/calendar?month=${currentMonth.value}`)
  } catch {}
  loading.value = false
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

onMounted(fetchCalendar)
</script>

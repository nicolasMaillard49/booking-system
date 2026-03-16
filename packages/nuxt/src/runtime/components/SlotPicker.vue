<template>
  <div>
    <!-- Calendar -->
    <div class="mb-8">
      <div class="glass-card overflow-hidden rounded-2xl">
        <!-- Calendar Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-black/5 dark:border-white/5">
          <button type="button" class="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:text-white dark:hover:bg-white/5 transition-all" :disabled="isPrevDisabled" :class="{ 'opacity-30 cursor-not-allowed': isPrevDisabled }" @click="prevMonth">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span class="text-sm font-semibold text-neutral-900 dark:text-white capitalize">{{ monthLabel }}</span>
          <button type="button" class="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:text-white dark:hover:bg-white/5 transition-all" :disabled="isNextDisabled" :class="{ 'opacity-30 cursor-not-allowed': isNextDisabled }" @click="nextMonth">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <!-- Day Names -->
        <div class="grid grid-cols-7 border-b border-black/5 dark:border-white/5">
          <div v-for="day in dayNames" :key="day" class="py-3 text-center text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{{ day }}</div>
        </div>

        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 p-2 gap-0.5">
          <button
            v-for="(cell, idx) in calendarCells" :key="idx" type="button" :disabled="!cell.selectable"
            class="relative aspect-square flex items-center justify-center text-sm rounded-xl transition-all duration-200"
            :class="cellClass(cell)"
            @click="cell.selectable && onSelectDate(cell.dateStr)"
          >
            <span v-if="cell.day" class="relative z-10">{{ cell.day }}</span>
            <!-- Today dot -->
            <span v-if="cell.isToday" class="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
          </button>
        </div>
      </div>
    </div>

    <!-- Selected Date Label -->
    <div v-if="selectedDate" class="mb-5">
      <div class="text-xs uppercase tracking-wider font-medium text-neutral-500 dark:text-neutral-400">{{ formatSelectedDate }}</div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
      <div v-for="i in 8" :key="i" class="h-12 rounded-xl bg-neutral-100 dark:bg-white/5 animate-pulse" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="glass-card rounded-2xl p-4">
      <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <!-- Empty Slots -->
    <div v-else-if="selectedDate && slots.length === 0 && !loading" class="py-10 text-center">
      <p class="text-neutral-400 dark:text-neutral-500 text-sm mb-1">Aucun créneau disponible</p>
      <p class="text-neutral-300 dark:text-neutral-600 text-xs">Essayez une autre date</p>
    </div>

    <!-- Time Slots Grid -->
    <div v-else-if="slots.length > 0">
      <div class="mb-3 text-xs text-neutral-400 dark:text-neutral-500">
        {{ slots.length }} créneau{{ slots.length > 1 ? 'x' : '' }} disponible{{ slots.length > 1 ? 's' : '' }}
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        <button
          v-for="slot in slots" :key="slot" type="button" :aria-pressed="selectedSlot === slot"
          @click="onSelectSlot(slot)"
          :class="[
            'py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200',
            selectedSlot === slot
              ? 'btn-premium shadow-lg'
              : 'glass-card hover:!transform-none cursor-pointer'
          ]"
        >
          {{ formatTime(slot) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{ serviceId: string }>()
const emit = defineEmits<{ select: [slot: string] }>()

const { slots, loading, error, fetchSlots } = useBookingSlots()
const selectedDate = ref('')
const selectedSlot = ref<string | null>(null)

const today = new Date()
today.setHours(0, 0, 0, 0)
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())
const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const monthLabel = computed(() => {
  const d = new Date(currentYear.value, currentMonth.value, 1)
  return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
})

const minDate = computed(() => { const d = new Date(today); d.setDate(d.getDate() + 1); return d })
const maxDate = computed(() => { const d = new Date(today); d.setDate(d.getDate() + 60); return d })
const isPrevDisabled = computed(() => currentYear.value === today.getFullYear() && currentMonth.value === today.getMonth())
const isNextDisabled = computed(() => {
  const my = maxDate.value.getFullYear(), mm = maxDate.value.getMonth()
  return currentYear.value > my || (currentYear.value === my && currentMonth.value >= mm)
})

interface CalendarCell { day: number | null; dateStr: string; selectable: boolean; isToday: boolean; isSelected: boolean; isPast: boolean; isOtherMonth: boolean }

const calendarCells = computed<CalendarCell[]>(() => {
  const year = currentYear.value, month = currentMonth.value
  const firstDay = new Date(year, month, 1), lastDay = new Date(year, month + 1, 0)
  let startDow = firstDay.getDay() - 1; if (startDow < 0) startDow = 6
  const cells: CalendarCell[] = []
  for (let i = 0; i < startDow; i++) cells.push({ day: null, dateStr: '', selectable: false, isToday: false, isSelected: false, isPast: false, isOtherMonth: true })
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d), dateStr = formatDateStr(date)
    const isPast = date <= today, isBeyondMax = date > maxDate.value
    cells.push({ day: d, dateStr, selectable: !isPast && !isBeyondMax, isToday: date.getTime() === today.getTime(), isSelected: dateStr === selectedDate.value, isPast, isOtherMonth: false })
  }
  return cells
})

const formatSelectedDate = computed(() => {
  if (!selectedDate.value) return ''
  const [y, m, d] = selectedDate.value.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
})

function cellClass(cell: CalendarCell): string {
  if (!cell.day) return ''
  if (cell.isSelected) return 'bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold cursor-pointer shadow-md'
  if (cell.isToday) return 'text-neutral-400 dark:text-neutral-600 cursor-default'
  if (!cell.selectable) return 'text-neutral-300 dark:text-neutral-700 cursor-default'
  return 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer font-medium'
}

function prevMonth() { if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- } else currentMonth.value-- }
function nextMonth() { if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ } else currentMonth.value++ }
function formatDateStr(d: Date): string { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
async function onSelectDate(dateStr: string) { selectedDate.value = dateStr; selectedSlot.value = null; await fetchSlots(props.serviceId, dateStr) }
function onSelectSlot(slot: string) { selectedSlot.value = slot; emit('select', slot) }
function formatTime(isoString: string): string { return new Date(isoString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
</script>

<template>
  <BookingAdminLayout title="Dashboard">
    <!-- Skeleton loading -->
    <div v-if="loading" class="space-y-6">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
          <div class="h-3 w-16 bg-gray-100 dark:bg-gray-700 rounded mb-3" />
          <div class="h-7 w-12 bg-gray-100 dark:bg-gray-700 rounded" />
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
        <div class="h-4 w-36 bg-gray-100 dark:bg-gray-700 rounded mb-6" />
        <div v-for="i in 5" :key="i" class="h-11 bg-gray-50 dark:bg-gray-700 rounded mb-2" />
      </div>
    </div>

    <div v-else class="space-y-6">
      <!-- Stats cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 transition-colors"
        >
          <div class="text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">{{ stat.label }}</div>
          <div class="text-[28px] font-semibold text-gray-900 dark:text-gray-100 tracking-[-0.02em]">{{ stat.value }}</div>
        </div>
      </div>

      <!-- Recent appointments -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 class="text-[14px] font-semibold text-gray-900 dark:text-gray-100">Rendez-vous récents</h2>
          <button
            class="text-[13px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
            @click="navigateTo(`${adminPrefix}/appointments`)"
          >
            Voir tout
          </button>
        </div>

        <div v-if="recentAppointments.length === 0" class="text-center py-16 text-gray-400 dark:text-gray-500 text-[13px]">
          Aucun rendez-vous pour le moment
        </div>

        <div v-else>
          <div
            v-for="(appt, idx) in recentAppointments"
            :key="appt.id"
            class="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
            :class="{ 'border-t border-gray-100 dark:border-gray-700': idx > 0 }"
            @click="navigateTo(`${adminPrefix}/appointments/${appt.id}`)"
          >
            <div class="flex items-center gap-3.5 min-w-0">
              <div class="w-8 h-8 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center text-[11px] font-semibold text-white shrink-0">
                {{ (appt.clientFirstName?.[0] ?? '') + (appt.clientLastName?.[0] ?? '') }}
              </div>
              <div class="min-w-0">
                <div class="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate">
                  {{ appt.clientFirstName }} {{ appt.clientLastName }}
                </div>
                <div class="text-[12px] text-gray-400 dark:text-gray-500 mt-0.5">
                  {{ formatDate(appt.startAt) }}
                </div>
              </div>
            </div>
            <BookingSharedStatusBadge :status="appt.status" size="xs" />
          </div>
        </div>
      </div>
    </div>
  </BookingAdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRuntimeConfig, navigateTo } from '#app'

const api = useBookingApi()
const config = useRuntimeConfig()
const adminPrefix = (config.public.booking as any).adminPrefix
const loading = ref(true)

const allData = ref<any>(null)
const pendingData = ref<any>(null)
const confirmedData = ref<any>(null)
const todayData = ref<any>(null)

const recentAppointments = computed(() => allData.value?.data ?? [])

const stats = computed(() => [
  { label: 'Total', value: allData.value?.meta?.total ?? 0 },
  { label: 'En attente', value: pendingData.value?.meta?.total ?? 0 },
  { label: 'Confirmés', value: confirmedData.value?.meta?.total ?? 0 },
  { label: "Aujourd'hui", value: todayData.value?.meta?.total ?? 0 },
])

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })
}

onMounted(async () => {
  const today = new Date().toISOString().split('T')[0]
  try {
    const [all, pending, confirmed, todayResult] = await Promise.all([
      api<any>('/admin/appointments?limit=8'),
      api<any>('/admin/appointments?status=PENDING&limit=1'),
      api<any>('/admin/appointments?status=CONFIRMED&limit=1'),
      api<any>(`/admin/appointments?dateFrom=${today}&dateTo=${today}&limit=1`),
    ])
    allData.value = all
    pendingData.value = pending
    confirmedData.value = confirmed
    todayData.value = todayResult
  } catch {}
  loading.value = false
})
</script>

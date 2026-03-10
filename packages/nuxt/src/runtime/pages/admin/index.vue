<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-8">Dashboard</h1>

    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-3xl" />
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <UCard v-for="stat in stats" :key="stat.label">
        <div class="text-center">
          <div class="text-3xl font-bold">{{ stat.value }}</div>
          <div class="text-sm text-gray-500 mt-1">{{ stat.label }}</div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBookingApi } from '../../composables/useBookingApi'

const api = useBookingApi()
const loading = ref(false)
const data = ref<any>(null)

const stats = computed(() => [
  { label: 'Total', value: data.value?.total ?? 0 },
  { label: 'En attente', value: data.value?.pending ?? 0 },
  { label: 'Confirmés', value: data.value?.confirmed ?? 0 },
  { label: "Aujourd'hui", value: data.value?.todayCount ?? 0 },
])

onMounted(async () => {
  loading.value = true
  try {
    data.value = await api('/admin/dashboard/stats')
  } catch {}
  loading.value = false
})
</script>

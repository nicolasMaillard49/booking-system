<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Rendez-vous</h1>
    </div>

    <BookingAdminAppointmentFilters v-model="filters" class="mb-6" @change="onFilter" />

    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-3xl" />
    </div>

    <div v-else>
      <BookingAdminAppointmentList
        :appointments="appointments"
        @select="onSelect"
      />

      <div v-if="meta && meta.totalPages > 1" class="flex justify-center mt-6">
        <UPagination
          v-model="currentPage"
          :total="meta.total"
          :page-count="meta.limit"
          @update:model-value="onPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminAppointments } from '../../../composables/useAdminAppointments'
import { useRuntimeConfig, navigateTo } from '#app'

const { appointments, meta, loading, fetchAll } = useAdminAppointments()
const config = useRuntimeConfig()
const adminPrefix = (config.public.booking as any).adminPrefix
const filters = ref({})
const currentPage = ref(1)

async function onFilter() {
  currentPage.value = 1
  await fetchAll({ ...filters.value, page: 1 })
}

async function onPageChange(page: number) {
  await fetchAll({ ...filters.value, page })
}

async function onSelect(id: string) {
  await navigateTo(`${adminPrefix}/appointments/${id}`)
}

onMounted(() => fetchAll())
</script>

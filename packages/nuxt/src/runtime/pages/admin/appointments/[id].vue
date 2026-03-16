<template>
  <BookingAdminLayout title="Détail du rendez-vous">
    <template #actions>
      <button
        class="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
        @click="navigateTo(`${adminPrefix}/appointments`)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Retour
      </button>
    </template>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-5 h-5 border-2 border-gray-200 dark:border-gray-700 border-t-gray-900 dark:border-t-brand-500 rounded-full animate-spin" />
    </div>

    <div v-else class="max-w-3xl">
      <BookingAdminAppointmentDetail
        v-if="appointment"
        :appointment="appointment"
        :action-loading="actionLoading"
        @confirm="onConfirm"
        @reject="onReject"
        @complete="onComplete"
        @no-show="onNoShow"
        @delete="onDelete"
      />
    </div>
  </BookingAdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig, navigateTo } from '#app'

const route = useRoute()
const id = route.params.id as string
const { appointment, loading, fetchOne, confirm, reject, complete, noShow, remove } = useAdminAppointments()
const config = useRuntimeConfig()
const adminPrefix = (config.public.booking as any).adminPrefix
const actionLoading = ref(false)

async function onConfirm() {
  actionLoading.value = true
  await confirm(id)
  actionLoading.value = false
}

async function onReject(data: { reason?: string; alternativeSlot?: string }) {
  actionLoading.value = true
  await reject(id, data.reason, data.alternativeSlot)
  actionLoading.value = false
}

async function onComplete() {
  actionLoading.value = true
  await complete(id)
  actionLoading.value = false
}

async function onNoShow() {
  actionLoading.value = true
  await noShow(id)
  actionLoading.value = false
}

async function onDelete() {
  actionLoading.value = true
  await remove(id)
  await navigateTo(`${adminPrefix}/appointments`)
}

onMounted(() => fetchOne(id))
</script>

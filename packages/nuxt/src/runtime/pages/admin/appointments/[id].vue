<template>
  <div class="p-6 max-w-3xl">
    <UButton
      variant="ghost"
      icon="i-heroicons-arrow-left"
      class="mb-6"
      @click="navigateTo(`${adminPrefix}/appointments`)"
    >
      Retour
    </UButton>

    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-3xl" />
    </div>

    <BookingAdminAppointmentDetail
      v-else-if="appointment"
      :appointment="appointment"
      :action-loading="actionLoading"
      @confirm="onConfirm"
      @reject="onReject"
      @complete="onComplete"
      @no-show="onNoShow"
      @delete="onDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminAppointments } from '../../../composables/useAdminAppointments'
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

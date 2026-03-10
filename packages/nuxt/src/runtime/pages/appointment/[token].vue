<template>
  <div class="max-w-lg mx-auto py-12 px-4">
    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-3xl" />
    </div>

    <div v-else-if="error">
      <UAlert color="red" :title="error" />
    </div>

    <div v-else-if="appointment">
      <BookingAppointmentCard
        :appointment="appointment"
        :loading="actionLoading"
        :error="actionError"
        @cancel="onCancel"
        @modify="onModify"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAppointment } from '../../composables/useAppointment'

const route = useRoute()
const token = route.params.token as string
const { appointment, loading, error, fetchByToken, cancelByToken, updateByToken } = useAppointment()
const actionLoading = ref(false)
const actionError = ref<string | null>(null)

async function onCancel() {
  actionLoading.value = true
  actionError.value = null
  try {
    await cancelByToken(token)
  } catch (e: any) {
    actionError.value = e?.data?.message ?? 'Erreur lors de l\'annulation'
  } finally {
    actionLoading.value = false
  }
}

async function onModify(data: any) {
  actionLoading.value = true
  actionError.value = null
  try {
    await updateByToken(token, data)
  } catch (e: any) {
    actionError.value = e?.data?.message ?? 'Erreur lors de la modification'
  } finally {
    actionLoading.value = false
  }
}

onMounted(() => fetchByToken(token))
</script>

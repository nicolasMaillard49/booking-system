<template>
  <div class="p-6 max-w-2xl">
    <h1 class="text-2xl font-bold mb-8">Paramètres généraux</h1>

    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-3xl" />
    </div>

    <BookingAdminSettingsForm
      v-else-if="settings"
      :settings="settings"
      :saving="saving"
      @save="onSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBookingApi } from '../../../composables/useBookingApi'

const api = useBookingApi()
const settings = ref<any>(null)
const loading = ref(false)
const saving = ref(false)

async function onSave(data: any) {
  saving.value = true
  try {
    settings.value = await api('/admin/settings', { method: 'PATCH', body: data })
  } catch {}
  saving.value = false
}

onMounted(async () => {
  loading.value = true
  try {
    settings.value = await api('/admin/settings')
  } catch {}
  loading.value = false
})
</script>

<template>
  <BookingAdminLayout title="Paramètres généraux">
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-5 h-5 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
    </div>

    <div v-else class="max-w-2xl">
      <BookingAdminSettingsForm
        v-if="settings"
        :settings="settings"
        :saving="saving"
        @save="onSave"
      />
    </div>
  </BookingAdminLayout>
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

<template>
  <BookingAdminLayout title="Paramètres généraux">
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-5 h-5 border-2 border-gray-200 dark:border-gray-600 border-t-gray-900 dark:border-t-brand-500 rounded-full animate-spin" />
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

const api = useBookingApi()
const toast = useToast()
const settings = ref<any>(null)
const loading = ref(false)
const saving = ref(false)

async function onSave(data: any) {
  saving.value = true
  try {
    settings.value = await api('/admin/settings', { method: 'PATCH', body: data })
    toast.success('Paramètres enregistrés avec succès')
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Erreur lors de l\'enregistrement')
  }
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

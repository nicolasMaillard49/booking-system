<template>
  <BookingAdminLayout title="Disponibilités">
    <div class="max-w-3xl space-y-10">
      <!-- Weekly schedule -->
      <div>
        <h2 class="text-[15px] font-semibold text-black mb-4">Horaires hebdomadaires</h2>
        <BookingAdminAvailabilityWeekEditor
          :rules="rules"
          :loading="saving"
          @save="onSaveRules"
        />
      </div>

      <!-- Exceptions -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-[15px] font-semibold text-black">Exceptions & fermetures</h2>
          <UButton size="sm" color="black" icon="i-heroicons-plus" @click="showExceptionModal = true">
            Ajouter
          </UButton>
        </div>

        <BookingAdminExceptionsList
          :exceptions="exceptions"
          @delete="onDeleteException"
        />
      </div>
    </div>

    <UModal v-model="showExceptionModal">
      <UCard>
        <template #header>
          <h3 class="text-[15px] font-semibold text-black">Nouvelle exception</h3>
        </template>
        <BookingAdminExceptionForm
          :loading="saving"
          @save="onSaveException"
          @cancel="showExceptionModal = false"
        />
      </UCard>
    </UModal>
  </BookingAdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBookingApi } from '../../../composables/useBookingApi'

const api = useBookingApi()
const rules = ref<any[]>([])
const exceptions = ref<any[]>([])
const saving = ref(false)
const showExceptionModal = ref(false)

async function fetchRules() {
  rules.value = await api('/admin/availability/rules')
}

async function fetchExceptions() {
  exceptions.value = await api('/admin/availability/exceptions')
}

async function onSaveRules(data: any[]) {
  saving.value = true
  try {
    rules.value = await api('/admin/availability/rules', { method: 'PUT', body: data })
  } catch {}
  saving.value = false
}

async function onSaveException(data: any) {
  saving.value = true
  try {
    await api('/admin/availability/exceptions', { method: 'POST', body: data })
    showExceptionModal.value = false
    await fetchExceptions()
  } catch {}
  saving.value = false
}

async function onDeleteException(id: string) {
  if (!confirm('Supprimer cette exception ?')) return
  await api(`/admin/availability/exceptions/${id}`, { method: 'DELETE' })
  await fetchExceptions()
}

onMounted(async () => {
  await Promise.all([fetchRules(), fetchExceptions()])
})
</script>

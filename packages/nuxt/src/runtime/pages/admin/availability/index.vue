<template>
  <BookingAdminLayout title="Disponibilités">
    <div class="max-w-3xl space-y-10">
      <!-- Weekly schedule -->
      <div>
        <h2 class="text-[15px] font-semibold text-gray-900 dark:text-gray-100 mb-4">Horaires hebdomadaires</h2>
        <BookingAdminAvailabilityWeekEditor
          :rules="rules"
          :loading="saving"
          @save="onSaveRules"
        />
      </div>

      <!-- Exceptions -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-[15px] font-semibold text-gray-900 dark:text-gray-100">Exceptions & fermetures</h2>
          <button
            class="flex items-center gap-2 px-3 py-2 bg-gray-900 dark:bg-brand-500 text-white font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-brand-600 transition-colors cursor-pointer text-sm"
            @click="showExceptionModal = true"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter
          </button>
        </div>

        <BookingAdminExceptionsList
          :exceptions="exceptions"
          @delete="onDeleteException"
        />
      </div>
    </div>

    <!-- Modal create exception -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="showExceptionModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg w-full max-w-lg">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 class="text-[15px] font-semibold text-gray-900 dark:text-gray-100">Nouvelle exception</h3>
            <button
              class="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              @click="showExceptionModal = false"
            >
              <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <!-- Body -->
          <div class="p-6">
            <BookingAdminExceptionForm
              :loading="saving"
              @save="onSaveException"
              @cancel="showExceptionModal = false"
            />
          </div>
        </div>
      </div>
    </Transition>
  </BookingAdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const api = useBookingApi()
const toast = useToast()
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
    toast.success('Horaires enregistrés avec succès')
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Erreur lors de l\'enregistrement des horaires')
  }
  saving.value = false
}

async function onSaveException(data: any) {
  saving.value = true
  try {
    await api('/admin/availability/exceptions', { method: 'POST', body: data })
    showExceptionModal.value = false
    await fetchExceptions()
    toast.success('Exception ajoutée avec succès')
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Erreur lors de l\'ajout de l\'exception')
  }
  saving.value = false
}

async function onDeleteException(id: string) {
  if (!confirm('Supprimer cette exception ?')) return
  try {
    await api(`/admin/availability/exceptions/${id}`, { method: 'DELETE' })
    await fetchExceptions()
    toast.success('Exception supprimée')
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Erreur lors de la suppression')
  }
}

onMounted(async () => {
  await Promise.all([fetchRules(), fetchExceptions()])
})
</script>

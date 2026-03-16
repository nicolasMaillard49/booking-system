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
          <button
            class="flex items-center gap-2 px-3 py-2 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer text-sm"
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
        <div class="bg-white rounded-xl border border-neutral-200 shadow-lg w-full max-w-lg">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 class="text-[15px] font-semibold text-black">Nouvelle exception</h3>
            <button
              class="p-1 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer"
              @click="showExceptionModal = false"
            >
              <svg class="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

<template>
  <BookingAdminLayout title="Champs personnalisés">
    <template #actions>
      <button
        class="flex items-center gap-2 px-3 py-2 bg-gray-900 dark:bg-brand-500 text-white font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-brand-600 transition-colors cursor-pointer text-sm"
        @click="showModal = true"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nouveau champ
      </button>
    </template>

    <div class="max-w-3xl space-y-3">
      <div
        v-for="field in fields"
        :key="field.id"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="text-[14px] font-semibold text-gray-900 dark:text-gray-100">{{ field.label }}</div>
            <div class="flex items-center gap-2 mt-1.5">
              <span class="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{{ field.type }}</span>
              <span class="text-[11px] text-gray-400 dark:text-gray-500">{{ field.key }}</span>
              <span v-if="field.isRequired" class="text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">Requis</span>
            </div>
          </div>

          <div class="flex gap-1">
            <button
              class="w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              @click="onEdit(field)"
              title="Modifier"
            >
              <svg class="w-[14px] h-[14px] text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              class="w-7 h-7 rounded-md flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
              @click="onDelete(field.id)"
              title="Supprimer"
            >
              <svg class="w-[14px] h-[14px] text-red-400 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-if="fields.length === 0" class="text-center py-16 text-gray-400 dark:text-gray-500 text-[13px]">
        Aucun champ personnalisé configuré
      </div>
    </div>

    <!-- Modal create/edit -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="showModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg w-full max-w-lg">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 class="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
              {{ selectedField ? 'Modifier le champ' : 'Nouveau champ' }}
            </h3>
            <button
              class="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              @click="showModal = false"
            >
              <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <!-- Body -->
          <div class="p-6">
            <BookingAdminCustomFieldForm
              :field="selectedField"
              :loading="saving"
              @save="onSave"
              @cancel="showModal = false"
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
const fields = ref<any[]>([])
const saving = ref(false)
const showModal = ref(false)
const selectedField = ref<any>(null)

async function fetchFields() {
  fields.value = await api('/admin/custom-fields')
}

function onEdit(field: any) {
  selectedField.value = field
  showModal.value = true
}

async function onDelete(id: string) {
  if (!confirm('Supprimer ce champ ?')) return
  try {
    await api(`/admin/custom-fields/${id}`, { method: 'DELETE' })
    await fetchFields()
    toast.success('Champ personnalisé supprimé')
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Erreur lors de la suppression')
  }
}

async function onSave(data: any) {
  saving.value = true
  try {
    if (selectedField.value) {
      await api(`/admin/custom-fields/${selectedField.value.id}`, { method: 'PATCH', body: data })
      toast.success('Champ personnalisé modifié')
    } else {
      await api('/admin/custom-fields', { method: 'POST', body: data })
      toast.success('Champ personnalisé créé')
    }
    showModal.value = false
    selectedField.value = null
    await fetchFields()
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Erreur lors de l\'enregistrement')
  }
  saving.value = false
}

onMounted(fetchFields)
</script>

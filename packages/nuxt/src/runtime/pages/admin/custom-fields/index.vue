<template>
  <BookingAdminLayout title="Champs personnalisés">
    <template #actions>
      <UButton color="black" icon="i-heroicons-plus" size="sm" @click="showModal = true">
        Nouveau champ
      </UButton>
    </template>

    <div class="max-w-3xl space-y-3">
      <div
        v-for="field in fields"
        :key="field.id"
        class="bg-white border border-neutral-200 rounded-lg p-5 hover:border-neutral-300 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="text-[14px] font-semibold text-black">{{ field.label }}</div>
            <div class="flex items-center gap-2 mt-1.5">
              <span class="text-[11px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">{{ field.type }}</span>
              <span class="text-[11px] text-neutral-400">{{ field.key }}</span>
              <span v-if="field.isRequired" class="text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600">Requis</span>
            </div>
          </div>

          <div class="flex gap-1">
            <button
              class="w-7 h-7 rounded-md flex items-center justify-center hover:bg-neutral-100 transition-colors cursor-pointer"
              @click="onEdit(field)"
            >
              <UIcon name="i-heroicons-pencil" class="text-[14px] text-neutral-400" />
            </button>
            <button
              class="w-7 h-7 rounded-md flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer"
              @click="onDelete(field.id)"
            >
              <UIcon name="i-heroicons-trash" class="text-[14px] text-red-400" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="fields.length === 0" class="text-center py-16 text-neutral-400 text-[13px]">
        Aucun champ personnalisé configuré
      </div>
    </div>

    <UModal v-model="showModal" @close="selectedField = null">
      <UCard>
        <template #header>
          <h3 class="text-[15px] font-semibold text-black">
            {{ selectedField ? 'Modifier le champ' : 'Nouveau champ' }}
          </h3>
        </template>
        <BookingAdminCustomFieldForm
          :field="selectedField"
          :loading="saving"
          @save="onSave"
          @cancel="showModal = false"
        />
      </UCard>
    </UModal>
  </BookingAdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBookingApi } from '../../../composables/useBookingApi'

const api = useBookingApi()
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
  await api(`/admin/custom-fields/${id}`, { method: 'DELETE' })
  await fetchFields()
}

async function onSave(data: any) {
  saving.value = true
  try {
    if (selectedField.value) {
      await api(`/admin/custom-fields/${selectedField.value.id}`, { method: 'PATCH', body: data })
    } else {
      await api('/admin/custom-fields', { method: 'POST', body: data })
    }
    showModal.value = false
    selectedField.value = null
    await fetchFields()
  } catch {}
  saving.value = false
}

onMounted(fetchFields)
</script>

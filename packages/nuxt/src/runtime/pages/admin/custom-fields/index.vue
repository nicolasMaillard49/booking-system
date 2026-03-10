<template>
  <div class="p-6 max-w-3xl">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Champs personnalisés</h1>
      <UButton icon="i-heroicons-plus" @click="showModal = true">
        Nouveau champ
      </UButton>
    </div>

    <div class="space-y-3">
      <div
        v-for="field in fields"
        :key="field.id"
        class="border rounded-xl p-4 flex items-center justify-between"
      >
        <div>
          <div class="font-medium">{{ field.label }}</div>
          <div class="text-sm text-gray-500 mt-1">
            <UBadge size="xs" color="gray">{{ field.type }}</UBadge>
            <span class="ml-2">{{ field.key }}</span>
            <span v-if="field.isRequired" class="ml-2 text-red-500">Requis</span>
          </div>
        </div>

        <div class="flex gap-2">
          <UButton variant="ghost" icon="i-heroicons-pencil" size="sm" @click="onEdit(field)" />
          <UButton variant="ghost" icon="i-heroicons-trash" size="sm" color="red" @click="onDelete(field.id)" />
        </div>
      </div>

      <div v-if="fields.length === 0" class="text-center py-12 text-gray-400">
        Aucun champ personnalisé configuré
      </div>
    </div>

    <UModal v-model="showModal" @close="selectedField = null">
      <UCard>
        <template #header>
          <h3 class="font-semibold">
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
  </div>
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

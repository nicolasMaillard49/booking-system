<template>
  <div class="p-6 max-w-3xl">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Prestations</h1>
      <UButton icon="i-heroicons-plus" @click="showCreateModal = true">
        Nouvelle prestation
      </UButton>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-3xl" />
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="service in services"
        :key="service.id"
        class="border rounded-xl p-4 flex items-center justify-between"
      >
        <div>
          <div class="font-medium">{{ service.name }}</div>
          <div class="text-sm text-gray-500 mt-1">
            {{ service.duration }} min
            <span v-if="service.isPriceVisible && service.price">
              · {{ formatPrice(service.price) }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <UBadge :color="service.isActive ? 'green' : 'gray'">
            {{ service.isActive ? 'Actif' : 'Inactif' }}
          </UBadge>
          <UButton
            variant="ghost"
            icon="i-heroicons-pencil"
            size="sm"
            @click="onEdit(service)"
          />
          <UButton
            variant="ghost"
            icon="i-heroicons-trash"
            size="sm"
            color="red"
            @click="onDelete(service.id)"
          />
        </div>
      </div>

      <div v-if="services.length === 0" class="text-center py-12 text-gray-400">
        Aucune prestation créée
      </div>
    </div>

    <!-- Modal création/édition -->
    <UModal v-model="showCreateModal" @close="selectedService = null">
      <UCard>
        <template #header>
          <h3 class="font-semibold">
            {{ selectedService ? 'Modifier la prestation' : 'Nouvelle prestation' }}
          </h3>
        </template>

        <BookingAdminServiceForm
          :service="selectedService"
          :loading="saving"
          @save="onSave"
          @cancel="showCreateModal = false"
        />
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBookingApi } from '../../../composables/useBookingApi'

const api = useBookingApi()
const services = ref<any[]>([])
const loading = ref(false)
const saving = ref(false)
const showCreateModal = ref(false)
const selectedService = ref<any>(null)

async function fetchServices() {
  loading.value = true
  try {
    services.value = await api('/admin/services')
  } catch {}
  loading.value = false
}

function onEdit(service: any) {
  selectedService.value = service
  showCreateModal.value = true
}

async function onDelete(id: string) {
  if (!confirm('Supprimer cette prestation ?')) return
  await api(`/admin/services/${id}`, { method: 'DELETE' })
  await fetchServices()
}

async function onSave(data: any) {
  saving.value = true
  try {
    if (selectedService.value) {
      await api(`/admin/services/${selectedService.value.id}`, { method: 'PATCH', body: data })
    } else {
      await api('/admin/services', { method: 'POST', body: data })
    }
    showCreateModal.value = false
    selectedService.value = null
    await fetchServices()
  } catch {}
  saving.value = false
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}

onMounted(fetchServices)
</script>

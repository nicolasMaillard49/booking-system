<template>
  <BookingAdminLayout title="Prestations">
    <template #actions>
      <UButton color="black" size="sm" icon="i-heroicons-plus" @click="showCreateModal = true">
        Nouvelle prestation
      </UButton>
    </template>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-5 h-5 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
    </div>

    <div v-else class="max-w-3xl space-y-3">
      <div
        v-for="service in services"
        :key="service.id"
        class="bg-white border border-neutral-200 rounded-lg p-5 hover:border-neutral-300 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="text-[14px] font-semibold text-black">{{ service.name }}</div>
            <div class="text-[13px] text-neutral-500 mt-1">
              {{ service.duration }} min
              <span v-if="service.isPriceVisible && service.price">
                · {{ formatPrice(service.price) }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span
              class="text-[11px] font-medium px-2 py-0.5 rounded-full"
              :class="service.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500'"
            >
              {{ service.isActive ? 'Actif' : 'Inactif' }}
            </span>
            <button
              class="w-7 h-7 rounded-md flex items-center justify-center hover:bg-neutral-100 transition-colors cursor-pointer"
              @click="onEdit(service)"
            >
              <UIcon name="i-heroicons-pencil" class="text-[14px] text-neutral-400" />
            </button>
            <button
              class="w-7 h-7 rounded-md flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer"
              @click="onDelete(service.id)"
            >
              <UIcon name="i-heroicons-trash" class="text-[14px] text-red-400" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="services.length === 0" class="text-center py-16 text-neutral-400 text-[13px]">
        Aucune prestation créée
      </div>
    </div>

    <!-- Modal create/edit -->
    <UModal v-model="showCreateModal" @close="selectedService = null">
      <UCard>
        <template #header>
          <h3 class="text-[15px] font-semibold text-black">
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
  </BookingAdminLayout>
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

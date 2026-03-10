<template>
  <BookingAdminLayout title="Utilisateurs">
    <template #actions>
      <UButton color="black" icon="i-heroicons-plus" size="sm" @click="showModal = true">
        Nouvel utilisateur
      </UButton>
    </template>

    <div class="max-w-2xl space-y-3">
      <div
        v-for="user in users"
        :key="user.id"
        class="bg-white border border-neutral-200 rounded-lg p-5 hover:border-neutral-300 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3.5">
            <div class="w-9 h-9 rounded-full bg-black flex items-center justify-center text-[11px] font-semibold text-white">
              {{ (user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '') }}
            </div>
            <div>
              <div class="text-[14px] font-semibold text-black">{{ user.firstName }} {{ user.lastName }}</div>
              <div class="text-[13px] text-neutral-500">{{ user.email }}</div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span
              class="text-[11px] font-medium px-2 py-0.5 rounded-full"
              :class="user.role === 'superadmin' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'"
            >
              {{ user.role === 'superadmin' ? 'Super Admin' : 'Admin' }}
            </span>
            <button
              class="w-7 h-7 rounded-md flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              :disabled="user.id === authStore.user?.id"
              @click="onDelete(user.id)"
            >
              <UIcon name="i-heroicons-trash" class="text-[14px] text-red-400" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="users.length === 0" class="text-center py-16 text-neutral-400 text-[13px]">
        Aucun utilisateur
      </div>
    </div>

    <UModal v-model="showModal">
      <UCard>
        <template #header>
          <h3 class="text-[15px] font-semibold text-black">Nouvel utilisateur</h3>
        </template>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Prénom">
              <UInput v-model="form.firstName" />
            </UFormGroup>
            <UFormGroup label="Nom">
              <UInput v-model="form.lastName" />
            </UFormGroup>
          </div>

          <UFormGroup label="Email">
            <UInput v-model="form.email" type="email" />
          </UFormGroup>

          <UFormGroup label="Mot de passe">
            <UInput v-model="form.password" type="password" />
          </UFormGroup>

          <UFormGroup label="Rôle">
            <USelect
              v-model="form.role"
              :options="roleOptions"
              option-attribute="label"
              value-attribute="value"
            />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex gap-3 justify-end">
            <UButton variant="ghost" @click="showModal = false">Annuler</UButton>
            <UButton color="black" :loading="saving" @click="onSave">Créer</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </BookingAdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useBookingApi } from '../../../composables/useBookingApi'
import { useAuthStore } from '../../../stores/auth'

const api = useBookingApi()
const authStore = useAuthStore()
const users = ref<any[]>([])
const saving = ref(false)
const showModal = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'admin',
})

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Super Admin', value: 'superadmin' },
]

async function fetchUsers() {
  users.value = await api('/admin/users')
}

async function onDelete(id: string) {
  if (!confirm('Supprimer cet utilisateur ?')) return
  await api(`/admin/users/${id}`, { method: 'DELETE' })
  await fetchUsers()
}

async function onSave() {
  saving.value = true
  try {
    await api('/admin/users', { method: 'POST', body: { ...form } })
    showModal.value = false
    Object.assign(form, { firstName: '', lastName: '', email: '', password: '', role: 'admin' })
    await fetchUsers()
  } catch {}
  saving.value = false
}

onMounted(fetchUsers)
</script>

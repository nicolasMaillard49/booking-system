<template>
  <div class="p-6 max-w-2xl">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Utilisateurs</h1>
      <UButton icon="i-heroicons-plus" @click="showModal = true">
        Nouvel utilisateur
      </UButton>
    </div>

    <div class="space-y-3">
      <div
        v-for="user in users"
        :key="user.id"
        class="border rounded-xl p-4 flex items-center justify-between"
      >
        <div>
          <div class="font-medium">{{ user.firstName }} {{ user.lastName }}</div>
          <div class="text-sm text-gray-500 mt-0.5">{{ user.email }}</div>
        </div>

        <div class="flex items-center gap-3">
          <UBadge :color="user.role === 'superadmin' ? 'purple' : 'gray'">
            {{ user.role }}
          </UBadge>
          <UButton
            variant="ghost"
            icon="i-heroicons-trash"
            size="sm"
            color="red"
            :disabled="user.id === authStore.user?.id"
            @click="onDelete(user.id)"
          />
        </div>
      </div>

      <div v-if="users.length === 0" class="text-center py-12 text-gray-400">
        Aucun utilisateur
      </div>
    </div>

    <UModal v-model="showModal">
      <UCard>
        <template #header>
          <h3 class="font-semibold">Nouvel utilisateur</h3>
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
            <UButton :loading="saving" @click="onSave">Créer</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
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

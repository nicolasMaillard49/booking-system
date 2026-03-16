<template>
  <BookingAdminLayout title="Utilisateurs">
    <template #actions>
      <button
        class="flex items-center gap-2 px-3 py-2 bg-gray-900 dark:bg-brand-500 text-white font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-brand-600 transition-colors cursor-pointer text-sm"
        @click="showModal = true"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nouvel utilisateur
      </button>
    </template>

    <div class="max-w-2xl space-y-3">
      <div
        v-for="user in users"
        :key="user.id"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3.5">
            <div class="w-9 h-9 rounded-full bg-gray-900 dark:bg-brand-600 flex items-center justify-center text-[11px] font-semibold text-white">
              {{ (user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '') }}
            </div>
            <div>
              <div class="text-[14px] font-semibold text-gray-900 dark:text-gray-100">{{ user.firstName }} {{ user.lastName }}</div>
              <div class="text-[13px] text-gray-500 dark:text-gray-400">{{ user.email }}</div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span
              class="text-[11px] font-medium px-2 py-0.5 rounded-full"
              :class="user.role === 'superadmin' ? 'bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'"
            >
              {{ user.role === 'superadmin' ? 'Super Admin' : 'Admin' }}
            </span>
            <button
              class="w-7 h-7 rounded-md flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              :disabled="user.id === authStore.user?.id"
              @click="onDelete(user.id)"
            >
              <svg class="w-[14px] h-[14px] text-red-400 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-if="users.length === 0" class="text-center py-16 text-gray-400 dark:text-gray-500 text-[13px]">
        Aucun utilisateur
      </div>
    </div>

    <!-- Modal create user -->
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
            <h3 class="text-[15px] font-semibold text-gray-900 dark:text-gray-100">Nouvel utilisateur</h3>
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
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prénom</label>
                  <input v-model="form.firstName" type="text" class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom</label>
                  <input v-model="form.lastName" type="text" class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input v-model="form.email" type="email" class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mot de passe</label>
                <input v-model="form.password" type="password" class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rôle</label>
                <select v-model="form.role" class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all cursor-pointer">
                  <option v-for="opt in roleOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3 justify-end">
            <button
              class="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              @click="showModal = false"
            >
              Annuler
            </button>
            <button
              class="px-4 py-2 bg-gray-900 dark:bg-brand-600 hover:bg-gray-800 dark:hover:bg-brand-500 text-white font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="saving"
              @click="onSave"
            >
              <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <template v-else>Créer</template>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </BookingAdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../../../stores/auth'

const api = useBookingApi()
const toast = useToast()
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
  try {
    await api(`/admin/users/${id}`, { method: 'DELETE' })
    await fetchUsers()
    toast.success('Utilisateur supprimé')
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Erreur lors de la suppression')
  }
}

async function onSave() {
  saving.value = true
  try {
    await api('/admin/users', { method: 'POST', body: { ...form } })
    showModal.value = false
    Object.assign(form, { firstName: '', lastName: '', email: '', password: '', role: 'admin' })
    await fetchUsers()
    toast.success('Utilisateur créé avec succès')
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Erreur lors de la création')
  }
  saving.value = false
}

onMounted(fetchUsers)
</script>

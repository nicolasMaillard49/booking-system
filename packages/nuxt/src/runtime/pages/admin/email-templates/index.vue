<template>
  <BookingAdminLayout title="Templates email">
    <div class="max-w-3xl space-y-4">
      <div
        v-for="template in templates"
        :key="template.type"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <!-- Title and toggle -->
            <div class="flex items-center gap-3 mb-5">
              <span class="text-[14px] font-semibold text-gray-900 dark:text-gray-100">{{ typeLabels[template.type] ?? template.type }}</span>
              <button
                class="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition-colors cursor-pointer"
                :class="template.isEnabled && 'bg-green-500 dark:bg-green-500'"
                @click="onToggle(template.type, !template.isEnabled)"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                  :class="template.isEnabled ? 'translate-x-[22px]' : 'translate-x-0.5'"
                />
              </button>
            </div>

            <!-- Subject -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sujet</label>
              <input
                v-model="template.subject"
                type="text"
                class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                @blur="onUpdateSubject(template)"
              />
            </div>

            <!-- Extra content -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contenu additionnel</label>
              <textarea
                v-model="template.extraContent"
                placeholder="Texte affiché en bas de l'email..."
                rows="3"
                class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
                @blur="onUpdateExtra(template)"
              />
            </div>
          </div>

          <button
            class="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer text-sm shrink-0 mt-1"
            @click="onSendTest(template.type)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Tester
          </button>
        </div>
      </div>

      <div v-if="templates.length === 0" class="text-center py-16 text-gray-400 dark:text-gray-500 text-[13px]">
        Aucun template configuré
      </div>
    </div>
  </BookingAdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const api = useBookingApi()
const toast = useToast()
const templates = ref<any[]>([])

const typeLabels: Record<string, string> = {
  REQUEST_RECEIVED: 'Demande reçue',
  CONFIRMED: 'Rendez-vous confirmé',
  REJECTED: 'Rendez-vous refusé',
  MODIFIED: 'Rendez-vous modifié',
  CANCELLED: 'Rendez-vous annulé',
  REMINDER: 'Rappel',
}

async function fetchTemplates() {
  templates.value = await api('/admin/email-templates')
}

async function onToggle(type: string, isEnabled: boolean) {
  try {
    await api(`/admin/email-templates/${type}`, { method: 'PATCH', body: { isEnabled } })
    toast.success('Template mis à jour')
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Erreur lors de la mise à jour')
  }
}

async function onUpdateSubject(template: any) {
  try {
    await api(`/admin/email-templates/${template.type}`, {
      method: 'PATCH',
      body: { subject: template.subject },
    })
    toast.success('Sujet mis à jour')
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Erreur lors de la mise à jour')
  }
}

async function onUpdateExtra(template: any) {
  try {
    await api(`/admin/email-templates/${template.type}`, {
      method: 'PATCH',
      body: { extraContent: template.extraContent },
    })
    toast.success('Contenu mis à jour')
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Erreur lors de la mise à jour')
  }
}

async function onSendTest(type: string) {
  const to = prompt('Email de test :')
  if (!to) return
  try {
    await api(`/admin/email-templates/${type}/test`, { method: 'POST', body: { to } })
    toast.success('Email de test envoyé')
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Erreur lors de l\'envoi')
  }
}

onMounted(fetchTemplates)
</script>

<template>
  <BookingAdminLayout title="Templates email">
    <div class="max-w-3xl space-y-4">
      <div
        v-for="template in templates"
        :key="template.type"
        class="bg-white border border-neutral-200 rounded-lg p-5 hover:border-neutral-300 transition-colors"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-5">
              <span class="text-[14px] font-semibold text-black">{{ typeLabels[template.type] ?? template.type }}</span>
              <UToggle
                :model-value="template.isEnabled"
                @update:model-value="onToggle(template.type, $event)"
              />
            </div>

            <UFormGroup label="Sujet">
              <UInput
                v-model="template.subject"
                @blur="onUpdateSubject(template)"
              />
            </UFormGroup>

            <UFormGroup label="Contenu additionnel" class="mt-3">
              <UTextarea
                v-model="template.extraContent"
                placeholder="Texte affiché en bas de l'email..."
                :rows="3"
                @blur="onUpdateExtra(template)"
              />
            </UFormGroup>
          </div>

          <UButton
            size="sm"
            variant="outline"
            color="gray"
            icon="i-heroicons-paper-airplane"
            @click="onSendTest(template.type)"
          >
            Tester
          </UButton>
        </div>
      </div>

      <div v-if="templates.length === 0" class="text-center py-16 text-neutral-400 text-[13px]">
        Aucun template configuré
      </div>
    </div>
  </BookingAdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBookingApi } from '../../../composables/useBookingApi'

const api = useBookingApi()
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
  await api(`/admin/email-templates/${type}`, { method: 'PATCH', body: { isEnabled } })
}

async function onUpdateSubject(template: any) {
  await api(`/admin/email-templates/${template.type}`, {
    method: 'PATCH',
    body: { subject: template.subject },
  })
}

async function onUpdateExtra(template: any) {
  await api(`/admin/email-templates/${template.type}`, {
    method: 'PATCH',
    body: { extraContent: template.extraContent },
  })
}

async function onSendTest(type: string) {
  const to = prompt('Email de test :')
  if (!to) return
  try {
    await api(`/admin/email-templates/${type}/test`, { method: 'POST', body: { to } })
    alert('Email de test envoyé !')
  } catch {
    alert('Erreur lors de l\'envoi')
  }
}

onMounted(fetchTemplates)
</script>

<template>
  <div class="p-6 max-w-3xl">
    <h1 class="text-2xl font-bold mb-8">Templates email</h1>

    <div class="space-y-4">
      <UCard v-for="template in templates" :key="template.type">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <span class="font-medium">{{ typeLabels[template.type] }}</span>
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
            icon="i-heroicons-paper-airplane"
            @click="onSendTest(template.type)"
          >
            Tester
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBookingApi } from '../../../composables/useBookingApi'

const api = useBookingApi()
const templates = ref<any[]>([])

const typeLabels: Record<string, string> = {
  request_received: 'Demande reçue',
  confirmed: 'Rendez-vous confirmé',
  rejected: 'Rendez-vous refusé',
  modified: 'Rendez-vous modifié',
  cancelled: 'Rendez-vous annulé',
  reminder: 'Rappel',
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
  await api(`/admin/email-templates/${type}/test`, { method: 'POST', body: { to } })
  alert('Email de test envoyé !')
}

onMounted(fetchTemplates)
</script>

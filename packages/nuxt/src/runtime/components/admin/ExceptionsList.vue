<template>
  <div class="space-y-2">
    <div
      v-for="exception in exceptions"
      :key="exception.id"
      class="border rounded-xl p-3 flex items-center justify-between"
    >
      <div>
        <div class="font-medium text-sm">
          {{ formatDate(exception.date) }}
          <span v-if="exception.label" class="text-gray-500 ml-2">— {{ exception.label }}</span>
        </div>
        <div class="text-xs text-gray-400 mt-1">
          <span v-if="exception.type === 'CLOSED'">Fermé</span>
          <span v-else>
            Horaires modifiés : {{ exception.openTime }} → {{ exception.closeTime }}
          </span>
        </div>
      </div>
      <UButton
        variant="ghost"
        color="red"
        icon="i-heroicons-trash"
        size="sm"
        @click="$emit('delete', exception.id)"
      />
    </div>

    <div v-if="exceptions.length === 0" class="text-center py-8 text-gray-400 text-sm">
      Aucune exception configurée
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ exceptions: any[] }>()
defineEmits<{ delete: [id: string] }>()

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', { dateStyle: 'long' })
}
</script>

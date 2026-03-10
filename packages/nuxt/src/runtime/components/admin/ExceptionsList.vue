<template>
  <div class="space-y-2">
    <div
      v-for="exception in exceptions"
      :key="exception.id"
      class="bg-white border border-neutral-200 rounded-lg p-4 flex items-center justify-between"
    >
      <div>
        <div class="text-[13px] font-medium text-black">
          {{ formatDate(exception.date) }}
          <span v-if="exception.label" class="text-neutral-400 ml-2">— {{ exception.label }}</span>
        </div>
        <div class="text-[12px] text-neutral-400 mt-1">
          <span v-if="exception.type === 'CLOSED'">Fermé</span>
          <span v-else>
            Horaires modifiés : {{ exception.openTime }} - {{ exception.closeTime }}
          </span>
        </div>
      </div>
      <button
        class="w-7 h-7 rounded-md flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer"
        @click="$emit('delete', exception.id)"
      >
        <UIcon name="i-heroicons-trash" class="text-[14px] text-red-400" />
      </button>
    </div>

    <div v-if="exceptions.length === 0" class="text-center py-8 text-neutral-400 text-[13px]">
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

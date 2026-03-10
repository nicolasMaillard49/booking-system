<template>
  <div class="min-h-screen bg-white flex items-center justify-center px-5">
    <div class="max-w-sm w-full text-center">
      <div
        class="w-14 h-14 rounded-full mx-auto mb-6 flex items-center justify-center"
        :class="isPending ? 'bg-neutral-100' : 'bg-black'"
      >
        <UIcon
          :name="isPending ? 'i-heroicons-clock' : 'i-heroicons-check'"
          class="text-2xl"
          :class="isPending ? 'text-neutral-600' : 'text-white'"
        />
      </div>

      <h1 class="text-[22px] font-semibold text-black tracking-[-0.02em] mb-2">
        {{ isPending ? 'Demande envoyée' : 'Rendez-vous confirmé' }}
      </h1>

      <p class="text-[14px] text-neutral-500 mb-8 leading-relaxed">
        {{
          isPending
            ? 'Votre demande est en attente de validation. Vous recevrez un email de confirmation.'
            : 'Votre rendez-vous est confirmé. Un email de confirmation vous a été envoyé.'
        }}
      </p>

      <div v-if="bookingStore.createdMagicToken" class="mb-8 p-4 bg-neutral-50 border border-neutral-200 rounded-lg text-left">
        <div class="flex gap-3">
          <UIcon name="i-heroicons-information-circle" class="text-neutral-400 text-lg shrink-0 mt-0.5" />
          <div>
            <p class="text-[13px] font-medium text-black">Lien de gestion envoyé par email</p>
            <p class="text-[12px] text-neutral-500 mt-1">Il vous permettra de consulter, modifier ou annuler votre rendez-vous.</p>
          </div>
        </div>
      </div>

      <button
        class="w-full py-3 bg-black text-white text-[14px] font-medium rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
        @click="bookingStore.reset(); navigateTo(publicPrefix)"
      >
        Retour à l'accueil
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBookingStore } from '../../stores/booking'
import { useRuntimeConfig, navigateTo } from '#app'

const bookingStore = useBookingStore()
const config = useRuntimeConfig()
const publicPrefix = (config.public.booking as any).publicPrefix

const isPending = computed(() => {
  return !bookingStore.createdStatus || bookingStore.createdStatus === 'PENDING'
})
</script>

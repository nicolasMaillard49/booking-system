<template>
  <div class="max-w-lg mx-auto py-20 px-4 text-center">
    <UIcon name="i-heroicons-check-circle" class="text-green-500 text-6xl mb-6" />

    <h1 class="text-2xl font-bold mb-2">
      {{ isPending ? 'Demande envoyée !' : 'Rendez-vous confirmé !' }}
    </h1>

    <p class="text-gray-500 mb-8">
      {{
        isPending
          ? 'Votre demande est en attente de validation. Vous recevrez un email de confirmation.'
          : 'Votre rendez-vous est confirmé. Un email de confirmation vous a été envoyé.'
      }}
    </p>

    <UButton @click="bookingStore.reset(); navigateTo(publicPrefix)">
      Retour à l'accueil
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBookingStore } from '../../stores/booking'
import { useRuntimeConfig, navigateTo } from '#app'

const bookingStore = useBookingStore()
const config = useRuntimeConfig()
const publicPrefix = (config.public.booking as any).publicPrefix

// On ne sait pas ici si c'est pending ou confirmed
// Le store pourrait stocker le status — pour l'instant on affiche le message générique
const isPending = computed(() => true)
</script>

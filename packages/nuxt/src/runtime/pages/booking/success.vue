<template>
  <div class="min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full">
      <!-- Success Card -->
      <div class="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm text-center">
        <!-- Icon -->
        <div
          class="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          :class="isPending ? 'bg-amber-100' : 'bg-emerald-100'"
        >
          <UIcon
            :name="isPending ? 'i-heroicons-clock' : 'i-heroicons-check'"
            class="w-10 h-10"
            :class="isPending ? 'text-amber-600' : 'text-emerald-600'"
          />
        </div>

        <!-- Title -->
        <h1 class="text-2xl font-bold text-zinc-900 mb-3">
          {{ isPending ? 'Demande envoyée !' : 'Rendez-vous confirmé !' }}
        </h1>

        <!-- Message -->
        <p class="text-zinc-600 mb-8 leading-relaxed">
          {{
            isPending
              ? 'Votre demande est en attente de validation. Vous recevrez un email de confirmation sous peu.'
              : 'Votre rendez-vous est confirmé. Un email de confirmation vous a été envoyé.'
          }}
        </p>

        <!-- Management Link Info -->
        <div v-if="bookingStore.createdMagicToken" class="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
          <div class="flex gap-3">
            <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-semibold text-blue-900">Gérez votre rendez-vous</p>
              <p class="text-sm text-blue-700 mt-1">Un lien vous a été envoyé par email pour consulter, modifier ou annuler votre réservation.</p>
            </div>
          </div>
        </div>

        <!-- CTA Button -->
        <button
          class="w-full py-3.5 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-zinc-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          @click="bookingStore.reset(); navigateTo(publicPrefix)"
        >
          <UIcon name="i-heroicons-home" class="w-5 h-5" />
          Retour à l'accueil
        </button>
      </div>

      <!-- Footer -->
      <p class="text-center text-sm text-zinc-500 mt-6">
        Merci de votre confiance !
      </p>
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
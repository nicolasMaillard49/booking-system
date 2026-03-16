<template>
  <div class="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-black px-4 py-12 transition-colors">
    <!-- Ambient glow -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-[120px] dark:opacity-[0.06]" :class="isPending ? 'bg-gradient-to-br from-amber-200 to-orange-100 dark:from-amber-900 dark:to-orange-900' : 'bg-gradient-to-br from-emerald-200 to-green-100 dark:from-emerald-900 dark:to-green-900'" />
    </div>

    <div class="relative w-full max-w-md">
      <div class="glass-card rounded-3xl p-10">
        <!-- Icon -->
        <div v-if="!isPending" class="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-200 shadow-lg">
          <svg class="w-8 h-8 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
        </div>
        <div v-else class="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-neutral-200 dark:border-neutral-800">
          <svg class="w-8 h-8 text-neutral-400 dark:text-neutral-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>

        <h1 class="text-center text-xl font-semibold text-neutral-900 dark:text-white mb-3">
          {{ isPending ? 'Demande envoyée' : 'Réservation confirmée' }}
        </h1>

        <p class="text-center text-sm text-neutral-500 dark:text-neutral-400 mb-6">
          {{ isPending
            ? 'Votre demande est en attente de validation. Vous recevrez un email de confirmation sous peu.'
            : 'Votre rendez-vous est confirmé. Un email de confirmation vous a été envoyé.'
          }}
        </p>

        <div v-if="bookingStore.createdMagicToken" class="border-t border-black/5 dark:border-white/5 pt-6 mt-6">
          <div class="flex gap-3">
            <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-white/5">
              <svg class="w-4 h-4 text-neutral-500 dark:text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-neutral-900 dark:text-white">Gérez votre réservation</p>
              <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Un lien vous a été envoyé par email.</p>
            </div>
          </div>
        </div>

        <button class="btn-premium mt-8 w-full rounded-xl py-3.5 font-semibold text-sm" @click="bookingStore.reset(); navigateTo(publicPrefix)">
          Retour à l'accueil
        </button>
      </div>

      <p class="mt-6 text-center text-xs text-neutral-400 dark:text-neutral-600">Merci de votre confiance</p>
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
const isPending = computed(() => !bookingStore.createdStatus || bookingStore.createdStatus === 'PENDING')
</script>

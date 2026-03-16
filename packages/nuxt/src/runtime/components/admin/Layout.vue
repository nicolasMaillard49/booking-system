<template>
  <div class="min-h-screen bg-white">
    <!-- Mobile overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileOpen"
        class="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        @click="mobileOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 w-[260px] bg-black z-50 flex flex-col transition-transform duration-300 ease-out lg:translate-x-0"
      :class="mobileOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Brand -->
      <div class="h-[72px] flex items-center px-6 shrink-0">
        <span class="text-[15px] font-semibold text-white tracking-[-0.01em]">Booking</span>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 pb-4 overflow-y-auto">
        <template v-for="item in visibleNav" :key="item.path">
          <div v-if="item.separator" class="mt-6 mb-2 px-3">
            <span class="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">{{ item.separator }}</span>
          </div>
          <NuxtLink
            :to="item.path"
            class="flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13px] font-medium transition-all duration-150 cursor-pointer"
            :class="isActive(item.path)
              ? 'bg-white text-black'
              : 'text-neutral-400 hover:text-white hover:bg-white/[0.06]'"
            @click="mobileOpen = false"
          >
            <svg class="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="item.label === 'Dashboard'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4 2V9m0 0L9 7m0 0L3 9" />
              <path v-else-if="item.label === 'Appointments'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              <path v-else-if="item.label === 'Services'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m0 0v2m0-2a2 2 0 100 4m0-4a2 2 0 110 4m0 0v2" />
              <path v-else-if="item.label === 'Availability'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path v-else-if="item.label === 'Settings'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
            </svg>
            {{ item.label }}
          </NuxtLink>
        </template>
      </nav>

      <!-- User -->
      <div class="px-3 py-4 border-t border-white/[0.08] shrink-0">
        <div class="flex items-center gap-3 px-3">
          <div class="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-[11px] font-semibold text-white">
            {{ initials }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-[13px] font-medium text-white truncate">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</div>
            <div class="text-[11px] text-neutral-500 truncate">{{ authStore.user?.email }}</div>
          </div>
          <button
            class="p-1.5 rounded-md text-neutral-500 hover:text-white hover:bg-white/[0.06] transition-all duration-150 cursor-pointer"
            aria-label="Se déconnecter"
            @click="onLogout"
          >
            <svg class="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <div class="lg:pl-[260px] min-h-screen flex flex-col">
      <!-- Header -->
      <header class="h-[72px] bg-white border-b border-neutral-100 flex items-center justify-between px-5 lg:px-8 sticky top-0 z-20 shrink-0">
        <div class="flex items-center gap-4">
          <button
            class="lg:hidden p-2 -ml-2 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors"
            aria-label="Menu"
            @click="mobileOpen = !mobileOpen"
          >
            <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <slot name="header">
            <h1 class="text-[17px] font-semibold text-black tracking-[-0.01em]">{{ title }}</h1>
          </slot>
        </div>
        <div class="flex items-center gap-2">
          <slot name="actions" />
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 p-5 lg:p-8 bg-neutral-50/50">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useAuth } from '../../composables/useAuth'
import { useRuntimeConfig } from '#app'

defineProps<{
  title?: string
}>()

const route = useRoute()
const authStore = useAuthStore()
const { logout } = useAuth()
const config = useRuntimeConfig()
const adminPrefix = (config.public.booking as any).adminPrefix
const mobileOpen = ref(false)

const navItems = [
  { path: adminPrefix, icon: 'i-heroicons-squares-2x2', label: 'Dashboard', exact: true },
  { separator: 'Gestion', path: `${adminPrefix}/appointments`, icon: 'i-heroicons-calendar-days', label: 'Rendez-vous' },
  { path: `${adminPrefix}/calendar`, icon: 'i-heroicons-calendar', label: 'Calendrier' },
  { separator: 'Configuration', path: `${adminPrefix}/services`, icon: 'i-heroicons-scissors', label: 'Prestations' },
  { path: `${adminPrefix}/availability`, icon: 'i-heroicons-clock', label: 'Disponibilités' },
  { path: `${adminPrefix}/custom-fields`, icon: 'i-heroicons-adjustments-horizontal', label: 'Champs personnalisés' },
  { separator: 'Système', path: `${adminPrefix}/email-templates`, icon: 'i-heroicons-envelope', label: 'Emails' },
  { path: `${adminPrefix}/settings`, icon: 'i-heroicons-cog-6-tooth', label: 'Paramètres' },
  { path: `${adminPrefix}/users`, icon: 'i-heroicons-users', label: 'Utilisateurs', superadmin: true },
]

const visibleNav = computed(() =>
  navItems.filter(item => !item.superadmin || authStore.isSuperAdmin)
)

const initials = computed(() => {
  const f = authStore.user?.firstName?.[0] ?? ''
  const l = authStore.user?.lastName?.[0] ?? ''
  return (f + l).toUpperCase()
})

function isActive(path: string): boolean {
  const item = navItems.find(n => n.path === path)
  if (item?.exact) return route.path === path
  return route.path.startsWith(path)
}

function onLogout() {
  logout()
}
</script>

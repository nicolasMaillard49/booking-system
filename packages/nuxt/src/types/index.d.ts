import type { BookingModuleOptions } from '../module'

declare module 'nuxt/schema' {
  interface NuxtConfig {
    booking?: BookingModuleOptions
  }
  interface NuxtOptions {
    booking?: BookingModuleOptions
  }
  interface PublicRuntimeConfig {
    booking: {
      apiBase: string
      publicPrefix: string
      adminPrefix: string
    }
  }
}

export {}

import {
  defineNuxtModule,
  addPlugin,
  addComponentsDir,
  addImportsDir,
  extendPages,
  createResolver,
} from '@nuxt/kit'

export interface BookingModuleOptions {
  // URL de base de l'API NestJS
  apiBase: string

  // Préfixe des pages publiques de réservation
  publicPrefix: string

  // Préfixe des pages admin
  adminPrefix: string

  // Override de composants — le développeur peut remplacer n'importe quel composant
  components?: Partial<Record<string, string>>
}

export default defineNuxtModule<BookingModuleOptions>({
  meta: {
    name: '@booking/nuxt',
    configKey: 'booking',
    compatibility: { nuxt: '^3.0.0' },
  },

  defaults: {
    apiBase: 'http://localhost:3001',
    publicPrefix: '/booking',
    adminPrefix: '/admin',
    components: {},
  },

  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const runtimeDir = resolver.resolve('./runtime')

    // ── Rendre la config accessible dans le runtime ──────────────────────────
    nuxt.options.runtimeConfig.public.booking = {
      apiBase: options.apiBase,
      publicPrefix: options.publicPrefix,
      adminPrefix: options.adminPrefix,
    }

    // ── Pages ────────────────────────────────────────────────────────────────
    extendPages((pages) => {
      // Pages publiques
      pages.push(
        {
          name: 'booking-index',
          path: options.publicPrefix,
          file: resolver.resolve(runtimeDir, 'pages/booking/index.vue'),
        },
        {
          name: 'booking-service',
          path: `${options.publicPrefix}/:serviceId`,
          file: resolver.resolve(runtimeDir, 'pages/booking/[serviceId].vue'),
        },
        {
          name: 'booking-confirm',
          path: `${options.publicPrefix}/:serviceId/confirm`,
          file: resolver.resolve(runtimeDir, 'pages/booking/confirm.vue'),
        },
        {
          name: 'booking-success',
          path: `${options.publicPrefix}/success`,
          file: resolver.resolve(runtimeDir, 'pages/booking/success.vue'),
        },
        {
          name: 'booking-appointment',
          path: '/appointment/:token',
          file: resolver.resolve(runtimeDir, 'pages/appointment/[token].vue'),
        },
        // Pages admin
        {
          name: 'admin-login',
          path: `${options.adminPrefix}/login`,
          file: resolver.resolve(runtimeDir, 'pages/admin/login.vue'),
        },
        {
          name: 'admin-index',
          path: options.adminPrefix,
          file: resolver.resolve(runtimeDir, 'pages/admin/index.vue'),
        },
        {
          name: 'admin-appointments',
          path: `${options.adminPrefix}/appointments`,
          file: resolver.resolve(runtimeDir, 'pages/admin/appointments/index.vue'),
        },
        {
          name: 'admin-appointment-detail',
          path: `${options.adminPrefix}/appointments/:id`,
          file: resolver.resolve(runtimeDir, 'pages/admin/appointments/[id].vue'),
        },
        {
          name: 'admin-calendar',
          path: `${options.adminPrefix}/calendar`,
          file: resolver.resolve(runtimeDir, 'pages/admin/calendar.vue'),
        },
        {
          name: 'admin-services',
          path: `${options.adminPrefix}/services`,
          file: resolver.resolve(runtimeDir, 'pages/admin/services/index.vue'),
        },
        {
          name: 'admin-availability',
          path: `${options.adminPrefix}/availability`,
          file: resolver.resolve(runtimeDir, 'pages/admin/availability/index.vue'),
        },
        {
          name: 'admin-custom-fields',
          path: `${options.adminPrefix}/custom-fields`,
          file: resolver.resolve(runtimeDir, 'pages/admin/custom-fields/index.vue'),
        },
        {
          name: 'admin-email-templates',
          path: `${options.adminPrefix}/email-templates`,
          file: resolver.resolve(runtimeDir, 'pages/admin/email-templates/index.vue'),
        },
        {
          name: 'admin-settings',
          path: `${options.adminPrefix}/settings`,
          file: resolver.resolve(runtimeDir, 'pages/admin/settings/index.vue'),
        },
        {
          name: 'admin-users',
          path: `${options.adminPrefix}/users`,
          file: resolver.resolve(runtimeDir, 'pages/admin/users/index.vue'),
        },
      )
    })

    // ── Composants auto-importés préfixés "Booking" ──────────────────────────
    addComponentsDir({
      path: resolver.resolve(runtimeDir, 'components'),
      prefix: 'Booking',
      global: true,
    })

    // ── Composables auto-importés ────────────────────────────────────────────
    addImportsDir(resolver.resolve(runtimeDir, 'composables'))
    addImportsDir(resolver.resolve(runtimeDir, 'stores'))

    // ── Plugin principal (api + auth store) ──────────────────────────────────
    addPlugin(resolver.resolve(runtimeDir, 'plugins/booking'))
  },
})

// packages/nest/src/booking.module.ts

import { DynamicModule, Global, Module } from '@nestjs/common'
import { BookingConfig } from '@booking/shared'
import { SettingsModule } from './modules/settings/settings.module'
import { Service } from './modules/service/entities/service.entity'
import { ServiceModule } from './modules/service/service.module'
import { AvailabilityModule } from './modules/availability/availability.module'
import { AppointmentModule } from './modules/appointment/appointment.module'
import { CustomFieldsModule } from './modules/custom-fields/custom-fields.module'
import { MagicLinkModule } from './modules/magic-link/magic-link.module'
import { MailModule } from './modules/mail/mail.module'
import { EmailTemplatesModule } from './modules/email-templates/email-templates.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { SchedulerModule } from './modules/scheduler/scheduler.module'

import { BOOKING_CONFIG } from './common/constants'
export { BOOKING_CONFIG } from './common/constants'

// Module interne global — rend BOOKING_CONFIG injectable partout dans le package
@Global()
@Module({})
class BookingConfigModule {
    static register(config: BookingConfig): DynamicModule {
        return {
            module: BookingConfigModule,
            providers: [{ provide: BOOKING_CONFIG, useValue: config }],
            exports: [BOOKING_CONFIG],
            global: true,
        }
    }
}

@Module({})
export class BookingModule {
    static register(config: BookingConfig): DynamicModule {
        return {
            module: BookingModule,

            imports: [
                BookingConfigModule.register(config),
                SettingsModule,
                ServiceModule,
                AvailabilityModule,
                AppointmentModule,
                CustomFieldsModule,
                MagicLinkModule,
                MailModule,
                EmailTemplatesModule,
                AuthModule,
                UsersModule,
                SchedulerModule,
            ],

            exports: [BookingConfigModule],

            global: false,
        }
    }
}
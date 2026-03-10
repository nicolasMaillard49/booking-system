import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Appointment } from './entities/appointment.entity'
import { AppointmentService } from './appointment.service'
import { AppointmentController } from './appointment.controller'
import { AppointmentAdminController } from './appointment-admin.controller'
import { CustomFieldValue } from '../custom-fields/entities/custom-field-value.entity'
import { CustomFieldDefinition } from '../custom-fields/entities/custom-field-definition.entity'
import { Service } from '../service/entities/service.entity'
import { SettingsModule } from '../settings/settings.module'
import { AvailabilityModule } from '../availability/availability.module'
import { MagicLinkModule } from '../magic-link/magic-link.module'
import { MailModule } from '../mail/mail.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      CustomFieldValue,
      CustomFieldDefinition,
      Service,
    ]),
    SettingsModule,
    AvailabilityModule,
    MagicLinkModule,
    MailModule,
  ],
  controllers: [AppointmentController, AppointmentAdminController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}

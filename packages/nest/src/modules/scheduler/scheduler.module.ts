import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'
import { Appointment } from '../appointment/entities/appointment.entity'
import { ReminderService } from './reminder.service'
import { SettingsModule } from '../settings/settings.module'
import { MailModule } from '../mail/mail.module'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Appointment]),
    SettingsModule,
    MailModule,
  ],
  providers: [ReminderService],
})
export class SchedulerModule {}

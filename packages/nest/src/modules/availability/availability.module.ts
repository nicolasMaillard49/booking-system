import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AvailabilityRule } from './entities/availability-rule.entity'
import { AvailabilityBreak } from './entities/availability-break.entity'
import { AvailabilityException } from './entities/availability-exception.entity'
import { AvailabilityService } from './availability.service'
import { AvailabilityController } from './availability.controller'
import { SlotGeneratorService } from './slot-generator.service'
import { SettingsModule } from '../settings/settings.module'
import { ServiceModule } from '../service/service.module'
import { Appointment } from '../appointment/entities/appointment.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AvailabilityRule,
      AvailabilityBreak,
      AvailabilityException,
      Appointment, // Nécessaire pour SlotGeneratorService
    ]),
    SettingsModule,
    ServiceModule,
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService, SlotGeneratorService],
  exports: [AvailabilityService, SlotGeneratorService],
})
export class AvailabilityModule {}

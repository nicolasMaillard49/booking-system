import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator'
import { AppointmentStatus } from '@booking/shared'

export class UpdateAppointmentAdminDto {

  @IsDateString()
  @IsOptional()
  startAt?: string

  @IsString()
  @IsOptional()
  notes?: string

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus
}

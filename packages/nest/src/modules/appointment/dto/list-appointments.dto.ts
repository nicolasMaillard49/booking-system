import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator'
import { AppointmentStatus } from '@booking/shared'

export class ListAppointmentsDto {

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus

  @IsUUID()
  @IsOptional()
  serviceId?: string

  @IsDateString()
  @IsOptional()
  dateFrom?: string

  @IsDateString()
  @IsOptional()
  dateTo?: string

  // Recherche sur nom/email client
  @IsString()
  @IsOptional()
  search?: string

  @IsOptional()
  page?: number = 1

  @IsOptional()
  limit?: number = 20
}

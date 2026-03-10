import { IsDateString, IsOptional, IsString } from 'class-validator'

export class RejectAppointmentDto {

  @IsString()
  @IsOptional()
  reason?: string

  // Créneau alternatif proposé au client
  @IsDateString()
  @IsOptional()
  alternativeSlot?: string
}

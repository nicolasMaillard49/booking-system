import { Type } from 'class-transformer'
import { IsArray, IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator'
import { CustomFieldValueInputDto } from './create-appointment.dto'

export class UpdateAppointmentPublicDto {

  // Nouveau créneau souhaité
  @IsDateString()
  @IsOptional()
  startAt?: string

  @IsString()
  @IsOptional()
  clientNotes?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomFieldValueInputDto)
  @IsOptional()
  customFields?: CustomFieldValueInputDto[]
}

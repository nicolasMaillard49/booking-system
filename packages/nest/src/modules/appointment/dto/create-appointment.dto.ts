import { Type } from 'class-transformer'
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'

export class CustomFieldValueInputDto {
  @IsString()
  key: string

  @IsString()
  value: string
}

export class CreateAppointmentDto {

  @IsUUID()
  serviceId: string

  @IsString()
  @IsNotEmpty()
  clientFirstName: string

  @IsString()
  @IsNotEmpty()
  clientLastName: string

  @IsEmail()
  clientEmail: string

  @IsString()
  @IsNotEmpty()
  clientPhone: string

  // Créneau choisi par le client (ISO string)
  @IsDateString()
  startAt: string

  @IsString()
  @IsOptional()
  clientNotes?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomFieldValueInputDto)
  @IsOptional()
  customFields?: CustomFieldValueInputDto[]
}

import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator'
import { ExceptionType } from '../entities/availability-exception.entity'

export class CreateExceptionDto {
  @IsDateString()
  date: string

  @IsEnum(ExceptionType)
  @IsOptional()
  type?: ExceptionType

  @IsString()
  @IsOptional()
  openTime?: string

  @IsString()
  @IsOptional()
  closeTime?: string

  @IsString()
  @IsOptional()
  label?: string
}

export class UpdateExceptionDto extends CreateExceptionDto {}

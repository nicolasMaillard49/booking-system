import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { FieldType } from '@booking/shared'
import { PartialType } from '@nestjs/mapped-types'

export class FieldOptionDto {
  @IsString()
  value: string

  @IsString()
  label: string
}

export class CreateCustomFieldDto {

  @IsString()
  @IsNotEmpty()
  key: string

  @IsString()
  @IsNotEmpty()
  label: string

  @IsEnum(FieldType)
  type: FieldType

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldOptionDto)
  @IsOptional()
  options?: FieldOptionDto[]

  @IsBoolean()
  @IsOptional()
  isRequired?: boolean

  @IsBoolean()
  @IsOptional()
  isActive?: boolean

  @IsInt()
  @IsOptional()
  sortOrder?: number

  @IsString()
  @IsOptional()
  placeholder?: string

  @IsOptional()
  validation?: Record<string, unknown>

  @IsArray()
  @IsOptional()
  serviceIds?: string[]
}

export class UpdateCustomFieldDto extends PartialType(CreateCustomFieldDto) {}

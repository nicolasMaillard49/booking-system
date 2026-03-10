import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator'

export class AvailabilityBreakDto {
  @IsString()
  startTime: string

  @IsString()
  endTime: string
}

export class AvailabilityRuleDto {
  // 0 = Lundi, 6 = Dimanche
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number

  @IsString()
  openTime: string

  @IsString()
  closeTime: string

  @IsBoolean()
  @IsOptional()
  isActive?: boolean

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityBreakDto)
  @IsOptional()
  breaks?: AvailabilityBreakDto[]
}

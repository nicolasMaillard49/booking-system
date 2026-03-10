// packages/nest/src/modules/settings/dto/update-settings.dto.ts

import { IsString, IsBoolean, IsNumber, IsArray, IsOptional, Min } from 'class-validator'

export class UpdateSettingsDto {

    @IsString()
    @IsOptional()
    businessName?: string

    @IsString()
    @IsOptional()
    address?: string

    @IsString()
    @IsOptional()
    phone?: string

    @IsString()
    @IsOptional()
    email?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsOptional()
    instructions?: string

    @IsBoolean()
    @IsOptional()
    autoConfirm?: boolean

    @IsNumber()
    @Min(15)
    @IsOptional()
    slotDuration?: number

    @IsNumber()
    @Min(0)
    @IsOptional()
    bufferBetweenSlots?: number

    @IsNumber()
    @Min(1)
    @IsOptional()
    maxDaysInAdvance?: number

    @IsNumber()
    @Min(0)
    @IsOptional()
    minHoursBeforeBooking?: number

    @IsNumber()
    @Min(0)
    @IsOptional()
    cancellationDeadlineHours?: number

    @IsNumber()
    @Min(0)
    @IsOptional()
    modificationDeadlineHours?: number

    @IsNumber()
    @Min(1)
    @IsOptional()
    magicLinkExpirationHours?: number

    @IsArray()
    @IsOptional()
    reminderHoursBefore?: number[]

    @IsString()
    @IsOptional()
    timezone?: string
}
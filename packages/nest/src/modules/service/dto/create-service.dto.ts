// packages/nest/src/modules/service/dto/create-service.dto.ts

import { IsString, IsNumber, IsBoolean, IsOptional, Min, IsNotEmpty } from 'class-validator'

export class CreateServiceDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsOptional()
    description?: string

    // Durée en minutes — minimum 5 minutes
    @IsNumber()
    @Min(5)
    duration: number

    @IsNumber()
    @IsOptional()
    price?: number

    @IsBoolean()
    @IsOptional()
    isPriceVisible?: boolean

    // Délai minimum en heures
    @IsNumber()
    @Min(0)
    @IsOptional()
    minBookingDelay?: number

    // Délai maximum en jours
    @IsNumber()
    @Min(1)
    @IsOptional()
    maxBookingDelay?: number

    @IsBoolean()
    @IsOptional()
    isActive?: boolean

    @IsNumber()
    @IsOptional()
    sortOrder?: number
}
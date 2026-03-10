// packages/nest/src/modules/service/dto/update-service.dto.ts

import { PartialType } from '@nestjs/mapped-types'
import { CreateServiceDto } from './create-service.dto'

// PartialType rend tous les champs de CreateServiceDto optionnels
// Pas besoin de tout réécrire
export class UpdateServiceDto extends PartialType(CreateServiceDto) { }
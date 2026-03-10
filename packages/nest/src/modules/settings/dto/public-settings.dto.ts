// packages/nest/src/modules/settings/dto/public-settings.dto.ts

// Ce que le client peut voir — pas de config technique exposée
export class PublicSettingsDto {
    businessName: string
    address: string | null
    phone: string | null
    email: string | null
    description: string | null
    instructions: string | null
    timezone: string
}
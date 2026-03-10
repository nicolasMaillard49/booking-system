// packages/shared/src/types/booking-config.types.ts

// Configuration obligatoire - le développeur DOIT fournir ces valeurs
export interface BookingConfigRequired {
    // Clé secrète pour signer les JWT admin
    jwtSecret: string

    resendApiKey: string       // Clé API Resend pour les emails
    frontendUrl: string         // URL du frontend (pour les liens magiques dans les emails)  
}

// Configuration optionnelle - des valeurs par défaut seront appliquées
export interface BookingConfigOptional {
    //ajoute une valeur par defaut 
    autoConfirm?: boolean   // défaut: false
    timezone?: string            // défaut: 'Europe/Paris'
    adminPrefix?: string         // défaut: '/admin'
    publicPrefix?: string        // défaut: '/booking'
}

// Interface finale qui combine les deux
export type BookingConfig = BookingConfigRequired & BookingConfigOptional
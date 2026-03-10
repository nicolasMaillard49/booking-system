// packages/shared/src/types/custom-field.types.ts

import { FieldType } from '../enums/field-type.enum'

// Règles de validation appliquées sur la valeur d'un champ
export interface FieldValidationRule {
    min?: number        // Valeur/longueur minimum
    max?: number        // Valeur/longueur maximum
    pattern?: string    // Regex de validation
    patternMessage?: string  // Message affiché si pattern non respecté
}

// Définition complète d'un champ custom (utilisé côté admin et frontend)
export interface CustomFieldDefinitionConfig {
    key: string           // Identifiant technique unique ex: "allergies"
    label: string         // Label affiché au client
    type: FieldType       // Type du champ
    options?: {           // Pour SELECT, RADIO, CHECKBOX uniquement
        value: string
        label: string
    }[]
    isRequired?: boolean
    placeholder?: string
    validation?: FieldValidationRule
    serviceIds?: string[] // null = visible pour tous les services
}
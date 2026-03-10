// packages/shared/src/types/appointment.types.ts

import { AppointmentStatus } from '../enums/appointment-status.enum'

// Ce que le client voit de son RDV via le lien magique
export interface AppointmentPublic {
    id: string
    status: AppointmentStatus
    startAt: string
    endAt: string
    clientFirstName: string
    clientLastName: string
    clientEmail: string
    clientPhone: string
    serviceName: string
    clientNotes?: string
}

// Version condensée pour les listes admin
export interface AppointmentSummary {
    id: string
    status: AppointmentStatus
    startAt: string
    endAt: string
    clientFirstName: string
    clientLastName: string
    clientEmail: string
    serviceName: string
}

// Version complète pour le détail admin
export interface AppointmentDetail extends AppointmentSummary {
    clientPhone: string
    clientNotes?: string
    notes?: string                    // Notes internes admin
    rejectionReason?: string
    alternativeSlot?: string
    autoConfirmed: boolean
    customFieldValues: {
        key: string
        label: string
        value: string
    }[]
    createdAt: string
    updatedAt: string
}
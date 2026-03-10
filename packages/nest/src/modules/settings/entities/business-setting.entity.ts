// packages/nest/src/modules/settings/entities/business-setting.entity.ts

import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('business_settings')
export class BusinessSetting {

  // Toujours 1 — c'est un singleton
  @PrimaryColumn({ type: 'int' })
  id: number

  @Column({ length: 255 })
  businessName: string

  @Column({ type: 'text', nullable: true })
  address: string | null

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null

  // Description publique affichée au client (markdown)
  @Column({ type: 'text', nullable: true })
  description: string | null

  // Consignes affichées au client après réservation (markdown)
  @Column({ type: 'text', nullable: true })
  instructions: string | null

  // Si true, les RDV sont confirmés automatiquement sans validation admin
  @Column({ default: false })
  autoConfirm: boolean

  // Durée d'un créneau en minutes (ex: 30)
  @Column({ default: 30 })
  slotDuration: number

  // Temps tampon entre deux RDV en minutes (ex: 15)
  @Column({ default: 0 })
  bufferBetweenSlots: number

  // Nombre maximum de jours à l'avance pour réserver
  @Column({ default: 60 })
  maxDaysInAdvance: number

  // Délai minimum en heures avant de pouvoir réserver
  @Column({ default: 1 })
  minHoursBeforeBooking: number

  // Délai minimum en heures avant le RDV pour pouvoir annuler
  @Column({ default: 24 })
  cancellationDeadlineHours: number

  // Délai minimum en heures avant le RDV pour pouvoir modifier
  @Column({ default: 24 })
  modificationDeadlineHours: number

  // Durée de validité du lien magique en heures
  @Column({ default: 48 })
  magicLinkExpirationHours: number

  // Heures avant le RDV auxquelles envoyer un rappel (ex: [24, 2])
  @Column({ type: 'int', array: true, default: [24] })
  reminderHoursBefore: number[]

  // Timezone utilisée pour tous les calculs de créneaux
  @Column({ length: 50, default: 'Europe/Paris' })
  timezone: string
}
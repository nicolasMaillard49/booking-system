import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { AppointmentStatus } from '@booking/shared'
import { Service } from '../../service/entities/service.entity'
import { CustomFieldValue } from '../../custom-fields/entities/custom-field-value.entity'

@Entity('appointments')
export class Appointment {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Service, { onDelete: 'RESTRICT', eager: false })
  @JoinColumn({ name: 'service_id' })
  service: Service

  @Column({ name: 'service_id' })
  serviceId: string

  @Column({ length: 100 })
  clientFirstName: string

  @Column({ length: 100 })
  clientLastName: string

  @Column({ length: 255 })
  clientEmail: string

  @Column({ length: 30 })
  clientPhone: string

  @Column({ type: 'timestamptz' })
  startAt: Date

  @Column({ type: 'timestamptz' })
  endAt: Date

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus

  // Notes internes admin — non visibles par le client
  @Column({ type: 'text', nullable: true })
  notes: string | null

  // Notes du client lors de la réservation
  @Column({ type: 'text', nullable: true })
  clientNotes: string | null

  // Motif de refus
  @Column({ type: 'text', nullable: true })
  rejectionReason: string | null

  // Créneau alternatif proposé lors d'un refus
  @Column({ type: 'timestamptz', nullable: true })
  alternativeSlot: Date | null

  // Token pour les liens magiques client
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  magicToken: string | null

  @Column({ type: 'timestamptz', nullable: true })
  magicTokenExpiresAt: Date | null

  @Column({ default: false })
  magicTokenUsed: boolean

  // true si confirmé automatiquement sans validation admin
  @Column({ default: false })
  autoConfirmed: boolean

  // Tableau des timestamps de rappels déjà envoyés
  @Column({ type: 'timestamptz', array: true, default: [] })
  reminderSentAt: Date[]

  @OneToMany(() => CustomFieldValue, (cfv) => cfv.appointment, {
    cascade: true,
    eager: true,
  })
  customFieldValues: CustomFieldValue[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

export enum ExceptionType {
  CLOSED = 'CLOSED',
  CUSTOM_HOURS = 'CUSTOM_HOURS',
}

@Entity('availability_exceptions')
export class AvailabilityException {

  @PrimaryGeneratedColumn('uuid')
  id: string

  // Date de l'exception ex: "2024-12-25"
  @Column({ type: 'date', unique: true })
  date: string

  @Column({
    type: 'enum',
    enum: ExceptionType,
    default: ExceptionType.CLOSED,
  })
  type: ExceptionType

  // Uniquement si type = CUSTOM_HOURS
  @Column({ type: 'time', nullable: true })
  openTime: string | null

  @Column({ type: 'time', nullable: true })
  closeTime: string | null

  // Label lisible ex: "Noël", "Vacances d'été"
  @Column({ type: 'varchar', length: 255, nullable: true })
  label: string | null
}

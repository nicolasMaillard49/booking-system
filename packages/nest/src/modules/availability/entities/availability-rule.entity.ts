import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { AvailabilityBreak } from './availability-break.entity'

@Entity('availability_rules')
export class AvailabilityRule {

  @PrimaryGeneratedColumn('uuid')
  id: string

  // 0 = Lundi, 6 = Dimanche
  @Column({ type: 'smallint' })
  dayOfWeek: number

  // Format HH:mm ex: "09:00"
  @Column({ type: 'time' })
  openTime: string

  @Column({ type: 'time' })
  closeTime: string

  @Column({ default: true })
  isActive: boolean

  @OneToMany(() => AvailabilityBreak, (b) => b.rule, {
    cascade: true,
    eager: true,
  })
  breaks: AvailabilityBreak[]
}

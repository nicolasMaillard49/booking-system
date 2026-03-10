import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { AvailabilityRule } from './availability-rule.entity'

@Entity('availability_breaks')
export class AvailabilityBreak {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => AvailabilityRule, (r) => r.breaks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'availability_rule_id' })
  rule: AvailabilityRule

  // Format HH:mm ex: "12:00"
  @Column({ type: 'time' })
  startTime: string

  @Column({ type: 'time' })
  endTime: string
}

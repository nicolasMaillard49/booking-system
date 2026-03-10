import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { Appointment } from '../../appointment/entities/appointment.entity'
import { CustomFieldDefinition } from './custom-field-definition.entity'

@Entity('custom_field_values')
export class CustomFieldValue {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Appointment, (a) => a.customFieldValues, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment

  @Column({ name: 'appointment_id' })
  appointmentId: string

  @ManyToOne(() => CustomFieldDefinition, (cfd) => cfd.values, { eager: true })
  @JoinColumn({ name: 'field_definition_id' })
  fieldDefinition: CustomFieldDefinition

  @Column({ name: 'field_definition_id' })
  fieldDefinitionId: string

  @Column({ type: 'text' })
  value: string
}

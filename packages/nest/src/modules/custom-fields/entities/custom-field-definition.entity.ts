import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { FieldType } from '@booking/shared'
import { CustomFieldValue } from './custom-field-value.entity'

@Entity('custom_field_definitions')
export class CustomFieldDefinition {

  @PrimaryGeneratedColumn('uuid')
  id: string

  // Identifiant technique unique ex: "allergies", "vehicle_type"
  @Column({ length: 100, unique: true })
  key: string

  @Column({ length: 255 })
  label: string

  @Column({ type: 'enum', enum: FieldType })
  type: FieldType

  // Options pour SELECT, RADIO, CHECKBOX — stockées en JSON
  @Column({ type: 'jsonb', nullable: true })
  options: { value: string; label: string }[] | null

  @Column({ default: false })
  isRequired: boolean

  @Column({ default: true })
  isActive: boolean

  @Column({ type: 'int', default: 0 })
  sortOrder: number

  @Column({ type: 'varchar', length: 255, nullable: true })
  placeholder: string | null

  // Règles de validation JSON ex: { min: 2, max: 100 }
  @Column({ type: 'jsonb', nullable: true })
  validation: Record<string, unknown> | null

  // null = visible pour tous les services, sinon liste d'IDs
  @Column({ type: 'uuid', array: true, nullable: true })
  serviceIds: string[] | null

  @OneToMany(() => CustomFieldValue, (cfv) => cfv.fieldDefinition)
  values: CustomFieldValue[]
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { EmailType } from '@booking/shared'

@Entity('email_template_configs')
export class EmailTemplateConfig {

  @PrimaryGeneratedColumn('uuid')
  id: string

  // Un seul enregistrement par type d'email
  @Column({ type: 'enum', enum: EmailType, unique: true })
  type: EmailType

  // Sujet de l'email — supporte les variables {{clientFirstName}} etc.
  @Column({ length: 255 })
  subject: string

  // Si false, cet email n'est pas envoyé
  @Column({ default: true })
  isEnabled: boolean

  // Contenu additionnel libre affiché en bas de l'email
  @Column({ type: 'text', nullable: true })
  extraContent: string | null
}

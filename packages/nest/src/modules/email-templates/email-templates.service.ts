import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EmailTemplateConfig } from './entities/email-template-config.entity'
import { UpdateEmailTemplateDto } from './dto/email-template.dto'
import { EmailType } from '@booking/shared'

// Sujets par défaut pour chaque type d'email
const DEFAULT_SUBJECTS: Record<EmailType, string> = {
  [EmailType.REQUEST_RECEIVED]: 'Votre demande de rendez-vous a bien été reçue',
  [EmailType.CONFIRMED]: 'Votre rendez-vous est confirmé',
  [EmailType.REJECTED]: 'Votre demande de rendez-vous',
  [EmailType.MODIFIED]: 'Votre rendez-vous a été modifié',
  [EmailType.CANCELLED]: 'Votre rendez-vous a été annulé',
  [EmailType.REMINDER]: 'Rappel : votre rendez-vous approche',
}

@Injectable()
export class EmailTemplatesService implements OnModuleInit {

  constructor(
    @InjectRepository(EmailTemplateConfig)
    private readonly repo: Repository<EmailTemplateConfig>,
  ) {}

  // Seed automatique au démarrage — crée les 6 templates s'ils n'existent pas
  async onModuleInit(): Promise<void> {
    for (const type of Object.values(EmailType)) {
      const existing = await this.repo.findOne({ where: { type } })
      if (!existing) {
        await this.repo.save(
          this.repo.create({
            type,
            subject: DEFAULT_SUBJECTS[type],
            isEnabled: true,
          }),
        )
      }
    }
  }

  async findAll(): Promise<EmailTemplateConfig[]> {
    return this.repo.find()
  }

  async findOne(type: EmailType): Promise<EmailTemplateConfig> {
    const template = await this.repo.findOne({ where: { type } })
    if (!template) throw new NotFoundException(`Template ${type} introuvable`)
    return template
  }

  async update(type: EmailType, dto: UpdateEmailTemplateDto): Promise<EmailTemplateConfig> {
    await this.findOne(type)
    await this.repo.update({ type }, dto)
    return this.findOne(type)
  }
}

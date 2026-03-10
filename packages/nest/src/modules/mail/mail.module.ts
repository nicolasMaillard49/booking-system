import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MailService } from './mail.service'
import { EmailTemplateConfig } from '../email-templates/entities/email-template-config.entity'
import { SettingsModule } from '../settings/settings.module'
import { MagicLinkModule } from '../magic-link/magic-link.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailTemplateConfig]),
    SettingsModule,
    MagicLinkModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

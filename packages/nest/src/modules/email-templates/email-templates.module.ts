import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmailTemplateConfig } from './entities/email-template-config.entity'
import { EmailTemplatesService } from './email-templates.service'
import { EmailTemplatesController } from './email-templates.controller'
import { MailModule } from '../mail/mail.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailTemplateConfig]),
    MailModule,
  ],
  controllers: [EmailTemplatesController],
  providers: [EmailTemplatesService],
  exports: [EmailTemplatesService],
})
export class EmailTemplatesModule {}

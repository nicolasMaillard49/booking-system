import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { EmailTemplatesService } from './email-templates.service'
import { UpdateEmailTemplateDto } from './dto/email-template.dto'
import { EmailType } from '@booking/shared'
import { MailService } from '../mail/mail.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('admin/email-templates')
export class EmailTemplatesController {

  constructor(
    private readonly emailTemplatesService: EmailTemplatesService,
    private readonly mailService: MailService,
  ) {}

  // GET /admin/email-templates
  @Get()
  async findAll() {
    return this.emailTemplatesService.findAll()
  }

  // PATCH /admin/email-templates/:type
  @Patch(':type')
  async update(
    @Param('type') type: EmailType,
    @Body() dto: UpdateEmailTemplateDto,
  ) {
    return this.emailTemplatesService.update(type, dto)
  }

  // POST /admin/email-templates/:type/test
  // Envoie un email de test à l'admin connecté
  @Post(':type/test')
  async sendTest(
    @Param('type') type: string,
    @Body() body: { to: string },
  ) {
    await this.mailService.sendTestEmail(type as any, body.to)
    return { success: true }
  }
}

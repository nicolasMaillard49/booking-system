import { Inject, Injectable } from '@nestjs/common'
import { Resend } from 'resend'
import { BOOKING_CONFIG } from '../../common/constants'
import { BookingConfig } from '@booking/shared'
import { EmailTemplateConfig } from '../email-templates/entities/email-template-config.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SettingsService } from '../settings/settings.service'
import { MagicLinkService } from '../magic-link/magic-link.service'

export type EmailEventType =
  | 'request_received'
  | 'confirmed'
  | 'rejected'
  | 'modified'
  | 'cancelled'
  | 'reminder'

@Injectable()
export class MailService {

  private resend: Resend

  constructor(
    @Inject(BOOKING_CONFIG) private readonly config: BookingConfig,
    @InjectRepository(EmailTemplateConfig)
    private readonly templateRepo: Repository<EmailTemplateConfig>,
    private readonly settingsService: SettingsService,
    private readonly magicLinkService: MagicLinkService,
  ) {
    this.resend = new Resend(config.resendApiKey)
  }

  async sendAppointmentEmail(type: EmailEventType, context: any): Promise<void> {
    // Charger la config du template
    const template = await this.templateRepo.findOne({ where: { type } })
    if (!template || !template.isEnabled) return

    const settings = await this.settingsService.get()

    // Construire le lien magique si disponible
    const magicLink = context.magicToken
      ? this.magicLinkService.buildUrl(this.config.frontendUrl, context.magicToken)
      : null

    const html = this.buildHtml(type, context, settings, template, magicLink)

    await this.resend.emails.send({
      from: `${settings.businessName} <noreply@${this.extractDomain(this.config.frontendUrl)}>`,
      to: context.clientEmail,
      subject: this.interpolate(template.subject, context),
      html,
    })
  }

  // Envoi d'un email de test depuis le dashboard admin
  async sendTestEmail(type: EmailEventType, to: string): Promise<void> {
    const mockContext = {
      clientFirstName: 'Jean',
      clientLastName: 'Dupont',
      clientEmail: to,
      startAt: new Date(),
      serviceName: 'Prestation de test',
      magicToken: null,
    }
    await this.sendAppointmentEmail(type, mockContext)
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private buildHtml(
    type: EmailEventType,
    context: any,
    settings: any,
    template: EmailTemplateConfig,
    magicLink: string | null,
  ): string {
    const formattedDate = new Date(context.startAt).toLocaleString('fr-FR', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: settings.timezone,
    })

    const baseContent = this.getBaseContent(type, context, formattedDate, magicLink)
    const extraContent = template.extraContent
      ? `<p style="margin-top:16px">${template.extraContent}</p>`
      : ''

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"></head>
      <body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1a1a1a">
        <h1 style="font-size:20px;margin-bottom:8px">${settings.businessName}</h1>
        <hr style="border:none;border-top:1px solid #e5e5e5;margin-bottom:24px">
        ${baseContent}
        ${extraContent}
        ${settings.address ? `<p style="color:#666;font-size:13px;margin-top:24px">${settings.address}</p>` : ''}
      </body>
      </html>
    `
  }

  private getBaseContent(
    type: EmailEventType,
    context: any,
    formattedDate: string,
    magicLink: string | null,
  ): string {
    const name = `${context.clientFirstName} ${context.clientLastName}`
    const magicLinkHtml = magicLink
      ? `<p><a href="${magicLink}" style="color:#4f46e5">Gérer mon rendez-vous</a></p>`
      : ''

    const templates: Record<EmailEventType, string> = {
      request_received: `
        <p>Bonjour ${name},</p>
        <p>Votre demande de rendez-vous a bien été reçue pour le <strong>${formattedDate}</strong>.</p>
        <p>Elle est en attente de confirmation. Vous recevrez un email dès qu'elle sera traitée.</p>
        ${magicLinkHtml}
      `,
      confirmed: `
        <p>Bonjour ${name},</p>
        <p>Votre rendez-vous du <strong>${formattedDate}</strong> est confirmé.</p>
        ${magicLinkHtml}
      `,
      rejected: `
        <p>Bonjour ${name},</p>
        <p>Votre demande de rendez-vous du <strong>${formattedDate}</strong> n'a pas pu être acceptée.</p>
        ${context.rejectionReason ? `<p>Motif : ${context.rejectionReason}</p>` : ''}
        ${context.alternativeSlot ? `<p>Un créneau alternatif vous est proposé : <strong>${new Date(context.alternativeSlot).toLocaleString('fr-FR')}</strong></p>` : ''}
      `,
      modified: `
        <p>Bonjour ${name},</p>
        <p>Votre rendez-vous a été modifié. Nouveau créneau : <strong>${formattedDate}</strong>.</p>
        ${magicLinkHtml}
      `,
      cancelled: `
        <p>Bonjour ${name},</p>
        <p>Votre rendez-vous du <strong>${formattedDate}</strong> a été annulé.</p>
      `,
      reminder: `
        <p>Bonjour ${name},</p>
        <p>Rappel : vous avez un rendez-vous prévu le <strong>${formattedDate}</strong>.</p>
        ${magicLinkHtml}
      `,
    }

    return templates[type]
  }

  // Remplace les variables dans le sujet ex: "RDV {{clientFirstName}}"
  private interpolate(template: string, context: any): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => context[key] ?? '')
  }

  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname
    } catch {
      return 'booking.app'
    }
  }
}

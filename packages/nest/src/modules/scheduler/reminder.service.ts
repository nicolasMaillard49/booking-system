import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between } from 'typeorm'
import { Appointment } from '../appointment/entities/appointment.entity'
import { SettingsService } from '../settings/settings.service'
import { MailService } from '../mail/mail.service'
import { AppointmentStatus } from '@booking/shared'

@Injectable()
export class ReminderService {

  private readonly logger = new Logger(ReminderService.name)

  constructor(
    @InjectRepository(Appointment)
    private readonly repo: Repository<Appointment>,
    private readonly settingsService: SettingsService,
    private readonly mailService: MailService,
  ) {}

  // Tourne toutes les heures
  @Cron(CronExpression.EVERY_HOUR)
  async sendReminders(): Promise<void> {
    const settings = await this.settingsService.get()

    for (const hours of settings.reminderHoursBefore) {
      await this.processReminder(hours)
    }
  }

  private async processReminder(hoursBeforeAppt: number): Promise<void> {
    // Fenêtre de 30 min autour du moment cible
    const now = new Date()
    const targetFrom = new Date(now.getTime() + (hoursBeforeAppt - 0.5) * 60 * 60 * 1000)
    const targetTo = new Date(now.getTime() + (hoursBeforeAppt + 0.5) * 60 * 60 * 1000)

    const appointments = await this.repo.find({
      where: {
        status: AppointmentStatus.CONFIRMED,
        startAt: Between(targetFrom, targetTo),
      },
      relations: ['service'],
    })

    for (const appointment of appointments) {
      // Vérifier que le rappel n'a pas déjà été envoyé pour ce délai
      const alreadySent = appointment.reminderSentAt?.some((sentAt) => {
        const diff = Math.abs(sentAt.getTime() - targetFrom.getTime())
        return diff < 60 * 60 * 1000 // Dans la même heure
      })

      if (alreadySent) continue

      try {
        await this.mailService.sendAppointmentEmail('reminder', appointment)

        // Marquer le rappel comme envoyé
        await this.repo.update(appointment.id, {
          reminderSentAt: [...(appointment.reminderSentAt ?? []), new Date()],
        })

        this.logger.log(`Rappel envoyé pour RDV ${appointment.id}`)
      } catch (err) {
        this.logger.error(`Erreur rappel RDV ${appointment.id}`, err)
      }
    }
  }
}

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AvailabilityRule } from './entities/availability-rule.entity'
import { AvailabilityException, ExceptionType } from './entities/availability-exception.entity'
import { Appointment } from '../appointment/entities/appointment.entity'
import { BusinessSetting } from '../settings/entities/business-setting.entity'
import { AppointmentStatus } from '@booking/shared'

@Injectable()
export class SlotGeneratorService {

  constructor(
    @InjectRepository(AvailabilityRule)
    private readonly ruleRepo: Repository<AvailabilityRule>,
    @InjectRepository(AvailabilityException)
    private readonly exceptionRepo: Repository<AvailabilityException>,
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
  ) {}

  // Point d'entrée principal
  // date format: "YYYY-MM-DD"
  // serviceDuration: en minutes
  async getAvailableSlots(
    date: string,
    serviceDuration: number,
    settings: BusinessSetting,
  ): Promise<string[]> {

    // 1. Vérifier si la date est dans la fenêtre de réservation autorisée
    const now = new Date()
    const targetDate = new Date(date)
    const minDate = new Date(now.getTime() + settings.minHoursBeforeBooking * 60 * 60 * 1000)
    const maxDate = new Date(now.getTime() + settings.maxDaysInAdvance * 24 * 60 * 60 * 1000)

    if (targetDate < minDate || targetDate > maxDate) return []

    // 2. Vérifier les exceptions (jours fériés, vacances, etc.)
    const exception = await this.exceptionRepo.findOne({ where: { date } })
    if (exception?.type === ExceptionType.CLOSED) return []

    // 3. Déterminer les horaires d'ouverture
    let openTime: string
    let closeTime: string

    if (exception?.type === ExceptionType.CUSTOM_HOURS && exception.openTime && exception.closeTime) {
      openTime = exception.openTime
      closeTime = exception.closeTime
    } else {
      // 0 = Lundi en JS (getDay() retourne 0 = Dimanche, on normalise)
      const jsDay = targetDate.getDay() // 0=Dim, 1=Lun...6=Sam
      const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1 // Convertit en 0=Lun...6=Dim

      const rule = await this.ruleRepo.findOne({
        where: { dayOfWeek, isActive: true },
        relations: ['breaks'],
      })

      if (!rule) return [] // Jour fermé
      openTime = rule.openTime
      closeTime = rule.closeTime

      // 4. Générer les créneaux potentiels
      const slots = this.generateTimeSlots(
        date,
        openTime,
        closeTime,
        settings.slotDuration,
        serviceDuration,
        settings.bufferBetweenSlots,
        rule.breaks.map(b => ({ start: b.startTime, end: b.endTime })),
      )

      // 5. Filtrer les créneaux déjà pris
      return this.filterBookedSlots(slots, date, serviceDuration, settings.bufferBetweenSlots)
    }

    // Cas CUSTOM_HOURS sans pauses
    const slots = this.generateTimeSlots(
      date, openTime, closeTime,
      settings.slotDuration, serviceDuration,
      settings.bufferBetweenSlots, [],
    )
    return this.filterBookedSlots(slots, date, serviceDuration, settings.bufferBetweenSlots)
  }

  // Génère tous les créneaux potentiels d'une journée
  private generateTimeSlots(
    date: string,
    openTime: string,
    closeTime: string,
    slotDuration: number,
    serviceDuration: number,
    buffer: number,
    breaks: { start: string; end: string }[],
  ): Date[] {
    const slots: Date[] = []

    const open = new Date(`${date}T${openTime}:00`)
    const close = new Date(`${date}T${closeTime}:00`)

    let current = new Date(open)

    while (current.getTime() + serviceDuration * 60 * 1000 <= close.getTime()) {
      const slotEnd = new Date(current.getTime() + serviceDuration * 60 * 1000)

      // Vérifier que le créneau ne tombe pas dans une pause
      const inBreak = breaks.some(b => {
        const breakStart = new Date(`${date}T${b.start}:00`)
        const breakEnd = new Date(`${date}T${b.end}:00`)
        return current < breakEnd && slotEnd > breakStart
      })

      if (!inBreak) slots.push(new Date(current))

      // Avancer d'un slot (pas la durée du service)
      current = new Date(current.getTime() + slotDuration * 60 * 1000)
    }

    return slots
  }

  // Filtre les créneaux déjà réservés
  private async filterBookedSlots(
    slots: Date[],
    date: string,
    serviceDuration: number,
    buffer: number,
  ): Promise<string[]> {
    // Charger tous les RDV pending/confirmed de la journée
    const startOfDay = new Date(`${date}T00:00:00`)
    const endOfDay = new Date(`${date}T23:59:59`)

    const booked = await this.appointmentRepo
      .createQueryBuilder('a')
      .where('a.startAt >= :start', { start: startOfDay })
      .andWhere('a.startAt <= :end', { end: endOfDay })
      .andWhere('a.status IN (:...statuses)', {
        statuses: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
      })
      .getMany()

    const now = new Date()

    return slots
      .filter(slot => {
        // Exclure les créneaux passés
        if (slot <= now) return false

        const slotEnd = new Date(slot.getTime() + (serviceDuration + buffer) * 60 * 1000)

        // Vérifier chevauchement avec RDV existants
        const overlaps = booked.some(appt => {
          const apptEnd = new Date(appt.endAt)
          return slot < apptEnd && slotEnd > new Date(appt.startAt)
        })

        return !overlaps
      })
      .map(slot => slot.toISOString())
  }
}

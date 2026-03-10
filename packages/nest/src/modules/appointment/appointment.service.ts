import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { Appointment } from './entities/appointment.entity'
import { CustomFieldValue } from '../custom-fields/entities/custom-field-value.entity'
import { CustomFieldDefinition } from '../custom-fields/entities/custom-field-definition.entity'
import { Service } from '../service/entities/service.entity'
import { SettingsService } from '../settings/settings.service'
import { SlotGeneratorService } from '../availability/slot-generator.service'
import { MagicLinkService } from '../magic-link/magic-link.service'
import { MailService } from '../mail/mail.service'
import { CreateAppointmentDto } from './dto/create-appointment.dto'
import { UpdateAppointmentPublicDto } from './dto/update-appointment-public.dto'
import { UpdateAppointmentAdminDto } from './dto/update-appointment-admin.dto'
import { RejectAppointmentDto } from './dto/reject-appointment.dto'
import { ListAppointmentsDto } from './dto/list-appointments.dto'
import { AppointmentStatus } from '@booking/shared'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { BOOKING_EVENTS } from '../../common/events/booking.events'

@Injectable()
export class AppointmentService {

  constructor(
    @InjectRepository(Appointment)
    private readonly repo: Repository<Appointment>,
    @InjectRepository(CustomFieldValue)
    private readonly cfvRepo: Repository<CustomFieldValue>,
    @InjectRepository(CustomFieldDefinition)
    private readonly cfdRepo: Repository<CustomFieldDefinition>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    private readonly settingsService: SettingsService,
    private readonly slotGenerator: SlotGeneratorService,
    private readonly magicLinkService: MagicLinkService,
    private readonly mailService: MailService,
    private readonly eventEmitter: EventEmitter2,
    private readonly dataSource: DataSource,
  ) {}

  // ─── Création ───────────────────────────────────────────────────────────────

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const settings = await this.settingsService.get()
    const service = await this.serviceRepo.findOne({ where: { id: dto.serviceId } })
    if (!service) throw new NotFoundException('Service introuvable')

    const startAt = new Date(dto.startAt)
    const endAt = new Date(startAt.getTime() + service.duration * 60 * 1000)
    const date = dto.startAt.split('T')[0]

    // Vérifier que le créneau est disponible
    const availableSlots = await this.slotGenerator.getAvailableSlots(
      date, service.duration, settings,
    )
    if (!availableSlots.includes(startAt.toISOString())) {
      throw new ConflictException('Ce créneau n\'est plus disponible')
    }

    // Transaction pour éviter la double réservation
    return this.dataSource.transaction(async (manager) => {

      // Verrou pessimiste sur le créneau
      const existing = await manager
        .createQueryBuilder(Appointment, 'a')
        .where('a.startAt = :startAt', { startAt })
        .andWhere('a.status IN (:...statuses)', {
          statuses: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
        })
        .setLock('pessimistic_write')
        .getOne()

      if (existing) throw new ConflictException('Ce créneau vient d\'être pris')

      const status = settings.autoConfirm
        ? AppointmentStatus.CONFIRMED
        : AppointmentStatus.PENDING

      // Créer le RDV
      const appointment = manager.create(Appointment, {
        serviceId: dto.serviceId,
        clientFirstName: dto.clientFirstName,
        clientLastName: dto.clientLastName,
        clientEmail: dto.clientEmail,
        clientPhone: dto.clientPhone,
        clientNotes: dto.clientNotes,
        startAt,
        endAt,
        status,
        autoConfirmed: settings.autoConfirm,
      })

      const saved = await manager.save(appointment)

      // Sauvegarder les champs custom
      if (dto.customFields?.length) {
        await this.saveCustomFields(manager, saved.id, dto.customFields)
      }

      // Générer le lien magique
      const { token, expiresAt } = this.magicLinkService.generate(
        saved.id,
        settings.magicLinkExpirationHours,
      )
      await manager.update(Appointment, saved.id, {
        magicToken: token,
        magicTokenExpiresAt: expiresAt,
      })

      // Envoyer email
      const emailType = settings.autoConfirm ? 'confirmed' : 'request_received'
      await this.mailService.sendAppointmentEmail(emailType, {
        ...saved,
        magicToken: token,
        service,
      })

      this.eventEmitter.emit(BOOKING_EVENTS.APPOINTMENT_CREATED, saved)

      return manager.findOneOrFail(Appointment, {
        where: { id: saved.id },
        relations: ['service', 'customFieldValues'],
      })
    })
  }

  // ─── Lecture publique via magic link ────────────────────────────────────────

  async findByMagicToken(token: string): Promise<Appointment> {
    const appointment = await this.repo.findOne({
      where: { magicToken: token },
      relations: ['service', 'customFieldValues'],
    })
    if (!appointment) throw new NotFoundException('Lien invalide')
    this.magicLinkService.validate(appointment)
    return appointment
  }

  // ─── Modification via magic link ────────────────────────────────────────────

  async updateByMagicToken(token: string, dto: UpdateAppointmentPublicDto): Promise<Appointment> {
    const appointment = await this.findByMagicToken(token)
    const settings = await this.settingsService.get()

    // Vérifier le délai de modification
    const hoursBeforeAppt = (appointment.startAt.getTime() - Date.now()) / (1000 * 60 * 60)
    if (hoursBeforeAppt < settings.modificationDeadlineHours) {
      throw new BadRequestException('Délai de modification dépassé')
    }

    return this.dataSource.transaction(async (manager) => {
      const updates: Partial<Appointment> = {}

      if (dto.startAt) {
        const service = await this.serviceRepo.findOneOrFail({ where: { id: appointment.serviceId } })
        const newStart = new Date(dto.startAt)
        const newEnd = new Date(newStart.getTime() + service.duration * 60 * 1000)
        const date = dto.startAt.split('T')[0]

        const availableSlots = await this.slotGenerator.getAvailableSlots(
          date, service.duration, settings,
        )
        if (!availableSlots.includes(newStart.toISOString())) {
          throw new ConflictException('Ce créneau n\'est plus disponible')
        }

        updates.startAt = newStart
        updates.endAt = newEnd

        // Si le RDV était confirmé et autoConfirm est off → repasse en pending
        if (
          appointment.status === AppointmentStatus.CONFIRMED &&
          !settings.autoConfirm
        ) {
          updates.status = AppointmentStatus.PENDING
        }
      }

      if (dto.clientNotes !== undefined) updates.clientNotes = dto.clientNotes

      // Invalider l'ancien token et générer un nouveau
      const { token: newToken, expiresAt } = this.magicLinkService.generate(
        appointment.id,
        settings.magicLinkExpirationHours,
      )
      updates.magicToken = newToken
      updates.magicTokenExpiresAt = expiresAt
      updates.magicTokenUsed = false

      await manager.update(Appointment, appointment.id, updates)

      if (dto.customFields?.length) {
        await this.cfvRepo.delete({ appointmentId: appointment.id })
        await this.saveCustomFields(manager, appointment.id, dto.customFields)
      }

      await this.mailService.sendAppointmentEmail('modified', {
        ...appointment,
        ...updates,
        magicToken: newToken,
      })

      this.eventEmitter.emit(BOOKING_EVENTS.APPOINTMENT_MODIFIED, appointment)

      return manager.findOneOrFail(Appointment, {
        where: { id: appointment.id },
        relations: ['service', 'customFieldValues'],
      })
    })
  }

  // ─── Annulation via magic link ───────────────────────────────────────────────

  async cancelByMagicToken(token: string): Promise<void> {
    const appointment = await this.findByMagicToken(token)
    const settings = await this.settingsService.get()

    const hoursBeforeAppt = (appointment.startAt.getTime() - Date.now()) / (1000 * 60 * 60)
    if (hoursBeforeAppt < settings.cancellationDeadlineHours) {
      throw new BadRequestException('Délai d\'annulation dépassé')
    }

    await this.repo.update(appointment.id, {
      status: AppointmentStatus.CANCELLED,
      magicTokenUsed: true,
    })

    await this.mailService.sendAppointmentEmail('cancelled', appointment)
    this.eventEmitter.emit(BOOKING_EVENTS.APPOINTMENT_CANCELLED, appointment)
  }

  // ─── Actions admin ───────────────────────────────────────────────────────────

  async findAll(dto: ListAppointmentsDto) {
    const qb = this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.service', 'service')
      .orderBy('a.startAt', 'DESC')

    if (dto.status) qb.andWhere('a.status = :status', { status: dto.status })
    if (dto.serviceId) qb.andWhere('a.serviceId = :serviceId', { serviceId: dto.serviceId })
    if (dto.dateFrom) qb.andWhere('a.startAt >= :dateFrom', { dateFrom: dto.dateFrom })
    if (dto.dateTo) qb.andWhere('a.startAt <= :dateTo', { dateTo: dto.dateTo })
    if (dto.search) {
      qb.andWhere(
        '(a.clientFirstName ILIKE :search OR a.clientLastName ILIKE :search OR a.clientEmail ILIKE :search)',
        { search: `%${dto.search}%` },
      )
    }

    const page = dto.page ?? 1
    const limit = dto.limit ?? 20
    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.repo.findOne({
      where: { id },
      relations: ['service', 'customFieldValues', 'customFieldValues.fieldDefinition'],
    })
    if (!appointment) throw new NotFoundException(`Rendez-vous ${id} introuvable`)
    return appointment
  }

  async confirm(id: string): Promise<Appointment> {
    const appointment = await this.findOne(id)
    if (appointment.status !== AppointmentStatus.PENDING) {
      throw new BadRequestException('Seul un RDV en attente peut être confirmé')
    }
    await this.repo.update(id, { status: AppointmentStatus.CONFIRMED })
    await this.mailService.sendAppointmentEmail('confirmed', appointment)
    this.eventEmitter.emit(BOOKING_EVENTS.APPOINTMENT_CONFIRMED, appointment)
    return this.findOne(id)
  }

  async reject(id: string, dto: RejectAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id)
    if (appointment.status !== AppointmentStatus.PENDING) {
      throw new BadRequestException('Seul un RDV en attente peut être refusé')
    }
    await this.repo.update(id, {
      status: AppointmentStatus.REJECTED,
      rejectionReason: dto.reason ?? null,
      alternativeSlot: dto.alternativeSlot ? new Date(dto.alternativeSlot) : null,
    })
    await this.mailService.sendAppointmentEmail('rejected', { ...appointment, ...dto })
    this.eventEmitter.emit(BOOKING_EVENTS.APPOINTMENT_REJECTED, appointment)
    return this.findOne(id)
  }

  async complete(id: string): Promise<Appointment> {
    const appointment = await this.findOne(id)
    if (appointment.status !== AppointmentStatus.CONFIRMED) {
      throw new BadRequestException('Seul un RDV confirmé peut être marqué terminé')
    }
    await this.repo.update(id, { status: AppointmentStatus.COMPLETED })
    return this.findOne(id)
  }

  async noShow(id: string): Promise<Appointment> {
    const appointment = await this.findOne(id)
    await this.repo.update(id, { status: AppointmentStatus.NO_SHOW })
    return this.findOne(id)
  }

  async update(id: string, dto: UpdateAppointmentAdminDto): Promise<Appointment> {
    await this.findOne(id)
    await this.repo.update(id, dto)
    return this.findOne(id)
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.repo.delete(id)
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private async saveCustomFields(
    manager: any,
    appointmentId: string,
    fields: { key: string; value: string }[],
  ): Promise<void> {
    for (const field of fields) {
      const definition = await this.cfdRepo.findOne({ where: { key: field.key } })
      if (!definition) continue
      await manager.save(CustomFieldValue, {
        appointmentId,
        fieldDefinitionId: definition.id,
        value: field.value,
      })
    }
  }
}

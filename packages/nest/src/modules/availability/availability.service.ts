import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AvailabilityRule } from './entities/availability-rule.entity'
import { AvailabilityException } from './entities/availability-exception.entity'
import { AvailabilityRuleDto } from './dto/availability-rule.dto'
import { CreateExceptionDto, UpdateExceptionDto } from './dto/availability-exception.dto'

@Injectable()
export class AvailabilityService {

  constructor(
    @InjectRepository(AvailabilityRule)
    private readonly ruleRepo: Repository<AvailabilityRule>,
    @InjectRepository(AvailabilityException)
    private readonly exceptionRepo: Repository<AvailabilityException>,
  ) {}

  // Règles hebdomadaires
  async getRules(): Promise<AvailabilityRule[]> {
    return this.ruleRepo.find({ order: { dayOfWeek: 'ASC' }, relations: ['breaks'] })
  }

  // Remplacement complet des règles — on supprime tout et on recrée
  async replaceRules(dtos: AvailabilityRuleDto[]): Promise<AvailabilityRule[]> {
    await this.ruleRepo.delete({})
    const rules = dtos.map(dto => this.ruleRepo.create(dto))
    return this.ruleRepo.save(rules)
  }

  // Exceptions
  async getExceptions(from?: string, to?: string): Promise<AvailabilityException[]> {
    const qb = this.exceptionRepo.createQueryBuilder('e').orderBy('e.date', 'ASC')
    if (from) qb.andWhere('e.date >= :from', { from })
    if (to) qb.andWhere('e.date <= :to', { to })
    return qb.getMany()
  }

  async createException(dto: CreateExceptionDto): Promise<AvailabilityException> {
    const exception = this.exceptionRepo.create(dto)
    return this.exceptionRepo.save(exception)
  }

  async updateException(id: string, dto: UpdateExceptionDto): Promise<AvailabilityException> {
    const exception = await this.exceptionRepo.findOne({ where: { id } })
    if (!exception) throw new NotFoundException(`Exception ${id} introuvable`)
    await this.exceptionRepo.update(id, dto)
    return this.exceptionRepo.findOneOrFail({ where: { id } })
  }

  async removeException(id: string): Promise<void> {
    const exception = await this.exceptionRepo.findOne({ where: { id } })
    if (!exception) throw new NotFoundException(`Exception ${id} introuvable`)
    await this.exceptionRepo.delete(id)
  }
}

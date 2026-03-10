import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CustomFieldDefinition } from './entities/custom-field-definition.entity'
import { CreateCustomFieldDto, UpdateCustomFieldDto } from './dto/custom-field.dto'

@Injectable()
export class CustomFieldsService {

  constructor(
    @InjectRepository(CustomFieldDefinition)
    private readonly repo: Repository<CustomFieldDefinition>,
  ) {}

  async findAll(): Promise<CustomFieldDefinition[]> {
    return this.repo.find({ order: { sortOrder: 'ASC' } })
  }

  // Retourne les champs actifs pour un service donné
  async findForService(serviceId: string): Promise<CustomFieldDefinition[]> {
    const all = await this.repo.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    })
    return all.filter(
      (f) => f.serviceIds === null || f.serviceIds.includes(serviceId),
    )
  }

  async findOne(id: string): Promise<CustomFieldDefinition> {
    const field = await this.repo.findOne({ where: { id } })
    if (!field) throw new NotFoundException(`Champ ${id} introuvable`)
    return field
  }

  async create(dto: CreateCustomFieldDto): Promise<CustomFieldDefinition> {
    const existing = await this.repo.findOne({ where: { key: dto.key } })
    if (existing) throw new ConflictException(`La clé "${dto.key}" existe déjà`)
    const field = this.repo.create(dto)
    return this.repo.save(field)
  }

  async update(id: string, dto: UpdateCustomFieldDto): Promise<CustomFieldDefinition> {
    await this.findOne(id)
    await this.repo.update(id, dto)
    return this.findOne(id)
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.repo.delete(id)
  }

  async reorder(ids: string[]): Promise<void> {
    await Promise.all(
      ids.map((id, index) => this.repo.update(id, { sortOrder: index }))
    )
  }
}

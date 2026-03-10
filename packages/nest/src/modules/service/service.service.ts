// packages/nest/src/modules/service/service.service.ts

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Service } from './entities/service.entity'
import { CreateServiceDto } from './dto/create-service.dto'
import { UpdateServiceDto } from './dto/update-service.dto'

@Injectable()
export class ServiceService {

    constructor(
        @InjectRepository(Service)
        private readonly repo: Repository<Service>,
    ) { }

    // Liste publique — uniquement les services actifs triés par sortOrder
    async findAllPublic(): Promise<Service[]> {
        return this.repo.find({
            where: { isActive: true },
            order: { sortOrder: 'ASC' },
        })
    }

    // Liste admin — tous les services
    async findAll(): Promise<Service[]> {
        return this.repo.find({ order: { sortOrder: 'ASC' } })
    }

    async findOne(id: string): Promise<Service> {
        const service = await this.repo.findOne({ where: { id } })
        if (!service) throw new NotFoundException(`Service ${id} introuvable`)
        return service
    }

    async create(dto: CreateServiceDto): Promise<Service> {
        const service = this.repo.create(dto)
        return this.repo.save(service)
    }

    async update(id: string, dto: UpdateServiceDto): Promise<Service> {
        await this.findOne(id) // Vérifie que le service existe
        await this.repo.update(id, dto)
        return this.findOne(id)
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id) // Vérifie que le service existe
        await this.repo.delete(id)
    }

    // Réordonne les services selon l'ordre fourni
    async reorder(ids: string[]): Promise<void> {
        await Promise.all(
            ids.map((id, index) => this.repo.update(id, { sortOrder: index }))
        )
    }
}
// packages/nest/src/modules/settings/settings.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BusinessSetting } from './entities/business-setting.entity'

@Injectable()
export class SettingsService implements OnModuleInit {

    constructor(
        @InjectRepository(BusinessSetting)
        private readonly repo: Repository<BusinessSetting>,
    ) { }

    // OnModuleInit : s'exécute au démarrage de l'app
    // Garantit qu'il y a toujours une ligne en base (le singleton)
    async onModuleInit(): Promise<void> {
        const existing = await this.repo.findOne({ where: { id: 1 } })
        if (!existing) {
            await this.repo.save(this.repo.create({ id: 1, businessName: 'Mon Business' }))
        }
    }

    // Récupère toujours le singleton
    async get(): Promise<BusinessSetting> {
        return this.repo.findOneOrFail({ where: { id: 1 } })
    }

    // Mise à jour partielle — on écrase uniquement les champs fournis
    async update(data: Partial<BusinessSetting>): Promise<BusinessSetting> {
        await this.repo.update(1, data)
        return this.get()
    }
}
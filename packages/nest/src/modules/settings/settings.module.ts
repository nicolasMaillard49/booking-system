// packages/nest/src/modules/settings/settings.module.ts

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BusinessSetting } from './entities/business-setting.entity'
import { SettingsService } from './settings.service'
import { SettingsController } from './settings.controller'

@Module({
    // Enregistre l'entité BusinessSetting pour ce module
    imports: [TypeOrmModule.forFeature([BusinessSetting])],

    // Pas de controller pour l'instant
    controllers: [SettingsController],

    // On déclare le service
    providers: [SettingsService],

    // On l'exporte car les autres modules en auront besoin
    exports: [SettingsService],
})
export class SettingsModule { }
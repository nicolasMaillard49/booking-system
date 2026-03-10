// packages/nest/src/modules/settings/settings.controller.ts

import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { SettingsService } from './settings.service'
import { UpdateSettingsDto } from './dto/update-settings.dto'
import { PublicSettingsDto } from './dto/public-settings.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@Controller()
export class SettingsController {

    constructor(private readonly settingsService: SettingsService) { }

    // Route publique — accessible sans auth
    // GET /booking/settings/public
    @Get('booking/settings/public')
    async getPublic(): Promise<PublicSettingsDto> {
        const settings = await this.settingsService.get()
        return {
            businessName: settings.businessName,
            address: settings.address,
            phone: settings.phone,
            email: settings.email,
            description: settings.description,
            instructions: settings.instructions,
            timezone: settings.timezone,
        }
    }

    // Route admin — récupère tous les paramètres
    // GET /admin/settings
    @UseGuards(JwtAuthGuard)
    @Get('admin/settings')
    async get() {
        return this.settingsService.get()
    }

    // Route admin — met à jour les paramètres
    // PATCH /admin/settings
    @UseGuards(JwtAuthGuard)
    @Patch('admin/settings')
    async update(@Body() dto: UpdateSettingsDto) {
        return this.settingsService.update(dto)
    }
}
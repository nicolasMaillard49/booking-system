// packages/nest/src/modules/service/service.controller.ts

import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ServiceService } from './service.service'
import { CreateServiceDto } from './dto/create-service.dto'
import { UpdateServiceDto } from './dto/update-service.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@Controller()
export class ServiceController {

    constructor(private readonly serviceService: ServiceService) { }

    // Route publique — liste des prestations actives
    // GET /booking/services
    @Get('booking/services')
    async findAllPublic() {
        return this.serviceService.findAllPublic()
    }

    // Route publique — détail d'une prestation
    // GET /booking/services/:id
    @Get('booking/services/:id')
    async findOnePublic(@Param('id') id: string) {
        return this.serviceService.findOne(id)
    }

    // Route admin — liste complète
    // GET /admin/services
    @UseGuards(JwtAuthGuard)
    @Get('admin/services')
    async findAll() {
        return this.serviceService.findAll()
    }

    // Route admin — créer une prestation
    // POST /admin/services
    @UseGuards(JwtAuthGuard)
    @Post('admin/services')
    async create(@Body() dto: CreateServiceDto) {
        return this.serviceService.create(dto)
    }

    // Route admin — modifier une prestation
    // PATCH /admin/services/:id
    @UseGuards(JwtAuthGuard)
    @Patch('admin/services/:id')
    async update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
        return this.serviceService.update(id, dto)
    }

    // Route admin — supprimer une prestation
    // DELETE /admin/services/:id
    @UseGuards(JwtAuthGuard)
    @Delete('admin/services/:id')
    async remove(@Param('id') id: string) {
        return this.serviceService.remove(id)
    }

    // Route admin — réordonner les prestations
    // PATCH /admin/services/reorder
    @UseGuards(JwtAuthGuard)
    @Patch('admin/services/reorder')
    async reorder(@Body() body: { ids: string[] }) {
        return this.serviceService.reorder(body.ids)
    }
}
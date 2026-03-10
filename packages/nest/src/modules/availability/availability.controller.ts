import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common'
import { AvailabilityService } from './availability.service'
import { SlotGeneratorService } from './slot-generator.service'
import { SettingsService } from '../settings/settings.service'
import { ServiceService } from '../service/service.service'
import { AvailabilityRuleDto } from './dto/availability-rule.dto'
import { CreateExceptionDto, UpdateExceptionDto } from './dto/availability-exception.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@Controller()
export class AvailabilityController {

  constructor(
    private readonly availabilityService: AvailabilityService,
    private readonly slotGenerator: SlotGeneratorService,
    private readonly settingsService: SettingsService,
    private readonly serviceService: ServiceService,
  ) {}

  // Route publique — créneaux disponibles
  // GET /booking/slots?serviceId=&date=
  @Get('booking/slots')
  async getSlots(
    @Query('serviceId') serviceId: string,
    @Query('date') date: string,
  ) {
    const [service, settings] = await Promise.all([
      this.serviceService.findOne(serviceId),
      this.settingsService.get(),
    ])
    const slots = await this.slotGenerator.getAvailableSlots(date, service.duration, settings)
    return { date, slots }
  }

  // Routes admin — règles hebdomadaires
  @UseGuards(JwtAuthGuard)
  @Get('admin/availability/rules')
  async getRules() {
    return this.availabilityService.getRules()
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/availability/rules')
  async replaceRules(@Body() dtos: AvailabilityRuleDto[]) {
    return this.availabilityService.replaceRules(dtos)
  }

  // Routes admin — exceptions
  @UseGuards(JwtAuthGuard)
  @Get('admin/availability/exceptions')
  async getExceptions(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.availabilityService.getExceptions(from, to)
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/availability/exceptions')
  async createException(@Body() dto: CreateExceptionDto) {
    return this.availabilityService.createException(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/availability/exceptions/:id')
  async updateException(@Param('id') id: string, @Body() dto: UpdateExceptionDto) {
    return this.availabilityService.updateException(id, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/availability/exceptions/:id')
  async removeException(@Param('id') id: string) {
    return this.availabilityService.removeException(id)
  }
}

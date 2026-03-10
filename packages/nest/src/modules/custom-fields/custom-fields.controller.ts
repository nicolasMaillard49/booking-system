import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { CustomFieldsService } from './custom-fields.service'
import { CreateCustomFieldDto, UpdateCustomFieldDto } from './dto/custom-field.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@Controller()
export class CustomFieldsController {

  constructor(private readonly customFieldsService: CustomFieldsService) {}

  // Route publique — champs pour un service donné
  // GET /booking/custom-fields?serviceId=
  @Get('booking/custom-fields')
  async findForService(@Query('serviceId') serviceId: string) {
    return this.customFieldsService.findForService(serviceId)
  }

  // Routes admin
  @UseGuards(JwtAuthGuard)
  @Get('admin/custom-fields')
  async findAll() {
    return this.customFieldsService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/custom-fields')
  async create(@Body() dto: CreateCustomFieldDto) {
    return this.customFieldsService.create(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/custom-fields/reorder')
  async reorder(@Body() body: { ids: string[] }) {
    return this.customFieldsService.reorder(body.ids)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/custom-fields/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateCustomFieldDto) {
    return this.customFieldsService.update(id, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/custom-fields/:id')
  async remove(@Param('id') id: string) {
    return this.customFieldsService.remove(id)
  }
}

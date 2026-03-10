import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common'
import { AppointmentService } from './appointment.service'
import { UpdateAppointmentAdminDto } from './dto/update-appointment-admin.dto'
import { RejectAppointmentDto } from './dto/reject-appointment.dto'
import { ListAppointmentsDto } from './dto/list-appointments.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('admin/appointments')
export class AppointmentAdminController {

  constructor(private readonly appointmentService: AppointmentService) {}

  // GET /admin/appointments
  @Get()
  async findAll(@Query() dto: ListAppointmentsDto) {
    return this.appointmentService.findAll(dto)
  }

  // GET /admin/appointments/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(id)
  }

  // PATCH /admin/appointments/:id
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAppointmentAdminDto) {
    return this.appointmentService.update(id, dto)
  }

  // PATCH /admin/appointments/:id/confirm
  @Patch(':id/confirm')
  async confirm(@Param('id') id: string) {
    return this.appointmentService.confirm(id)
  }

  // PATCH /admin/appointments/:id/reject
  @Patch(':id/reject')
  async reject(@Param('id') id: string, @Body() dto: RejectAppointmentDto) {
    return this.appointmentService.reject(id, dto)
  }

  // PATCH /admin/appointments/:id/complete
  @Patch(':id/complete')
  async complete(@Param('id') id: string) {
    return this.appointmentService.complete(id)
  }

  // PATCH /admin/appointments/:id/no-show
  @Patch(':id/no-show')
  async noShow(@Param('id') id: string) {
    return this.appointmentService.noShow(id)
  }

  // DELETE /admin/appointments/:id
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.appointmentService.remove(id)
  }
}

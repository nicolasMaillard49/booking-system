import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { AppointmentService } from './appointment.service'
import { CreateAppointmentDto } from './dto/create-appointment.dto'
import { UpdateAppointmentPublicDto } from './dto/update-appointment-public.dto'

@Controller('booking/appointments')
export class AppointmentController {

  constructor(private readonly appointmentService: AppointmentService) {}

  // POST /booking/appointments
  @Post()
  async create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.create(dto)
  }

  // GET /booking/appointments/:token
  @Get(':token')
  async findByToken(@Param('token') token: string) {
    return this.appointmentService.findByMagicToken(token)
  }

  // PATCH /booking/appointments/:token
  @Patch(':token')
  async updateByToken(
    @Param('token') token: string,
    @Body() dto: UpdateAppointmentPublicDto,
  ) {
    return this.appointmentService.updateByMagicToken(token, dto)
  }

  // DELETE /booking/appointments/:token
  @Delete(':token')
  async cancelByToken(@Param('token') token: string) {
    return this.appointmentService.cancelByMagicToken(token)
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto, UpdateUserDto } from './dto/user.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { UserRole } from '../auth/entities/user.entity'

// Toutes les routes de ce controller sont superadmin uniquement
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPERADMIN)
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  // GET /admin/users
  @Get()
  async findAll() {
    return this.usersService.findAll()
  }

  // GET /admin/users/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  // POST /admin/users
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto)
  }

  // PATCH /admin/users/:id
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto)
  }

  // DELETE /admin/users/:id
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id)
  }
}

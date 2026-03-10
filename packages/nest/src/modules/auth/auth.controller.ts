import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/auth.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@Controller('admin/auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  // POST /admin/auth/login
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  // POST /admin/auth/logout — côté client on supprime juste le token
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout() {
    return { success: true }
  }
}

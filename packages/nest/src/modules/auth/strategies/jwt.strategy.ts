import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from '../auth.service'
import { BOOKING_CONFIG } from '../../../common/constants'
import { BookingConfig } from '@booking/shared'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'booking-jwt') {

  constructor(
    @Inject(BOOKING_CONFIG) config: BookingConfig,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
    })
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.authService.validateUser(payload.sub)
    if (!user) throw new UnauthorizedException()
    return user
  }
}

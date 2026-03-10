import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { User, UserRole } from './entities/user.entity'
import { LoginDto, AuthResponseDto } from './dto/auth.dto'

@Injectable()
export class AuthService implements OnModuleInit {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Crée un superadmin par défaut au démarrage si aucun user n'existe
  async onModuleInit(): Promise<void> {
    const count = await this.userRepo.count()
    if (count === 0) {
      const hashed = await bcrypt.hash('admin123', 12)
      await this.userRepo.save(
        this.userRepo.create({
          email: 'admin@booking.local',
          password: hashed,
          firstName: 'Super',
          lastName: 'Admin',
          role: UserRole.SUPERADMIN,
        }),
      )
      console.log('✅ Superadmin créé : admin@booking.local / admin123')
    }
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    // select: false sur password — on doit le demander explicitement
    const user = await this.userRepo
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.email = :email', { email: dto.email })
      .getOne()

    if (!user) throw new UnauthorizedException('Identifiants invalides')

    const isValid = await bcrypt.compare(dto.password, user.password)
    if (!isValid) throw new UnauthorizedException('Identifiants invalides')

    const payload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' })

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    }
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException('Utilisateur introuvable')
    return user
  }
}

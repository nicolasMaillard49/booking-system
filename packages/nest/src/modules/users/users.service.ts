import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from '../auth/entities/user.entity'
import { CreateUserDto, UpdateUserDto } from './dto/user.dto'

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } })
  }

  async findOne(id: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } })
    if (!user) throw new NotFoundException(`Utilisateur ${id} introuvable`)
    return user
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.repo.findOne({ where: { email: dto.email } })
    if (existing) throw new ConflictException('Cet email est déjà utilisé')

    const hashed = await bcrypt.hash(dto.password, 12)
    const user = this.repo.create({ ...dto, password: hashed })
    return this.repo.save(user)
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.findOne(id)

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 12)
    }

    await this.repo.update(id, dto)
    return this.findOne(id)
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.repo.delete(id)
  }
}

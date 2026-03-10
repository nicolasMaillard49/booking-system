import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'
import { UserRole } from '../../../modules/auth/entities/user.entity'

export class CreateUserDto {

  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string

  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  lastName: string

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

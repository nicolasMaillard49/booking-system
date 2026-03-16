import { IsString, MinLength } from 'class-validator'

export class LoginDto {
  @IsString()
  email: string

  @IsString()
  @MinLength(1)
  password: string
}

export class AuthResponseDto {
  accessToken: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
  }
}

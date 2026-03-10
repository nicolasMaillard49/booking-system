import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class UpdateEmailTemplateDto {

  @IsString()
  @IsOptional()
  subject?: string

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean

  @IsString()
  @IsOptional()
  extraContent?: string
}

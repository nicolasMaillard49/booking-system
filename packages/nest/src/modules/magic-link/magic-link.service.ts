import { Injectable, UnauthorizedException } from '@nestjs/common'
import { randomBytes } from 'crypto'
import { Appointment } from '../appointment/entities/appointment.entity'

export interface MagicLinkPayload {
  token: string
  expiresAt: Date
}

@Injectable()
export class MagicLinkService {

  // Génère un token aléatoire sécurisé
  generate(appointmentId: string, expirationHours: number): MagicLinkPayload {
    const token = randomBytes(32).toString('hex') // 256 bits, non devinable
    const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000)
    return { token, expiresAt }
  }

  // Valide le token d'un RDV
  validate(appointment: Appointment): void {
    if (!appointment.magicToken) {
      throw new UnauthorizedException('Lien invalide')
    }

    if (appointment.magicTokenUsed) {
      throw new UnauthorizedException('Ce lien a déjà été utilisé')
    }

    if (!appointment.magicTokenExpiresAt || appointment.magicTokenExpiresAt < new Date()) {
      throw new UnauthorizedException('Ce lien a expiré')
    }
  }

  // Construit l'URL complète du lien magique
  buildUrl(frontendUrl: string, token: string): string {
    return `${frontendUrl}/appointment/${token}`
  }
}

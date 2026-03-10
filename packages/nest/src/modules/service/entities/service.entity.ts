// packages/nest/src/modules/service/entities/service.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('business_services')
export class Service {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ length: 255 })
    name: string

    @Column({ type: 'text', nullable: true })
    description: string | null

    // En minutes
    @Column({ type: 'int' })
    duration: number

    // Nullable — une prestation peut ne pas avoir de prix
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    price: number | null

    // Si false, le prix n'est pas affiché au client
    @Column({ default: true })
    isPriceVisible: boolean

    // Délai minimum en heures avant de pouvoir réserver
    @Column({ type: 'int', default: 1 })
    minBookingDelay: number

    // Délai maximum en jours à l'avance pour réserver
    @Column({ type: 'int', default: 60 })
    maxBookingDelay: number

    @Column({ default: true })
    isActive: boolean

    // Ordre d'affichage dans la liste des prestations
    @Column({ type: 'int', default: 0 })
    sortOrder: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
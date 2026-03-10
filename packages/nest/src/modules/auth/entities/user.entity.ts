import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export enum UserRole {
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 255, unique: true })
  email: string

  // Toujours hashé avec bcrypt — jamais en clair
  @Column({ length: 255, select: false })
  password: string

  @Column({ length: 100 })
  firstName: string

  @Column({ length: 100 })
  lastName: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.ADMIN })
  role: UserRole

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

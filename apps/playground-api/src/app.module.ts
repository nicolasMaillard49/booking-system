import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { BookingModule } from '@booking/nest'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'booking_playground',
      username: process.env.DB_USER || 'booking',
      password: process.env.DB_PASSWORD || 'booking123',
      autoLoadEntities: true,
      synchronize: true,
    }),

    EventEmitterModule.forRoot(),

    BookingModule.register({
      jwtSecret: process.env.JWT_SECRET || 'super-secret-dev-key',
      resendApiKey: process.env.RESEND_API_KEY || 're_test_fake_key',
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
      autoConfirm: false,
      timezone: 'Europe/Paris',
    }),
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './features/user/user.module';
import { WeightsModule } from './features/weights/weights.module';
import { PersonModule } from './features/person/person.module';
import { GymModule } from './features/gym/gym.module';
import { AthleteModule } from './features/athlete/athlete.module';
import { CoachModule } from './features/coach/coach.module';
import { CompetitionModule } from './features/competition/competition.module';
import { GymPaymentModule } from './features/gym-payment/gym-payment.module';
import { AuthModule } from './features/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './features/auth/auth.guard';
import { CompetitionRegistrationModule } from './features/competition-registration/competition-registration.module';
import { CompetitionDivisionModule } from './features/competition-division/competition-division.module';
import { PagoMovilModule } from './features/pago-movil/pago-movil.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    WeightsModule,
    PersonModule,
    GymModule,
    AthleteModule,
    CoachModule,
    CompetitionModule,
    CompetitionRegistrationModule,
    CompetitionDivisionModule,
    GymPaymentModule,
    PagoMovilModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [],
})
export class AppModule {}

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
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './features/auth/auth.guard';
import { CompetitionRegistrationModule } from './features/competition-registration/competition-registration.module';
import { CompetitionDivisionModule } from './features/competition-division/competition-division.module';
import { PagoMovilModule } from './features/pago-movil/pago-movil.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggerModule } from './common/logger/logger.module';
import { AppController } from './app.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AdminModule } from './admin/admin.module';

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
    LoggerModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 80,
      },
    ]),
    AdminModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}

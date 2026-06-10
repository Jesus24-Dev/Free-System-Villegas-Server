import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './features/user/user.module';
import { WeightsModule } from './features/weights/weights.module';
import { PersonModule } from './features/person/person.module';
import { GymModule } from './features/gym/gym.module';
import { AthleteModule } from './features/athlete/athlete.module';
import { CoachModule } from './features/coach/coach.module';
import { CompetitionModule } from './features/competition/competition.module';
import { AthleteRegisterModule } from './features/athlete-register/athlete-register.module';
import { FightModeModule } from './features/fight-mode/fight-mode.module';
import { GymPaymentModule } from './features/gym-payment/gym-payment.module';
import { AuthModule } from './features/auth/auth.module';

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
    AthleteRegisterModule,
    FightModeModule,
    GymPaymentModule,
  ],
  controllers: [],
})
export class AppModule {}

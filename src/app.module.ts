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

@Module({
  imports: [
    PrismaModule,
    UserModule,
    WeightsModule,
    PersonModule,
    GymModule,
    AthleteModule,
    CoachModule,
    CompetitionModule,
    AthleteRegisterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

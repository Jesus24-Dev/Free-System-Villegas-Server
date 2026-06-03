import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { WeightsModule } from './weights/weights.module';
import { PersonModule } from './person/person.module';
import { GymModule } from './gym/gym.module';
import { AthleteModule } from './athlete/athlete.module';
import { CoachModule } from './coach/coach.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    WeightsModule,
    PersonModule,
    GymModule,
    AthleteModule,
    CoachModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

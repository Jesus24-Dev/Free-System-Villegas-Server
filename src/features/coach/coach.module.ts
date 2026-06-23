import { Module } from '@nestjs/common';
import { CoachService } from './coach.service';
import { CoachController } from './coach.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RegisterAthleteUseCase } from './use-cases/register-athlete.use-case';
import { AssignAthleteToGymUseCase } from './use-cases/assign-athlete-gym.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [CoachController],
  providers: [CoachService, RegisterAthleteUseCase, AssignAthleteToGymUseCase],
})
export class CoachModule {}

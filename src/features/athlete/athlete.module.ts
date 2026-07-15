import { Module } from '@nestjs/common';
import { AthleteService } from './athlete.service';
import { AthleteController } from './athlete.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PromoteAthleteToCoachUseCase } from './use-cases/promote-athlete-to-coach.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [AthleteController],
  providers: [AthleteService, PromoteAthleteToCoachUseCase],
})
export class AthleteModule {}

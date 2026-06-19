import { Module } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { CompetitionController } from './competition.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RegisterAthleteAtCompetitionUseCase } from './use-cases/register-athlete-at-competition.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [CompetitionController],
  providers: [CompetitionService, RegisterAthleteAtCompetitionUseCase],
})
export class CompetitionModule {}

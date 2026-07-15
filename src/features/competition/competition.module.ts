import { Module } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { CompetitionController } from './competition.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RegisterAthleteAtCompetitionUseCase } from './use-cases/register-athlete-at-competition.use-case';
import { LoggerService } from 'src/common/logger/logger.service';

@Module({
  imports: [PrismaModule],
  controllers: [CompetitionController],
  providers: [
    CompetitionService,
    RegisterAthleteAtCompetitionUseCase,
    LoggerService,
  ],
  exports: [CompetitionService],
})
export class CompetitionModule {}

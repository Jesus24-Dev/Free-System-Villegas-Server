import { Module } from '@nestjs/common';
import { CompetitionDivisionService } from './competition-division.service';
import { CompetitionDivisionController } from './competition-division.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CompetitionDivisionController],
  providers: [CompetitionDivisionService],
})
export class CompetitionDivisionModule {}

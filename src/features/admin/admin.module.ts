import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CompetitionModule } from '../competition/competition.module';
import { CompetitionDivisionModule } from '../competition-division/competition-division.module';

@Module({
  imports: [PrismaModule, CompetitionModule, CompetitionDivisionModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

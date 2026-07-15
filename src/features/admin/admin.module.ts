import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CompetitionModule } from '../competition/competition.module';
import { CompetitionDivisionModule } from '../competition-division/competition-division.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PrismaModule,
    CompetitionModule,
    CompetitionDivisionModule,
    UserModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

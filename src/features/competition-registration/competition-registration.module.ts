import { Module } from '@nestjs/common';
import { CompetitionRegistrationService } from './competition-registration.service';
import { CompetitionRegistrationController } from './competition-registration.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CompetitionRegistrationController],
  providers: [CompetitionRegistrationService],
})
export class CompetitionRegistrationModule {}

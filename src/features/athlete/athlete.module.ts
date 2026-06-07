import { Module } from '@nestjs/common';
import { AthleteService } from './athlete.service';
import { AthleteController } from './athlete.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AthleteController],
  providers: [AthleteService],
})
export class AthleteModule {}

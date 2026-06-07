import { Module } from '@nestjs/common';
import { AthleteRegisterService } from './athlete-register.service';
import { AthleteRegisterController } from './athlete-register.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AthleteRegisterController],
  providers: [AthleteRegisterService],
})
export class AthleteRegisterModule {}

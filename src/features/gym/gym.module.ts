import { Module } from '@nestjs/common';
import { GymService } from './gym.service';
import { GymController } from './gym.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateGymUseCase } from './use-cases/create-gym.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [GymController],
  providers: [GymService, CreateGymUseCase],
})
export class GymModule {}

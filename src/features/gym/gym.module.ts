import { Module } from '@nestjs/common';
import { GymService } from './gym.service';
import { GymController } from './gym.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateGymUseCase } from './use-cases/create-gym.use-case';
import { UpdateGymByOwnerUseCase } from './use-cases/update-gym-by-owner.use-case';
import { LoggerService } from 'src/common/logger/logger.service';

@Module({
  imports: [PrismaModule],
  controllers: [GymController],
  providers: [
    GymService,
    CreateGymUseCase,
    UpdateGymByOwnerUseCase,
    LoggerService,
  ],
})
export class GymModule {}

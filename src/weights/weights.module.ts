import { Module } from '@nestjs/common';
import { WeightsService } from './weights.service';
import { WeightsController } from './weights.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [WeightsService],
  controllers: [WeightsController],
})
export class WeightsModule {}

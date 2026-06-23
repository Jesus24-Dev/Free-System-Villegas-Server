import { Module } from '@nestjs/common';
import { GymPaymentService } from './gym-payment.service';
import { GymPaymentController } from './gym-payment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LoggerService } from 'src/common/logger/logger.service';

@Module({
  imports: [PrismaModule],
  controllers: [GymPaymentController],
  providers: [GymPaymentService, LoggerService],
})
export class GymPaymentModule {}

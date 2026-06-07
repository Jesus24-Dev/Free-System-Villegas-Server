import { Module } from '@nestjs/common';
import { GymPaymentService } from './gym-payment.service';
import { GymPaymentController } from './gym-payment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GymPaymentController],
  providers: [GymPaymentService],
})
export class GymPaymentModule {}

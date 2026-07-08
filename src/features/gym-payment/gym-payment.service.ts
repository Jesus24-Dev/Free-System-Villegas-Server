import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGymPaymentDto } from './dto/create-gym-payment.dto';
import { UpdateGymPaymentDto } from './dto/update-gym-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GymPayment } from '@prisma/client';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class GymPaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}
  async create(createGymPaymentDto: CreateGymPaymentDto): Promise<GymPayment> {
    return this.prisma.gymPayment.create({
      data: createGymPaymentDto,
    });
  }

  async findAll(): Promise<GymPayment[]> {
    return this.prisma.gymPayment.findMany({
      where: { deleted_at: null },
    });
  }

  async findOne(id: string): Promise<GymPayment> {
    const gymPayment = await this.prisma.gymPayment.findFirst({
      where: { id, deleted_at: null },
    });

    if (!gymPayment) {
      throw new NotFoundException(
        `El pago del gimnasio con id ${id} no fue encontrado`,
      );
    }
    return gymPayment;
  }

  async update(
    id: string,
    updateGymPaymentDto: UpdateGymPaymentDto,
  ): Promise<GymPayment> {
    return this.prisma.gymPayment.update({
      where: { id },
      data: updateGymPaymentDto,
    });
  }

  async confirmPayment(id: string): Promise<void> {
    const payment = await this.prisma.gymPayment.update({
      where: { id },
      data: {
        isConfirmed: true,
      },
    });
    this.logger.info('PAYMENT_CONFIRMED', {
      payment_id: id,
      gym_id: payment.gym_id,
      athlete_id: payment.athlete_id,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.gymPayment.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}

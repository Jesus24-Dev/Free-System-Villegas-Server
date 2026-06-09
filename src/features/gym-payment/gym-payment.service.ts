import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGymPaymentDto } from './dto/create-gym-payment.dto';
import { UpdateGymPaymentDto } from './dto/update-gym-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Gym_Payment } from 'src/generated/prisma/client';

@Injectable()
export class GymPaymentService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createGymPaymentDto: CreateGymPaymentDto): Promise<Gym_Payment> {
    return this.prisma.gym_Payment.create({
      data: createGymPaymentDto,
    });
  }

  async findAll(): Promise<Gym_Payment[]> {
    return this.prisma.gym_Payment.findMany();
  }

  async findOne(id: string): Promise<Gym_Payment> {
    const gymPayment = await this.prisma.gym_Payment.findUnique({
      where: { id },
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
  ): Promise<Gym_Payment> {
    return this.prisma.gym_Payment.update({
      where: { id },
      data: updateGymPaymentDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.gym_Payment.delete({
      where: { id },
    });
  }
}

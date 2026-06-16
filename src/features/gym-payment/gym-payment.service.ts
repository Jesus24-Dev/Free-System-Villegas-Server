import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGymPaymentDto } from './dto/create-gym-payment.dto';
import { UpdateGymPaymentDto } from './dto/update-gym-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GymPayment } from 'src/generated/prisma/client';

@Injectable()
export class GymPaymentService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createGymPaymentDto: CreateGymPaymentDto): Promise<GymPayment> {
    return this.prisma.gymPayment.create({
      data: createGymPaymentDto,
    });
  }

  async findAll(): Promise<GymPayment[]> {
    return this.prisma.gymPayment.findMany();
  }

  async findOne(id: string): Promise<GymPayment> {
    const gymPayment = await this.prisma.gymPayment.findUnique({
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
  ): Promise<GymPayment> {
    return this.prisma.gymPayment.update({
      where: { id },
      data: updateGymPaymentDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.gymPayment.delete({
      where: { id },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { CreateGymPaymentDto } from './dto/create-gym-payment.dto';
import { UpdateGymPaymentDto } from './dto/update-gym-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GymPaymentService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createGymPaymentDto: CreateGymPaymentDto) {
    return this.prisma.gym_Payment.create({
      data: createGymPaymentDto,
    });
  }

  async findAll() {
    return this.prisma.gym_Payment.findMany();
  }

  findOne(id: string) {
    return this.prisma.gym_Payment.findUnique({
      where: { id },
    });
  }

  update(id: string, updateGymPaymentDto: UpdateGymPaymentDto) {
    return this.prisma.gym_Payment.update({
      where: { id },
      data: updateGymPaymentDto,
    });
  }

  remove(id: string) {
    return this.prisma.gym_Payment.delete({
      where: { id },
    });
  }
}

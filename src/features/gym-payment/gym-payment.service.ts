import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGymPaymentDto } from './dto/request';
import { UpdateGymPaymentDto } from './dto/request';
import { FilterGymPaymentDto } from './dto/request';
import { PrismaService } from 'src/prisma/prisma.service';
import { GymPayment } from '@prisma/client';
import { LoggerService } from 'src/common/logger/logger.service';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { GymPaymentByGymResponseDto } from './dto/response';

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

  async findAll(
    filter: FilterGymPaymentDto,
  ): Promise<PaginatedResponseDto<GymPayment>> {
    const { skip, limit, page, gym_id } = filter;
    const where = { deleted_at: null, ...(gym_id && { gym_id }) };
    const [data, total] = await Promise.all([
      this.prisma.gymPayment.findMany({ where, skip, take: limit }),
      this.prisma.gymPayment.count({ where }),
    ]);
    return new PaginatedResponseDto(data, total, page!, limit!);
  }

  async findByGym(gymId: string): Promise<GymPaymentByGymResponseDto[]> {
    const payments = await this.prisma.gymPayment.findMany({
      where: {
        gym_id: gymId,
        deleted_at: null,
      },
      select: {
        id: true,
        day_payed: true,
        amount: true,
        evidence_url: true,
        payment_reference: true,
        isConfirmed: true,
        gym_id: true,
        created_at: true,
        updated_at: true,
        athlete: {
          select: {
            id: true,
            person: {
              select: {
                dni: true,
                name: true,
                surname: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return payments.map((payment) => ({
      id: payment.id,
      day_payed: payment.day_payed,
      amount: payment.amount,
      evidence_url: payment.evidence_url,
      payment_reference: payment.payment_reference,
      isConfirmed: payment.isConfirmed,
      gym_id: payment.gym_id,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
      athlete: {
        id: payment.athlete.id,
        dni: payment.athlete.person.dni,
        name: payment.athlete.person.name,
        surname: payment.athlete.person.surname,
      },
    }));
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

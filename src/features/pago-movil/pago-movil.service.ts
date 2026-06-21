import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePagoMovilDto } from './dto/request';
import { PagoMovilFields } from 'src/generated/prisma/client';
import { PagoMovilResponseDto } from './dto/responses/pago-movil-response.dto';

@Injectable()
export class PagoMovilService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    gymId: string,
    dto: CreatePagoMovilDto,
  ): Promise<PagoMovilFields> {
    return this.prisma.pagoMovilFields.create({
      data: {
        gym_id: gymId,
        ...dto,
      },
    });
  }

  async findByGym(gymId: string): Promise<PagoMovilResponseDto[]> {
    const pagoMovilFields = await this.prisma.pagoMovilFields.findMany({
      where: {
        gym_id: gymId,
      },
      select: {
        id: true,
        bank_to_pay: true,
        dni: true,
        phone: true,
      },
    });

    if (!pagoMovilFields) {
      throw new NotFoundException(
        `El gimnasio con id ${gymId} no fue encontrado`,
      );
    }

    return pagoMovilFields;
  }

  async findOne(id: string): Promise<PagoMovilResponseDto> {
    const pagoMovilField = await this.prisma.pagoMovilFields.findUnique({
      where: { id },
      select: {
        id: true,
        bank_to_pay: true,
        dni: true,
        phone: true,
      },
    });

    if (!pagoMovilField) {
      throw new NotFoundException(
        `El pago movil con id ${id} no fue encontrado`,
      );
    }

    return pagoMovilField;
  }
  async remove(id: string): Promise<void> {
    await this.prisma.pagoMovilFields.delete({
      where: {
        id,
      },
    });
  }
}

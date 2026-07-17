import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePagoMovilDto } from './dto/request';
import { PagoMovilFields } from '@prisma/client';
import { PagoMovilResponseDto } from './dto/responses/pago-movil-response.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

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

  async findAll(
    pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<PagoMovilResponseDto>> {
    const { skip, limit, page } = pagination;
    const where = { deleted_at: null };
    const [data, total] = await Promise.all([
      this.prisma.pagoMovilFields.findMany({
        where,
        select: {
          id: true,
          bank_to_pay: true,
          dni: true,
          phone: true,
          gym_id: true,
        },
        skip,
        take: limit,
      }),
      this.prisma.pagoMovilFields.count({ where }),
    ]);
    return new PaginatedResponseDto(data, total, page!, limit!);
  }

  async findByGym(gymId: string): Promise<PagoMovilResponseDto[]> {
    const pagoMovilFields = await this.prisma.pagoMovilFields.findMany({
      where: {
        gym_id: gymId,
        deleted_at: null,
      },
      select: {
        id: true,
        bank_to_pay: true,
        dni: true,
        phone: true,
        gym_id: true,
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
    const pagoMovilField = await this.prisma.pagoMovilFields.findFirst({
      where: { id, deleted_at: null },
      select: {
        id: true,
        bank_to_pay: true,
        dni: true,
        phone: true,
        gym_id: true,
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
    await this.prisma.pagoMovilFields.update({
      where: {
        id,
      },
      data: { deleted_at: new Date() },
    });
  }
}

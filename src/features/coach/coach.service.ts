import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { Coach, Prisma } from '@prisma/client';
import { CoachDto, CoachMeResponseDto } from './dto/response';
import { CreateCoachDto, UpdateCoachDto } from './dto/request';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

export type CoachWithPerson = Prisma.CoachGetPayload<{
  include: { person: true };
}>;
@Injectable()
export class CoachService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCoachDto: CreateCoachDto): Promise<Coach> {
    return this.prisma.coach.create({
      data: createCoachDto,
    });
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<CoachWithPerson>> {
    const { skip, limit, page } = pagination;
    const where = { deleted_at: null };
    const [data, total] = await Promise.all([
      this.prisma.coach.findMany({
        where,
        include: { person: true },
        skip,
        take: limit,
      }),
      this.prisma.coach.count({ where }),
    ]);
    return new PaginatedResponseDto(data, total, page!, limit!);
  }

  async findOne(id: string): Promise<CoachWithPerson> {
    const coach = await this.prisma.coach.findFirst({
      where: { id, deleted_at: null },
      include: { person: true },
    });

    if (!coach) {
      throw new NotFoundException(`Coach con la ID ${id} no fue encontrado`);
    }
    return coach;
  }

  async findCoachProfile(id: string): Promise<CoachDto> {
    const coach = await this.prisma.coach.findFirst({
      where: { id, deleted_at: null },
      include: {
        person: {
          select: {
            dni: true,
            name: true,
            surname: true,
            gender: true,
            birthday: true,
            status: true,
          },
        },
      },
    });
    if (!coach) {
      throw new NotFoundException(`Coach con la ID ${id} no fue encontrado`);
    }
    return {
      id: coach.id,
      dni: coach.person.dni,
      name: coach.person.name,
      surname: coach.person.surname,
      gender: coach.person.gender,
      birthday: coach.person.birthday,
      status: coach.person.status,
    };
  }

  async findCoachByUserId(userId: string): Promise<CoachMeResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { person_id: true },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no fue encontrado`);
    }

    const coach = await this.prisma.coach.findFirst({
      where: { person_id: user.person_id, deleted_at: null },
      select: {
        id: true,
        person_id: true,
        gym_id: true,
        person: {
          select: {
            dni: true,
            name: true,
            surname: true,
            gender: true,
            birthday: true,
            status: true,
          },
        },
      },
    });

    if (!coach) {
      throw new NotFoundException(
        `Coach associado al usuario ${userId} no fue encontrado`,
      );
    }

    return coach;
  }

  async findAllCoachesByGym(gymdId: string): Promise<CoachDto[]> {
    const coaches = await this.prisma.coach.findMany({
      where: { gym_id: gymdId, deleted_at: null },
      include: {
        person: {
          select: {
            dni: true,
            name: true,
            surname: true,
            gender: true,
            birthday: true,
            status: true,
          },
        },
      },
    });
    return coaches.map((coach) => ({
      id: coach.id,
      ...coach.person,
    }));
  }

  async update(id: string, updateCoachDto: UpdateCoachDto): Promise<Coach> {
    return this.prisma.coach.update({
      where: { id },
      data: updateCoachDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.coach.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}

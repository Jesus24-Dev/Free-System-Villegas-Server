import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { Coach, Prisma } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { CoachDto } from './dto/response';
import { CreateCoachDto, UpdateCoachDto } from './dto/request';

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

  async findAll(): Promise<CoachWithPerson[]> {
    return this.prisma.coach.findMany({
      include: { person: true },
    });
  }

  async findOne(id: string): Promise<CoachWithPerson> {
    const coach = await this.prisma.coach.findUnique({
      where: { id },
      include: { person: true },
    });

    if (!coach) {
      throw new NotFoundException(`Coach con la ID ${id} no fue encontrado`);
    }
    return coach;
  }

  async findCoachProfile(id: string): Promise<CoachDto> {
    const coach = await this.prisma.coach.findUnique({
      where: { id },
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

  async findAllCoachesByGym(gymdId: string): Promise<CoachDto[]> {
    const coaches = await this.prisma.coach.findMany({
      where: { gym_id: gymdId },
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
    await this.prisma.coach.delete({
      where: { id },
    });
  }
}

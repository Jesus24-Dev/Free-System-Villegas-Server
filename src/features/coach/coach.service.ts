import { Injectable } from '@nestjs/common';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Coach } from 'src/generated/prisma/client';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class CoachService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCoachDto: CreateCoachDto): Promise<Coach> {
    return this.prisma.coach.create({
      data: createCoachDto,
    });
  }

  async findAll(): Promise<Coach[]> {
    return this.prisma.coach.findMany();
  }

  async findOne(id: string): Promise<Coach> {
    const coach = await this.prisma.coach.findUnique({
      where: { id },
    });

    if (!coach) {
      throw new NotFoundException(`Coach con la ID ${id} no fue encontrado`);
    }
    return coach;
  }

  async findCoachProfile(id: string): Promise<Coach> {
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
    return coach;
  }

  async findAllCoachesByGym(gymdId: string): Promise<Coach[]> {
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
    return coaches;
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

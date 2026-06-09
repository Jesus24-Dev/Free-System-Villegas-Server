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

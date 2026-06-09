import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Athlete } from 'src/generated/prisma/client';

@Injectable()
export class AthleteService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAthleteDto: CreateAthleteDto): Promise<Athlete> {
    return this.prisma.athlete.create({
      data: createAthleteDto,
    });
  }

  async findAll(): Promise<Athlete[]> {
    return this.prisma.athlete.findMany({});
  }

  async findOne(id: string): Promise<Athlete> {
    const athlete = await this.prisma.athlete.findUnique({
      where: { id },
    });

    if (!athlete) {
      throw new NotFoundException(
        `El atleta con la ID ${id} no fue encontrado.`,
      );
    }

    return athlete;
  }

  async update(
    id: string,
    updateAthleteDto: UpdateAthleteDto,
  ): Promise<Athlete> {
    return this.prisma.athlete.update({
      where: { id },
      data: updateAthleteDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.athlete.delete({
      where: { id },
    });
  }
}

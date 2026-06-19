import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Competition } from 'src/generated/prisma/client';
import { FindCompetitionDto } from './dto/find-competition.dto';

@Injectable()
export class CompetitionService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createCompetitionDto: CreateCompetitionDto,
  ): Promise<Competition> {
    return this.prisma.competition.create({
      data: createCompetitionDto,
    });
  }

  async findAll(dto: FindCompetitionDto): Promise<Competition[]> {
    const { status } = dto;
    return this.prisma.competition.findMany({
      where: { status },
    });
  }

  async findOne(id: string): Promise<Competition> {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
    });

    if (!competition) {
      throw new NotFoundException(
        `La competencia con ID ${id} no fue encontrada`,
      );
    }

    return competition;
  }

  async update(
    id: string,
    updateCompetitionDto: UpdateCompetitionDto,
  ): Promise<Competition> {
    return this.prisma.competition.update({
      where: { id },
      data: updateCompetitionDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.competition.delete({
      where: { id },
    });
  }
}

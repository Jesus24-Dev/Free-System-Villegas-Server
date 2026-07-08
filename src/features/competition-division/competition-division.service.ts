import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompetitionDivision } from '@prisma/client';
import {
  CreateCompetitionDivisionDto,
  UpdateCompetitionDivisionDto,
} from './dto/request';
import { CompetitionDivisionDto } from './dto/response';

@Injectable()
export class CompetitionDivisionService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createCompetitionDivisionDto: CreateCompetitionDivisionDto,
  ): Promise<CompetitionDivision> {
    return this.prisma.competitionDivision.create({
      data: createCompetitionDivisionDto,
    });
  }

  async findAll(): Promise<CompetitionDivisionDto[]> {
    const competitionDivisions = await this.prisma.competitionDivision.findMany(
      {
        where: { deleted_at: null },
        include: { competition: true },
      },
    );

    return competitionDivisions.map((competitionDivision) => ({
      id: competitionDivision.id,
      gender: competitionDivision.gender,
      mode: competitionDivision.mode,
      category: competitionDivision.category,
      weight: competitionDivision.weight,
      competition: {
        name: competitionDivision.competition.name,
        status: competitionDivision.competition.status,
      },
    }));
  }

  async findOne(id: string): Promise<CompetitionDivisionDto> {
    const competitionDivision = await this.prisma.competitionDivision.findFirst(
      {
        where: { id, deleted_at: null },
        include: { competition: true },
      },
    );

    if (!competitionDivision) {
      throw new NotFoundException(
        `Modo de pelea con id ${id} no fue encontrado`,
      );
    }

    return {
      id: competitionDivision.id,
      gender: competitionDivision.gender,
      mode: competitionDivision.mode,
      category: competitionDivision.category,
      weight: competitionDivision.weight,
      competition: {
        name: competitionDivision.competition.name,
        status: competitionDivision.competition.status,
      },
    };
  }

  async update(
    id: string,
    updateCompetitionDivisionDto: UpdateCompetitionDivisionDto,
  ): Promise<CompetitionDivision> {
    return this.prisma.competitionDivision.update({
      where: { id },
      data: updateCompetitionDivisionDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.competitionDivision.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}

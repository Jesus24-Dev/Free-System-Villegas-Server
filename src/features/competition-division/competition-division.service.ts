import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompetitionDivisionDto } from './dto/create-competition-division.dto';
import { UpdateCompetitionDivisionDto } from './dto/update-competition-division.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompetitionDivision } from 'src/generated/prisma/client';

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

  async findAll(): Promise<CompetitionDivision[]> {
    return this.prisma.competitionDivision.findMany();
  }

  async findOne(id: string): Promise<CompetitionDivision> {
    const CompetitionDivision =
      await this.prisma.competitionDivision.findUnique({
        where: { id },
      });

    if (!CompetitionDivision) {
      throw new NotFoundException(
        `Modo de pelea con id ${id} no fue encontrado`,
      );
    }

    return CompetitionDivision;
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
    await this.prisma.competitionDivision.delete({
      where: { id },
    });
  }
}

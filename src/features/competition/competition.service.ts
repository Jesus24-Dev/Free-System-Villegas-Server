import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCompetitionDto,
  FindCompetitionDto,
  UpdateCompetitionDto,
} from './dto/request';
import { CompetitionDto } from './dto/response';

@Injectable()
export class CompetitionService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createCompetitionDto: CreateCompetitionDto,
  ): Promise<CompetitionDto> {
    return this.prisma.competition.create({
      data: createCompetitionDto,
    });
  }

  async findAll(dto: FindCompetitionDto): Promise<CompetitionDto[]> {
    const { status } = dto;
    const competitions = await this.prisma.competition.findMany({
      where: { status },
    });

    return competitions.map((competition) => ({
      id: competition.id,
      name: competition.name,
      description: competition.description,
      logo_url: competition.logo_url,
      location: competition.location,
      inscription_begin_at: competition.inscription_begin_at,
      inscription_end_at: competition.inscription_end_at,
      status: competition.status,
    }));
  }

  async findOne(id: string): Promise<CompetitionDto> {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
    });

    if (!competition) {
      throw new NotFoundException(
        `La competencia con ID ${id} no fue encontrada`,
      );
    }

    return {
      id: competition.id,
      name: competition.name,
      description: competition.description,
      logo_url: competition.logo_url,
      location: competition.location,
      inscription_begin_at: competition.inscription_begin_at,
      inscription_end_at: competition.inscription_end_at,
      status: competition.status,
    };
  }

  async update(
    id: string,
    updateCompetitionDto: UpdateCompetitionDto,
  ): Promise<CompetitionDto> {
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

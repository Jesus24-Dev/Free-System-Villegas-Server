import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCompetitionDto,
  FindCompetitionDto,
  UpdateCompetitionDto,
} from './dto/request';
import { CompetitionDto } from './dto/response';
import type { Response } from 'express';
import ExcelJS from 'exceljs';

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
      where: { status, deleted_at: null },
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
    const competition = await this.prisma.competition.findFirst({
      where: { id, deleted_at: null },
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
    await this.prisma.competition.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  async exportAthletesByGym(
    competitionId: string,
    gymId: string,
    res: Response,
  ): Promise<void> {
    const competition = await this.prisma.competition.findFirst({
      where: { id: competitionId, deleted_at: null },
    });

    if (!competition) {
      throw new NotFoundException(
        `La competencia con ID ${competitionId} no fue encontrada`,
      );
    }

    const registrations = await this.prisma.competitionRegistration.findMany({
      where: {
        division: { competition_id: competitionId },
        athlete: { gym_id: gymId, deleted_at: null },
        deleted_at: null,
      },
      include: {
        athlete: {
          include: {
            person: true,
          },
        },
        division: true,
      },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Atletas Inscritos');

    sheet.columns = [
      { header: 'DNI', key: 'dni', width: 15 },
      { header: 'Nombre', key: 'name', width: 20 },
      { header: 'Apellido', key: 'surname', width: 20 },
      { header: 'Género', key: 'gender', width: 10 },
      { header: 'Categoría', key: 'category', width: 12 },
      { header: 'Modalidad', key: 'mode', width: 18 },
      { header: 'Peso', key: 'weight', width: 10 },
    ];

    sheet.getRow(1).font = { bold: true };

    for (const reg of registrations) {
      sheet.addRow({
        dni: reg.athlete.person.dni,
        name: reg.athlete.person.name,
        surname: reg.athlete.person.surname,
        gender: reg.athlete.person.gender,
        category: reg.division.category,
        mode: reg.division.mode,
        weight: reg.division.weight,
      });
    }

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=atletas_${competition.name.replace(/\s+/g, '_')}_${gymId}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompetitionRegistrationDto } from './dto/request/create-competition-registration.dto';
import { UpdateCompetitionRegistrationDto } from './dto/request/update-competition-registration.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompetitionRegistration } from '@prisma/client';
import { CompetitionRegistrationResponseDto } from './dto/response';

@Injectable()
export class CompetitionRegistrationService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createCompetitionRegistrationDto: CreateCompetitionRegistrationDto,
  ): Promise<CompetitionRegistration> {
    return this.prisma.competitionRegistration.create({
      data: createCompetitionRegistrationDto,
    });
  }

  async findAll(): Promise<CompetitionRegistrationResponseDto[]> {
    const competitionRegistrations =
      await this.prisma.competitionRegistration.findMany({
        where: { deleted_at: null },
        include: {
          athlete: {
            include: {
              person: true,
            },
          },
          division: true,
        },
      });

    return competitionRegistrations.map((competitionRegistration) => ({
      id: competitionRegistration.id,
      athlete: {
        id: competitionRegistration.athlete.id,
        name: competitionRegistration.athlete.person.name,
        surname: competitionRegistration.athlete.person.surname,
        gender: competitionRegistration.athlete.person.gender,
      },
      division: {
        mode: competitionRegistration.division.mode,
        category: competitionRegistration.division.category,
        weight: competitionRegistration.division.weight,
      },
    }));
  }

  async findOne(id: string): Promise<CompetitionRegistrationResponseDto> {
    const competitionRegistration =
      await this.prisma.competitionRegistration.findFirst({
        where: { id, deleted_at: null },
        include: {
          athlete: {
            include: {
              person: true,
            },
          },
          division: true,
        },
      });

    if (!competitionRegistration) {
      throw new NotFoundException(
        `El registro del atleta con id ${id} no se pudo encontrar`,
      );
    }

    return {
      id: competitionRegistration.id,
      athlete: {
        id: competitionRegistration.athlete.id,
        name: competitionRegistration.athlete.person.name,
        surname: competitionRegistration.athlete.person.surname,
        gender: competitionRegistration.athlete.person.gender,
      },
      division: {
        mode: competitionRegistration.division.mode,
        category: competitionRegistration.division.category,
        weight: competitionRegistration.division.weight,
      },
    };
  }

  async update(
    id: string,
    updateCompetitionRegistrationDto: UpdateCompetitionRegistrationDto,
  ): Promise<CompetitionRegistration> {
    return this.prisma.competitionRegistration.update({
      where: { id },
      data: updateCompetitionRegistrationDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.competitionRegistration.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}

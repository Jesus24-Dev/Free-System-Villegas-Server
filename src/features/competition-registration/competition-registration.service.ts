import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompetitionRegistrationDto } from './dto/request/create-competition-registration.dto';
import { UpdateCompetitionRegistrationDto } from './dto/request/update-competition-registration.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompetitionRegistration } from '@prisma/client';
import { CompetitionRegistrationResponseDto } from './dto/response';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

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

  async findAll(
    pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<CompetitionRegistrationResponseDto>> {
    const { skip, limit, page } = pagination;
    const where = { deleted_at: null };
    const [data, total] = await Promise.all([
      this.prisma.competitionRegistration.findMany({
        where,
        include: {
          athlete: { include: { person: true } },
          division: true,
        },
        skip,
        take: limit,
      }),
      this.prisma.competitionRegistration.count({ where }),
    ]);

    return new PaginatedResponseDto(
      data.map((competitionRegistration) => ({
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
      })),
      total,
      page!,
      limit!,
    );
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

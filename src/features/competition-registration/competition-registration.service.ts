import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
          id: competitionRegistration.division.id,
          mode: competitionRegistration.division.mode,
          category: competitionRegistration.division.category,
          gender: competitionRegistration.division.gender,
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
        id: competitionRegistration.division.id,
        mode: competitionRegistration.division.mode,
        category: competitionRegistration.division.category,
        gender: competitionRegistration.division.gender,
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

  async findByCompetitionId(
    competitionId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<CompetitionRegistrationResponseDto>> {
    const { skip, limit, page } = pagination;
    const where = {
      deleted_at: null,
      division: { competition_id: competitionId, deleted_at: null },
    };
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
      data.map((reg) => ({
        id: reg.id,
        athlete: {
          id: reg.athlete.id,
          name: reg.athlete.person.name,
          surname: reg.athlete.person.surname,
          gender: reg.athlete.person.gender,
        },
        division: {
          id: reg.division.id,
          mode: reg.division.mode,
          category: reg.division.category,
          gender: reg.division.gender,
          weight: reg.division.weight,
        },
      })),
      total,
      page!,
      limit!,
    );
  }

  async findByGymId(
    gymId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<CompetitionRegistrationResponseDto>> {
    const { skip, limit, page } = pagination;
    const where = {
      deleted_at: null,
      athlete: { gym_id: gymId, deleted_at: null },
      division: { deleted_at: null },
    };
    const [data, total] = await Promise.all([
      this.prisma.competitionRegistration.findMany({
        where,
        include: {
          athlete: { include: { person: true } },
          division: {
            include: {
              competition: { select: { id: true, name: true, status: true } },
            },
          },
        },
        skip,
        take: limit,
      }),
      this.prisma.competitionRegistration.count({ where }),
    ]);

    return new PaginatedResponseDto(
      data.map((reg) => ({
        id: reg.id,
        athlete: {
          id: reg.athlete.id,
          name: reg.athlete.person.name,
          surname: reg.athlete.person.surname,
          gender: reg.athlete.person.gender,
        },
        division: {
          id: reg.division.id,
          mode: reg.division.mode,
          category: reg.division.category,
          gender: reg.division.gender,
          weight: reg.division.weight,
          competition: reg.division.competition,
        },
      })),
      total,
      page!,
      limit!,
    );
  }

  async findByGymAndCompetition(
    gymId: string,
    competitionId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<CompetitionRegistrationResponseDto>> {
    const { skip, limit, page } = pagination;
    const where = {
      deleted_at: null,
      athlete: { gym_id: gymId, deleted_at: null },
      division: { competition_id: competitionId, deleted_at: null },
    };
    const [data, total] = await Promise.all([
      this.prisma.competitionRegistration.findMany({
        where,
        include: {
          athlete: { include: { person: true } },
          division: {
            include: {
              competition: { select: { id: true, name: true, status: true } },
            },
          },
        },
        skip,
        take: limit,
      }),
      this.prisma.competitionRegistration.count({ where }),
    ]);

    return new PaginatedResponseDto(
      data.map((reg) => ({
        id: reg.id,
        athlete: {
          id: reg.athlete.id,
          name: reg.athlete.person.name,
          surname: reg.athlete.person.surname,
          gender: reg.athlete.person.gender,
        },
        division: {
          id: reg.division.id,
          mode: reg.division.mode,
          category: reg.division.category,
          gender: reg.division.gender,
          weight: reg.division.weight,
          competition: reg.division.competition,
        },
      })),
      total,
      page!,
      limit!,
    );
  }

  async remove(id: string): Promise<void> {
    await this.prisma.competitionRegistration.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  async removeByAthleteAndCompetition(
    athleteId: string,
    competitionId: string,
    divisionId: string,
  ): Promise<void> {
    const registration =
      await this.prisma.competitionRegistration.findFirst({
        where: {
          athlete_id: athleteId,
          division_id: divisionId,
          deleted_at: null,
          division: {
            competition_id: competitionId,
            deleted_at: null,
          },
        },
        include: {
          division: {
            include: {
              competition: { select: { status: true } },
            },
          },
        },
      });

    if (!registration) {
      throw new NotFoundException(
        `No se encontro un registro del atleta ${athleteId} en la division ${divisionId} de la competencia ${competitionId}`,
      );
    }

    if (registration.division.competition.status !== 'OPEN') {
      throw new BadRequestException(
        `No se puede eliminar el registro. La competencia no esta en estado OPEN`,
      );
    }

    await this.prisma.competitionRegistration.delete({
      where: { id: registration.id },
    });
  }
}

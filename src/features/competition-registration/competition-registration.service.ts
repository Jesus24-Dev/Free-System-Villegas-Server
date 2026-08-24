import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompetitionRegistrationDto } from './dto/request/create-competition-registration.dto';
import { UpdateCompetitionRegistrationDto } from './dto/request/update-competition-registration.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompetitionRegistration, FightingMode } from '@prisma/client';
import { CompetitionRegistrationResponseDto } from './dto/response';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

const RING_MODES = new Set<FightingMode>([
  FightingMode.K1,
  FightingMode.LOW_KICK,
  FightingMode.FULL_CONTACT,
]);

const TATAMI_MODES = new Set<FightingMode>([
  FightingMode.POINT_FIGHTING,
  FightingMode.KICK_LIGHT,
  FightingMode.LIGHT_CONTACT,
  FightingMode.BOXING,
]);

@Injectable()
export class CompetitionRegistrationService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createCompetitionRegistrationDto: CreateCompetitionRegistrationDto,
  ): Promise<CompetitionRegistration> {
    const { athlete_id, division_id } = createCompetitionRegistrationDto;

    const division = await this.prisma.competitionDivision.findUnique({
      where: { id: division_id },
      select: { competition_id: true, mode: true },
    });

    if (!division) {
      throw new NotFoundException(
        `La division con id ${division_id} no existe`,
      );
    }

    const newMode = division.mode;
    const isRing = RING_MODES.has(newMode);
    const isTatami = TATAMI_MODES.has(newMode);

    const existingRegistrations =
      await this.prisma.competitionRegistration.findMany({
        where: {
          athlete_id,
          deleted_at: null,
          division: {
            competition_id: division.competition_id,
            deleted_at: null,
          },
        },
        include: {
          division: { select: { mode: true } },
        },
      });

    if (existingRegistrations.length > 0) {
      const hasRing = existingRegistrations.some((r) =>
        RING_MODES.has(r.division.mode),
      );
      const hasTatami = existingRegistrations.some((r) =>
        TATAMI_MODES.has(r.division.mode),
      );

      if (isRing && hasRing) {
        const existingRing = existingRegistrations.find((r) =>
          RING_MODES.has(r.division.mode),
        );
        throw new BadRequestException(
          `El atleta ya esta registrado en una modalidad de Ring (${existingRing!.division.mode}). Solo puede registrarse en una modalidad de Ring por competencia`,
        );
      }

      if (isTatami && hasRing) {
        throw new BadRequestException(
          `El atleta ya tiene un registro en modalidad de Ring. No puede registrarse en modalidades de Tatami y Ring simultaneamente`,
        );
      }

      if (isRing && hasTatami) {
        throw new BadRequestException(
          `El atleta ya tiene registros en modalidades de Tatami. No puede registrarse en modalidades de Ring y Tatami simultaneamente`,
        );
      }
    }

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
          athlete: { include: { person: true, gym: { select: { name: true } } } },
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
          competition_id: competitionRegistration.division.competition_id,
          mode: competitionRegistration.division.mode,
          category: competitionRegistration.division.category,
          gender: competitionRegistration.division.gender,
          weight: competitionRegistration.division.weight,
        },
        gym_name: competitionRegistration.athlete.gym?.name,
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
              gym: { select: { name: true } },
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
        competition_id: competitionRegistration.division.competition_id,
        mode: competitionRegistration.division.mode,
        category: competitionRegistration.division.category,
        gender: competitionRegistration.division.gender,
        weight: competitionRegistration.division.weight,
      },
      gym_name: competitionRegistration.athlete.gym?.name,
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
          athlete: { include: { person: true, gym: { select: { name: true } } } },
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
          competition_id: reg.division.competition_id,
          mode: reg.division.mode,
          category: reg.division.category,
          gender: reg.division.gender,
          weight: reg.division.weight,
        },
        gym_name: reg.athlete.gym?.name,
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
          athlete: { include: { person: true, gym: { select: { name: true } } } },
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
          competition_id: reg.division.competition_id,
          mode: reg.division.mode,
          category: reg.division.category,
          gender: reg.division.gender,
          weight: reg.division.weight,
          competition: reg.division.competition,
        },
        gym_name: reg.athlete.gym?.name,
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
          athlete: { include: { person: true, gym: { select: { name: true } } } },
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
          competition_id: reg.division.competition_id,
          mode: reg.division.mode,
          category: reg.division.category,
          gender: reg.division.gender,
          weight: reg.division.weight,
          competition: reg.division.competition,
        },
        gym_name: reg.athlete.gym?.name,
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

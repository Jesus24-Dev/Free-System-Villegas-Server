import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CompetitionStatus, FightingMode } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterAthleteAtCompetitionDto } from '../dto/request';
import { LoggerService } from 'src/common/logger/logger.service';
import { RegistrationResponseDto } from '../dto/response/registration-response.dto';

@Injectable()
export class RegisterAthleteAtCompetitionUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async execute(
    dto: RegisterAthleteAtCompetitionDto,
    competitionId: string,
    athleteId: string,
  ): Promise<RegistrationResponseDto> {
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

    const registration = await this.prisma.$transaction(async (tx) => {
      // =====================================================
      // Competition validation
      // =====================================================

      const competition = await tx.competition.findFirst({
        where: {
          id: competitionId,
          deleted_at: null,
        },
      });

      if (!competition) {
        throw new NotFoundException(
          `Competencia con ID ${competitionId} no encontrada`,
        );
      }

      if (competition.status !== CompetitionStatus.OPEN) {
        this.logger.error(
          'ATHLETE_REGISTER_FAILED',
          new Error('Competition status is not open'),
          {
            competitionId,
          },
        );

        throw new BadRequestException(
          'La competencia no esta abierta para inscripciones',
        );
      }

      // =====================================================
      // Athlete validation
      // =====================================================

      const athlete = await tx.athlete.findFirst({
        where: {
          id: athleteId,
          deleted_at: null,
        },
        include: {
          person: true,
        },
      });

      if (!athlete) {
        throw new NotFoundException(`Atleta con ID ${athleteId} no encontrado`);
      }

      if (!athlete.person) {
        this.logger.error(
          'ATHLETE_REGISTER_FAILED',
          new Error('Athlete has not a associated profile'),
          {
            athleteId,
          },
        );

        throw new BadRequestException('El atleta no tiene un perfil asociado');
      }

      // =====================================================
      // WAKO division validation
      // =====================================================

      const officialDivision = await tx.fightingWeights.findFirst({
        where: {
          mode: dto.mode,
          category: dto.category,
          gender: athlete.person.gender,
          weight: dto.weight,
        },
      });

      if (!officialDivision) {
        this.logger.error(
          'ATHLETE_REGISTER_FAILED',
          new Error('Category not exists'),
          {
            mode: dto.mode,
            category: dto.category,
            gender: athlete.person.gender,
            weight: dto.weight,
          },
        );

        throw new BadRequestException(
          'La division seleccionada no existe en las categorias oficiales de WAKO',
        );
      }

      // =====================================================
      // Ring / Tatami validation
      // =====================================================

      const isNewRing = RING_MODES.has(dto.mode);
      const isNewTatami = TATAMI_MODES.has(dto.mode);

      const existingRegistrations =
        await tx.competitionRegistration.findMany({
          where: {
            athlete_id: athleteId,
            deleted_at: null,
            division: {
              competition_id: competitionId,
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

        if (isNewRing && hasRing) {
          const existingRing = existingRegistrations.find((r) =>
            RING_MODES.has(r.division.mode),
          );
          throw new ConflictException(
            `El atleta ya esta registrado en una modalidad de Ring (${existingRing!.division.mode}). Solo puede registrarse en una modalidad de Ring por competencia`,
          );
        }

        if (isNewTatami && hasRing) {
          throw new BadRequestException(
            `El atleta ya tiene un registro en modalidad de Ring. No puede registrarse en modalidades de Tatami y Ring simultaneamente`,
          );
        }

        if (isNewRing && hasTatami) {
          throw new BadRequestException(
            `El atleta ya tiene registros en modalidades de Tatami. No puede registrarse en modalidades de Ring y Tatami simultaneamente`,
          );
        }
      }

      // =====================================================
      // Find or create competition division
      // =====================================================

      let division = await tx.competitionDivision.findFirst({
        where: {
          competition_id: competitionId,
          mode: dto.mode,
          category: dto.category,
          gender: athlete.person.gender,
          weight: dto.weight,
          deleted_at: null,
        },
      });

      if (!division) {
        division = await tx.competitionDivision.create({
          data: {
            competition_id: competitionId,
            mode: dto.mode,
            category: dto.category,
            gender: athlete.person.gender,
            weight: dto.weight,
          },
        });
      }

      // =====================================================
      // Duplicate registration validation
      // =====================================================

      const existingRegistration = await tx.competitionRegistration.findFirst({
        where: {
          athlete_id: athleteId,
          division_id: division.id,
          deleted_at: null,
        },
      });

      if (existingRegistration) {
        throw new ConflictException(
          'El atleta ya esta registrado en esta categoria',
        );
      }

      // =====================================================
      // Registration
      // =====================================================

      const competitionRegistration = await tx.competitionRegistration.create({
        data: {
          athlete_id: athleteId,
          division_id: division.id,
        },
      });

      this.logger.info('GYM_CREATED', {
        competition: competition.id,
        athlete: athleteId,
        division_id: division.id,
      });
      return competitionRegistration;
    });
    return {
      id: registration.id,
      athlete_id: registration.athlete_id,
      division_id: registration.division_id,
    };
  }
}

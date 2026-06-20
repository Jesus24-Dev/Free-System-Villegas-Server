import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  CompetitionRegistration,
  CompetitionStatus,
  FightingMode,
} from 'src/generated/prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterAthleteAtCompetitionDto } from '../dto/request';

@Injectable()
export class RegisterAthleteAtCompetitionUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    dto: RegisterAthleteAtCompetitionDto,
    competitionId: string,
    athleteId: string,
  ): Promise<CompetitionRegistration> {
    const RING_MODES = new Set<FightingMode>([
      FightingMode.K1,
      FightingMode.LOW_KICK,
      FightingMode.FULL_CONTACT,
    ]);

    return this.prisma.$transaction(async (tx) => {
      // =====================================================
      // Competition validation
      // =====================================================

      const competition = await tx.competition.findUnique({
        where: {
          id: competitionId,
        },
      });

      if (!competition) {
        throw new NotFoundException(
          `Competencia con ID ${competitionId} no encontrada`,
        );
      }

      if (competition.status !== CompetitionStatus.OPEN) {
        throw new BadRequestException(
          'La competencia no esta abierta para inscripciones',
        );
      }

      // =====================================================
      // Athlete validation
      // =====================================================

      const athlete = await tx.athlete.findUnique({
        where: {
          id: athleteId,
        },
        include: {
          person: true,
        },
      });

      if (!athlete) {
        throw new NotFoundException(`Atleta con ID ${athleteId} no encontrado`);
      }

      if (!athlete.person) {
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
        throw new BadRequestException(
          'La division seleccionada no existe en las categorias oficiales de WAKO',
        );
      }

      // =====================================================
      // Ring validation
      // =====================================================

      if (RING_MODES.has(dto.mode)) {
        const existingRingRegistration =
          await tx.competitionRegistration.findFirst({
            where: {
              athlete_id: athleteId,
              division: {
                competition_id: competitionId,
                mode: {
                  in: Array.from(RING_MODES),
                },
              },
            },
            include: {
              division: true,
            },
          });

        if (existingRingRegistration) {
          throw new ConflictException(
            `El atleta ya esta registrado en una modalidad de Ring ${existingRingRegistration.division.mode}`,
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

      return tx.competitionRegistration.create({
        data: {
          athlete_id: athleteId,
          division_id: division.id,
        },
      });
    });
  }
}

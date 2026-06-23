/* eslint-disable */
// @ts-nocheck
import { Test } from '@nestjs/testing';
import { RegisterAthleteAtCompetitionUseCase } from '../use-cases/register-athlete-at-competition.use-case';
import { PrismaService } from 'src/prisma/prisma.service';
import { describe, beforeEach, jest, it, expect } from '@jest/globals';
import {
  CompetitionStatus,
  FightingCategory,
  FightingMode,
  Gender,
} from '@prisma/client';
import { LoggerService } from 'src/common/logger/logger.service';

describe('RegisterAthleteAtCompetitionUseCase', () => {
  let useCase: RegisterAthleteAtCompetitionUseCase;

  let prisma: {
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      $transaction: jest.fn(),
    };

    const mockLogger = {
      log: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };
    const module = await Test.createTestingModule({
      providers: [
        RegisterAthleteAtCompetitionUseCase,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: LoggerService,
          useValue: mockLogger,
        },
      ],
    }).compile();

    useCase = module.get(RegisterAthleteAtCompetitionUseCase);
  });
  it('debe registrar un atleta en una competencia', async () => {
    prisma.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        competition: {
          findUnique: jest.fn().mockResolvedValue({
            id: 'competition-1',
            name: 'competition-for-test',
            status: CompetitionStatus.OPEN,
          }),
        },

        athlete: {
          findUnique: jest.fn().mockResolvedValue({
            id: 'athlete-1',
            person: {
              id: 'person-1',
            },
          }),
        },

        fightingWeights: {
          findFirst: jest.fn().mockResolvedValue({
            mode: FightingMode.POINT_FIGHTING,
            category: FightingCategory.S,
            gender: Gender.MALE,
            weight: -69,
          }),
        },

        competitionDivision: {
          create: jest.fn().mockResolvedValue({
            id: 'division-1',
          }),
          findFirst: jest.fn().mockResolvedValue({
            competition_id: 'competition-1',
            mode: FightingMode.POINT_FIGHTING,
            category: FightingCategory.S,
            gender: Gender.MALE,
            weight: -69,
          }),
        },

        competitionRegistration: {
          create: jest.fn().mockResolvedValue({
            id: 'registration-123',
            athlete_id: 'athlete-1',
            division_id: 'division-1',
          }),
          findFirst: jest.fn().mockResolvedValue(null),
        },
      };

      return callback(tx);
    });

    const result = await useCase.execute(
      {
        mode: FightingMode.POINT_FIGHTING,
        category: FightingCategory.S,
        weight: -69,
      },

      'competition-1',

      'athlete-1',
    );

    expect(result).toEqual({
      id: 'registration-123',
      athlete_id: 'athlete-1',
      division_id: 'division-1',
    });
  });

  it('no debe permitir doble registro', async () => {
    prisma.$transaction.mockRejectedValue(new Error('duplicate'));
    await expect(
      useCase.execute({}, 'competition', 'athlete'),
    ).rejects.toThrow();
  });
});

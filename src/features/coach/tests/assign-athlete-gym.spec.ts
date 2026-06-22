/* eslint-disable */
// @ts-nocheck
import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { describe, beforeEach, jest, it, expect } from '@jest/globals';
import { AssignAthleteToGymUseCase } from '../use-cases/assign-athlete-gym.use-case';
import { ConflictException } from '@nestjs/common';

describe('AssignAthleteToGymUseCase', () => {
  let useCase: AssignAthleteToGymUseCase;

  let prisma: {
    athlete: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      athlete: jest.fn(),
    };
    const module = await Test.createTestingModule({
      providers: [
        AssignAthleteToGymUseCase,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();
    useCase = module.get(AssignAthleteToGymUseCase);
  });
  it('debe asignar un atleta al gimnasio', async () => {
    prisma.athlete = {
      findFirst: jest.fn().mockResolvedValue({
        id: 'athlete-1',
        gym_id: null,
      }),
      update: jest.fn().mockResolvedValue({
        id: 'athlete-1',
        gym_id: 'gym-1',
      }),
    };
    const result = await useCase.execute('athlete-1', 'gym-1');
    expect(result).toEqual({
      id: 'athlete-1',
      gym_id: 'gym-1',
    });
  });

  it('el atleta ya tiene un gimnasio asignado', async () => {
    prisma.athlete = {
      findFirst: jest.fn().mockResolvedValue({
        id: 'athlete-1',
        gym_id: 'gym-antiguo-123',
      }),
      update: jest.fn(),
    };
    await expect(useCase.execute('athlete-1', 'gym-nuevo-456')).rejects.toThrow(
      ConflictException,
    );
    expect(prisma.athlete.update).not.toHaveBeenCalled();
  });
});

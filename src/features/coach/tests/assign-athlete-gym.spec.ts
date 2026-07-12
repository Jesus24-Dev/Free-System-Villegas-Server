/* eslint-disable */
// @ts-nocheck
import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { describe, beforeEach, jest, it, expect } from '@jest/globals';
import { AssignAthleteToGymUseCase } from '../use-cases/assign-athlete-gym.use-case';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('AssignAthleteToGymUseCase', () => {
  let useCase: AssignAthleteToGymUseCase;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      athlete: {
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      gym: {
        findFirst: jest.fn(),
      },
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
    prisma.athlete.findFirst.mockResolvedValue({
      id: 'athlete-1',
      gym_id: null,
    });

    prisma.gym.findFirst.mockResolvedValue({
      id: 'gym-1',
      name: 'Test Gym',
    });

    prisma.athlete.update.mockResolvedValue({
      id: 'athlete-1',
      gym_id: 'gym-1',
    });

    const result = await useCase.execute('athlete-1', 'gym-1');
    expect(result).toEqual({
      id: 'athlete-1',
      gym_id: 'gym-1',
    });
  });

  it('el atleta ya tiene un gimnasio asignado', async () => {
    prisma.athlete.findFirst.mockResolvedValue({
      id: 'athlete-1',
      gym_id: 'gym-antiguo-123',
    });

    await expect(useCase.execute('athlete-1', 'gym-nuevo-456')).rejects.toThrow(
      ConflictException,
    );
    expect(prisma.athlete.update).not.toHaveBeenCalled();
  });

  it('debe lanzar NotFoundException si el atleta no existe', async () => {
    prisma.athlete.findFirst.mockResolvedValue(null);

    await expect(
      useCase.execute('athlete-inexistente', 'gym-1'),
    ).rejects.toThrow(NotFoundException);
    expect(prisma.athlete.update).not.toHaveBeenCalled();
  });

  it('debe lanzar NotFoundException si el gimnasio no existe', async () => {
    prisma.athlete.findFirst.mockResolvedValue({
      id: 'athlete-1',
      gym_id: null,
    });

    prisma.gym.findFirst.mockResolvedValue(null);

    await expect(
      useCase.execute('athlete-1', 'gym-inexistente'),
    ).rejects.toThrow(NotFoundException);
    expect(prisma.athlete.update).not.toHaveBeenCalled();
  });
});

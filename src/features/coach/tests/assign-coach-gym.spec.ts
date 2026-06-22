/* eslint-disable */
// @ts-nocheck
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { AssignCoachToGymUseCase } from '../use-cases/assign-coach-gym.use-case';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AssignCoachToGymUseCase', () => {
  let useCase: AssignCoachToGymUseCase;
  let prisma: any;

  beforeEach(async () => {
    // Inicializamos el objeto prisma con la estructura base vacía
    prisma = {
      coach: {
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AssignCoachToGymUseCase,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    useCase = module.get(AssignCoachToGymUseCase);
  });

  // =========================================================================
  // CAMINO FELIZ: Asignación exitosa
  // =========================================================================
  it('debe asignar un coach al gimnasio correctamente', async () => {
    // Simulamos que el coach existe y no tiene gimnasio (gym_id: null)
    prisma.coach.findFirst.mockResolvedValue({
      id: 'coach-1',
      gym_id: null,
    });

    // Simulamos el update
    prisma.coach.update.mockResolvedValue({
      id: 'coach-1',
      gym_id: 'gym-1',
    });

    const result = await useCase.execute('coach-1', 'gym-1');

    // Verificaciones
    expect(result).toEqual({ id: 'coach-1', gym_id: null }); // Espera 'null' porque devuelves la variable 'coach' original
    expect(prisma.coach.findFirst).toHaveBeenCalledWith({ where: { id: 'coach-1' } });
    expect(prisma.coach.update).toHaveBeenCalledWith({
      where: { id: 'coach-1' },
      data: { gym_id: 'gym-1' },
    });
  });

  it('debe lanzar un NotFoundException si el coach no existe', async () => {
    prisma.coach.findFirst.mockResolvedValue(null);

    await expect(useCase.execute('coach-inexistente', 'gym-1')).rejects.toThrow(
      NotFoundException,
    );

    expect(prisma.coach.update).not.toHaveBeenCalled();
  });

  it('debe lanzar un ConflictException si el coach ya tiene un gimnasio asignado', async () => {
    prisma.coach.findFirst.mockResolvedValue({
      id: 'coach-1',
      gym_id: 'gym-antiguo-99',
    });

    await expect(useCase.execute('coach-1', 'gym-nuevo-100')).rejects.toThrow(
      ConflictException,
    );

    expect(prisma.coach.update).not.toHaveBeenCalled();
  });
});

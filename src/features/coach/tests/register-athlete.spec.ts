/* eslint-disable */
// @ts-nocheck
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RegisterAthleteUseCase } from '../use-cases/register-athlete.use-case'; // Ajusta la ruta
import { PrismaService } from 'src/prisma/prisma.service';

describe('RegisterAthleteUseCase', () => {
  let useCase: RegisterAthleteUseCase;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      $transaction: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        RegisterAthleteUseCase,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    useCase = module.get(RegisterAthleteUseCase);
  });
  
  it('debe registrar un atleta usando una transaccion de manera exitosa', async () => {
    const mockDto = {
      first_name: 'John',
      last_name: 'Doe',
      gender: 'MALE',
      birth_date: new Date('2000-01-01'),
    };

    prisma.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        gym: {
          findFirst: jest.fn().mockResolvedValue({
            id: 'gym-123',
            name: 'Alpha Gym',
          }),
        },
        person: {
          create: jest.fn().mockResolvedValue({
            id: 'person-789',
            ...mockDto,
          }),
        },
        athlete: {
          create: jest.fn().mockResolvedValue({
            id: 'athlete-456',
            person_id: 'person-789',
            gym_id: 'gym-123',
          }),
        },
      };

      return callback(tx);
    });

    // Ejecución
    const result = await useCase.execute(mockDto, 'gym-123');

    expect(result).toEqual({
      id: 'athlete-456',
      person_id: 'person-789',
      gym_id: 'gym-123',
    });


    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it('debe lanzar un NotFoundException dentro de la transaccion si el gimnasio no existe', async () => {
    const mockDto = {
      first_name: 'John',
      last_name: 'Doe',
    };

    prisma.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        gym: {
          findFirst: jest.fn().mockResolvedValue(null),
        },
        person: {
          create: jest.fn(),
        },
        athlete: {
          create: jest.fn(),
        },
      };

      return callback(tx);
    });

    await expect(
      useCase.execute(mockDto, 'gym-inexistente'),
    ).rejects.toThrow(NotFoundException);
  });
});
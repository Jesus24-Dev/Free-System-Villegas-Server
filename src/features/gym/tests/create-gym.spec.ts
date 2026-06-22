/* eslint-disable */
// @ts-nocheck
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreateGymUseCase } from '../use-cases/create-gym.use-case'; 
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerService } from 'src/common/logger/logger.service';

describe('CreateGymUseCase', () => {
  let useCase: CreateGymUseCase;
  let prisma: any;
  let mockLogger: any;

  beforeEach(async () => {
    prisma = {
      $transaction: jest.fn(),
    };

    mockLogger = {
      log: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        CreateGymUseCase,
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

    useCase = module.get(CreateGymUseCase);
  });

  it('debe crear un gimnasio y sus metodos de pago correctamente', async () => {
    const mockDto = {
      name: 'Chute Boxe',
      address: 'Av. Siempre Viva 742',
      payment_methods: [
        { bank_to_pay: 'Banesco', dni: 'V-123456', phone: '04141234567' }
      ]
    };

    prisma.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        coach: {
          findFirst: jest.fn().mockResolvedValue({
            id: 'coach-123',
          }),
        },
        gym: {
          create: jest.fn().mockResolvedValue({
            id: 'gym-999',
            name: 'Chute Boxe',
            owner_id: 'coach-123',
            address: 'Av. Siempre Viva 742',
          }),
        },
        pagoMovilFields: {
          createMany: jest.fn().mockResolvedValue({ count: 1 }),
        },
      };
      return callback(tx);
    });

    const result = await useCase.execute('user-555', mockDto);

    expect(result).toEqual({
      id: 'gym-999',
      name: 'Chute Boxe',
      owner_id: 'coach-123',
      address: 'Av. Siempre Viva 742',
    });

    expect(mockLogger.info).toHaveBeenCalledWith('GYM_CREATED', {
      gymId: 'gym-999',
      ownerId: 'coach-123',
    });
  });


  it('debe lanzar ForbiddenException si el usuario no es un coach registrado', async () => {
    const mockDto = { name: 'Gym Sin Coach', payment_methods: [{ bank_to_pay: 'BCV' }] };

    prisma.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        coach: {
          findFirst: jest.fn().mockResolvedValue(null),
        },
        gym: { create: jest.fn() },
        pagoMovilFields: { createMany: jest.fn() },
      };
      return callback(tx);
    });

    await expect(
      useCase.execute('user-anonimo', mockDto)
    ).rejects.toThrow(ForbiddenException);

    expect(mockLogger.error).toHaveBeenCalledWith(
      'GYM_CREATION_FAILED',
      expect.any(Error),
      { userId: 'user-anonimo' }
    );
  });

  it('debe lanzar BadRequestException si el array de payment_methods viene vacío', async () => {
    const mockDto = {
      name: 'Gym Gratis',
      payment_methods: []
    };

    prisma.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        coach: {
          findFirst: jest.fn().mockResolvedValue({ id: 'coach-123' }),
        },
        gym: { create: jest.fn() },
        pagoMovilFields: { createMany: jest.fn() },
      };
      return callback(tx);
    });

    await expect(
      useCase.execute('user-555', mockDto)
    ).rejects.toThrow(BadRequestException);

    expect(mockLogger.error).toHaveBeenCalledWith(
      'GYM_CREATION_FAILED',
      expect.any(Error),
      { payload: mockDto }
    );
  });
});
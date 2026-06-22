/* eslint-disable */
// @ts-nocheck
import { Test } from '@nestjs/testing';
import { RegisterUserUseCase } from '../use-cases/register-user.use-case';
import { PrismaService } from 'src/prisma/prisma.service';
import { describe, beforeEach, jest, it, expect } from '@jest/globals';
import { PasswordService } from '../services/password.service';
import { LoggerService } from 'src/common/logger/logger.service';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;

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

    const mockPasswordService = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        RegisterUserUseCase,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: LoggerService,
          useValue: mockLogger,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
      ],
    }).compile();
    useCase = module.get(RegisterUserUseCase);
  });

  it('debe crear un usuario', async () => {
    prisma.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        person: {
          create: jest.fn().mockResolvedValue({
            id: 'person-1',
          }),
        },
        athlete: {
          create: jest.fn().mockResolvedValue({
            id: 'athlete-1',
          }),
        },
        user: {
          create: jest.fn().mockResolvedValue({
            id: 'user-1',
            email: 'emailtest@gmail.com',
            password: 'pass1234',
            role: ['ATHLETE'],
            person_id: 'person-1',
          }),
        },
      };
      return callback(tx);
    });
    const result = await useCase.execute({
      email: 'emailtest@gmail.com',
      password: 'pass1234',
      role: 'ATHLETE',
      person_id: 'person-1',
    });
    expect(result).toEqual({
      id: 'user-1',
      email: 'emailtest@gmail.com',
      password: 'pass1234',
      role: ['ATHLETE'],
      person_id: 'person-1',
    });
  });
});

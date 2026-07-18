/* eslint-disable */
// @ts-nocheck
import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { describe, beforeEach, jest, it, expect } from '@jest/globals';
import { GymPaymentService } from '../gym-payment.service';
import { NotFoundException } from '@nestjs/common';

describe('GymPaymentService', () => {
  let service: GymPaymentService;

  let prisma: {
    gymPayment: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      count: jest.Mock;
      update: jest.Mock;
    };
  };

  let logger: {
    info: jest.Mock;
    warn: jest.Mock;
    error: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      gymPayment: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
      },
    };

    logger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        GymPaymentService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: LoggerService,
          useValue: logger,
        },
      ],
    }).compile();

    service = module.get(GymPaymentService);
  });

  describe('create', () => {
    it('debe crear un pago del gimnasio correctamente', async () => {
      const createGymPaymentDto = {
        gym_id: 'gym-1',
        athlete_id: 'athlete-1',
        amount: 50.0,
        isConfirmed: false,
      };

      const expectedPayment = {
        id: 'payment-1',
        ...createGymPaymentDto,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      prisma.gymPayment.create.mockResolvedValue(expectedPayment);

      const result = await service.create(createGymPaymentDto);

      expect(prisma.gymPayment.create).toHaveBeenCalledWith({
        data: createGymPaymentDto,
      });
      expect(result).toEqual(expectedPayment);
    });
  });

  describe('findAll', () => {
    it('debe retornar una lista paginada de pagos', async () => {
      const filter = {
        page: 1,
        limit: 10,
        skip: 0,
        gym_id: undefined,
      };

      const payments = [
        { id: 'payment-1', gym_id: 'gym-1', amount: 50 },
        { id: 'payment-2', gym_id: 'gym-1', amount: 75 },
      ];

      prisma.gymPayment.findMany.mockResolvedValue(payments);
      prisma.gymPayment.count.mockResolvedValue(2);

      const result = await service.findAll(filter);

      expect(prisma.gymPayment.findMany).toHaveBeenCalledWith({
        where: { deleted_at: null },
        skip: 0,
        take: 10,
      });
      expect(prisma.gymPayment.count).toHaveBeenCalledWith({
        where: { deleted_at: null },
      });
      expect(result.data).toEqual(payments);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('debe filtrar pagos por gym_id', async () => {
      const filter = {
        page: 1,
        limit: 10,
        skip: 0,
        gym_id: 'gym-1',
      };

      const payments = [
        { id: 'payment-1', gym_id: 'gym-1', amount: 50 },
      ];

      prisma.gymPayment.findMany.mockResolvedValue(payments);
      prisma.gymPayment.count.mockResolvedValue(1);

      const result = await service.findAll(filter);

      expect(prisma.gymPayment.findMany).toHaveBeenCalledWith({
        where: { deleted_at: null, gym_id: 'gym-1' },
        skip: 0,
        take: 10,
      });
      expect(prisma.gymPayment.count).toHaveBeenCalledWith({
        where: { deleted_at: null, gym_id: 'gym-1' },
      });
      expect(result.data).toEqual(payments);
      expect(result.total).toBe(1);
    });

    it('debe retornar lista vacía cuando no hay pagos', async () => {
      const filter = {
        page: 1,
        limit: 10,
        skip: 0,
        gym_id: undefined,
      };

      prisma.gymPayment.findMany.mockResolvedValue([]);
      prisma.gymPayment.count.mockResolvedValue(0);

      const result = await service.findAll(filter);

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });

  describe('findByGym', () => {
    it('debe retornar pagos de un gimnasio con datos del atleta', async () => {
      const gymId = 'gym-1';
      const prismaResult = [
        {
          id: 'payment-1',
          day_payed: new Date('2026-06-01'),
          amount: 50,
          evidence_url: null,
          payment_reference: 'REF-001',
          isConfirmed: true,
          gym_id: gymId,
          created_at: new Date(),
          updated_at: new Date(),
          athlete: {
            id: 'athlete-1',
            person: {
              dni: 'V12345678',
              name: 'Juan',
              surname: 'Pérez',
            },
          },
        },
      ];

      prisma.gymPayment.findMany.mockResolvedValue(prismaResult);

      const result = await service.findByGym(gymId);

      expect(prisma.gymPayment.findMany).toHaveBeenCalledWith({
        where: { gym_id: gymId, deleted_at: null },
        select: {
          id: true,
          day_payed: true,
          amount: true,
          evidence_url: true,
          payment_reference: true,
          isConfirmed: true,
          gym_id: true,
          created_at: true,
          updated_at: true,
          athlete: {
            select: {
              id: true,
              person: {
                select: {
                  dni: true,
                  name: true,
                  surname: true,
                },
              },
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });
      expect(result).toEqual([
        {
          id: 'payment-1',
          day_payed: prismaResult[0].day_payed,
          amount: 50,
          evidence_url: null,
          payment_reference: 'REF-001',
          isConfirmed: true,
          gym_id: gymId,
          created_at: prismaResult[0].created_at,
          updated_at: prismaResult[0].updated_at,
          athlete: {
            id: 'athlete-1',
            dni: 'V12345678',
            name: 'Juan',
            surname: 'Pérez',
          },
        },
      ]);
    });

    it('debe retornar lista vacía cuando no hay pagos para el gimnasio', async () => {
      prisma.gymPayment.findMany.mockResolvedValue([]);

      const result = await service.findByGym('gym-sin-pagos');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('debe retornar un pago por ID', async () => {
      const payment = {
        id: 'payment-1',
        gym_id: 'gym-1',
        athlete_id: 'athlete-1',
        amount: 50,
      };
      prisma.gymPayment.findFirst.mockResolvedValue(payment);

      const result = await service.findOne('payment-1');

      expect(prisma.gymPayment.findFirst).toHaveBeenCalledWith({
        where: { id: 'payment-1', deleted_at: null },
      });
      expect(result).toEqual(payment);
    });

    it('debe lanzar NotFoundException si el pago no existe', async () => {
      prisma.gymPayment.findFirst.mockResolvedValue(null);

      await expect(service.findOne('payment-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('debe actualizar un pago correctamente', async () => {
      const updateGymPaymentDto = { amount: 100 };
      const updatedPayment = {
        id: 'payment-1',
        gym_id: 'gym-1',
        amount: 100,
      };

      prisma.gymPayment.update.mockResolvedValue(updatedPayment);

      const result = await service.update('payment-1', updateGymPaymentDto);

      expect(prisma.gymPayment.update).toHaveBeenCalledWith({
        where: { id: 'payment-1' },
        data: updateGymPaymentDto,
      });
      expect(result).toEqual(updatedPayment);
    });
  });

  describe('confirmPayment', () => {
    it('debe confirmar un pago y registrar logs', async () => {
      const payment = {
        id: 'payment-1',
        gym_id: 'gym-1',
        athlete_id: 'athlete-1',
        isConfirmed: true,
      };

      prisma.gymPayment.update.mockResolvedValue(payment);

      await service.confirmPayment('payment-1');

      expect(prisma.gymPayment.update).toHaveBeenCalledWith({
        where: { id: 'payment-1' },
        data: { isConfirmed: true },
      });
      expect(logger.info).toHaveBeenCalledWith('PAYMENT_CONFIRMED', {
        payment_id: 'payment-1',
        gym_id: 'gym-1',
        athlete_id: 'athlete-1',
      });
    });
  });

  describe('remove', () => {
    it('debe realizar soft delete de un pago', async () => {
      prisma.gymPayment.update.mockResolvedValue({});

      await service.remove('payment-1');

      expect(prisma.gymPayment.update).toHaveBeenCalledWith({
        where: { id: 'payment-1' },
        data: { deleted_at: expect.any(Date) },
      });
    });

    it('debe lanzar error si el pago no existe al intentar eliminar', async () => {
      prisma.gymPayment.update.mockRejectedValue(
        new Error('Record to update not found'),
      );

      await expect(service.remove('payment-inexistente')).rejects.toThrow(
        'Record to update not found',
      );
    });
  });
});

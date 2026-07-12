/* eslint-disable */
// @ts-nocheck
import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { describe, beforeEach, jest, it, expect } from '@jest/globals';
import { PagoMovilService } from '../pago-movil.service';
import { NotFoundException } from '@nestjs/common';

describe('PagoMovilService', () => {
  let service: PagoMovilService;

  let prisma: {
    pagoMovilFields: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      pagoMovilFields: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        PagoMovilService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get(PagoMovilService);
  });

  describe('create', () => {
    it('debe crear un pago móvil correctamente', async () => {
      const gymId = 'gym-1';
      const dto = {
        bank_to_pay: '0102',
        dni: 'V12345678',
        phone: '04141234567',
      };

      const expectedPagoMovil = {
        id: 'pm-1',
        gym_id: gymId,
        ...dto,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      prisma.pagoMovilFields.create.mockResolvedValue(expectedPagoMovil);

      const result = await service.create(gymId, dto);

      expect(prisma.pagoMovilFields.create).toHaveBeenCalledWith({
        data: {
          gym_id: gymId,
          ...dto,
        },
      });
      expect(result).toEqual(expectedPagoMovil);
    });
  });

  describe('findByGym', () => {
    it('debe retornar pagos móviles por gym_id', async () => {
      const gymId = 'gym-1';
      const pagoMovilFields = [
        {
          id: 'pm-1',
          bank_to_pay: '0102',
          dni: 'V12345678',
          phone: '04141234567',
          gym_id: gymId,
        },
        {
          id: 'pm-2',
          bank_to_pay: '0104',
          dni: 'V87654321',
          phone: '04147654321',
          gym_id: gymId,
        },
      ];

      prisma.pagoMovilFields.findMany.mockResolvedValue(pagoMovilFields);

      const result = await service.findByGym(gymId);

      expect(prisma.pagoMovilFields.findMany).toHaveBeenCalledWith({
        where: {
          gym_id: gymId,
          deleted_at: null,
        },
        select: {
          id: true,
          bank_to_pay: true,
          dni: true,
          phone: true,
          gym_id: true,
        },
      });
      expect(result).toEqual(pagoMovilFields);
    });

    it('debe retornar lista vacía cuando no hay pagos móviles', async () => {
      const gymId = 'gym-sin-pagos';

      prisma.pagoMovilFields.findMany.mockResolvedValue([]);

      const result = await service.findByGym(gymId);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('debe retornar un pago móvil por ID', async () => {
      const pagoMovil = {
        id: 'pm-1',
        bank_to_pay: '0102',
        dni: 'V12345678',
        phone: '04141234567',
        gym_id: 'gym-1',
      };

      prisma.pagoMovilFields.findFirst.mockResolvedValue(pagoMovil);

      const result = await service.findOne('pm-1');

      expect(prisma.pagoMovilFields.findFirst).toHaveBeenCalledWith({
        where: { id: 'pm-1', deleted_at: null },
        select: {
          id: true,
          bank_to_pay: true,
          dni: true,
          phone: true,
          gym_id: true,
        },
      });
      expect(result).toEqual(pagoMovil);
    });

    it('debe lanzar NotFoundException si el pago móvil no existe', async () => {
      prisma.pagoMovilFields.findFirst.mockResolvedValue(null);

      await expect(service.findOne('pm-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('debe realizar soft delete de un pago móvil', async () => {
      prisma.pagoMovilFields.update.mockResolvedValue({});

      await service.remove('pm-1');

      expect(prisma.pagoMovilFields.update).toHaveBeenCalledWith({
        where: { id: 'pm-1' },
        data: { deleted_at: expect.any(Date) },
      });
    });

    it('debe lanzar error si el pago móvil no existe al intentar eliminar', async () => {
      prisma.pagoMovilFields.update.mockRejectedValue(
        new Error('Record to update not found'),
      );

      await expect(service.remove('pm-inexistente')).rejects.toThrow(
        'Record to update not found',
      );
    });
  });
});

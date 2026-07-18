/* eslint-disable */
// @ts-nocheck
import { describe, beforeEach, jest, it, expect } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompetitionDivisionService } from '../competition-division.service';

describe('CompetitionDivisionService', () => {
  let service: CompetitionDivisionService;
  let prisma: {
    competitionDivision: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      competitionDivision: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        CompetitionDivisionService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get(CompetitionDivisionService);
  });

  describe('create', () => {
    it('debe crear una competition division correctamente', async () => {
      const dto = {
        gender: 'MALE',
        mode: 'K1',
        category: 'S',
        weight: 75,
        competition_id: 'comp-1',
      };
      const expected = {
        id: 'div-1',
        ...dto,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      prisma.competitionDivision.create.mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(prisma.competitionDivision.create).toHaveBeenCalledWith({
        data: dto,
      });
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('debe retornar una lista de competition divisions mapeadas a CompetitionDivisionDto', async () => {
      const raw = [
        {
          id: 'div-1',
          gender: 'MALE',
          mode: 'K1',
          category: 'S',
          weight: 75,
          competition: { name: 'Comp 1', status: 'ACTIVE' },
        },
        {
          id: 'div-2',
          gender: 'FEMALE',
          mode: 'MMA',
          category: 'A',
          weight: 60,
          competition: { name: 'Comp 1', status: 'ACTIVE' },
        },
      ];

      prisma.competitionDivision.findMany.mockResolvedValue(raw);

      const result = await service.findAll();

      expect(prisma.competitionDivision.findMany).toHaveBeenCalledWith({
        where: { deleted_at: null },
        include: { competition: true },
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'div-1',
        gender: 'MALE',
        mode: 'K1',
        category: 'S',
        weight: 75,
        competition: { name: 'Comp 1', status: 'ACTIVE' },
      });
      expect(result[1]).toEqual({
        id: 'div-2',
        gender: 'FEMALE',
        mode: 'MMA',
        category: 'A',
        weight: 60,
        competition: { name: 'Comp 1', status: 'ACTIVE' },
      });
    });

    it('debe retornar lista vacía cuando no hay competition divisions', async () => {
      prisma.competitionDivision.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('debe retornar una competition division con su competencia asociada', async () => {
      const raw = {
        id: 'div-1',
        gender: 'MALE',
        mode: 'K1',
        category: 'S',
        weight: 75,
        competition: { name: 'Comp 1', status: 'ACTIVE' },
      };

      prisma.competitionDivision.findFirst.mockResolvedValue(raw);

      const result = await service.findOne('div-1');

      expect(prisma.competitionDivision.findFirst).toHaveBeenCalledWith({
        where: { id: 'div-1', deleted_at: null },
        include: { competition: true },
      });
      expect(result).toEqual({
        id: 'div-1',
        gender: 'MALE',
        mode: 'K1',
        category: 'S',
        weight: 75,
        competition: { name: 'Comp 1', status: 'ACTIVE' },
      });
    });

    it('debe lanzar NotFoundException si la competition division no existe', async () => {
      prisma.competitionDivision.findFirst.mockResolvedValue(null);

      await expect(service.findOne('div-inexistente')).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.competitionDivision.findFirst).toHaveBeenCalledWith({
        where: { id: 'div-inexistente', deleted_at: null },
        include: { competition: true },
      });
    });
  });

  describe('update', () => {
    it('debe actualizar una competition division correctamente', async () => {
      const dto = { weight: 80 };
      const updated = {
        id: 'div-1',
        gender: 'MALE',
        mode: 'K1',
        category: 'S',
        weight: 80,
        competition_id: 'comp-1',
      };

      prisma.competitionDivision.update.mockResolvedValue(updated);

      const result = await service.update('div-1', dto);

      expect(prisma.competitionDivision.update).toHaveBeenCalledWith({
        where: { id: 'div-1' },
        data: dto,
      });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('debe hacer soft delete de la competition division', async () => {
      prisma.competitionDivision.update.mockResolvedValue({});

      await service.remove('div-1');

      expect(prisma.competitionDivision.update).toHaveBeenCalledWith({
        where: { id: 'div-1' },
        data: { deleted_at: expect.any(Date) },
      });
    });

    it('debe lanzar error si la competition division no existe', async () => {
      prisma.competitionDivision.update.mockRejectedValue(
        new Error('Record to update not found'),
      );

      await expect(service.remove('div-inexistente')).rejects.toThrow(
        'Record to update not found',
      );
    });
  });
});

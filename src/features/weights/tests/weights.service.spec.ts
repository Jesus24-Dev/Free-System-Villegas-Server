/* eslint-disable */
// @ts-nocheck
import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { describe, beforeEach, jest, it, expect } from '@jest/globals';
import { WeightsService } from '../weights.service';
import { FightingMode, Gender, FightingCategory } from '@prisma/client';

describe('WeightsService', () => {
  let service: WeightsService;

  let prisma: {
    fightingWeights: {
      findMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      fightingWeights: {
        findMany: jest.fn(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        WeightsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get(WeightsService);
  });

  describe('findAll', () => {
    it('should return all weights when no filters are provided', async () => {
      const expected = [
        { id: '1', mode: FightingMode.K1, gender: Gender.MALE, category: FightingCategory.S, weight: 70 },
        { id: '2', mode: FightingMode.MUAY_THAI, gender: Gender.FEMALE, category: FightingCategory.M, weight: 60 },
      ];

      prisma.fightingWeights.findMany.mockResolvedValue(expected);

      const result = await service.findAll({});

      expect(prisma.fightingWeights.findMany).toHaveBeenCalledWith({
        where: {
          mode: undefined,
          gender: undefined,
          category: undefined,
        },
      });
      expect(result).toEqual(expected);
    });

    it('should filter by mode', async () => {
      const filters = { mode: FightingMode.K1 };
      const expected = [
        { id: '1', mode: FightingMode.K1, gender: Gender.MALE, category: FightingCategory.S, weight: 70 },
      ];

      prisma.fightingWeights.findMany.mockResolvedValue(expected);

      const result = await service.findAll(filters);

      expect(prisma.fightingWeights.findMany).toHaveBeenCalledWith({
        where: {
          mode: FightingMode.K1,
          gender: undefined,
          category: undefined,
        },
      });
      expect(result).toEqual(expected);
    });

    it('should filter by gender', async () => {
      const filters = { gender: Gender.FEMALE };
      const expected = [
        { id: '2', mode: FightingMode.MUAY_THAI, gender: Gender.FEMALE, category: FightingCategory.M, weight: 60 },
      ];

      prisma.fightingWeights.findMany.mockResolvedValue(expected);

      const result = await service.findAll(filters);

      expect(prisma.fightingWeights.findMany).toHaveBeenCalledWith({
        where: {
          mode: undefined,
          gender: Gender.FEMALE,
          category: undefined,
        },
      });
      expect(result).toEqual(expected);
    });

    it('should filter by category', async () => {
      const filters = { category: FightingCategory.S };
      const expected = [
        { id: '1', mode: FightingMode.K1, gender: Gender.MALE, category: FightingCategory.S, weight: 70 },
      ];

      prisma.fightingWeights.findMany.mockResolvedValue(expected);

      const result = await service.findAll(filters);

      expect(prisma.fightingWeights.findMany).toHaveBeenCalledWith({
        where: {
          mode: undefined,
          gender: undefined,
          category: FightingCategory.S,
        },
      });
      expect(result).toEqual(expected);
    });

    it('should filter by all parameters', async () => {
      const filters = {
        mode: FightingMode.K1,
        gender: Gender.MALE,
        category: FightingCategory.S,
      };
      const expected = [
        { id: '1', mode: FightingMode.K1, gender: Gender.MALE, category: FightingCategory.S, weight: 70 },
      ];

      prisma.fightingWeights.findMany.mockResolvedValue(expected);

      const result = await service.findAll(filters);

      expect(prisma.fightingWeights.findMany).toHaveBeenCalledWith({
        where: {
          mode: FightingMode.K1,
          gender: Gender.MALE,
          category: FightingCategory.S,
        },
      });
      expect(result).toEqual(expected);
    });

    it('should return empty array when no weights match', async () => {
      prisma.fightingWeights.findMany.mockResolvedValue([]);

      const result = await service.findAll({ mode: FightingMode.K1 });

      expect(result).toEqual([]);
    });
  });
});

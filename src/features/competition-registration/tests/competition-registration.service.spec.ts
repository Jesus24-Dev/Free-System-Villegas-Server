/* eslint-disable */
// @ts-nocheck
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CompetitionRegistrationService } from '../competition-registration.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('CompetitionRegistrationService', () => {
  let service: CompetitionRegistrationService;
  let prisma: any;

  const mockCompetitionRegistration = {
    id: 'reg-001',
    athlete_id: 'athlete-001',
    division_id: 'division-001',
    deleted_at: null,
  };

  const mockAthlete = {
    id: 'athlete-001',
    person_id: 'person-001',
    person: {
      id: 'person-001',
      name: 'John',
      surname: 'Doe',
      gender: 'MALE',
    },
  };

  const mockDivision = {
    id: 'division-001',
    mode: 'K1',
    category: 'ADULT',
    gender: 'MALE',
    weight: 75,
  };

  const mockRegistrationWithIncludes = {
    ...mockCompetitionRegistration,
    athlete: mockAthlete,
    division: mockDivision,
  };

  const mockMappedResponse = {
    id: 'reg-001',
    athlete: {
      id: 'athlete-001',
      name: 'John',
      surname: 'Doe',
      gender: 'MALE',
    },
    division: {
      id: 'division-001',
      mode: 'K1',
      category: 'ADULT',
      gender: 'MALE',
      weight: 75,
    },
  };

  beforeEach(async () => {
    prisma = {
      competitionRegistration: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        CompetitionRegistrationService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get(CompetitionRegistrationService);
  });

  describe('create', () => {
    it('debe crear un registro de competencia exitosamente', async () => {
      const dto = {
        athlete_id: 'athlete-001',
        division_id: 'division-001',
      };
      prisma.competitionRegistration.create.mockResolvedValue(
        mockCompetitionRegistration,
      );

      const result = await service.create(dto);

      expect(result).toEqual(mockCompetitionRegistration);
      expect(prisma.competitionRegistration.create).toHaveBeenCalledWith({
        data: dto,
      });
    });
  });

  describe('findAll', () => {
    it('debe retornar una lista paginada de registros', async () => {
      const pagination = { page: 1, limit: 10, skip: 0 };
      const registrations = [mockRegistrationWithIncludes];
      prisma.competitionRegistration.findMany.mockResolvedValue(registrations);
      prisma.competitionRegistration.count.mockResolvedValue(1);

      const result = await service.findAll(pagination);

      expect(result.data).toEqual([mockMappedResponse]);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(prisma.competitionRegistration.findMany).toHaveBeenCalledWith({
        where: { deleted_at: null },
        include: {
          athlete: { include: { person: true } },
          division: true,
        },
        skip: 0,
        take: 10,
      });
      expect(prisma.competitionRegistration.count).toHaveBeenCalledWith({
        where: { deleted_at: null },
      });
    });

    it('debe retornar lista vacia cuando no hay registros', async () => {
      const pagination = { page: 1, limit: 10, skip: 0 };
      prisma.competitionRegistration.findMany.mockResolvedValue([]);
      prisma.competitionRegistration.count.mockResolvedValue(0);

      const result = await service.findAll(pagination);

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('debe retornar un registro por id', async () => {
      prisma.competitionRegistration.findFirst.mockResolvedValue(
        mockRegistrationWithIncludes,
      );

      const result = await service.findOne('reg-001');

      expect(result).toEqual(mockMappedResponse);
      expect(prisma.competitionRegistration.findFirst).toHaveBeenCalledWith({
        where: { id: 'reg-001', deleted_at: null },
        include: {
          athlete: {
            include: {
              person: true,
            },
          },
          division: true,
        },
      });
    });

    it('debe lanzar NotFoundException si el registro no existe', async () => {
      prisma.competitionRegistration.findFirst.mockResolvedValue(null);

      await expect(
        service.findOne('reg-inexistente'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar un registro existente', async () => {
      const dto = { athlete_id: 'athlete-002' };
      const updated = { ...mockCompetitionRegistration, athlete_id: 'athlete-002' };
      prisma.competitionRegistration.update.mockResolvedValue(updated);

      const result = await service.update('reg-001', dto);

      expect(result).toEqual(updated);
      expect(prisma.competitionRegistration.update).toHaveBeenCalledWith({
        where: { id: 'reg-001' },
        data: dto,
      });
    });
  });

  describe('remove', () => {
    it('debe hacer soft delete de un registro existente', async () => {
      prisma.competitionRegistration.update.mockResolvedValue({
        ...mockCompetitionRegistration,
        deleted_at: new Date(),
      });

      await service.remove('reg-001');

      expect(prisma.competitionRegistration.update).toHaveBeenCalledWith({
        where: { id: 'reg-001' },
        data: { deleted_at: expect.any(Date) },
      });
    });

    it('debe lanzar error si el registro no existe', async () => {
      prisma.competitionRegistration.update.mockRejectedValue(
        new Error('Record to update not found'),
      );

      await expect(service.remove('reg-inexistente')).rejects.toThrow(
        'Record to update not found',
      );
    });
  });

  describe('removeByAthleteAndCompetition', () => {
    const mockRegistrationWithCompetition = {
      ...mockCompetitionRegistration,
      athlete: mockAthlete,
      division: {
        ...mockDivision,
        competition: { status: 'OPEN' },
      },
    };

    it('debe eliminar un registro cuando la competencia esta OPEN', async () => {
      prisma.competitionRegistration.findFirst.mockResolvedValue(
        mockRegistrationWithCompetition,
      );
      prisma.competitionRegistration.delete.mockResolvedValue(
        mockCompetitionRegistration,
      );

      await service.removeByAthleteAndCompetition(
        'athlete-001',
        'competition-001',
        'division-001',
      );

      expect(prisma.competitionRegistration.findFirst).toHaveBeenCalledWith({
        where: {
          athlete_id: 'athlete-001',
          division_id: 'division-001',
          deleted_at: null,
          division: {
            competition_id: 'competition-001',
            deleted_at: null,
          },
        },
        include: {
          division: {
            include: {
              competition: { select: { status: true } },
            },
          },
        },
      });
      expect(prisma.competitionRegistration.delete).toHaveBeenCalledWith({
        where: { id: 'reg-001' },
      });
    });

    it('debe lanzar NotFoundException si no existe el registro', async () => {
      prisma.competitionRegistration.findFirst.mockResolvedValue(null);

      await expect(
        service.removeByAthleteAndCompetition(
          'athlete-inexistente',
          'competition-001',
          'division-001',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar BadRequestException si la competencia no esta OPEN', async () => {
      const registrationClosed = {
        ...mockRegistrationWithCompetition,
        division: {
          ...mockDivision,
          competition: { status: 'CLOSED' },
        },
      };
      prisma.competitionRegistration.findFirst.mockResolvedValue(
        registrationClosed,
      );

      await expect(
        service.removeByAthleteAndCompetition(
          'athlete-001',
          'competition-001',
          'division-001',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});

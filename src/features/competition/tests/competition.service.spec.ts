/* eslint-disable */
// @ts-nocheck
import { describe, beforeEach, jest, it, expect } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CompetitionService } from '../competition.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompetitionStatus } from '@prisma/client';

jest.mock('exceljs', () => {
  return {
    __esModule: true,
    default: {
      Workbook: jest.fn().mockImplementation(() => ({
        addWorksheet: jest.fn().mockReturnValue({
          columns: [],
          getRow: jest.fn().mockReturnValue({
            font: null,
          }),
          addRow: jest.fn(),
        }),
        xlsx: {
          write: jest.fn().mockResolvedValue(undefined),
        },
      })),
    },
  };
});

describe('CompetitionService', () => {
  let service: CompetitionService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      competition: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      competitionRegistration: {
        findMany: jest.fn(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        CompetitionService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get(CompetitionService);
  });

  describe('create', () => {
    it('debe crear una competencia exitosamente', async () => {
      const dto = {
        name: 'Copa IV de kickboxing',
        description: 'Edicion especial',
        location: 'Gimnasio Caracas',
        inscription_begin_at: new Date('2026-06-01'),
        inscription_end_at: new Date('2026-06-30'),
        status: CompetitionStatus.OPEN,
      };

      const expected = {
        id: 'comp-1',
        ...dto,
        logo_url: null,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      prisma.competition.create.mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(result).toEqual(expected);
      expect(prisma.competition.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('findAll', () => {
    it('debe retornar competencias filtradas por status', async () => {
      const dto = { status: CompetitionStatus.OPEN };
      const mockCompetitions = [
        {
          id: 'comp-1',
          name: 'Copa IV',
          description: 'Edicion especial',
          logo_url: null,
          location: 'Gimnasio Caracas',
          inscription_begin_at: new Date('2026-06-01'),
          inscription_end_at: new Date('2026-06-30'),
          status: CompetitionStatus.OPEN,
          deleted_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'comp-2',
          name: 'Open Nacional',
          description: null,
          logo_url: 'https://example.com/logo.png',
          location: 'Maracaibo',
          inscription_begin_at: new Date('2026-07-01'),
          inscription_end_at: new Date('2026-07-31'),
          status: CompetitionStatus.OPEN,
          deleted_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      prisma.competition.findMany.mockResolvedValue(mockCompetitions);

      const result = await service.findAll(dto);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('comp-1');
      expect(result[0].name).toBe('Copa IV');
      expect(result[0].description).toBe('Edicion especial');
      expect(result[0].location).toBe('Gimnasio Caracas');
      expect(result[1].id).toBe('comp-2');
      expect(result[1].name).toBe('Open Nacional');
      expect(prisma.competition.findMany).toHaveBeenCalledWith({
        where: { status: CompetitionStatus.OPEN, deleted_at: null },
      });
    });

    it('debe retornar lista vacia cuando no hay competencias', async () => {
      const dto = { status: CompetitionStatus.FINISHED };

      prisma.competition.findMany.mockResolvedValue([]);

      const result = await service.findAll(dto);

      expect(result).toEqual([]);
      expect(prisma.competition.findMany).toHaveBeenCalledWith({
        where: { status: CompetitionStatus.FINISHED, deleted_at: null },
      });
    });
  });

  describe('findOne', () => {
    it('debe retornar una competencia por id', async () => {
      const mockCompetition = {
        id: 'comp-1',
        name: 'Copa IV',
        description: 'Edicion especial',
        logo_url: null,
        location: 'Gimnasio Caracas',
        inscription_begin_at: new Date('2026-06-01'),
        inscription_end_at: new Date('2026-06-30'),
        status: CompetitionStatus.OPEN,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      prisma.competition.findFirst.mockResolvedValue(mockCompetition);

      const result = await service.findOne('comp-1');

      expect(result).toEqual({
        id: 'comp-1',
        name: 'Copa IV',
        description: 'Edicion especial',
        logo_url: null,
        location: 'Gimnasio Caracas',
        inscription_begin_at: new Date('2026-06-01'),
        inscription_end_at: new Date('2026-06-30'),
        status: CompetitionStatus.OPEN,
      });
      expect(prisma.competition.findFirst).toHaveBeenCalledWith({
        where: { id: 'comp-1', deleted_at: null },
      });
    });

    it('debe lanzar NotFoundException si la competencia no existe', async () => {
      prisma.competition.findFirst.mockResolvedValue(null);

      await expect(
        service.findOne('comp-inexistente'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar una competencia exitosamente', async () => {
      const dto = { name: 'Copa IV Actualizada' };
      const mockUpdated = {
        id: 'comp-1',
        name: 'Copa IV Actualizada',
        description: 'Edicion especial',
        logo_url: null,
        location: 'Gimnasio Caracas',
        inscription_begin_at: new Date('2026-06-01'),
        inscription_end_at: new Date('2026-06-30'),
        status: CompetitionStatus.OPEN,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      prisma.competition.update.mockResolvedValue(mockUpdated);

      const result = await service.update('comp-1', dto);

      expect(result).toEqual(mockUpdated);
      expect(prisma.competition.update).toHaveBeenCalledWith({
        where: { id: 'comp-1' },
        data: dto,
      });
    });
  });

  describe('remove', () => {
    it('debe hacer soft delete de una competencia', async () => {
      prisma.competition.update.mockResolvedValue({});

      await service.remove('comp-1');

      expect(prisma.competition.update).toHaveBeenCalledWith({
        where: { id: 'comp-1' },
        data: { deleted_at: expect.any(Date) },
      });
    });

    it('debe lanzar error si la competencia no existe', async () => {
      prisma.competition.update.mockRejectedValue(
        new Error('Record to update not found'),
      );

      await expect(service.remove('comp-inexistente')).rejects.toThrow(
        'Record to update not found',
      );
    });
  });

  describe('exportAthletesByGym', () => {
    it('debe lanzar NotFoundException si la competencia no existe', async () => {
      prisma.competition.findFirst.mockResolvedValue(null);

      const mockRes = {
        setHeader: jest.fn(),
        end: jest.fn(),
      };

      await expect(
        service.exportAthletesByGym('comp-inexistente', 'gym-1', mockRes),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.competition.findFirst).toHaveBeenCalledWith({
        where: { id: 'comp-inexistente', deleted_at: null },
      });
      expect(prisma.competitionRegistration.findMany).not.toHaveBeenCalled();
    });

    it('debe generar Excel y escribir en la respuesta cuando hay registros', async () => {
      const mockCompetition = {
        id: 'comp-1',
        name: 'Copa IV de kickboxing',
        status: CompetitionStatus.OPEN,
      };

      const mockRegistrations = [
        {
          athlete: {
            person: {
              dni: '12345678',
              name: 'John',
              surname: 'Doe',
              gender: 'MALE',
            },
          },
          division: {
            category: 'ADULT',
            mode: 'POINT_FIGHTING',
            weight: 70,
          },
        },
        {
          athlete: {
            person: {
              dni: '87654321',
              name: 'Jane',
              surname: 'Smith',
              gender: 'FEMALE',
            },
          },
          division: {
            category: 'ADULT',
            mode: 'KICKBOXING',
            weight: 60,
          },
        },
      ];

      prisma.competition.findFirst.mockResolvedValue(mockCompetition);
      prisma.competitionRegistration.findMany.mockResolvedValue(
        mockRegistrations,
      );

      const mockRes = {
        setHeader: jest.fn(),
        end: jest.fn(),
      };

      await service.exportAthletesByGym('comp-1', 'gym-1', mockRes);

      expect(prisma.competition.findFirst).toHaveBeenCalledWith({
        where: { id: 'comp-1', deleted_at: null },
      });
      expect(prisma.competitionRegistration.findMany).toHaveBeenCalledWith({
        where: {
          division: { competition_id: 'comp-1' },
          athlete: { gym_id: 'gym-1', deleted_at: null },
          deleted_at: null,
        },
        include: {
          athlete: {
            include: {
              person: true,
            },
          },
          division: true,
        },
      });
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        `attachment; filename=atletas_Copa_IV_de_kickboxing_gym-1.xlsx`,
      );
      expect(mockRes.end).toHaveBeenCalled();
    });

    it('debe generar Excel con registros vacios', async () => {
      const mockCompetition = {
        id: 'comp-1',
        name: 'Copa Vacía',
        status: CompetitionStatus.OPEN,
      };

      prisma.competition.findFirst.mockResolvedValue(mockCompetition);
      prisma.competitionRegistration.findMany.mockResolvedValue([]);

      const mockRes = {
        setHeader: jest.fn(),
        end: jest.fn(),
      };

      await service.exportAthletesByGym('comp-1', 'gym-1', mockRes);

      expect(mockRes.setHeader).toHaveBeenCalledTimes(2);
      expect(mockRes.end).toHaveBeenCalled();
    });
  });
});

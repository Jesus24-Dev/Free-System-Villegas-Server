/* eslint-disable */
// @ts-nocheck
import { describe, beforeEach, jest, it, expect } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CoachService } from '../coach.service';

describe('CoachService', () => {
  let service: CoachService;
  let prisma: {
    coach: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      count: jest.Mock;
      update: jest.Mock;
    };
    user: {
      findUnique: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      coach: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        CoachService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get(CoachService);
  });

  describe('create', () => {
    it('debe crear un coach correctamente', async () => {
      const dto = { person_id: 'person-1', gym_id: 'gym-1' };
      const expected = { id: 'coach-1', ...dto, created_at: new Date(), updated_at: new Date() };

      prisma.coach.create.mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(prisma.coach.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('debe retornar una lista paginada de coaches', async () => {
      const pagination = { page: 1, limit: 10, skip: 0 };
      const coaches = [
        { id: 'coach-1', person: { name: 'John' } },
        { id: 'coach-2', person: { name: 'Jane' } },
      ];

      prisma.coach.findMany.mockResolvedValue(coaches);
      prisma.coach.count.mockResolvedValue(2);

      const result = await service.findAll(pagination);

      expect(prisma.coach.findMany).toHaveBeenCalledWith({
        where: { deleted_at: null },
        include: { person: true },
        skip: 0,
        take: 10,
      });
      expect(prisma.coach.count).toHaveBeenCalledWith({ where: { deleted_at: null } });
      expect(result.data).toEqual(coaches);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('debe retornar lista vacía cuando no hay coaches', async () => {
      const pagination = { page: 1, limit: 10, skip: 0 };

      prisma.coach.findMany.mockResolvedValue([]);
      prisma.coach.count.mockResolvedValue(0);

      const result = await service.findAll(pagination);

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });

  describe('findOne', () => {
    it('debe retornar un coach con su persona asociada', async () => {
      const coach = {
        id: 'coach-1',
        person_id: 'person-1',
        person: { id: 'person-1', name: 'John', surname: 'Doe' },
      };

      prisma.coach.findFirst.mockResolvedValue(coach);

      const result = await service.findOne('coach-1');

      expect(prisma.coach.findFirst).toHaveBeenCalledWith({
        where: { id: 'coach-1', deleted_at: null },
        include: { person: true },
      });
      expect(result).toEqual(coach);
    });

    it('debe lanzar NotFoundException si el coach no existe', async () => {
      prisma.coach.findFirst.mockResolvedValue(null);

      await expect(service.findOne('coach-inexistente')).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.coach.findFirst).toHaveBeenCalledWith({
        where: { id: 'coach-inexistente', deleted_at: null },
        include: { person: true },
      });
    });
  });

  describe('findCoachProfile', () => {
    it('debe retornar el perfil del coach mapeado a CoachDto', async () => {
      const raw = {
        id: 'coach-1',
        person_id: 'person-1',
        gym_id: 'gym-1',
        created_at: new Date('2026-01-01'),
        updated_at: new Date('2026-01-02'),
        person: {
          dni: '12345678',
          name: 'John',
          surname: 'Doe',
          gender: 'MALE',
          birthday: new Date('1990-01-01'),
          status: true,
        },
      };

      prisma.coach.findFirst.mockResolvedValue(raw);

      const result = await service.findCoachProfile('coach-1');

      expect(prisma.coach.findFirst).toHaveBeenCalledWith({
        where: { id: 'coach-1', deleted_at: null },
        select: {
          id: true,
          person_id: true,
          gym_id: true,
          created_at: true,
          updated_at: true,
          person: {
            select: {
              dni: true,
              name: true,
              surname: true,
              gender: true,
              birthday: true,
              status: true,
            },
          },
        },
      });
      expect(result).toEqual({
        id: 'coach-1',
        person_id: 'person-1',
        gym_id: 'gym-1',
        dni: '12345678',
        name: 'John',
        surname: 'Doe',
        gender: 'MALE',
        birthday: new Date('1990-01-01'),
        status: true,
        created_at: new Date('2026-01-01'),
        updated_at: new Date('2026-01-02'),
      });
    });

    it('debe lanzar NotFoundException si el coach no existe', async () => {
      prisma.coach.findFirst.mockResolvedValue(null);

      await expect(service.findCoachProfile('coach-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findCoachByUserId', () => {
    it('debe retornar el coach asociado al usuario', async () => {
      const user = { person_id: 'person-1' };
      const coach = {
        id: 'coach-1',
        person_id: 'person-1',
        gym_id: 'gym-1',
        person: {
          dni: '12345678',
          name: 'John',
          surname: 'Doe',
          gender: 'MALE',
          birthday: new Date('1990-01-01'),
          status: true,
        },
      };

      prisma.user.findUnique.mockResolvedValue(user);
      prisma.coach.findFirst.mockResolvedValue(coach);

      const result = await service.findCoachByUserId('user-1');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: { person_id: true },
      });
      expect(prisma.coach.findFirst).toHaveBeenCalledWith({
        where: { person_id: 'person-1', deleted_at: null },
        select: {
          id: true,
          person_id: true,
          gym_id: true,
          person: {
            select: {
              dni: true,
              name: true,
              surname: true,
              gender: true,
              birthday: true,
              status: true,
            },
          },
        },
      });
      expect(result).toEqual(coach);
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findCoachByUserId('user-inexistente')).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.coach.findFirst).not.toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si el usuario existe pero no tiene coach asociado', async () => {
      prisma.user.findUnique.mockResolvedValue({ person_id: 'person-1' });
      prisma.coach.findFirst.mockResolvedValue(null);

      await expect(service.findCoachByUserId('user-sin-coach')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllCoachesByGym', () => {
    it('debe retornar todos los coaches de un gimnasio mapeados a CoachDto', async () => {
      const raw = [
        {
          id: 'coach-1',
          person_id: 'person-1',
          gym_id: 'gym-1',
          created_at: new Date('2026-01-01'),
          updated_at: new Date('2026-01-02'),
          person: {
            dni: '12345678',
            name: 'John',
            surname: 'Doe',
            gender: 'MALE',
            birthday: new Date('1990-01-01'),
            status: true,
          },
        },
        {
          id: 'coach-2',
          person_id: 'person-2',
          gym_id: 'gym-1',
          created_at: new Date('2026-02-01'),
          updated_at: new Date('2026-02-02'),
          person: {
            dni: '87654321',
            name: 'Jane',
            surname: 'Smith',
            gender: 'FEMALE',
            birthday: new Date('1992-05-15'),
            status: true,
          },
        },
      ];

      prisma.coach.findMany.mockResolvedValue(raw);

      const result = await service.findAllCoachesByGym('gym-1');

      expect(prisma.coach.findMany).toHaveBeenCalledWith({
        where: { gym_id: 'gym-1', deleted_at: null },
        select: {
          id: true,
          person_id: true,
          gym_id: true,
          created_at: true,
          updated_at: true,
          person: {
            select: {
              dni: true,
              name: true,
              surname: true,
              gender: true,
              birthday: true,
              status: true,
            },
          },
        },
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'coach-1',
        person_id: 'person-1',
        gym_id: 'gym-1',
        dni: '12345678',
        name: 'John',
        surname: 'Doe',
        gender: 'MALE',
        birthday: new Date('1990-01-01'),
        status: true,
        created_at: new Date('2026-01-01'),
        updated_at: new Date('2026-01-02'),
      });
      expect(result[1]).toEqual({
        id: 'coach-2',
        person_id: 'person-2',
        gym_id: 'gym-1',
        dni: '87654321',
        name: 'Jane',
        surname: 'Smith',
        gender: 'FEMALE',
        birthday: new Date('1992-05-15'),
        status: true,
        created_at: new Date('2026-02-01'),
        updated_at: new Date('2026-02-02'),
      });
    });

    it('debe retornar array vacío cuando el gimnasio no tiene coaches', async () => {
      prisma.coach.findMany.mockResolvedValue([]);

      const result = await service.findAllCoachesByGym('gym-vacio');

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('debe actualizar un coach correctamente', async () => {
      const dto = { gym_id: 'gym-new' };
      const updated = { id: 'coach-1', person_id: 'person-1', gym_id: 'gym-new' };

      prisma.coach.update.mockResolvedValue(updated);

      const result = await service.update('coach-1', dto);

      expect(prisma.coach.update).toHaveBeenCalledWith({
        where: { id: 'coach-1' },
        data: dto,
      });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('debe hacer soft delete del coach', async () => {
      prisma.coach.update.mockResolvedValue({});

      await service.remove('coach-1');

      expect(prisma.coach.update).toHaveBeenCalledWith({
        where: { id: 'coach-1' },
        data: { deleted_at: expect.any(Date) },
      });
    });

    it('debe lanzar error si el coach no existe', async () => {
      prisma.coach.update.mockRejectedValue(
        new Error('Record to update not found'),
      );

      await expect(service.remove('coach-inexistente')).rejects.toThrow(
        'Record to update not found',
      );
    });
  });
});

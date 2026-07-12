/* eslint-disable */
// @ts-nocheck
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PersonService } from '../person.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { describe, beforeEach, jest, it, expect } from '@jest/globals';

describe('PersonService', () => {
  let service: PersonService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      person: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get(PersonService);
  });

  describe('create', () => {
    it('debe crear una persona exitosamente', async () => {
      const mockDto = {
        name: 'John',
        surname: 'Doe',
        dni: '12345678',
      };

      prisma.person.create.mockResolvedValue({
        id: 'person-1',
        ...mockDto,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await service.create(mockDto);

      expect(result).toEqual({
        id: 'person-1',
        name: 'John',
        surname: 'Doe',
        dni: '12345678',
        deleted_at: null,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
      expect(prisma.person.create).toHaveBeenCalledWith({ data: mockDto });
    });
  });

  describe('findAll', () => {
    it('debe retornar personas paginadas', async () => {
      const pagination = { page: 1, limit: 10, skip: 0 };

      const mockPeople = [
        { id: 'person-1', name: 'John', surname: 'Doe', deleted_at: null },
        { id: 'person-2', name: 'Jane', surname: 'Smith', deleted_at: null },
      ];

      prisma.person.findMany.mockResolvedValue(mockPeople);
      prisma.person.count.mockResolvedValue(2);

      const result = await service.findAll(pagination);

      expect(result.data).toEqual(mockPeople);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(prisma.person.findMany).toHaveBeenCalledWith({
        where: { deleted_at: null },
        skip: 0,
        take: 10,
      });
      expect(prisma.person.count).toHaveBeenCalledWith({
        where: { deleted_at: null },
      });
    });

    it('debe retornar lista vacia cuando no hay personas', async () => {
      const pagination = { page: 1, limit: 10, skip: 0 };

      prisma.person.findMany.mockResolvedValue([]);
      prisma.person.count.mockResolvedValue(0);

      const result = await service.findAll(pagination);

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });

  describe('findOne', () => {
    it('debe retornar una persona por id', async () => {
      const mockPerson = {
        id: 'person-1',
        name: 'John',
        surname: 'Doe',
        dni: '12345678',
        deleted_at: null,
      };

      prisma.person.findFirst.mockResolvedValue(mockPerson);

      const result = await service.findOne('person-1');

      expect(result).toEqual(mockPerson);
      expect(prisma.person.findFirst).toHaveBeenCalledWith({
        where: { id: 'person-1', deleted_at: null },
      });
    });

    it('debe lanzar NotFoundException si la persona no existe', async () => {
      prisma.person.findFirst.mockResolvedValue(null);

      await expect(service.findOne('person-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('checkIfPersonByDnyExists', () => {
    it('debe retornar null si la persona no existe', async () => {
      prisma.person.findFirst.mockResolvedValue(null);

      const result = await service.checkIfPersonByDnyExists('12345678');

      expect(result).toBeNull();
      expect(prisma.person.findFirst).toHaveBeenCalledWith({
        where: { dni: '12345678', deleted_at: null },
        include: {
          user: { select: { id: true, role: true } },
          coach: { select: { id: true } },
          athlete: { select: { id: true } },
        },
      });
    });

    it('debe retornar persona con ids cuando no tiene user/athlete/coach', async () => {
      const mockPerson = {
        id: 'person-1',
        name: 'John',
        surname: 'Doe',
        dni: '12345678',
        user: null,
        coach: null,
        athlete: null,
      };

      prisma.person.findFirst.mockResolvedValue(mockPerson);

      const result = await service.checkIfPersonByDnyExists('12345678');

      expect(result).toEqual({
        id: 'person-1',
        dni: '12345678',
        name: 'John',
        surname: 'Doe',
        user_id: null,
        roles: null,
        athlete_id: null,
        coach_id: null,
      });
    });

    it('debe retornar persona con user_id y roles si tiene usuario', async () => {
      const mockPerson = {
        id: 'person-1',
        name: 'John',
        surname: 'Doe',
        dni: '12345678',
        user: { id: 'user-1', role: ['ATHLETE'] },
        coach: null,
        athlete: { id: 'athlete-1' },
      };

      prisma.person.findFirst.mockResolvedValue(mockPerson);

      const result = await service.checkIfPersonByDnyExists('12345678');

      expect(result).toEqual({
        id: 'person-1',
        dni: '12345678',
        name: 'John',
        surname: 'Doe',
        user_id: 'user-1',
        roles: ['ATHLETE'],
        athlete_id: 'athlete-1',
        coach_id: null,
      });
    });
  });

  describe('update', () => {
    it('debe actualizar una persona exitosamente', async () => {
      const mockDto = { name: 'John Updated' };
      const mockPerson = {
        id: 'person-1',
        name: 'John Updated',
        surname: 'Doe',
        deleted_at: null,
      };

      prisma.person.update.mockResolvedValue(mockPerson);

      const result = await service.update('person-1', mockDto);

      expect(result).toEqual(mockPerson);
      expect(prisma.person.update).toHaveBeenCalledWith({
        where: { id: 'person-1' },
        data: mockDto,
      });
    });
  });

  describe('remove', () => {
    it('debe hacer soft delete de una persona', async () => {
      prisma.person.update.mockResolvedValue({});

      await service.remove('person-1');

      expect(prisma.person.update).toHaveBeenCalledWith({
        where: { id: 'person-1' },
        data: { deleted_at: expect.any(Date) },
      });
    });

    it('debe lanzar error si la persona no existe', async () => {
      prisma.person.update.mockRejectedValue(
        new Error('Record to update not found'),
      );

      await expect(service.remove('person-inexistente')).rejects.toThrow(
        'Record to update not found',
      );
    });
  });
});

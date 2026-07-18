/* eslint-disable */
// @ts-nocheck
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AthleteService } from '../athlete.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AthleteService', () => {
  let service: AthleteService;
  let prisma: any;

  const mockAthlete = {
    id: 'athlete-001',
    person_id: 'person-001',
    gym_id: 'gym-001',
    created_at: new Date('2025-01-01'),
    updated_at: new Date('2025-01-01'),
  };

  const mockPerson = {
    id: 'person-001',
    dni: '12345678',
    name: 'John',
    surname: 'Doe',
    birthday: new Date('1995-05-15'),
    gender: 'MALE',
    status: true,
  };

  const mockAthleteWithPerson = {
    ...mockAthlete,
    person: mockPerson,
  };

  beforeEach(async () => {
    prisma = {
      athlete: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
      },
      user: {
        findFirst: jest.fn(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AthleteService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get(AthleteService);
  });

  describe('create', () => {
    it('debe crear un atleta exitosamente', async () => {
      const dto = { person_id: 'person-001', gym_id: 'gym-001' };
      prisma.athlete.create.mockResolvedValue(mockAthlete);

      const result = await service.create(dto);

      expect(result).toEqual(mockAthlete);
      expect(prisma.athlete.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('findAll', () => {
    it('debe retornar una lista paginada de atletas', async () => {
      const pagination = { page: 1, limit: 10 };
      const athletes = [mockAthleteWithPerson];
      prisma.athlete.findMany.mockResolvedValue(athletes);
      prisma.athlete.count.mockResolvedValue(1);

      const result = await service.findAll(pagination);

      expect(result.data).toEqual(athletes);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(prisma.athlete.findMany).toHaveBeenCalledWith({
        where: { deleted_at: null },
        include: { person: true },
        skip: undefined,
        take: 10,
      });
      expect(prisma.athlete.count).toHaveBeenCalledWith({
        where: { deleted_at: null },
      });
    });

    it('debe retornar lista vacia cuando no hay atletas', async () => {
      const pagination = { page: 1, limit: 10 };
      prisma.athlete.findMany.mockResolvedValue([]);
      prisma.athlete.count.mockResolvedValue(0);

      const result = await service.findAll(pagination);

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('debe retornar un atleta por personId', async () => {
      prisma.athlete.findFirst.mockResolvedValue(mockAthleteWithPerson);

      const result = await service.findOne('person-001');

      expect(result).toEqual(mockAthleteWithPerson);
      expect(prisma.athlete.findFirst).toHaveBeenCalledWith({
        where: { person_id: 'person-001', deleted_at: null },
        include: { person: true },
      });
    });

    it('debe lanzar NotFoundException si el atleta no existe', async () => {
      prisma.athlete.findFirst.mockResolvedValue(null);

      await expect(service.findOne('person-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllAthletesByGym', () => {
    it('debe retornar atletas de un gimnasio mapeados a AthleteDto', async () => {
      const rawAthletes = [
        {
          id: 'athlete-001',
          person_id: 'person-001',
          gym_id: 'gym-001',
          created_at: new Date('2025-01-01'),
          updated_at: new Date('2025-01-01'),
          person: {
            dni: '12345678',
            name: 'John',
            surname: 'Doe',
            gender: 'MALE',
            birthday: new Date('1995-05-15'),
            status: true,
          },
        },
      ];
      prisma.athlete.findMany.mockResolvedValue(rawAthletes);

      const result = await service.findAllAthletesByGym('gym-001');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'athlete-001',
        person_id: 'person-001',
        gym_id: 'gym-001',
        dni: '12345678',
        name: 'John',
        surname: 'Doe',
        gender: 'MALE',
        birthday: new Date('1995-05-15'),
        status: true,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-01'),
      });
      expect(prisma.athlete.findMany).toHaveBeenCalledWith({
        where: { gym_id: 'gym-001', deleted_at: null },
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
    });

    it('debe retornar array vacio si el gimnasio no tiene atletas', async () => {
      prisma.athlete.findMany.mockResolvedValue([]);

      const result = await service.findAllAthletesByGym('gym-vacio');

      expect(result).toEqual([]);
    });
  });

  describe('findAthleteProfile', () => {
    const mockProfileData = {
      id: 'athlete-001',
      person: {
        dni: '12345678',
        name: 'John',
        surname: 'Doe',
        birthday: new Date('1995-05-15'),
        gender: 'MALE',
      },
      gym: {
        id: 'gym-001',
        name: 'Alpha Gym',
        address: 'Calle 123',
        state: 'ARAGUA',
        monthly_payment: 30,
      },
      payments_gym: [
        {
          day_payed: new Date('2025-01-01'),
          amount: 30,
          payment_reference: 'REF-001',
          isConfirmed: true,
        },
      ],
      registrations: [
        {
          division: {
            mode: 'KICKBOXING',
            category: 'ADULT',
            weight: 70,
            competition: {
              name: 'Open Nacional',
              status: 'PENDING',
            },
          },
        },
      ],
    };

    it('debe retornar perfil cuando se busca por athlete ID directamente', async () => {
      prisma.athlete.findFirst.mockResolvedValue(mockProfileData);

      const result = await service.findAthleteProfile('athlete-001');

      expect(result.id).toBe('athlete-001');
      expect(result.personal.name).toBe('John');
      expect(result.gym.name).toBe('Alpha Gym');
      expect(result.payments).toHaveLength(1);
      expect(result.competitions).toHaveLength(1);
      expect(prisma.athlete.findFirst).toHaveBeenCalledWith({
        where: { id: 'athlete-001', deleted_at: null },
        include: {
          person: {
            select: {
              dni: true,
              name: true,
              surname: true,
              birthday: true,
              gender: true,
            },
          },
          gym: {
            where: { deleted_at: null },
            select: {
              id: true,
              name: true,
              address: true,
              state: true,
              monthly_payment: true,
            },
          },
          payments_gym: {
            where: { deleted_at: null },
            select: {
              day_payed: true,
              amount: true,
              payment_reference: true,
              isConfirmed: true,
            },
          },
          registrations: {
            where: { deleted_at: null },
            include: {
              division: {
                select: {
                  mode: true,
                  category: true,
                  weight: true,
                  competition: {
                    select: {
                      name: true,
                      status: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    });

    it('debe retornar perfil cuando se busca por user ID', async () => {
      prisma.athlete.findFirst.mockResolvedValue(null);

      const userWithAthlete = {
        id: 'user-001',
        person_id: 'person-001',
      };
      prisma.user.findFirst.mockResolvedValue(userWithAthlete);

      const athleteProfileData = { ...mockProfileData, id: 'athlete-001' };
      prisma.athlete.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(athleteProfileData);

      const result = await service.findAthleteProfile('user-001');

      expect(result.id).toBe('athlete-001');
      expect(result.personal.name).toBe('John');
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { id: 'user-001', deleted_at: null },
        select: { person_id: true },
      });
    });

    it('debe lanzar NotFoundException si no se encuentra por athlete ID ni user ID', async () => {
      prisma.athlete.findFirst.mockResolvedValue(null);
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(
        service.findAthleteProfile('id-inexistente'),
      ).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar NotFoundException si el user no tiene person_id', async () => {
      prisma.athlete.findFirst.mockResolvedValue(null);
      prisma.user.findFirst.mockResolvedValue({ id: 'user-001', person_id: null });

      await expect(
        service.findAthleteProfile('user-001'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar un atleta existente', async () => {
      prisma.athlete.findFirst.mockResolvedValue(mockAthleteWithPerson);
      const updatedAthlete = { ...mockAthlete, gym_id: 'gym-002' };
      prisma.athlete.update.mockResolvedValue(updatedAthlete);

      const dto = { gym_id: 'gym-002' };
      const result = await service.update('person-001', dto);

      expect(result).toEqual(updatedAthlete);
      expect(prisma.athlete.findFirst).toHaveBeenCalledWith({
        where: { person_id: 'person-001', deleted_at: null },
        include: { person: true },
      });
      expect(prisma.athlete.update).toHaveBeenCalledWith({
        where: { id: 'athlete-001' },
        data: dto,
      });
    });

    it('debe lanzar NotFoundException si el atleta no existe para actualizar', async () => {
      prisma.athlete.findFirst.mockResolvedValue(null);

      await expect(
        service.update('person-inexistente', { gym_id: 'gym-002' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debe hacer soft delete de un atleta existente', async () => {
      prisma.athlete.findFirst.mockResolvedValue(mockAthleteWithPerson);
      prisma.athlete.update.mockResolvedValue({
        ...mockAthlete,
        deleted_at: new Date(),
      });

      await service.remove('person-001');

      expect(prisma.athlete.update).toHaveBeenCalledWith({
        where: { id: 'athlete-001' },
        data: { deleted_at: expect.any(Date) },
      });
    });

    it('debe lanzar NotFoundException si el atleta no existe para eliminar', async () => {
      prisma.athlete.findFirst.mockResolvedValue(null);

      await expect(service.remove('person-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

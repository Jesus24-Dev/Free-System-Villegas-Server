/* eslint-disable */
// @ts-nocheck
import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { describe, beforeEach, jest, it, expect } from '@jest/globals';
import { UserService } from '../user.service';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  let prisma: {
    user: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      count: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      user: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get(UserService);
  });

  describe('create', () => {
    it('debe crear un usuario correctamente', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'Password123!',
        role: ['ATHLETE'],
        person_id: 'person-123',
      };

      const expectedUser = {
        id: 'user-1',
        ...createUserDto,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      prisma.user.create.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
      expect(result).toEqual(expectedUser);
    });
  });

  describe('findAll', () => {
    it('debe retornar una lista paginada de usuarios', async () => {
      const pagination = Object.create(
        { get skip() { return (this.page! - 1) * this.limit!; } },
        { page: { value: 1, writable: true }, limit: { value: 10, writable: true } },
      );
      const users = [
        { id: 'user-1', email: 'user1@example.com' },
        { id: 'user-2', email: 'user2@example.com' },
      ];

      prisma.user.findMany.mockResolvedValue(users);
      prisma.user.count.mockResolvedValue(2);

      const result = await service.findAll(pagination);

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { deleted_at: null },
        skip: 0,
        take: 10,
      });
      expect(prisma.user.count).toHaveBeenCalledWith({
        where: { deleted_at: null },
      });
      expect(result.data).toEqual(users);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });

    it('debe retornar lista vacía cuando no hay usuarios', async () => {
      const pagination = { page: 1, limit: 10 };

      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(0);

      const result = await service.findAll(pagination);

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });

  describe('findOne', () => {
    it('debe retornar un usuario por ID', async () => {
      const user = { id: 'user-1', email: 'test@example.com' };
      prisma.user.findFirst.mockResolvedValue(user);

      const result = await service.findOne('user-1');

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { id: 'user-1', deleted_at: null },
      });
      expect(result).toEqual(user);
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(service.findOne('user-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('debe lanzar NotFoundException si el usuario fue eliminado', async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(service.findOne('user-eliminado')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getProfile', () => {
    it('debe retornar un usuario con su persona asociada', async () => {
      const userWithPerson = {
        id: 'user-1',
        email: 'test@example.com',
        person: {
          id: 'person-1',
          name: 'John',
          lastname: 'Doe',
        },
      };

      prisma.user.findFirst.mockResolvedValue(userWithPerson);

      const result = await service.getProfile('user-1');

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { id: 'user-1', deleted_at: null },
        include: { person: true },
      });
      expect(result).toEqual(userWithPerson);
      expect(result.person).toBeDefined();
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(service.getProfile('user-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByEmail', () => {
    it('debe retornar un usuario por email', async () => {
      const user = { id: 'user-1', email: 'test@example.com' };
      prisma.user.findFirst.mockResolvedValue(user);

      const result = await service.findByEmail('test@example.com');

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com', deleted_at: null },
      });
      expect(result).toEqual(user);
    });

    it('debe lanzar NotFoundException si no existe usuario con ese email', async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(
        service.findByEmail('noexiste@example.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar un usuario correctamente', async () => {
      const updateUserDto = { email: 'updated@example.com' };
      const updatedUser = {
        id: 'user-1',
        email: 'updated@example.com',
      };

      prisma.user.update.mockResolvedValue(updatedUser);

      const result = await service.update('user-1', updateUserDto);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: updateUserDto,
      });
      expect(result).toEqual(updatedUser);
    });

    it('debe actualizar múltiples campos del usuario', async () => {
      const updateUserDto = {
        email: 'newemail@example.com',
        password: 'NewPassword123!',
      };
      const updatedUser = {
        id: 'user-1',
        email: 'newemail@example.com',
        password: 'NewPassword123!',
      };

      prisma.user.update.mockResolvedValue(updatedUser);

      const result = await service.update('user-1', updateUserDto);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: updateUserDto,
      });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('debe realizar soft delete de un usuario', async () => {
      prisma.user.update.mockResolvedValue({});

      await service.remove('user-1');

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { deleted_at: expect.any(Date) },
      });
    });

    it('debe lanzar error si el usuario no existe al intentar eliminar', async () => {
      prisma.user.update.mockRejectedValue(
        new Error('Record to update not found'),
      );

      await expect(service.remove('user-inexistente')).rejects.toThrow(
        'Record to update not found',
      );
    });
  });
});

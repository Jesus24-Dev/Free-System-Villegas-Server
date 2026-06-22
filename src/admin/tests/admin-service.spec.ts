import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { describe, beforeEach, jest, it, expect } from '@jest/globals';
import { AdminService } from '../admin.service';
import { NotFoundException } from '@nestjs/common';

describe('AdminServiceTest', () => {
  let service: AdminService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
    };
    person: {
      update: jest.Mock;
    };
  };
  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
      person: {
        update: jest.fn(),
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();
    service = module.get(AdminService);
  });
  it('debe invertir el estado de la persona asociada al usuario correctamente', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-123',
      person_id: 'person-789',
      person: {
        id: 'person-789',
        status: true,
      },
    });

    prisma.person.update.mockResolvedValue({
      id: 'person-789',
      status: false,
    });

    await service.changeUserStatus('user-123');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      include: { person: true },
    });

    expect(prisma.person.update).toHaveBeenCalledWith({
      where: { id: 'person-789' },
      data: { status: false },
    });
  });

  it('debe activar a la persona si actualmente está inactiva', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-123',
      person_id: 'person-789',
      person: {
        id: 'person-789',
        status: false,
      },
    });

    await service.changeUserStatus('user-123');

    expect(prisma.person.update).toHaveBeenCalledWith({
      where: { id: 'person-789' },
      data: { status: true },
    });
  });

  it('debe lanzar un NotFoundException si el usuario no existe', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.changeUserStatus('user-inexistente')).rejects.toThrow(
      NotFoundException,
    );

    expect(prisma.person.update).not.toHaveBeenCalled();
  });
});
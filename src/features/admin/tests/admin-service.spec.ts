/* eslint-disable */
// @ts-nocheck
import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { describe, beforeEach, jest, it, expect } from '@jest/globals';
import { AdminService } from '../admin.service';
import { NotFoundException } from '@nestjs/common';
import { CompetitionService } from 'src/features/competition/competition.service';
import { CompetitionDivisionService } from 'src/features/competition-division/competition-division.service';
import { UserService } from 'src/features/user/user.service';
import { PersonService } from 'src/features/person/person.service';
import { CoachService } from 'src/features/coach/coach.service';
import { AthleteService } from 'src/features/athlete/athlete.service';
import { GymService } from 'src/features/gym/gym.service';
import { GymPaymentService } from 'src/features/gym-payment/gym-payment.service';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

describe('AdminService', () => {
  let service: AdminService;
  let prisma: {
    gym: {
      findMany: jest.Mock;
    };
    user: {
      findFirst: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
    };
    person: {
      update: jest.Mock;
    };
  };

  let competitionService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  let competitionDivisionService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  let userService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  let personService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  let coachService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    remove: jest.Mock;
  };

  let athleteService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    remove: jest.Mock;
  };

  let gymService: {
    remove: jest.Mock;
  };

  let gymPaymentService: {
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      gym: {
        findMany: jest.fn(),
      },
      user: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
      person: {
        update: jest.fn(),
      },
    };

    competitionService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    competitionDivisionService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    userService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    personService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    coachService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    athleteService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    gymService = {
      remove: jest.fn(),
    };

    gymPaymentService = {
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: prisma },
        { provide: CompetitionService, useValue: competitionService },
        { provide: CompetitionDivisionService, useValue: competitionDivisionService },
        { provide: UserService, useValue: userService },
        { provide: PersonService, useValue: personService },
        { provide: CoachService, useValue: coachService },
        { provide: AthleteService, useValue: athleteService },
        { provide: GymService, useValue: gymService },
        { provide: GymPaymentService, useValue: gymPaymentService },
      ],
    }).compile();

    service = module.get(AdminService);
  });

  describe('getAllGyms', () => {
    it('debe retornar una lista de gimnasios con conteos', async () => {
      const gyms = [
        {
          id: 'gym-1',
          name: 'Gimnasio Test',
          address: 'Calle Principal',
          state: 'Caracas',
          coach_owner: {
            person: { name: 'John', surname: 'Doe' },
          },
          coaches: [{ id: 'c1' }, { id: 'c2' }],
          athletes: [{ id: 'a1' }, { id: 'a2' }, { id: 'a3' }],
        },
      ];

      prisma.gym.findMany.mockResolvedValue(gyms);

      const result = await service.getAllGyms();

      expect(result).toHaveLength(1);
      expect(result[0].owner_name).toBe('John Doe');
      expect(result[0].total_coaches).toBe(2);
      expect(result[0].total_athletes).toBe(3);
    });

    it('debe retornar lista vacía cuando no hay gimnasios', async () => {
      prisma.gym.findMany.mockResolvedValue([]);

      const result = await service.getAllGyms();

      expect(result).toEqual([]);
    });
  });

  describe('getAllUsers', () => {
    it('debe retornar una lista de usuarios con datos de persona', async () => {
      const users = [
        {
          id: 'user-1',
          email: 'test@example.com',
          role: ['ATHLETE'],
          person: {
            dni: 'V12345678',
            name: 'John',
            surname: 'Doe',
            birthday: new Date('1990-01-01'),
            gender: 'MALE',
            status: true,
          },
        },
      ];

      prisma.user.findMany.mockResolvedValue(users);

      const result = await service.getAllUsers();

      expect(result).toHaveLength(1);
      expect(result[0].dni).toBe('V12345678');
    });
  });

  describe('changeUserStatus', () => {
    it('debe invertir el estado de la persona asociada al usuario correctamente', async () => {
      prisma.user.findFirst.mockResolvedValue({
        id: 'user-123',
        person_id: 'person-789',
        person: { id: 'person-789', status: true },
      });
      prisma.person.update.mockResolvedValue({ id: 'person-789', status: false });

      await service.changeUserStatus('user-123');

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { id: 'user-123', deleted_at: null },
        include: { person: true },
      });
      expect(prisma.person.update).toHaveBeenCalledWith({
        where: { id: 'person-789' },
        data: { status: false },
      });
    });

    it('debe activar a la persona si actualmente está inactiva', async () => {
      prisma.user.findFirst.mockResolvedValue({
        id: 'user-123',
        person_id: 'person-789',
        person: { id: 'person-789', status: false },
      });

      await service.changeUserStatus('user-123');

      expect(prisma.person.update).toHaveBeenCalledWith({
        where: { id: 'person-789' },
        data: { status: true },
      });
    });

    it('debe lanzar un NotFoundException si el usuario no existe', async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(service.changeUserStatus('user-inexistente')).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.person.update).not.toHaveBeenCalled();
    });
  });

  describe('createCompetition', () => {
    it('debe delegar a CompetitionService.create', async () => {
      const dto = { name: 'Test Competition', location: 'Caracas' };
      const expected = { id: 'comp-1', ...dto };
      competitionService.create.mockResolvedValue(expected);

      const result = await service.createCompetition(dto);

      expect(competitionService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAllCompetitions', () => {
    it('debe delegar a CompetitionService.findAll', async () => {
      const dto = { status: 'OPEN' };
      const expected = [{ id: 'comp-1', name: 'Test' }];
      competitionService.findAll.mockResolvedValue(expected);

      const result = await service.findAllCompetitions(dto);

      expect(competitionService.findAll).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findOneCompetition', () => {
    it('debe delegar a CompetitionService.findOne', async () => {
      const expected = { id: 'comp-1', name: 'Test' };
      competitionService.findOne.mockResolvedValue(expected);

      const result = await service.findOneCompetition('comp-1');

      expect(competitionService.findOne).toHaveBeenCalledWith('comp-1');
      expect(result).toEqual(expected);
    });
  });

  describe('updateCompetition', () => {
    it('debe delegar a CompetitionService.update', async () => {
      const dto = { name: 'Updated' };
      const expected = { id: 'comp-1', name: 'Updated' };
      competitionService.update.mockResolvedValue(expected);

      const result = await service.updateCompetition('comp-1', dto);

      expect(competitionService.update).toHaveBeenCalledWith('comp-1', dto);
      expect(result).toEqual(expected);
    });
  });

  describe('removeCompetition', () => {
    it('debe delegar a CompetitionService.remove', async () => {
      competitionService.remove.mockResolvedValue(undefined);

      await service.removeCompetition('comp-1');

      expect(competitionService.remove).toHaveBeenCalledWith('comp-1');
    });
  });

  describe('createCompetitionDivision', () => {
    it('debe delegar a CompetitionDivisionService.create', async () => {
      const dto = { competition_id: 'comp-1', mode: 'POINT_FIGHTING', gender: 'MALE', weight: 75 };
      const expected = { id: 'div-1', ...dto };
      competitionDivisionService.create.mockResolvedValue(expected);

      const result = await service.createCompetitionDivision(dto);

      expect(competitionDivisionService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAllCompetitionDivisions', () => {
    it('debe delegar a CompetitionDivisionService.findAll', async () => {
      const expected = [{ id: 'div-1' }];
      competitionDivisionService.findAll.mockResolvedValue(expected);

      const result = await service.findAllCompetitionDivisions();

      expect(competitionDivisionService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('findOneCompetitionDivision', () => {
    it('debe delegar a CompetitionDivisionService.findOne', async () => {
      const expected = { id: 'div-1' };
      competitionDivisionService.findOne.mockResolvedValue(expected);

      const result = await service.findOneCompetitionDivision('div-1');

      expect(competitionDivisionService.findOne).toHaveBeenCalledWith('div-1');
      expect(result).toEqual(expected);
    });
  });

  describe('updateCompetitionDivision', () => {
    it('debe delegar a CompetitionDivisionService.update', async () => {
      const dto = { weight: 80 };
      const expected = { id: 'div-1', weight: 80 };
      competitionDivisionService.update.mockResolvedValue(expected);

      const result = await service.updateCompetitionDivision('div-1', dto);

      expect(competitionDivisionService.update).toHaveBeenCalledWith('div-1', dto);
      expect(result).toEqual(expected);
    });
  });

  describe('removeCompetitionDivision', () => {
    it('debe delegar a CompetitionDivisionService.remove', async () => {
      competitionDivisionService.remove.mockResolvedValue(undefined);

      await service.removeCompetitionDivision('div-1');

      expect(competitionDivisionService.remove).toHaveBeenCalledWith('div-1');
    });
  });

  describe('createUser', () => {
    it('debe delegar a UserService.create y transformar respuesta', async () => {
      const dto = { email: 'test@example.com', password: 'Pass123!', role: ['ATHLETE'], person_id: 'p1' };
      const expected = {
        id: 'user-1',
        email: 'test@example.com',
        role: ['ATHLETE'],
        person_id: 'p1',
        created_at: new Date(),
        updated_at: new Date(),
      };
      userService.create.mockResolvedValue(expected);

      const result = await service.createUser(dto);

      expect(userService.create).toHaveBeenCalledWith(dto);
      expect(result.id).toBe('user-1');
      expect(result.email).toBe('test@example.com');
    });
  });

  describe('findAllUsersPaginated', () => {
    it('debe delegar a UserService.findAll y retornar PaginatedResponseDto', async () => {
      const pagination = { page: 1, limit: 10 };
      const users = [
        { id: 'u1', email: 'a@test.com', role: ['ATHLETE'], person_id: 'p1', created_at: new Date(), updated_at: new Date() },
      ];
      userService.findAll.mockResolvedValue({
        data: users,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      const result = await service.findAllUsersPaginated(pagination);

      expect(userService.findAll).toHaveBeenCalledWith(pagination);
      expect(result).toBeInstanceOf(PaginatedResponseDto);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('findOneUser', () => {
    it('debe delegar a UserService.findOne', async () => {
      const expected = { id: 'u1', email: 'test@test.com', role: ['ATHLETE'], person_id: 'p1', created_at: new Date(), updated_at: new Date() };
      userService.findOne.mockResolvedValue(expected);

      const result = await service.findOneUser('u1');

      expect(userService.findOne).toHaveBeenCalledWith('u1');
      expect(result.id).toBe('u1');
    });
  });

  describe('updateUser', () => {
    it('debe delegar a UserService.update', async () => {
      const dto = { email: 'new@test.com' };
      const expected = { id: 'u1', email: 'new@test.com', role: ['ATHLETE'], person_id: 'p1', created_at: new Date(), updated_at: new Date() };
      userService.update.mockResolvedValue(expected);

      const result = await service.updateUser('u1', dto);

      expect(userService.update).toHaveBeenCalledWith('u1', dto);
      expect(result.email).toBe('new@test.com');
    });
  });

  describe('removeUser', () => {
    it('debe delegar a UserService.remove', async () => {
      userService.remove.mockResolvedValue(undefined);

      await service.removeUser('u1');

      expect(userService.remove).toHaveBeenCalledWith('u1');
    });
  });

  describe('createPerson', () => {
    it('debe delegar a PersonService.create', async () => {
      const dto = { dni: 'V12345678', name: 'John', surname: 'Doe', birthday: new Date(), gender: 'MALE' };
      const expected = { id: 'p1', ...dto, status: true };
      personService.create.mockResolvedValue(expected);

      const result = await service.createPerson(dto);

      expect(personService.create).toHaveBeenCalledWith(dto);
      expect(result.id).toBe('p1');
    });
  });

  describe('findAllPersonsPaginated', () => {
    it('debe delegar a PersonService.findAll', async () => {
      const pagination = { page: 1, limit: 10 };
      personService.findAll.mockResolvedValue({
        data: [{ id: 'p1', dni: 'V12345678', name: 'John', surname: 'Doe', birthday: new Date(), gender: 'MALE', status: true }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      const result = await service.findAllPersonsPaginated(pagination);

      expect(personService.findAll).toHaveBeenCalledWith(pagination);
      expect(result).toBeInstanceOf(PaginatedResponseDto);
    });
  });

  describe('findOnePerson', () => {
    it('debe delegar a PersonService.findOne', async () => {
      const expected = { id: 'p1', dni: 'V12345678', name: 'John', surname: 'Doe', birthday: new Date(), gender: 'MALE', status: true };
      personService.findOne.mockResolvedValue(expected);

      const result = await service.findOnePerson('p1');

      expect(personService.findOne).toHaveBeenCalledWith('p1');
      expect(result.id).toBe('p1');
    });
  });

  describe('updatePerson', () => {
    it('debe delegar a PersonService.update', async () => {
      const dto = { name: 'Jane' };
      const expected = { id: 'p1', dni: 'V12345678', name: 'Jane', surname: 'Doe', birthday: new Date(), gender: 'MALE', status: true };
      personService.update.mockResolvedValue(expected);

      const result = await service.updatePerson('p1', dto);

      expect(personService.update).toHaveBeenCalledWith('p1', dto);
      expect(result.name).toBe('Jane');
    });
  });

  describe('removePerson', () => {
    it('debe delegar a PersonService.remove', async () => {
      personService.remove.mockResolvedValue(undefined);

      await service.removePerson('p1');

      expect(personService.remove).toHaveBeenCalledWith('p1');
    });
  });

  describe('createCoach', () => {
    it('debe delegar a CoachService.create', async () => {
      const dto = { person_id: 'p1' };
      const expected = { id: 'c1', person_id: 'p1' };
      coachService.create.mockResolvedValue(expected);

      const result = await service.createCoach(dto);

      expect(coachService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAllCoachesPaginated', () => {
    it('debe delegar a CoachService.findAll', async () => {
      const pagination = { page: 1, limit: 10 };
      coachService.findAll.mockResolvedValue({
        data: [{ id: 'c1', person_id: 'p1' }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      const result = await service.findAllCoachesPaginated(pagination);

      expect(coachService.findAll).toHaveBeenCalledWith(pagination);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('findOneCoach', () => {
    it('debe delegar a CoachService.findOne', async () => {
      const expected = { id: 'c1', person_id: 'p1' };
      coachService.findOne.mockResolvedValue(expected);

      const result = await service.findOneCoach('c1');

      expect(coachService.findOne).toHaveBeenCalledWith('c1');
      expect(result).toEqual(expected);
    });
  });

  describe('removeCoach', () => {
    it('debe delegar a CoachService.remove', async () => {
      coachService.remove.mockResolvedValue(undefined);

      await service.removeCoach('c1');

      expect(coachService.remove).toHaveBeenCalledWith('c1');
    });
  });

  describe('createAthlete', () => {
    it('debe delegar a AthleteService.create', async () => {
      const dto = { person_id: 'p1' };
      const expected = { id: 'a1', person_id: 'p1' };
      athleteService.create.mockResolvedValue(expected);

      const result = await service.createAthlete(dto);

      expect(athleteService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAllAthletesPaginated', () => {
    it('debe delegar a AthleteService.findAll', async () => {
      const pagination = { page: 1, limit: 10 };
      athleteService.findAll.mockResolvedValue({
        data: [{ id: 'a1', person_id: 'p1' }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      const result = await service.findAllAthletesPaginated(pagination);

      expect(athleteService.findAll).toHaveBeenCalledWith(pagination);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('findOneAthlete', () => {
    it('debe delegar a AthleteService.findOne', async () => {
      const expected = { id: 'a1', person_id: 'p1' };
      athleteService.findOne.mockResolvedValue(expected);

      const result = await service.findOneAthlete('a1');

      expect(athleteService.findOne).toHaveBeenCalledWith('a1');
      expect(result).toEqual(expected);
    });
  });

  describe('removeAthlete', () => {
    it('debe delegar a AthleteService.remove', async () => {
      athleteService.remove.mockResolvedValue(undefined);

      await service.removeAthlete('a1');

      expect(athleteService.remove).toHaveBeenCalledWith('a1');
    });
  });

  describe('removeGym', () => {
    it('debe delegar a GymService.remove', async () => {
      gymService.remove.mockResolvedValue(undefined);

      await service.removeGym('g1');

      expect(gymService.remove).toHaveBeenCalledWith('g1');
    });
  });

  describe('updateGymPayment', () => {
    it('debe delegar a GymPaymentService.update', async () => {
      const dto = { amount: 100 };
      const expected = { id: 'pay-1', amount: 100 };
      gymPaymentService.update.mockResolvedValue(expected);

      const result = await service.updateGymPayment('pay-1', dto);

      expect(gymPaymentService.update).toHaveBeenCalledWith('pay-1', dto);
      expect(result).toEqual(expected);
    });
  });

  describe('removeGymPayment', () => {
    it('debe delegar a GymPaymentService.remove', async () => {
      gymPaymentService.remove.mockResolvedValue(undefined);

      await service.removeGymPayment('pay-1');

      expect(gymPaymentService.remove).toHaveBeenCalledWith('pay-1');
    });
  });
});

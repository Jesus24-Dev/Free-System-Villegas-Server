/* eslint-disable */
// @ts-nocheck
import { Test } from '@nestjs/testing';
import { describe, beforeEach, jest, it, expect } from '@jest/globals';
import { AdminController } from '../admin.controller';
import { AdminService } from '../admin.service';
import { NotFoundException } from '@nestjs/common';

describe('AdminController', () => {
  let controller: AdminController;
  let service: {
    getAllGyms: jest.Mock;
    getAllUsers: jest.Mock;
    changeUserStatus: jest.Mock;
    createCompetition: jest.Mock;
    findAllCompetitions: jest.Mock;
    findOneCompetition: jest.Mock;
    updateCompetition: jest.Mock;
    removeCompetition: jest.Mock;
    createCompetitionDivision: jest.Mock;
    findAllCompetitionDivisions: jest.Mock;
    findOneCompetitionDivision: jest.Mock;
    updateCompetitionDivision: jest.Mock;
    removeCompetitionDivision: jest.Mock;
    createUser: jest.Mock;
    findAllUsersPaginated: jest.Mock;
    findOneUser: jest.Mock;
    updateUser: jest.Mock;
    removeUser: jest.Mock;
    createPerson: jest.Mock;
    findAllPersonsPaginated: jest.Mock;
    findOnePerson: jest.Mock;
    updatePerson: jest.Mock;
    removePerson: jest.Mock;
    createCoach: jest.Mock;
    findAllCoachesPaginated: jest.Mock;
    findOneCoach: jest.Mock;
    removeCoach: jest.Mock;
    createAthlete: jest.Mock;
    findAllAthletesPaginated: jest.Mock;
    findOneAthlete: jest.Mock;
    removeAthlete: jest.Mock;
    removeGym: jest.Mock;
    updateGymPayment: jest.Mock;
    removeGymPayment: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      getAllGyms: jest.fn(),
      getAllUsers: jest.fn(),
      changeUserStatus: jest.fn(),
      createCompetition: jest.fn(),
      findAllCompetitions: jest.fn(),
      findOneCompetition: jest.fn(),
      updateCompetition: jest.fn(),
      removeCompetition: jest.fn(),
      createCompetitionDivision: jest.fn(),
      findAllCompetitionDivisions: jest.fn(),
      findOneCompetitionDivision: jest.fn(),
      updateCompetitionDivision: jest.fn(),
      removeCompetitionDivision: jest.fn(),
      createUser: jest.fn(),
      findAllUsersPaginated: jest.fn(),
      findOneUser: jest.fn(),
      updateUser: jest.fn(),
      removeUser: jest.fn(),
      createPerson: jest.fn(),
      findAllPersonsPaginated: jest.fn(),
      findOnePerson: jest.fn(),
      updatePerson: jest.fn(),
      removePerson: jest.fn(),
      createCoach: jest.fn(),
      findAllCoachesPaginated: jest.fn(),
      findOneCoach: jest.fn(),
      removeCoach: jest.fn(),
      createAthlete: jest.fn(),
      findAllAthletesPaginated: jest.fn(),
      findOneAthlete: jest.fn(),
      removeAthlete: jest.fn(),
      removeGym: jest.fn(),
      updateGymPayment: jest.fn(),
      removeGymPayment: jest.fn(),
    };

    const module = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        { provide: AdminService, useValue: service },
      ],
    }).compile();

    controller = module.get(AdminController);
  });

  describe('GET /admin/gyms', () => {
    it('debe retornar lista de gimnasios', async () => {
      const gyms = [{ id: 'g1', name: 'Test Gym' }];
      service.getAllGyms.mockResolvedValue(gyms);

      const result = await controller.findAllGyms();

      expect(service.getAllGyms).toHaveBeenCalled();
      expect(result).toEqual(gyms);
    });
  });

  describe('GET /admin/users', () => {
    it('debe retornar lista de usuarios', async () => {
      const users = [{ id: 'u1', email: 'test@test.com' }];
      service.getAllUsers.mockResolvedValue(users);

      const result = await controller.findAllUsers();

      expect(service.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('PATCH /admin/users/:id/status', () => {
    it('debe cambiar el estado del usuario', async () => {
      service.changeUserStatus.mockResolvedValue(undefined);

      await controller.changeUserStatus('user-1');

      expect(service.changeUserStatus).toHaveBeenCalledWith('user-1');
    });
  });

  describe('POST /admin/competitions', () => {
    it('debe crear una competencia', async () => {
      const dto = { name: 'Test', location: 'Caracas' };
      const expected = { id: 'c1', ...dto };
      service.createCompetition.mockResolvedValue(expected);

      const result = await controller.createCompetition(dto);

      expect(service.createCompetition).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('GET /admin/competitions', () => {
    it('debe retornar lista de competencias', async () => {
      const expected = [{ id: 'c1', name: 'Test' }];
      service.findAllCompetitions.mockResolvedValue(expected);

      const result = await controller.findAllCompetitions({});

      expect(service.findAllCompetitions).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('GET /admin/competitions/:id', () => {
    it('debe retornar una competencia por ID', async () => {
      const expected = { id: 'c1', name: 'Test' };
      service.findOneCompetition.mockResolvedValue(expected);

      const result = await controller.findOneCompetition('c1');

      expect(service.findOneCompetition).toHaveBeenCalledWith('c1');
      expect(result).toEqual(expected);
    });
  });

  describe('PATCH /admin/competitions/:id', () => {
    it('debe actualizar una competencia', async () => {
      const dto = { name: 'Updated' };
      const expected = { id: 'c1', name: 'Updated' };
      service.updateCompetition.mockResolvedValue(expected);

      const result = await controller.updateCompetition('c1', dto);

      expect(service.updateCompetition).toHaveBeenCalledWith('c1', dto);
      expect(result).toEqual(expected);
    });
  });

  describe('DELETE /admin/competitions/:id', () => {
    it('debe eliminar una competencia', async () => {
      service.removeCompetition.mockResolvedValue(undefined);

      await controller.removeCompetition('c1');

      expect(service.removeCompetition).toHaveBeenCalledWith('c1');
    });
  });

  describe('POST /admin/competition-divisions', () => {
    it('debe crear una división', async () => {
      const dto = { competition_id: 'c1', mode: 'POINT_FIGHTING', gender: 'MALE', weight: 75 };
      const expected = { id: 'd1', ...dto };
      service.createCompetitionDivision.mockResolvedValue(expected);

      const result = await controller.createCompetitionDivision(dto);

      expect(service.createCompetitionDivision).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('GET /admin/competition-divisions', () => {
    it('debe retornar lista de divisiones', async () => {
      const expected = [{ id: 'd1' }];
      service.findAllCompetitionDivisions.mockResolvedValue(expected);

      const result = await controller.findAllCompetitionDivisions();

      expect(service.findAllCompetitionDivisions).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('GET /admin/competition-divisions/:id', () => {
    it('debe retornar una división por ID', async () => {
      const expected = { id: 'd1' };
      service.findOneCompetitionDivision.mockResolvedValue(expected);

      const result = await controller.findOneCompetitionDivision('d1');

      expect(service.findOneCompetitionDivision).toHaveBeenCalledWith('d1');
      expect(result).toEqual(expected);
    });
  });

  describe('PATCH /admin/competition-divisions/:id', () => {
    it('debe actualizar una división', async () => {
      const dto = { weight: 80 };
      const expected = { id: 'd1', weight: 80 };
      service.updateCompetitionDivision.mockResolvedValue(expected);

      const result = await controller.updateCompetitionDivision('d1', dto);

      expect(service.updateCompetitionDivision).toHaveBeenCalledWith('d1', dto);
      expect(result).toEqual(expected);
    });
  });

  describe('DELETE /admin/competition-divisions/:id', () => {
    it('debe eliminar una división', async () => {
      service.removeCompetitionDivision.mockResolvedValue(undefined);

      await controller.removeCompetitionDivision('d1');

      expect(service.removeCompetitionDivision).toHaveBeenCalledWith('d1');
    });
  });

  describe('POST /admin/users', () => {
    it('debe crear un usuario', async () => {
      const dto = { email: 'test@test.com', password: 'Pass123!', role: ['ATHLETE'], person_id: 'p1' };
      const expected = { id: 'u1', ...dto };
      service.createUser.mockResolvedValue(expected);

      const result = await controller.createUser(dto);

      expect(service.createUser).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('GET /admin/users/paginated', () => {
    it('debe retornar usuarios paginados', async () => {
      const pagination = { page: 1, limit: 10 };
      const expected = { data: [{ id: 'u1' }], total: 1, page: 1, limit: 10, totalPages: 1 };
      service.findAllUsersPaginated.mockResolvedValue(expected);

      const result = await controller.findAllUsersPaginated(pagination);

      expect(service.findAllUsersPaginated).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(expected);
    });
  });

  describe('GET /admin/users/:id', () => {
    it('debe retornar un usuario por ID', async () => {
      const expected = { id: 'u1', email: 'test@test.com' };
      service.findOneUser.mockResolvedValue(expected);

      const result = await controller.findOneUser('u1');

      expect(service.findOneUser).toHaveBeenCalledWith('u1');
      expect(result).toEqual(expected);
    });
  });

  describe('PATCH /admin/users/:id', () => {
    it('debe actualizar un usuario', async () => {
      const dto = { email: 'new@test.com' };
      const expected = { id: 'u1', email: 'new@test.com' };
      service.updateUser.mockResolvedValue(expected);

      const result = await controller.updateUser('u1', dto);

      expect(service.updateUser).toHaveBeenCalledWith('u1', dto);
      expect(result).toEqual(expected);
    });
  });

  describe('DELETE /admin/users/:id', () => {
    it('debe eliminar un usuario', async () => {
      service.removeUser.mockResolvedValue(undefined);

      await controller.removeUser('u1');

      expect(service.removeUser).toHaveBeenCalledWith('u1');
    });
  });

  describe('POST /admin/persons', () => {
    it('debe crear una persona', async () => {
      const dto = { dni: 'V12345678', name: 'John', surname: 'Doe', birthday: new Date(), gender: 'MALE' };
      const expected = { id: 'p1', ...dto };
      service.createPerson.mockResolvedValue(expected);

      const result = await controller.createPerson(dto);

      expect(service.createPerson).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('GET /admin/persons/paginated', () => {
    it('debe retornar personas paginadas', async () => {
      const pagination = { page: 1, limit: 10 };
      const expected = { data: [{ id: 'p1' }], total: 1, page: 1, limit: 10, totalPages: 1 };
      service.findAllPersonsPaginated.mockResolvedValue(expected);

      const result = await controller.findAllPersonsPaginated(pagination);

      expect(service.findAllPersonsPaginated).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(expected);
    });
  });

  describe('GET /admin/persons/:id', () => {
    it('debe retornar una persona por ID', async () => {
      const expected = { id: 'p1', name: 'John' };
      service.findOnePerson.mockResolvedValue(expected);

      const result = await controller.findOnePerson('p1');

      expect(service.findOnePerson).toHaveBeenCalledWith('p1');
      expect(result).toEqual(expected);
    });
  });

  describe('PATCH /admin/persons/:id', () => {
    it('debe actualizar una persona', async () => {
      const dto = { name: 'Jane' };
      const expected = { id: 'p1', name: 'Jane' };
      service.updatePerson.mockResolvedValue(expected);

      const result = await controller.updatePerson('p1', dto);

      expect(service.updatePerson).toHaveBeenCalledWith('p1', dto);
      expect(result).toEqual(expected);
    });
  });

  describe('DELETE /admin/persons/:id', () => {
    it('debe eliminar una persona', async () => {
      service.removePerson.mockResolvedValue(undefined);

      await controller.removePerson('p1');

      expect(service.removePerson).toHaveBeenCalledWith('p1');
    });
  });

  describe('POST /admin/coaches', () => {
    it('debe crear un coach', async () => {
      const dto = { person_id: 'p1' };
      const expected = { id: 'c1', ...dto };
      service.createCoach.mockResolvedValue(expected);

      const result = await controller.createCoach(dto);

      expect(service.createCoach).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('GET /admin/coaches/paginated', () => {
    it('debe retornar coaches paginados', async () => {
      const pagination = { page: 1, limit: 10 };
      const expected = { data: [{ id: 'c1' }], total: 1, page: 1, limit: 10, totalPages: 1 };
      service.findAllCoachesPaginated.mockResolvedValue(expected);

      const result = await controller.findAllCoachesPaginated(pagination);

      expect(service.findAllCoachesPaginated).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(expected);
    });
  });

  describe('GET /admin/coaches/:id', () => {
    it('debe retornar un coach por ID', async () => {
      const expected = { id: 'c1', person_id: 'p1' };
      service.findOneCoach.mockResolvedValue(expected);

      const result = await controller.findOneCoach('c1');

      expect(service.findOneCoach).toHaveBeenCalledWith('c1');
      expect(result).toEqual(expected);
    });
  });

  describe('DELETE /admin/coaches/:id', () => {
    it('debe eliminar un coach', async () => {
      service.removeCoach.mockResolvedValue(undefined);

      await controller.removeCoach('c1');

      expect(service.removeCoach).toHaveBeenCalledWith('c1');
    });
  });

  describe('POST /admin/athletes', () => {
    it('debe crear un atleta', async () => {
      const dto = { person_id: 'p1' };
      const expected = { id: 'a1', ...dto };
      service.createAthlete.mockResolvedValue(expected);

      const result = await controller.createAthlete(dto);

      expect(service.createAthlete).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('GET /admin/athletes/paginated', () => {
    it('debe retornar atletas paginados', async () => {
      const pagination = { page: 1, limit: 10 };
      const expected = { data: [{ id: 'a1' }], total: 1, page: 1, limit: 10, totalPages: 1 };
      service.findAllAthletesPaginated.mockResolvedValue(expected);

      const result = await controller.findAllAthletesPaginated(pagination);

      expect(service.findAllAthletesPaginated).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(expected);
    });
  });

  describe('GET /admin/athletes/:id', () => {
    it('debe retornar un atleta por ID', async () => {
      const expected = { id: 'a1', person_id: 'p1' };
      service.findOneAthlete.mockResolvedValue(expected);

      const result = await controller.findOneAthlete('a1');

      expect(service.findOneAthlete).toHaveBeenCalledWith('a1');
      expect(result).toEqual(expected);
    });
  });

  describe('DELETE /admin/athletes/:id', () => {
    it('debe eliminar un atleta', async () => {
      service.removeAthlete.mockResolvedValue(undefined);

      await controller.removeAthlete('a1');

      expect(service.removeAthlete).toHaveBeenCalledWith('a1');
    });
  });

  describe('DELETE /admin/gyms/:id', () => {
    it('debe eliminar un gimnasio', async () => {
      service.removeGym.mockResolvedValue(undefined);

      await controller.removeGym('g1');

      expect(service.removeGym).toHaveBeenCalledWith('g1');
    });
  });

  describe('PATCH /admin/gym-payments/:id', () => {
    it('debe actualizar un pago', async () => {
      const dto = { amount: 100 };
      const expected = { id: 'pay-1', amount: 100 };
      service.updateGymPayment.mockResolvedValue(expected);

      const result = await controller.updateGymPayment('pay-1', dto);

      expect(service.updateGymPayment).toHaveBeenCalledWith('pay-1', dto);
      expect(result).toEqual(expected);
    });
  });

  describe('DELETE /admin/gym-payments/:id', () => {
    it('debe eliminar un pago', async () => {
      service.removeGymPayment.mockResolvedValue(undefined);

      await controller.removeGymPayment('pay-1');

      expect(service.removeGymPayment).toHaveBeenCalledWith('pay-1');
    });
  });
});

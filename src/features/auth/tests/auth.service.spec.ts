/* eslint-disable */
// @ts-nocheck
import { Test } from '@nestjs/testing';
import { describe, beforeEach, jest, it, expect } from '@jest/globals';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { PasswordService } from '../services/password.service';
import { TokenService } from '../services/token.service';
import { RegisterUserUseCase } from '../use-cases/register-user.use-case';
import { LoggerService } from 'src/common/logger/logger.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  let mockUserService: {
    findByEmail: jest.Mock;
    getProfile: jest.Mock;
  };
  let mockRegisterUserUseCase: {
    execute: jest.Mock;
  };
  let mockPasswordService: {
    hash: jest.Mock;
    compare: jest.Mock;
  };
  let mockTokenService: {
    generateAccessToken: jest.Mock;
  };
  let mockLogger: {
    log: jest.Mock;
    info: jest.Mock;
    warn: jest.Mock;
    error: jest.Mock;
    debug: jest.Mock;
  };

  beforeEach(async () => {
    mockUserService = {
      findByEmail: jest.fn(),
      getProfile: jest.fn(),
    };
    mockRegisterUserUseCase = {
      execute: jest.fn(),
    };
    mockPasswordService = {
      hash: jest.fn(),
      compare: jest.fn(),
    };
    mockTokenService = {
      generateAccessToken: jest.fn(),
    };
    mockLogger = {
      log: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: RegisterUserUseCase, useValue: mockRegisterUserUseCase },
        { provide: PasswordService, useValue: mockPasswordService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: LoggerService, useValue: mockLogger },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('signIn', () => {
    it('should return access_token on successful login', async () => {
      const dto = { email: 'test@example.com', password: 'Password123!' };
      const user = { id: 'user-1', email: dto.email, password: 'hashed', role: ['ATHLETE'] };

      mockUserService.findByEmail.mockResolvedValue(user);
      mockPasswordService.compare.mockResolvedValue(true);
      mockTokenService.generateAccessToken.mockResolvedValue('jwt-token');

      const result = await service.signIn(dto);

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(mockPasswordService.compare).toHaveBeenCalledWith(dto.password, user.password);
      expect(mockTokenService.generateAccessToken).toHaveBeenCalledWith(user);
      expect(result).toEqual({ access_token: 'jwt-token' });
    });

    it('should throw UnauthorizedException when password does not match', async () => {
      const dto = { email: 'test@example.com', password: 'WrongPassword' };
      const user = { id: 'user-1', email: dto.email, password: 'hashed' };

      mockUserService.findByEmail.mockResolvedValue(user);
      mockPasswordService.compare.mockResolvedValue(false);

      await expect(service.signIn(dto)).rejects.toThrow(UnauthorizedException);
      expect(mockLogger.error).toHaveBeenCalledWith(
        'LOGIN_FAILED',
        expect.any(Error),
        { email: dto.email },
      );
    });
  });

  describe('register', () => {
    it('should register a new user and return access_token', async () => {
      const registerDto = {
        email: 'new@example.com',
        password: 'Password123!',
        role: 'ATHLETE',
        person_id: 'person-1',
      };
      const newUser = { id: 'user-1', ...registerDto, role: ['ATHLETE'] };

      mockRegisterUserUseCase.execute.mockResolvedValue(newUser);
      mockTokenService.generateAccessToken.mockResolvedValue('jwt-token');

      const result = await service.register(registerDto);

      expect(mockRegisterUserUseCase.execute).toHaveBeenCalledWith(registerDto);
      expect(mockTokenService.generateAccessToken).toHaveBeenCalledWith(newUser);
      expect(result).toEqual({ access_token: 'jwt-token' });
    });
  });

  describe('profile', () => {
    it('should return user profile with person data', async () => {
      const userId = 'user-1';
      const profile = {
        id: userId,
        email: 'test@example.com',
        person: { id: 'person-1', name: 'John', lastname: 'Doe' },
      };

      mockUserService.getProfile.mockResolvedValue(profile);

      const result = await service.profile(userId);

      expect(mockUserService.getProfile).toHaveBeenCalledWith(userId);
      expect(result).toEqual(profile);
    });
  });
});

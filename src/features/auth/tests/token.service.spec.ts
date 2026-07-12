/* eslint-disable */
// @ts-nocheck
import { Test } from '@nestjs/testing';
import { describe, beforeEach, jest, it, expect } from '@jest/globals';
import { TokenService } from '../services/token.service';
import { JwtService } from '@nestjs/jwt';

describe('TokenService', () => {
  let service: TokenService;

  let mockJwtService: {
    signAsync: jest.Mock;
  };

  beforeEach(async () => {
    mockJwtService = {
      signAsync: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get(TokenService);
  });

  describe('generateAccessToken', () => {
    it('should generate a token with sub and role from user', async () => {
      const user = {
        id: 'user-1',
        role: ['ATHLETE', 'COACH'],
      } as any;

      mockJwtService.signAsync.mockResolvedValue('jwt-token');

      const result = await service.generateAccessToken(user);

      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        role: user.role,
      });
      expect(result).toBe('jwt-token');
    });

    it('should generate a token with single role', async () => {
      const user = {
        id: 'user-2',
        role: ['ADMIN'],
      } as any;

      mockJwtService.signAsync.mockResolvedValue('admin-token');

      const result = await service.generateAccessToken(user);

      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: 'user-2',
        role: ['ADMIN'],
      });
      expect(result).toBe('admin-token');
    });
  });
});

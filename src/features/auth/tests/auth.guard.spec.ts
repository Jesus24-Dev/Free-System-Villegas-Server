/* eslint-disable */
// @ts-nocheck
import { Test } from '@nestjs/testing';
import { describe, beforeEach, jest, it, expect } from '@jest/globals';
import { AuthGuard } from '../auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  let mockJwtService: {
    verifyAsync: jest.Mock;
  };
  let mockReflector: {
    getAllAndOverride: jest.Mock;
  };

  beforeEach(async () => {
    mockJwtService = {
      verifyAsync: jest.fn(),
    };
    mockReflector = {
      getAllAndOverride: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: JwtService, useValue: mockJwtService },
        { provide: Reflector, useValue: mockReflector },
      ],
    }).compile();

    guard = module.get(AuthGuard);
  });

  function createMockContext(authorization?: string): ExecutionContext {
    const headers: Record<string, string> = {};
    if (authorization) {
      headers['authorization'] = authorization;
    }

    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
  }

  describe('canActivate', () => {
    it('should return true for public routes', async () => {
      mockReflector.getAllAndOverride.mockReturnValueOnce(true);

      const context = createMockContext();
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return true when a valid Bearer token is provided', async () => {
      mockReflector.getAllAndOverride.mockReturnValueOnce(false);
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'user-1', role: ['ATHLETE'] });

      const context = createMockContext('Bearer valid-token');
      const result = await guard.canActivate(context);

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException when no authorization header is present', async () => {
      mockReflector.getAllAndOverride.mockReturnValueOnce(false);

      const context = createMockContext();

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      mockReflector.getAllAndOverride.mockReturnValueOnce(false);
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      const context = createMockContext('Bearer invalid-token');

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when authorization header has no Bearer prefix', async () => {
      mockReflector.getAllAndOverride.mockReturnValueOnce(false);

      const context = createMockContext('Basic some-token');

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when authorization header is empty', async () => {
      mockReflector.getAllAndOverride.mockReturnValueOnce(false);

      const context = createMockContext('Bearer ');

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });
  });
});

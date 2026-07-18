/* eslint-disable */
// @ts-nocheck
import { Test } from '@nestjs/testing';
import { describe, beforeEach, jest, it, expect } from '@jest/globals';
import { RolesGuard } from '../guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;

  let mockReflector: {
    getAllAndOverride: jest.Mock;
  };

  beforeEach(async () => {
    mockReflector = {
      getAllAndOverride: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        RolesGuard,
        { provide: Reflector, useValue: mockReflector },
      ],
    }).compile();

    guard = module.get(RolesGuard);
  });

  function createMockContext(user?: { role?: string[] }): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user,
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
  }

  describe('canActivate', () => {
    it('should return true when no roles are required', () => {
      mockReflector.getAllAndOverride.mockReturnValueOnce(undefined);

      const context = createMockContext();
      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return false when required roles is an empty array (no match possible)', () => {
      mockReflector.getAllAndOverride.mockReturnValueOnce([]);

      const context = createMockContext({ role: ['ATHLETE'] });
      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return true when user has a required role', () => {
      mockReflector.getAllAndOverride.mockReturnValueOnce(['ADMIN']);

      const context = createMockContext({ role: ['ADMIN', 'ATHLETE'] });
      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return false when user does not have the required role', () => {
      mockReflector.getAllAndOverride.mockReturnValueOnce(['ADMIN']);

      const context = createMockContext({ role: ['ATHLETE'] });
      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return false when user has no role property', () => {
      mockReflector.getAllAndOverride.mockReturnValueOnce(['ADMIN']);

      const context = createMockContext({});
      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return false when user is undefined', () => {
      mockReflector.getAllAndOverride.mockReturnValueOnce(['ADMIN']);

      const context = createMockContext(undefined);
      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return true when user has any of the multiple required roles', () => {
      mockReflector.getAllAndOverride.mockReturnValueOnce(['ADMIN', 'COACH']);

      const context = createMockContext({ role: ['COACH', 'ATHLETE'] });
      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });
  });
});

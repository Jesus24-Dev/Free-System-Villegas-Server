/* eslint-disable */
// @ts-nocheck
import { Test } from '@nestjs/testing';
import { describe, beforeEach, it, expect } from '@jest/globals';
import { PasswordService } from '../services/password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get(PasswordService);
  });

  describe('hash', () => {
    it('should return a hashed password', async () => {
      const password = 'Password123!';

      const hashed = await service.hash(password);

      expect(hashed).toBeDefined();
      expect(typeof hashed).toBe('string');
      expect(hashed).not.toBe(password);
    });

    it('should produce different hashes for the same password (salt)', async () => {
      const password = 'Password123!';

      const hash1 = await service.hash(password);
      const hash2 = await service.hash(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('compare', () => {
    it('should return true when password matches the hash', async () => {
      const password = 'Password123!';
      const hashed = await service.hash(password);

      const result = await service.compare(password, hashed);

      expect(result).toBe(true);
    });

    it('should return false when password does not match the hash', async () => {
      const hashed = await service.hash('Password123!');

      const result = await service.compare('WrongPassword', hashed);

      expect(result).toBe(false);
    });
  });
});

/* eslint-disable */
// @ts-nocheck
import { PaginationDto } from '../dto/pagination.dto';
import { describe, it, expect } from '@jest/globals';

describe('PaginationDto', () => {
  it('has correct default values', () => {
    const dto = new PaginationDto();
    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(10);
    expect(dto.skip).toBe(0);
  });

  it('accepts custom page and limit values', () => {
    const dto = new PaginationDto();
    dto.page = 3;
    dto.limit = 20;
    expect(dto.page).toBe(3);
    expect(dto.limit).toBe(20);
  });

  it('calculates skip correctly for page 1', () => {
    const dto = new PaginationDto();
    dto.page = 1;
    dto.limit = 10;
    expect(dto.skip).toBe(0);
  });

  it('calculates skip correctly for page 2', () => {
    const dto = new PaginationDto();
    dto.page = 2;
    dto.limit = 10;
    expect(dto.skip).toBe(10);
  });

  it('calculates skip correctly for page 3 with limit 25', () => {
    const dto = new PaginationDto();
    dto.page = 3;
    dto.limit = 25;
    expect(dto.skip).toBe(50);
  });

  it('calculates skip correctly for page 5 with limit 5', () => {
    const dto = new PaginationDto();
    dto.page = 5;
    dto.limit = 5;
    expect(dto.skip).toBe(20);
  });
});

/* eslint-disable */
// @ts-nocheck
import { ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientExceptionFilter } from '../filters/prisma-client-exception.filter';
import { describe, beforeEach, jest, it, expect } from '@jest/globals';

describe('PrismaClientExceptionFilter', () => {
  let filter: PrismaClientExceptionFilter;
  let mockResponse: {
    status: jest.Mock;
    json: jest.Mock;
  };
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new PrismaClientExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as unknown as ArgumentsHost;

    jest.spyOn(BaseExceptionFilter.prototype, 'catch').mockImplementation();
  });

  it('handles P2002 unique constraint violation', () => {
    const exception = {
      code: 'P2002',
      meta: { target: ['email', 'dni'] },
    } as any;

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        message: expect.stringContaining('email, dni'),
      }),
    );
  });

  it('handles P2025 record not found', () => {
    const exception = {
      code: 'P2025',
      meta: {},
    } as any;

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
      }),
    );
  });

  it('handles P2003 foreign key constraint', () => {
    const exception = {
      code: 'P2003',
      meta: { field_name: 'person_id' },
    } as any;

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: expect.stringContaining('person_id'),
      }),
    );
  });

  it('handles P2014 required dependencies', () => {
    const exception = {
      code: 'P2014',
      meta: {},
    } as any;

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
      }),
    );
  });

  it('delegates to super.catch for unknown error codes', () => {
    const exception = {
      code: 'P9999',
      meta: {},
    } as any;

    filter.catch(exception, mockHost);

    expect(BaseExceptionFilter.prototype.catch).toHaveBeenCalledWith(exception, mockHost);
  });
});

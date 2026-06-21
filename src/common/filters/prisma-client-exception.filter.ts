import {
  ArgumentsHost,
  Catch,
  ConflictException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  override catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let errorToThrow: HttpException | null = null;

    switch (exception.code) {
      case 'P2002': {
        const target =
          (exception.meta?.target as string[])?.join(', ') || 'campo';
        errorToThrow = new ConflictException(
          `Ya existe un registro con ese ${target}.`,
        );
        break;
      }
      case 'P2025': {
        errorToThrow = new NotFoundException(
          'El registro solicitado no fue encontrado en la base de datos.',
        );
        break;
      }
      default:
        return super.catch(exception, host);
    }

    const status = errorToThrow.getStatus();
    const errorResponse = errorToThrow.getResponse();
    response.status(status).json(errorResponse);
  }
}

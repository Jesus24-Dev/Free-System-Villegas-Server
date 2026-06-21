import {
  Injectable,
  LoggerService as NestLoggerService,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class LoggerService
  implements NestLoggerService, OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(private readonly logger: PinoLogger) {}

  onApplicationBootstrap() {
    this.logger.info({
      event: 'SERVER_STARTED',
      environment: process.env.NODE_ENV,
    });
  }

  onApplicationShutdown(signal?: string) {
    this.logger.info({
      event: 'SERVER_SHUTDOWN',
      signal,
    });
  }

  log(message: unknown, ...optionalParams: any[]) {
    this.logger.info({
      message,
      ...optionalParams,
    });
  }

  info(event: string, data?: Record<string, any>) {
    this.logger.info({
      event,
      ...data,
    });
  }

  error(event: string, error?: unknown, data?: Record<string, any>) {
    this.logger.error({
      event,

      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : error,

      ...data,
    });
  }

  warn(message: unknown, ...optionalParams: any[]) {
    this.logger.warn({
      message,
      ...optionalParams,
    });
  }

  debug(message: unknown, ...optionalParams: any[]) {
    this.logger.debug({
      message,
      ...optionalParams,
    });
  }
}

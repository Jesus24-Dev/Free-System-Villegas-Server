import {
  Injectable,
  LoggerService as NestLoggerService,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class LoggerService
  implements NestLoggerService, OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {}

  onApplicationBootstrap() {
    this.logger.info({
      event: 'SERVER_STARTED',
      environment: this.configService.get<string>('NODE_ENV'),
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
      msg: message,
      message,
      ...optionalParams,
    });
  }

  info(event: string, data?: Record<string, any>) {
    this.logger.info({
      msg: event,
      event,
      ...data,
    });
  }

  error(event: string, error?: unknown, data?: Record<string, any>) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : error && typeof error === 'object' && 'message' in error
          ? String((error as Record<string, unknown>).message)
          : 'Error';
    this.logger.error({
      msg: `${event} -> ${errorMessage}`,
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
      msg: message,
      message,
      ...optionalParams,
    });
  }

  debug(message: unknown, ...optionalParams: any[]) {
    this.logger.debug({
      msg: message,
      message,
      ...optionalParams,
    });
  }
}

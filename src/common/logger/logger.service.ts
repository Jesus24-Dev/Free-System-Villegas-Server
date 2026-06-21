import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class LoggerService {
  constructor(private readonly logger: PinoLogger) {}

  info(event: string, data?: Record<string, any>) {
    this.logger.info({
      event,
      ...data,
    });
  }

  error(event: string, error: unknown, data?: Record<string, any>) {
    this.logger.error({
      event,

      error: error instanceof Error ? error.message : error,

      ...data,
    });
  }
}

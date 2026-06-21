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

  error(event: string, error: any, data?: Record<string, unknown>) {
    const isErrorInstance = error instanceof Error;
    this.logger.error({
      event,
      error: isErrorInstance ? error.message : String(error),
      stack: isErrorInstance ? error.stack : undefined,
      ...data,
    });
  }
}

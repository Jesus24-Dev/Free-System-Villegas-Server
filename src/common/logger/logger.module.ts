import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { LoggerService } from './logger.service';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        customProps() {
          return {
            environment: process.env.NODE_ENV,
          };
        },
        autoLogging: {
          ignore(req) {
            return req.url === '/favicon.ico';
          },
        },
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        redact: {
          paths: ['req.headers.authorization', 'req.headers.cookie'],
          censor: '[REDACTED]',
        },
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      },
    }),
  ],

  providers: [LoggerService],

  exports: [LoggerService],
})
export class LoggerModule {}

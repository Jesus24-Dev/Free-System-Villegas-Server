import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { LoggerService } from './logger.service';
import { IncomingMessage } from 'http';

@Global()
@Module({
  imports: [
    // Cambiamos a forRootAsync para poder inyectar ConfigService
    PinoLoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Extraemos la variable del entorno
        const nodeEnv = configService.get<string>('NODE_ENV') || 'development';

        return {
          pinoHttp: {
            customProps() {
              return {
                environment: nodeEnv,
              };
            },
            autoLogging: {
              ignore(req) {
                return req.url === '/favicon.ico';
              },
            },
            level: nodeEnv === 'production' ? 'info' : 'debug',
            serializers: {
              req: (req: IncomingMessage & { id?: string | number }) => ({
                id: req.id,
                method: req.method,
                url: req.url,
              }),
            },
            redact: {
              paths: ['req.headers.authorization', 'req.headers.cookie'],
              censor: '[REDACTED]',
            },
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
                singleLine: true,
                ignore: 'req,res,environment,context',
              },
            },
          },
        };
      },
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}

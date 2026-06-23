import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { LoggerService } from './logger.service';

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
            // Configuramos el nivel dinámicamente con nuestra variable local
            level: nodeEnv === 'production' ? 'info' : 'debug',
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
        };
      },
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}

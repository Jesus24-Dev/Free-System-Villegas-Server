import 'dotenv/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter';
import { LoggerService } from './common/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const { httpAdapter } = app.get(HttpAdapterHost);
  const logger = app.get(LoggerService);
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useLogger(logger);

  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  if (!corsOrigin) {
    throw new Error('CORS_ORIGIN missing');
  }
  app.enableCors({
    origin: corsOrigin.split(','),
    credentials: true,
  });

  if (configService.get<string>('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Free System Villegas')
      .setDescription(
        'Documentación oficial de la API de gestión de usuarios y atletas',
      )
      .setVersion('1.0')
      .addApiKey(
        {
          type: 'apiKey',
          name: 'X-API-KEY',
          in: 'header',
        },
        'api-key',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(configService.get<number>('PORT') ?? 3000);
}
void bootstrap();

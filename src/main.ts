import 'dotenv/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter';
import { LoggerService } from './common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Free System Villegas')
    .setDescription(
      'Documentación oficial de la API de gestión de usuarios y atletas',
    )
    .setVersion('1.0')
    .build();

  const { httpAdapter } = app.get(HttpAdapterHost);
  const logger = app.get(LoggerService);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  app.useLogger(logger);

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
    credentials: true,
  });

  if (process.env.NODE_ENV !== 'production') {
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document);
  }
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

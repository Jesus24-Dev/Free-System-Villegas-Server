/* eslint-disable */
// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const mockPrismaService = {
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      $transaction: jest.fn(),
      $queryRaw: jest.fn().mockResolvedValue([{ result: 1 }]),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();
  });

  it('/ (GET) - returns health status', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status');
        expect(res.body.status).toBe('up');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body).toHaveProperty('services');
        expect(res.body.services).toHaveProperty('database', 'healthy');
        expect(res.body.services).toHaveProperty(
          'service',
          'Free System Villegas Server',
        );
      });
  });

  afterEach(async () => {
    await app.close();
  });
});

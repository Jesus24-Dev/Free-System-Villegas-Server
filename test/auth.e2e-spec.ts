/* eslint-disable */
// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthModule } from '../src/features/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../src/prisma/prisma.service';
import { LoggerService } from '../src/common/logger/logger.service';
import * as bcrypt from 'bcrypt';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  const mockPrismaService = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $transaction: jest.fn(),
    $queryRaw: jest.fn(),
    user: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    person: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    athlete: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    coach: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockLogger = {
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
        AuthModule,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(LoggerService)
      .useValue(mockLogger)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();
  });

  describe('/auth/register (POST)', () => {
    it('registers a new user successfully', async () => {
      const mockPerson = {
        id: 'person-uuid-1',
        dni: 'V12345678',
        name: 'John',
        surname: 'Doe',
        birthday: new Date('1990-01-01'),
        gender: 'MALE',
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockUser = {
        id: 'user-uuid-1',
        email: 'john@example.com',
        password: '$2b$10$hashedpassword',
        role: ['ATHLETE'],
        person_id: 'person-uuid-1',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const tx = {
          person: {
            create: jest.fn().mockResolvedValue(mockPerson),
          },
          athlete: {
            create: jest.fn().mockResolvedValue({
              id: 'athlete-uuid-1',
              person_id: 'person-uuid-1',
            }),
          },
          user: {
            create: jest.fn().mockResolvedValue(mockUser),
          },
        };
        return callback(tx);
      });

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'john@example.com',
          password: 'Password123#',
          role: 'ATHLETE',
          dni: 'V12345678',
          name: 'John',
          surname: 'Doe',
          birthday: '1990-01-01',
          gender: 'MALE',
        })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(typeof response.body.access_token).toBe('string');
    });

    it('returns 400 for invalid data', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('returns 401 for wrong password', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      mockPrismaService.user.findFirst.mockResolvedValue({
        id: 'user-1',
        email: 'john@example.com',
        password: hashedPassword,
        role: ['ATHLETE'],
        person_id: 'person-1',
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.message).toContain('clave no coincide');
    });

    it('returns 200 with access_token for valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('Password123#', 10);
      mockPrismaService.user.findFirst.mockResolvedValue({
        id: 'user-1',
        email: 'john@example.com',
        password: hashedPassword,
        role: ['ATHLETE'],
        person_id: 'person-1',
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'john@example.com',
          password: 'Password123#',
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(typeof response.body.access_token).toBe('string');
    });
  });

  afterEach(async () => {
    await app.close();
  });
});

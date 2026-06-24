import { Injectable } from '@nestjs/common';
import { LoggerService } from './common/logger/logger.service';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(
    private readonly logger: LoggerService,
    private readonly prisma: PrismaService,
  ) {}
  async onModuleInit() {
    await this.prisma.$connect();
  }

  async checkDatabaseConnection(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database connection check failed', error);
      return false;
    }
  }
}

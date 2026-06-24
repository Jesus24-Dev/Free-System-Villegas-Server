import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';
import { AppService } from './app.service';
import type { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  @Public()
  async root(@Res() res: Response): Promise<any> {
    const isDbAlive = await this.appService.checkDatabaseConnection();
    const healthStatus = {
      status: isDbAlive ? 'up' : 'down',
      timestamp: new Date().toISOString(),
      services: {
        database: isDbAlive ? 'healthy' : 'unhealthy',
        service: 'Free System Villegas Server',
      },
    };
    if (!isDbAlive) {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json(healthStatus);
    }

    return res.status(HttpStatus.OK).json(healthStatus);
  }
}

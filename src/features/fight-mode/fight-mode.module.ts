import { Module } from '@nestjs/common';
import { FightModeService } from './fight-mode.service';
import { FightModeController } from './fight-mode.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FightModeController],
  providers: [FightModeService],
})
export class FightModeModule {}

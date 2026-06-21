import { Module } from '@nestjs/common';
import { PagoMovilService } from './pago-movil.service';
import { PagoMovilController } from './pago-movil.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PagoMovilController],
  providers: [PagoMovilService],
})
export class PagoMovilModule {}

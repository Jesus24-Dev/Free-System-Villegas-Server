import { PartialType } from '@nestjs/swagger';
import { CreatePagoMovilDto } from './create-pago-movil.dto';

export class UpdatePagoMovilDto extends PartialType(CreatePagoMovilDto) {}

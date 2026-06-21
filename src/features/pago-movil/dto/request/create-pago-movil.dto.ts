import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreatePagoMovilDto {
  @ApiProperty({
    example: '0102 - Banco de Venezuela',
    description: 'Banco destino del pago móvil',
  })
  @IsString()
  @IsNotEmpty()
  bank_to_pay!: string;

  @ApiProperty({
    example: 'V12345678',
    description: 'Cedula asociada al pago móvil',
  })
  @IsString()
  @IsNotEmpty()
  dni!: string;

  @ApiProperty({
    example: '04141234567',
    description: 'Número telefónico asociado',
  })
  @IsPhoneNumber('VE')
  phone!: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, Matches } from 'class-validator';

export class CreatePagoMovilDto {
  @ApiProperty({
    example: '0102 - Banco de Venezuela',
    description: 'Banco destino del pago móvil',
  })
  @IsString()
  @IsNotEmpty()
  bank_to_pay!: string;

  @ApiProperty({
    description: 'Cedula del usuario',
    example: '12345678',
  })
  @IsString({ message: 'La cédula debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La cédula no puede estar vacío' })
  @Matches(/^[VEJvej]\d{6,9}$/, {
    message:
      'La cédula debe seguir el formato venezolano: V/E/J seguido de 6 a 9 dígitos (ej: V12345678)',
  })
  dni!: string;

  @ApiProperty({
    example: '04141234567',
    description: 'Número telefónico asociado',
  })
  @IsPhoneNumber('VE')
  phone!: string;
}

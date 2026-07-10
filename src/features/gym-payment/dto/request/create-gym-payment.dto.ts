import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsNumber,
  IsDate,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGymPaymentDto {
  @ApiProperty({
    description: 'Fecha en que se realiza el pago',
    example: '2026-06-06T21:50:00.000Z',
  })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de pago debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha de pago es obligatoria' })
  day_payed!: Date;

  @ApiProperty({
    description: 'Monto pagado en BsD',
    example: 5675.42,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El monto debe ser un número con máximo 2 decimales' },
  )
  @Min(0.01, { message: 'El monto debe ser un número positivo' })
  @IsNotEmpty({ message: 'El monto es obligatorio' })
  amount!: number;

  @ApiPropertyOptional({
    description: 'URL de la evidencia del pago',
    example: 'https://example.com/evidence.jpg',
    nullable: true,
  })
  @IsUrl({}, { message: 'La URL de la evidencia debe ser una URL válida' })
  @IsOptional()
  evidence_url?: string | null;

  @ApiProperty({
    description: 'Número de referencia del pago',
    example: '33445673212',
  })
  @IsString({
    message: 'La referencia de pago debe ser una cadena de texto válida',
  })
  @IsNotEmpty({ message: 'La referencia de pago es obligatoria' })
  payment_reference!: string;

  @ApiProperty({
    description: 'ID único del atleta que realiza el pago',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El ID del atleta debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del atleta es obligatorio' })
  athlete_id!: string;

  @ApiProperty({
    description: 'ID único del gimnasio al que se le paga',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El ID del gimnasio debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del gimnasio es obligatorio' })
  gym_id!: string;
}

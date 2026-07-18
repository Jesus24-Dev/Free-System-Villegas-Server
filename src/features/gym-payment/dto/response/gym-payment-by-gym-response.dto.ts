import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GymPaymentByGymResponseDto {
  @ApiProperty({
    description: 'ID único del pago del gimnasio',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Fecha en que se realiza el pago',
    example: '2026-06-06T21:50:00.000Z',
  })
  day_payed!: Date;

  @ApiProperty({
    description: 'Monto pagado en BsD',
    example: 5675.42,
  })
  amount!: number;

  @ApiPropertyOptional({
    description: 'URL de la evidencia del pago',
    example: 'https://example.com/evidence.jpg',
    nullable: true,
  })
  evidence_url!: string | null;

  @ApiProperty({
    description: 'Número de referencia del pago',
    example: '33445673212',
  })
  payment_reference!: string;

  @ApiProperty({
    description: 'Estado de confirmación del pago',
    example: false,
  })
  isConfirmed!: boolean;

  @ApiProperty({
    description: 'ID del gimnasio al que se le pagó',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  gym_id!: string;

  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  created_at!: Date;

  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  updated_at!: Date;

  @ApiProperty({
    description: 'Datos del atleta que realizó el pago',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      dni: 'V12345678',
      name: 'Juan',
      surname: 'Pérez',
    },
  })
  athlete!: {
    id: string;
    dni: string;
    name: string;
    surname: string;
  };
}

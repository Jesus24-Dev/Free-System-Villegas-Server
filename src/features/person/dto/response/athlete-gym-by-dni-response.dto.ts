import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { States } from '@prisma/client';

export class AthleteGymByDniResponseDto {
  @ApiProperty({
    description: 'ID único de la persona',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Cédula de la persona',
    example: 'V12345678',
  })
  dni!: string;

  @ApiProperty({
    description: 'Nombre de la persona',
    example: 'John',
  })
  name!: string;

  @ApiProperty({
    description: 'Apellido de la persona',
    example: 'Doe',
  })
  surname!: string;

  @ApiProperty({
    description: 'ID del registro de atleta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  athlete_id!: string;

  @ApiProperty({
    description: 'Indica si el atleta tiene un gimnasio asignado',
    example: true,
  })
  has_gym!: boolean;

  @ApiPropertyOptional({
    description: 'Datos del gimnasio si el atleta tiene uno',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Dragon Fight Team',
      address: 'Caracas',
      state: 'DISTRITO_CAPITAL',
      monthly_payment: 30,
    },
  })
  gym?: {
    id: string;
    name: string;
    address: string;
    state: States;
    monthly_payment: number;
  } | null;
}

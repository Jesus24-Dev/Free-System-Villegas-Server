import { ApiProperty } from '@nestjs/swagger';
import { States } from '@prisma/client';

export class GymResponseDto {
  @ApiProperty({
    description: 'ID único del gimnasio',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del gimnasio',
    example: 'Gimnasio Villegas',
  })
  name!: string;

  @ApiProperty({
    description: 'Dirección del gimnasio',
    example: 'Calle Falsa 123',
  })
  address!: string;

  @ApiProperty({
    description: 'Estado geografico del gimnasio',
    enum: States,
    example: States.DISTRITO_CAPITAL,
  })
  state!: States;

  @ApiProperty({
    description: 'Nombre del entrenador principal',
    example: 'John Doe',
  })
  owner_name!: string;

  @ApiProperty({
    description: 'Numero total de atletas registrados',
    example: 10,
  })
  total_athletes!: number;

  @ApiProperty({
    description: 'Numero total de coaches registrados',
    example: 3,
  })
  total_coaches!: number;
}

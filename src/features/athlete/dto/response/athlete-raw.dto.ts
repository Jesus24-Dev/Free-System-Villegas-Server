import { ApiProperty } from '@nestjs/swagger';

export class RawAthleteDto {
  @ApiProperty({
    description: 'ID único del atleta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;
  @ApiProperty({
    description: 'ID único de la persona a relacionar con el atleta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  person_id!: string;

  @ApiProperty({
    description: 'ID único del gimnasio al que pertenece el atleta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  gym_id!: string | null;

  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  created_at!: Date;

  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  updated_at!: Date;
}

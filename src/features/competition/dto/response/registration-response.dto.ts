import { ApiProperty } from '@nestjs/swagger';

export class RegistrationResponseDto {
  @ApiProperty({
    description: 'ID único del registro',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'ID del atleta registrado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  athlete_id!: string;

  @ApiProperty({
    description: 'ID de la división de competencia',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  division_id!: string;
}

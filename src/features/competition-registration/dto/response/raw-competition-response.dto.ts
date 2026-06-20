import { ApiProperty } from '@nestjs/swagger';

export class RawCompetitionRegistrationDto {
  @ApiProperty({
    description: 'ID único del registro',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'ID único del atleta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  athlete_id!: string;

  @ApiProperty({
    description: 'ID único del gimnasio',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  division_id!: string;
}

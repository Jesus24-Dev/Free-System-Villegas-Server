import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PersonFoundedResponseDto {
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

  @ApiPropertyOptional({
    description: 'ID del usuario si tiene cuenta registrada',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  user_id?: string | null;

  @ApiPropertyOptional({
    description: 'Roles del usuario si tiene cuenta',
    example: ['ATHLETE'],
  })
  roles?: string[] | null;

  @ApiPropertyOptional({
    description: 'ID del registro de atleta si existe',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  athlete_id?: string | null;

  @ApiPropertyOptional({
    description: 'ID del registro de coach si existe',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  coach_id?: string | null;
}

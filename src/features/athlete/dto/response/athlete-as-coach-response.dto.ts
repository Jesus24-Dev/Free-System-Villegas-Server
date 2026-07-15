import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@prisma/client';

export class AthleteAsCoachResponseDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'athlete@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Roles actualizados del usuario',
    example: ['ATHLETE', 'COACH'],
    enum: Roles,
    isArray: true,
  })
  role!: Roles[];

  @ApiProperty({
    description: 'Mensaje de exito',
    example: 'Atleta promovido a entrenador exitosamente',
  })
  message!: string;
}

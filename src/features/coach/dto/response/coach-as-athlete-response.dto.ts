import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@prisma/client';

export class CoachAsAthleteResponseDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'coach@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Roles actualizados del usuario',
    example: ['COACH', 'ATHLETE'],
    enum: Roles,
    isArray: true,
  })
  role!: Roles[];

  @ApiProperty({
    description: 'Mensaje de exito',
    example: 'Coach registrado como atleta exitosamente',
  })
  message!: string;
}

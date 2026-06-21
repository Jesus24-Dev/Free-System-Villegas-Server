import { Gender, Roles } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserPersonDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ enum: Roles, isArray: true, example: ['ADMIN'] })
  role!: Roles[];

  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  created_at!: Date;

  @ApiProperty({ description: 'Cedula del usuario', example: '12345678' })
  dni!: string;

  @ApiProperty({ description: 'Nombre del usuario', example: 'John' })
  name!: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Doe' })
  surname!: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del usuario',
    example: '1990-01-01',
  })
  birthday!: Date;

  @ApiProperty({
    enum: Gender,
    description: 'Genero del usuario',
    example: 'MALE',
  })
  gender!: Gender;

  @ApiProperty({ description: 'Estado del usuario', example: true })
  status!: boolean;
}

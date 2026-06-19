import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/generated/prisma/enums';

export class CoachDto {
  @ApiProperty({
    description: 'ID único del Coach',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Cedula del usuario',
    example: '12345678',
  })
  dni!: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'John',
  })
  name!: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Doe',
  })
  surname!: string;

  @ApiProperty({
    description: 'Genero del usuario',
    example: 'MALE',
    enum: Gender,
  })
  gender!: Gender;

  @ApiProperty({
    description: 'Fecha de nacimiento del usuario',
    example: '1990-01-01',
  })
  birthday!: Date;

  @ApiProperty({
    description: 'Estado del usuario',
    example: 'true',
  })
  status!: boolean;
}

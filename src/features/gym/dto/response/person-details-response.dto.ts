import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/generated/prisma/enums';

export class PersonDetailsDto {
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
    description: 'Estado del usuario',
    example: 'true',
  })
  status!: boolean;
}

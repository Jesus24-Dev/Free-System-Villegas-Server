import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@prisma/client';

export class PersonFoundedResponseDto {
  @ApiProperty({
    description: 'ID único de la persona',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

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
    description: 'Roles del usuario',
    example: [Roles.ADMIN],
  })
  role!: string;
}

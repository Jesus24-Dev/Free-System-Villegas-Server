import { ApiProperty } from '@nestjs/swagger';

export class CoachOwnerDto {
  @ApiProperty({
    description: 'ID único del Coach',
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
    description: 'Estado del usuario',
    example: 'true',
  })
  status!: boolean;
}

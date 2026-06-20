import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Gender, Roles } from 'src/generated/prisma/enums';

export class ProfileDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  @Expose()
  email!: string;

  @ApiProperty({ enum: Roles, isArray: true, example: ['ATHLETE'] })
  @Expose()
  role!: Roles[];

  @ApiProperty({ description: 'Cedula del usuario', example: '12345678' })
  @Expose()
  dni!: string;

  @ApiProperty({ description: 'Nombre del usuario', example: 'John' })
  @Expose()
  name!: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Doe' })
  @Expose()
  surname!: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del usuario',
    example: '1990-01-01',
  })
  @Expose()
  birthday!: Date;

  @ApiProperty({ description: 'Genero del usuario', example: 'MALE' })
  @Expose()
  gender!: Gender;

  @ApiProperty({ description: 'Estado del usuario', example: true })
  @Expose()
  status!: boolean;
}

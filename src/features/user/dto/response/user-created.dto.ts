import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@prisma/client';

export class UserDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ enum: Roles, isArray: true, example: ['ADMIN'] })
  role!: Roles[];

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  person_id!: string;

  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  created_at!: Date;

  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  updated_at!: Date;
}

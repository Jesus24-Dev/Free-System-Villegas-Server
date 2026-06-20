import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/generated/prisma/client';

export class RegisteredAthleteDto {
  @ApiProperty({
    example: '44c7917f-57e5-4eba-841d-65608f1e03c0',
  })
  id!: string;

  @ApiProperty({
    example: 'Juan',
  })
  name!: string;

  @ApiProperty({
    example: 'Perez',
  })
  surname!: string;

  @ApiProperty({
    enum: Gender,
    example: Gender.MALE,
  })
  gender!: Gender;
}

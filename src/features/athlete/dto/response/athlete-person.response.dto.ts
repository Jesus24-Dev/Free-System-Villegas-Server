import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/generated/prisma/client';

export class AthletePersonResponseDto {
  @ApiProperty({
    example: 'V30000002',
  })
  dni!: string;

  @ApiProperty({
    example: 'Athlete',
  })
  name!: string;

  @ApiProperty({
    example: '2',
  })
  surname!: string;

  @ApiProperty({
    example: '2000-01-01T00:00:00.000Z',
  })
  birthday!: Date;

  @ApiProperty({
    enum: Gender,
    example: Gender.FEMALE,
  })
  gender!: Gender;
}

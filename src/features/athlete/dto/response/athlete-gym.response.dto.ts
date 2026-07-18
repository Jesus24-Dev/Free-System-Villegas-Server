import { ApiProperty } from '@nestjs/swagger';
import { States } from '@prisma/client';

export class AthleteGymResponseDto {
  @ApiProperty({
    example: '1u8ev-e4f-1c2b-3d4a-5b6c-7d8e9f0a1b2c',
  })
  id_gym!: string;

  @ApiProperty({
    example: 'Dragon Fight Team',
  })
  name!: string;

  @ApiProperty({
    example: 'Caracas',
  })
  address!: string;

  @ApiProperty({
    enum: States,
    example: States.DISTRITO_CAPITAL,
  })
  state!: States;

  @ApiProperty({
    example: 30,
  })
  monthly_payment!: number;
}

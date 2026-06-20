import { ApiProperty } from '@nestjs/swagger';
import { States } from 'src/generated/prisma/client';

export class AthleteGymResponseDto {
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

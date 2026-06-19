import { ApiProperty } from '@nestjs/swagger';

import { AthletePersonResponseDto } from './athlete-person.response.dto';
import { AthleteGymResponseDto } from './athlete-gym.response.dto';
import { AthletePaymentResponseDto } from './athlete-payment.response.dto';
import { AthleteCompetitionResponseDto } from './athlete-competition.response.dto';

export class AthleteProfileResponseDto {
  @ApiProperty({
    example: 'ff927490-829c-49eb-9788-1c855b33d212',
  })
  id!: string;

  @ApiProperty({
    type: AthletePersonResponseDto,
  })
  personal!: AthletePersonResponseDto;

  @ApiProperty({
    type: AthleteGymResponseDto,
  })
  gym!: Partial<AthleteGymResponseDto> | null;

  @ApiProperty({
    type: [AthletePaymentResponseDto],
  })
  payments!: AthletePaymentResponseDto[];

  @ApiProperty({
    type: [AthleteCompetitionResponseDto],
  })
  competitions!: AthleteCompetitionResponseDto[];
}

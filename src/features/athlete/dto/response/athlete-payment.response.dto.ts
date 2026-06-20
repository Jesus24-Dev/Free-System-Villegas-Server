import { ApiProperty } from '@nestjs/swagger';

export class AthletePaymentResponseDto {
  @ApiProperty({
    example: '2026-06-17T21:23:33.970Z',
  })
  date!: Date;

  @ApiProperty({
    example: 30,
  })
  amount!: number;

  @ApiProperty({
    example: 'REF-0002',
  })
  reference!: string;

  @ApiProperty({
    example: true,
  })
  confirmed!: boolean;
}

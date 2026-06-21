import { ApiProperty } from '@nestjs/swagger';

export class PagoMovilResponseDto {
  @ApiProperty({
    example: '7fd8f4f8-xxxx',
  })
  id!: string;

  @ApiProperty({
    example: '0102',
  })
  bank_to_pay!: string;

  @ApiProperty({
    example: 'V12345678',
  })
  dni!: string;

  @ApiProperty({
    example: '04141234567',
  })
  phone!: string;
}

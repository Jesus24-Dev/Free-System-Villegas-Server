import { ApiProperty } from '@nestjs/swagger';

export class AthleteHasAccountResponseDto {
  @ApiProperty({
    description:
      'Indica si el atleta tiene una cuenta de usuario asociada (User)',
    example: true,
  })
  hasAccount!: boolean;
}

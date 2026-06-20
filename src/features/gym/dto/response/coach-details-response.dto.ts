import { ApiProperty } from '@nestjs/swagger';
import { PersonDetailsDto } from './person-details-response.dto';

export class CoachDetailsDto {
  @ApiProperty({
    description: 'ID único del atleta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    type: PersonDetailsDto,
  })
  person!: PersonDetailsDto;
}

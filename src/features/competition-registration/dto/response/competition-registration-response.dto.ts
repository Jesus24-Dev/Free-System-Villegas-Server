import { ApiProperty } from '@nestjs/swagger';
import { RegisteredAthleteDto } from './registered-athlete-response.dto';
import { CompetitionDivisionDto } from './competition-division-response.dto';

export class CompetitionRegistrationResponseDto {
  @ApiProperty({
    example: '9ec2d338-dae9-4144-b807-c1dde106a5ca',
  })
  id!: string;

  @ApiProperty({
    type: RegisteredAthleteDto,
  })
  athlete!: RegisteredAthleteDto;

  @ApiProperty({
    type: CompetitionDivisionDto,
  })
  division!: CompetitionDivisionDto;
}

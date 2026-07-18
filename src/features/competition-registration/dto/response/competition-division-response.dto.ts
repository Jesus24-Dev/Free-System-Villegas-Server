import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CompetitionStatus,
  FightingCategory,
  FightingMode,
  Gender,
} from '@prisma/client';

export class CompetitionBasicDto {
  @ApiProperty({ example: '9ec2d338-dae9-4144-b807-c1dde106a5ca' })
  id!: string;

  @ApiProperty({ example: 'Copa IV de Kickboxing' })
  name!: string;

  @ApiProperty({ enum: CompetitionStatus, example: CompetitionStatus.OPEN })
  status!: CompetitionStatus;
}

export class CompetitionDivisionDto {
  @ApiProperty({
    enum: FightingMode,
    example: FightingMode.K1,
  })
  mode!: FightingMode;

  @ApiProperty({
    enum: FightingCategory,
    example: FightingCategory.S,
  })
  category!: FightingCategory;

  @ApiProperty({
    enum: Gender,
    example: Gender.MALE,
  })
  gender!: Gender;

  @ApiProperty({
    example: 75,
  })
  weight!: number;

  @ApiPropertyOptional({ type: CompetitionBasicDto })
  competition?: CompetitionBasicDto;
}

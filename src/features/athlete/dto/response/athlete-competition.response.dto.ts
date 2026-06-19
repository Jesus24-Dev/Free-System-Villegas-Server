import { ApiProperty } from '@nestjs/swagger';
import {
  CompetitionStatus,
  FightingCategory,
  FightingMode,
} from 'src/generated/prisma/client';

class AthleteDivisionResponseDto {
  @ApiProperty({
    enum: FightingMode,
  })
  mode!: FightingMode;

  @ApiProperty({
    enum: FightingCategory,
  })
  category!: FightingCategory;

  @ApiProperty({
    example: 69,
  })
  weight!: number;
}

export class AthleteCompetitionResponseDto {
  @ApiProperty({
    example: 'Copa Nacional WAKO 2026',
  })
  competition!: string;

  @ApiProperty({
    enum: CompetitionStatus,
  })
  status!: CompetitionStatus;

  @ApiProperty({
    type: AthleteDivisionResponseDto,
  })
  division!: AthleteDivisionResponseDto;
}

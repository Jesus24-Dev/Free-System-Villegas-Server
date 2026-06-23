import { ApiProperty } from '@nestjs/swagger';
import { FightingCategory, FightingMode } from '@prisma/client';

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
    example: 75,
  })
  weight!: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { FightingCategory, FightingMode, Gender } from '@prisma/client';

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
}

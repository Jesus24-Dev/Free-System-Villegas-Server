import { ApiProperty } from '@nestjs/swagger';
import {
  FightingCategory,
  FightingMode,
  Gender,
} from 'src/generated/prisma/enums';
import { CompetitionDivisionCompetitionDto } from './competition-division-competition.dto';

export class CompetitionDivisionDto {
  @ApiProperty({
    description: 'ID único de la modalidad de pelea registrada',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Genero del atleta a registrar',
    example: Gender.MALE,
    enum: Gender,
  })
  gender!: Gender;

  @ApiProperty({
    description: 'Modalidad de combate del atleta a registrar',
    example: FightingMode.K1,
    enum: FightingCategory,
  })
  mode!: FightingMode;

  @ApiProperty({
    description: 'Categoria de combate del atleta a registrar',
    example: FightingCategory.S,
    enum: FightingCategory,
  })
  category!: FightingCategory;

  @ApiProperty({
    description: 'Peso del atleta para competir',
    example: 75,
  })
  weight!: number;

  @ApiProperty({
    type: CompetitionDivisionCompetitionDto,
  })
  competition!: CompetitionDivisionCompetitionDto;
}

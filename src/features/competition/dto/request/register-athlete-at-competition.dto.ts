import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { FightingCategory, FightingMode } from '@prisma/client';

export class RegisterAthleteAtCompetitionDto {
  @ApiProperty({
    description: 'Modalidad del combate a inscribir',
    example: FightingMode.K1,
    enum: FightingMode,
  })
  @IsEnum(FightingMode, {
    message: `El modo de pelea debe ser uno de los siguientes: ${Object.values(FightingMode).join(', ')}`,
  })
  @IsNotEmpty({ message: 'La modalidad de combate es obligatoria' })
  mode!: FightingMode;

  @ApiProperty({
    description: 'Categoria del combate a inscribir',
    example: FightingCategory.S,
    enum: FightingCategory,
  })
  @IsEnum(FightingCategory, {
    message: `La categoría de pelea debe ser una de las siguientes: ${Object.values(FightingCategory).join(', ')}`,
  })
  @IsNotEmpty({ message: 'La categoria de combate es obligatoria' })
  category!: FightingCategory;

  @IsNumber({}, { message: 'Debe ser un numero valido.' })
  @IsNotEmpty({ message: 'El peso es obligatorio' })
  weight!: number;
}

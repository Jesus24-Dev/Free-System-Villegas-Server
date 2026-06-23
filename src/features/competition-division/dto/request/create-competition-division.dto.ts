import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsEnum, IsNumber, Min } from 'class-validator';
import {
  Gender,
  FightingMode,
  FightingCategory,
} from '@prisma/client';

export class CreateCompetitionDivisionDto {
  @ApiProperty({
    description: 'Genero del atleta a registrar',
    example: Gender.MALE,
    enum: Gender,
  })
  @IsEnum(Gender, {
    each: true,
    message:
      'El genero seleccionado no es valido. Los valores permitidos son: MALE, FEMALE',
  })
  @IsNotEmpty({ message: 'El genero es obligatorio' })
  gender!: Gender;

  @ApiProperty({
    description: 'Modalidad de combate del atleta a registrar',
    example: FightingMode.K1,
    enum: FightingMode,
  })
  @IsEnum(FightingMode, {
    each: true,
    message: `La modalidad de combate seleccionada no es valida. Los valores permitidos son: ${Object.values(FightingMode).join(', ')}`,
  })
  @IsNotEmpty({ message: 'La modalidad de combate es obligatorio' })
  mode!: FightingMode;

  @ApiProperty({
    description: 'Categoria de combate del atleta a registrar',
    example: FightingCategory.S,
    enum: FightingCategory,
  })
  @IsEnum(FightingCategory, {
    each: true,
    message: `La categoria de combate no es valida. Los valores permitidos son: ${Object.values(FightingCategory).join(', ')}`,
  })
  @IsNotEmpty({ message: 'La categoria de combate es obligatorio' })
  category!: FightingCategory;

  @ApiProperty({
    description: 'Peso del atleta para competir',
    example: 75,
  })
  @IsNumber({}, { message: 'El peso debe ser un numero entero' })
  @Min(1, { message: 'El peso debe ser un numero valido' })
  @IsNotEmpty({ message: 'El peso es obligatorio' })
  weight!: number;

  @ApiProperty({
    description: 'ID único de la competencia registrada',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El id de la competencia debe ser un UUID valido' })
  @IsNotEmpty({ message: 'El id de la competencia es obligatorio' })
  competition_id!: string;
}

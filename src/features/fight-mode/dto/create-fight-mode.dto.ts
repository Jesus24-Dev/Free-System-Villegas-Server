import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsEnum, IsNumber, Min } from 'class-validator';
import {
  Gender,
  Fighting_Mode,
  Fighting_Category,
} from 'src/generated/prisma/enums';

export class CreateFightModeDto {
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
    example: Fighting_Mode.K1,
    enum: Fighting_Mode,
  })
  @IsEnum(Fighting_Mode, {
    each: true,
    message: `La modalidad de combate seleccionada no es valida. Los valores permitidos son: ${Object.values(Fighting_Mode).join(', ')}`,
  })
  @IsNotEmpty({ message: 'La modalidad de combate es obligatorio' })
  mode!: Fighting_Mode;

  @ApiProperty({
    description: 'Categoria de combate del atleta a registrar',
    example: Fighting_Category.S,
    enum: Fighting_Category,
  })
  @IsEnum(Fighting_Category, {
    each: true,
    message: `La categoria de combate no es valida. Los valores permitidos son: ${Object.values(Fighting_Category).join(', ')}`,
  })
  @IsNotEmpty({ message: 'La categoria de combate es obligatorio' })
  category!: Fighting_Category;

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

  @ApiProperty({
    description: 'ID único del atleta registrado para competir',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', {
    message: 'El id del atleta registrado debe ser un UUID valido',
  })
  @IsNotEmpty({ message: 'El id del atleta registrado es obligatorio' })
  athlete_registration_id!: string;
}

export class DatabaseGeneratedFields {
  @ApiProperty({
    description: 'ID único de la modalidad de pelea registrada',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;
  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  created_at!: Date;

  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  updated_at!: Date;
}

export class FightModeResponseDto extends IntersectionType(
  CreateFightModeDto,
  DatabaseGeneratedFields,
) {}

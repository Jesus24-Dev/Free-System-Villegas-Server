import { IsEnum, IsOptional } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  ApiPropertyOptional,
  ApiProperty,
  IntersectionType,
} from '@nestjs/swagger';
import { FightingCategory, FightingMode, Gender } from '@prisma/client';

export class WeightsFilterDto {
  @ApiPropertyOptional({
    description: 'Modo de pelea del competidor',
    enum: FightingMode,
    example: FightingMode.K1,
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    const val = value as unknown;
    return typeof val === 'string' ? val.toUpperCase() : val;
  })
  @IsEnum(FightingMode)
  mode?: FightingMode;

  @ApiPropertyOptional({
    description: 'Género del atleta',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    const val = value as unknown;
    return typeof val === 'string' ? val.toUpperCase() : val;
  })
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    description: 'Categoría de peso según la modalidad',
    enum: FightingCategory,
    example: FightingCategory.S,
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    const val = value as unknown;
    return typeof val === 'string' ? val.toUpperCase() : val;
  })
  @IsEnum(FightingCategory)
  category?: FightingCategory;
}

export class DatabaseGeneratedFields {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Pesos en KG de la categoria',
    example: 75,
  })
  weight!: number;
}

export class WeightResponseDto extends IntersectionType(
  WeightsFilterDto,
  DatabaseGeneratedFields,
) {}

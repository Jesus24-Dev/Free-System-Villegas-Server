import { IsEnum, IsOptional } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  ApiPropertyOptional,
  ApiProperty,
  IntersectionType,
} from '@nestjs/swagger';
import {
  Fighting_Category,
  Fighting_Mode,
  Gender,
} from 'src/generated/prisma/enums';

export class WeightsFilterDto {
  @ApiPropertyOptional({
    description: 'Modo de pelea del competidor',
    enum: Fighting_Mode,
    example: Fighting_Mode.K1,
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(Fighting_Mode)
  mode?: Fighting_Mode;

  @ApiPropertyOptional({
    description: 'Género del atleta',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    description: 'Categoría de peso según la modalidad',
    enum: Fighting_Category,
    example: Fighting_Category.S,
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(Fighting_Category)
  category?: Fighting_Category;
}

export class DatabaseGeneratedFields {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Pesos disponibles en KG de la categoria',
    example: [51, 54, 57, 60, 63, 67, 71, 75, 81, 86, 91],
  })
  weights!: number[];
}

export class WeightResponseDto extends IntersectionType(
  WeightsFilterDto,
  DatabaseGeneratedFields,
) {}

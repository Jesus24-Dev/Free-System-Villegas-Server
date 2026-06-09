import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsDate,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  ApiProperty,
  IntersectionType,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateCompetitionDto {
  @ApiProperty({
    description: 'Nombre de la competencia',
    example: 'Copa IV de kickboxing',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(3, 255, { message: 'El nombre debe tener entre 3 y 255 caracteres' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name!: string;

  @ApiPropertyOptional({
    description: 'Descripcion y detalles de la competencia',
    example: 'Celebramos esta edicion...',
    nullable: true,
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  description?: string | null;

  @ApiPropertyOptional({
    description: 'URL del logo/banner de la competencia',
    example: 'https://servidordeimagenes/competencia1',
    nullable: true,
  })
  @IsUrl({}, { message: 'La URL del logo debe ser una URL válida' })
  @IsOptional()
  logo_url?: string | null;

  @ApiProperty({
    description: 'Direccion geografica de la competencia',
    example: 'Gimnasio Caracas',
  })
  @IsString({ message: 'La ubicación debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La ubicación es obligatoria' })
  location!: string;

  @ApiProperty({
    description: 'Fecha de inicio de inscripciones',
    example: '2026-06-06T21:50:00.000Z',
  })
  @Transform(({ value }: { value: string }) => new Date(value))
  @IsDate()
  @IsNotEmpty({ message: 'La fecha de inicio de inscripción es obligatoria' })
  inscription_begin_at!: Date;

  @ApiProperty({
    description: 'Fecha de finalizacion de inscripciones',
    example: '2026-06-06T21:50:00.000Z',
  })
  @Transform(({ value }: { value: string }) => new Date(value))
  @IsDate()
  @IsNotEmpty({ message: 'La fecha de fin de inscripción es obligatoria' })
  inscription_end_at!: Date;
}

export class DatabaseGeneratedFields {
  @ApiProperty({
    description: 'ID único de la competencia',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;
  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  created_at!: Date;

  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  updated_at!: Date;
}

export class CompetitionResponseDto extends IntersectionType(
  CreateCompetitionDto,
  DatabaseGeneratedFields,
) {}

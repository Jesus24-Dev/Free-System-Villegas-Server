import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsBoolean,
  IsOptional,
  Length,
  IsEnum,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Gender } from '@prisma/client';
import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';

export class CreatePersonDto {
  @ApiProperty({
    description: 'Cedula del usuario',
    example: '12345678',
  })
  @IsString({ message: 'La cédula debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La cédula no puede estar vacío' })
  @Matches(/^[VEve]\d{6,9}$/, {
    message:
      'La cédula debe seguir el formato venezolano: V/E seguido de 6 a 9 dígitos (ej: V12345678)',
  })
  dni!: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'John',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  name!: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Doe',
  })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @Length(2, 50, { message: 'El apellido debe tener entre 2 y 50 caracteres' })
  surname!: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del usuario',
    example: '1990-01-01',
  })
  @Transform(({ value }: { value: string }) => new Date(value))
  @IsDate({ message: 'La fecha de nacimiento debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
  birthday!: Date;

  @ApiProperty({
    description: 'Genero del usuario',
    example: 'MALE',
  })
  @IsEnum(Gender, {
    each: true,
    message:
      'El genero seleccionado no es valido. Los valores permitidos son: MALE, FEMALE',
  })
  @IsNotEmpty({ message: 'Debes asignar un genero a la persona' })
  gender!: Gender;

  @ApiPropertyOptional({
    description: 'Estado del usuario',
    example: true,
  })
  @IsBoolean({ message: 'El estado debe ser un valor booleano (true o false)' })
  @IsOptional()
  status!: boolean;
}

export class DatabaseGeneratedFields {
  @ApiProperty({
    description: 'ID único de la persona',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;
  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  created_at!: Date;

  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  updated_at!: Date;
}

export class PersonResponseDto extends IntersectionType(
  CreatePersonDto,
  DatabaseGeneratedFields,
) {}

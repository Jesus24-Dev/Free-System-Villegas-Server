import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Gender } from '@prisma/client';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Cedula del usuario',
    example: 'V12345678',
  })
  @IsString({ message: 'La cédula debe ser una cadena de texto' })
  @IsOptional()
  @Matches(/^[VEJvej]\d{6,9}$/, {
    message:
      'La cédula debe seguir el formato venezolano: V/E seguido de 6 a 9 dígitos (ej: V12345678)',
  })
  dni?: string;

  @ApiPropertyOptional({
    description: 'Nombre del usuario',
    example: 'John',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsOptional()
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Apellido del usuario',
    example: 'Doe',
  })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsOptional()
  @Length(2, 50, { message: 'El apellido debe tener entre 2 y 50 caracteres' })
  surname?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento del usuario',
    example: '1990-01-01',
  })
  @Transform(({ value }: { value: string }) => new Date(value))
  @IsDate({ message: 'La fecha de nacimiento debe ser una fecha válida' })
  @IsOptional()
  birthday?: Date;

  @ApiPropertyOptional({
    description: 'Genero del usuario',
    example: 'MALE',
  })
  @IsEnum(Gender, {
    each: true,
    message:
      'El genero seleccionado no es valido. Los valores permitidos son: MALE, FEMALE',
  })
  @IsOptional()
  gender?: Gender;
}

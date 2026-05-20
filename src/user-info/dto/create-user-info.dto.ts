import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsDate,
  IsBoolean,
  IsOptional,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserInfoDto {
  @IsUUID('4', { message: 'El user_id debe ser un UUID válido v4' })
  @IsNotEmpty({ message: 'El user_id es obligatorio' })
  user_id: string;

  @IsString({ message: 'La cédula debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La cédula no puede estar vacío' })
  @Length(6, 9, { message: 'La cédula debe tener entre 8 y 9 caracteres' })
  dni: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  name: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @Length(2, 50, { message: 'El apellido debe tener entre 2 y 50 caracteres' })
  surname: string;

  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'La fecha de nacimiento debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
  birthday: Date;

  @IsBoolean({ message: 'El estado debe ser un valor booleano (true o false)' })
  @IsOptional()
  status: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { Gender, Roles } from 'src/generated/prisma/enums';

export enum AllowedClientRoles {
  ATHLETE = 'ATHLETE',
  COACH = 'COACH',
}

export class RegisterDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'El correo electrónico proporcionado no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email!: string;
  @ApiProperty({
    description: 'Clave del usuario',
    example: 'Password123#',
  })
  @IsString({ message: 'La clave debe ser un texto valido.' })
  @IsNotEmpty({ message: 'La clave es obligatoria' })
  password!: string;

  @ApiProperty({
    description: 'Roles del usuario',
    example: 'ATHLETE',
    enum: AllowedClientRoles,
  })
  @IsEnum(AllowedClientRoles, {
    each: true,
    message: 'El rol no es válido. Los valores permitidos son: ATHLETE o COACH',
  })
  @IsNotEmpty({ message: 'Debes asignar un rol al usuario' })
  role!: 'ATHLETE' | 'COACH';

  @ApiProperty({
    description: 'Cedula del usuario',
    example: '12345678',
  })
  @IsString({ message: 'La cédula debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La cédula no puede estar vacío' })
  @Length(6, 9, { message: 'La cédula debe tener entre 8 y 9 caracteres' })
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
}

export class PersonDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  id!: string;

  @ApiProperty({ description: 'Cedula del usuario', example: '12345678' })
  @Expose() // Añadido para asegurar que se muestre en el response
  dni!: string;

  @ApiProperty({ description: 'Nombre del usuario', example: 'John' })
  @Expose() // Añadido
  name!: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Doe' })
  @Expose() // Añadido
  surname!: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del usuario',
    example: '1990-01-01',
  })
  @Expose() // Añadido
  birthday!: Date;

  @ApiProperty({ description: 'Genero del usuario', example: 'MALE' })
  @Expose() // Añadido
  gender!: Gender;

  @ApiProperty({ description: 'Estado del usuario', example: true })
  @Expose() // Añadido
  status!: boolean;

  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  @Expose()
  created_at!: Date;

  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  @Expose()
  updated_at!: Date;
}

// 2. PROFILEDTO SEGUNDO
export class ProfileDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  @Expose()
  email!: string;

  @ApiProperty({ enum: Roles, isArray: true, example: ['ATHLETE'] })
  @Expose()
  role!: Roles[];

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  @Expose()
  person_id!: string | null;

  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  @Expose()
  created_at!: Date;

  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  @Expose()
  updated_at!: Date;

  @ApiProperty({ type: () => PersonDto })
  @Expose()
  @Type(() => PersonDto)
  person!: PersonDto;
}

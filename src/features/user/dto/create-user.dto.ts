import { Roles } from 'src/generated/prisma/enums';
import {
  IsEmail,
  IsStrongPassword,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'El correo electrónico proporcionado no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email!: string;

  @ApiProperty({
    description: 'Clave del usuario',
    example: 'Password123!',
  })
  @IsStrongPassword(
    { minLength: 8, minUppercase: 1, minSymbols: 1 },
    {
      message:
        'La contraseña es demasiado débil. Debe tener al menos 8 caracteres, 1 letra mayúscula y 1 símbolo especial',
    },
  )
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @Exclude({ toPlainOnly: true })
  password!: string;

  @ApiProperty({
    description: 'Roles del usuario',
    example: ['user'],
  })
  @IsArray({ message: 'Los roles deben enviarse dentro de un arreglo ([])' })
  @IsEnum(Roles, {
    each: true,
    message:
      'Uno o más roles seleccionados no son válidos. Los valores permitidos son: ATHLETE, COACH, ADMIN',
  })
  @IsNotEmpty({ message: 'Debes asignar al menos un rol al usuario' })
  role!: Roles[];

  @ApiProperty({
    description:
      'ID de la persona con los datos personales asociada al usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El ID de la persona asociada es obligatorio' })
  @IsUUID('4', { message: 'El ID de la persona debe ser un UUID válido' })
  person_id!: string | null;
}

export class DatabaseGeneratedFields {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;
  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  created_at!: Date;

  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  updated_at!: Date;
}

export class UserResponseDto extends IntersectionType(
  CreateUserDto,
  DatabaseGeneratedFields,
) {}

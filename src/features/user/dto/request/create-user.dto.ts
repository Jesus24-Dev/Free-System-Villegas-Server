import {
  IsEmail,
  IsStrongPassword,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AllowedClientRoles {
  ATHLETE = 'ATHLETE',
  COACH = 'COACH',
}
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
  password!: string;

  @ApiProperty({
    description: 'Roles del usuario',
    example: ['user'],
    enum: AllowedClientRoles,
    isArray: true,
  })
  @IsArray({ message: 'Los roles deben enviarse dentro de un arreglo ([])' })
  @IsEnum(AllowedClientRoles, {
    each: true,
    message:
      'Uno o más roles seleccionados no son válidos. Los valores permitidos son: ATHLETE o COACH',
  })
  @IsNotEmpty({ message: 'Debes asignar al menos un rol al usuario' })
  role!: AllowedClientRoles[];

  @ApiProperty({
    description:
      'ID de la persona con los datos personales asociada al usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El ID de la persona debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID de la persona asociada es obligatorio' })
  person_id!: string;
}

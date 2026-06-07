import { Roles } from 'src/generated/prisma/enums';
import {
  IsEmail,
  IsStrongPassword,
  IsArray,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'El correo electrónico proporcionado no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;

  @IsStrongPassword(
    { minLength: 8, minUppercase: 1, minSymbols: 1 },
    {
      message:
        'La contraseña es demasiado débil. Debe tener al menos 8 caracteres, 1 letra mayúscula y 1 símbolo especial',
    },
  )
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  @IsArray({ message: 'Los roles deben enviarse dentro de un arreglo ([])' })
  @IsEnum(Roles, {
    each: true,
    message:
      'Uno o más roles seleccionados no son válidos. Los valores permitidos son: ATHLETE, COACH, ADMIN',
  })
  @IsNotEmpty({ message: 'Debes asignar al menos un rol al usuario' })
  role: Roles[];
}

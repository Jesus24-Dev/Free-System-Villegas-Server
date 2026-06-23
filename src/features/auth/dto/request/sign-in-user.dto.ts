import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
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
}

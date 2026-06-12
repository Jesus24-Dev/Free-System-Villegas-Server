import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
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

export class AuthDto {
  access_token!: string;
}

export class AuthResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIi...',
  })
  access_token!: string;
}
export class JwtPayload {
  sub!: string;
  role?: string[];
}

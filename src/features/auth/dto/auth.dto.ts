import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';
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

  @ApiProperty({
    description: 'ID único de la persona a relacionar con el atleta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'Person id debe ser un UUID valido' })
  @IsNotEmpty({ message: 'Person ID no debe estar vacio' })
  person_id!: string;
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

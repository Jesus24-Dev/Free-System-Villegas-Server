import { Roles } from 'src/generated/prisma/enums';
import { IsArray, IsEmail, IsEnum, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword({minLength: 8, minUppercase: 1, minSymbols: 1})
  password: string;

  @IsArray()
  @IsEnum(Roles, {each: true})
  role: Roles[];
}

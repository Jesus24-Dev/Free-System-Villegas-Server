import { IsUUID, IsNotEmpty, IsEnum, IsInt, Min } from 'class-validator';
import {
  Gender,
  Fighting_Mode,
  Fighting_Category,
} from 'src/generated/prisma/enums';

export class CreateFightModeDto {
  @IsEnum(Gender, {
    each: true,
    message:
      'El genero seleccionado no es valido. Los valores permitidos son: MALE, FEMALE',
  })
  @IsNotEmpty()
  gender!: Gender;

  @IsEnum(Fighting_Mode, {
    each: true,
    message: `La modalidad de combate seleccionada no es valida. Los valores permitidos son: ${Object.values(Fighting_Mode).join(', ')}`,
  })
  @IsNotEmpty()
  mode!: Fighting_Mode;

  @IsEnum(Fighting_Category, {
    each: true,
    message: `La categoria de combate no es valida. Los valores permitidos son: ${Object.values(Fighting_Category).join(', ')}`,
  })
  @IsNotEmpty()
  category!: Fighting_Category;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  weight!: number;

  @IsUUID()
  @IsNotEmpty()
  competition_id!: string;

  @IsUUID()
  @IsNotEmpty()
  athlete_registration_id!: string;
}

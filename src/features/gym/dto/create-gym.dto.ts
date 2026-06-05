import { IsString, IsNotEmpty, Length, IsEnum, IsUUID } from 'class-validator';
import { States } from 'src/generated/prisma/enums';

export class CreateGymDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  name!: string;

  @IsString({ message: 'La direccion debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La direccion es obligatoria' })
  @Length(2, 50, { message: 'La direccion debe tener entre 2 y 50 caracteres' })
  address!: string;

  @IsEnum(States, {
    each: true,
    message: `El estado seleccionado no es valido. Los valores permitidos son: ${Object.values(States).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Debes asignar un estado al gimnasio' })
  state!: States;

  @IsUUID('4', { message: 'El ID del propietario debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del propietario es obligatorio' })
  owner_id!: string;
}

import {
  IsString,
  IsNotEmpty,
  Length,
  IsEnum,
  IsUUID,
  Min,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { States } from 'src/generated/prisma/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGymDto {
  @ApiProperty({
    description: 'Nombre del gimnasio',
    example: 'Kickboxing gimnasio grill',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  name!: string;

  @ApiProperty({
    description: 'Direccion fisica del gimnasio',
    example: 'Los Dos Caminos, Caracas, Venezuela',
  })
  @IsString({ message: 'La direccion debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La direccion es obligatoria' })
  @Length(2, 50, { message: 'La direccion debe tener entre 2 y 50 caracteres' })
  address!: string;
  @ApiProperty({
    description: 'Estado geografico del gimnasio',
    enum: States,
    example: States.DISTRITO_CAPITAL,
  })
  @IsEnum(States, {
    each: true,
    message: `El estado seleccionado no es valido. Los valores permitidos son: ${Object.values(States).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Debes asignar un estado al gimnasio' })
  state!: States;

  @ApiProperty({
    description: 'Costo mensual del gimnasio en USD',
    example: '20',
  })
  @IsNumber({}, { message: 'El costo debe ser un numero valido.' })
  @Min(1)
  @IsNotEmpty({ message: 'Debes asignar un costo al gimnasio' })
  monthly_payment!: number;

  @ApiProperty({
    description: 'ID único del coach que le pertenece el gimnasio',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El ID del propietario debe ser un UUID válido' })
  @IsOptional()
  owner_id?: string;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { States } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  Length,
  Min,
  IsString,
} from 'class-validator';

export class UpdateGymByOwnerDto {
  @ApiPropertyOptional({
    description: 'Nombre del gimnasio',
    example: 'Kickboxing gimnasio grill',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsOptional()
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Direccion fisica del gimnasio',
    example: 'Los Dos Caminos, Caracas, Venezuela',
  })
  @IsString({ message: 'La direccion debe ser una cadena de texto' })
  @IsOptional()
  @Length(2, 50, { message: 'La direccion debe tener entre 2 y 50 caracteres' })
  address?: string;

  @ApiPropertyOptional({
    description: 'Estado geografico del gimnasio',
    enum: States,
    example: States.DISTRITO_CAPITAL,
  })
  @IsEnum(States, {
    each: true,
    message: `El estado seleccionado no es valido. Los valores permitidos son: ${Object.values(States).join(', ')}`,
  })
  @IsOptional()
  state?: States;

  @ApiPropertyOptional({
    description: 'Costo mensual del gimnasio en USD',
    example: '20',
  })
  @IsNumber({}, { message: 'El costo debe ser un numero valido.' })
  @Min(1)
  @IsOptional()
  monthly_payment?: number;
}

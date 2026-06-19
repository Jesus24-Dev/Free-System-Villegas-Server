import { ApiProperty } from '@nestjs/swagger';
import { States } from 'src/generated/prisma/enums';

export class RawGymDto {
  @ApiProperty({
    description: 'Nombre del gimnasio',
    example: 'Kickboxing gimnasio grill',
  })
  name!: string;

  @ApiProperty({
    description: 'Direccion fisica del gimnasio',
    example: 'Los Dos Caminos, Caracas, Venezuela',
  })
  address!: string;

  @ApiProperty({
    description: 'Estado geografico del gimnasio',
    enum: States,
    example: States.DISTRITO_CAPITAL,
  })
  state!: States;

  @ApiProperty({
    description: 'Costo mensual del gimnasio en USD',
    example: '20',
  })
  monthly_payment!: number;

  @ApiProperty({
    description: 'ID único del coach que le pertenece el gimnasio',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  owner_id?: string;
}

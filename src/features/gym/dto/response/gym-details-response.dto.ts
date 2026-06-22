import { ApiProperty } from '@nestjs/swagger';
import { States } from '@prisma/client';
import { AthleteDetailsDto } from './athlete-details-response.dto';
import { CoachDetailsDto } from './coach-details-response.dto';
import { PagoMovilDetailsDto } from './pago-movil-details-response.dto';

export class GymDetailsResponseDto {
  @ApiProperty({
    description: 'ID único del gimnasio',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del gimnasio',
    example: 'Gimnasio Villegas',
  })
  name!: string;

  @ApiProperty({
    description: 'Dirección del gimnasio',
    example: 'Calle Falsa 123',
  })
  address!: string;

  @ApiProperty({
    description: 'Estado geografico del gimnasio',
    enum: States,
    example: States.DISTRITO_CAPITAL,
  })
  state!: States;

  @ApiProperty({
    type: [AthleteDetailsDto],
  })
  athletes!: AthleteDetailsDto[];

  @ApiProperty({
    type: [CoachDetailsDto],
  })
  coaches!: CoachDetailsDto[];

  @ApiProperty({
    type: [PagoMovilDetailsDto],
  })
  pago_movil!: PagoMovilDetailsDto[];
}

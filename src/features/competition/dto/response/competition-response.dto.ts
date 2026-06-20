import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CompetitionStatus } from 'src/generated/prisma/enums';

export class CompetitionDto {
  @ApiProperty({
    description: 'ID único de la competencia',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre de la competencia',
    example: 'Copa IV de kickboxing',
  })
  name!: string;

  @ApiPropertyOptional({
    description: 'Descripcion y detalles de la competencia',
    example: 'Celebramos esta edicion...',
    nullable: true,
  })
  description?: string | null;

  @ApiPropertyOptional({
    description: 'URL del logo/banner de la competencia',
    example: 'https://servidordeimagenes/competencia1',
    nullable: true,
  })
  logo_url?: string | null;

  @ApiProperty({
    description: 'Direccion geografica de la competencia',
    example: 'Gimnasio Caracas',
  })
  location!: string;

  @ApiProperty({
    description: 'Fecha de inicio de inscripciones',
    example: '2026-06-06T21:50:00.000Z',
  })
  inscription_begin_at!: Date;

  @ApiProperty({
    description: 'Fecha de finalizacion de inscripciones',
    example: '2026-06-06T21:50:00.000Z',
  })
  inscription_end_at!: Date;

  @ApiProperty({
    description: 'Estado de la competencia',
    enum: CompetitionStatus,
    example: CompetitionStatus.OPEN,
  })
  status!: CompetitionStatus;
}
